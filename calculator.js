/* ELUCENIA standalone integration. Source package metadata and rights: README.md. */
(function(root){'use strict';
function freeze(value){if(value&&typeof value==='object'){for(const item of Object.values(value))freeze(item);Object.freeze(value);}return value;}
const TOOL=freeze({"id":"alcoolemia-estimada","title":"Alcoolemia estimada (fórmula de Widmark)","fields":[["sexo","Sexo","radio",{"opts":{"F":"Feminino","M":"Masculino"}}],["peso","Peso","num",{"min":35,"max":250,"step":0.1,"unit":"kg","ph":"70"}],["cerveja","Latas de cerveja (350 mL, 5%)","num",{"min":0,"max":40,"step":0.5,"unit":"latas","ph":"0","opt":true}],["vinho","Taças de vinho (150 mL, 12%)","num",{"min":0,"max":30,"step":0.5,"unit":"taças","ph":"0","opt":true}],["destilado","Doses de destilado (50 mL, 40%)","num",{"min":0,"max":30,"step":0.5,"unit":"doses","ph":"0","opt":true}],["outro_ml","Outra bebida: volume total","num",{"min":1,"max":5000,"step":1,"unit":"mL","opt":true}],["outro_teor","Outra bebida: teor alcoólico","num",{"min":0.5,"max":80,"step":0.1,"unit":"% vol.","opt":true}],["horas","Tempo desde o início do consumo","num",{"min":0,"max":48,"step":0.25,"unit":"h","ph":"2"}]],"config":null,"reviewStatus":"needs-review","clinicalValidation":"not-performed"});
const window={};
/* ELUCENIA arithmetic registry. No DOM access, storage, telemetry or network requests. */
(function(root){
  'use strict';
  const CALC={fn:Object.create(null)};
  const round=(n,d=1)=>Math.round(n*Math.pow(10,d))/Math.pow(10,d);
  const yes=v=>v===true||v==='1'||v===1;
  CALC.h={
    r1:round,
    br:(n,d=1)=>round(n,d).toLocaleString('pt-BR',{minimumFractionDigits:d,maximumFractionDigits:d}),
    band:(n,bands)=>{for(const b of bands)if(n<b[0])return b[1];return bands[bands.length-1][1];},
    sum:(values,weights)=>Object.entries(weights).reduce((n,[key,w])=>n+(yes(values[key])?w:0),0),yes
  };
  CALC.def=(id,fn)=>{if(CALC.fn[id])throw Error('Duplicate calculator '+id);CALC.fn[id]=fn;};
  CALC.score=(cfg,values)=>{
    let score=0;
    for(const[name,type,weight]of cfg.fields){const v=values[name];if(type==='chk'){if(yes(v))score+=weight;}else if(type==='radio'||type==='sel'){const n=parseFloat(v);if(!Number.isNaN(n))score+=n;}}
    score=round(score,2);let band=cfg.bands[0];for(const b of cfg.bands)if(score>=b[0])band=b;
    return{main:[String(score).replace('.',','),cfg.unit||(Math.abs(score)===1?'ponto':'pontos')],label:cfg.label,level:band[1],verdict:band[2],note:band[3]||'',raw:{score}};
  };
  CALC.run=(id,values,cfg)=>{if(cfg&&cfg.bands)return CALC.score(cfg,values);if(!CALC.fn[id])return{error:'Calculadora indisponível.'};return CALC.fn[id](values);};
  root.CALC=CALC;if(typeof module!=='undefined')module.exports=CALC;
})(typeof window!=='undefined'?window:globalThis);

(function(a){'use strict';
var e=a.h;
var o=e.br;
var i=function(a){return null==a||""===a||isNaN(+a)?0:+a};
var h=function(a){var e=Math.round(60*a),o=Math.floor(e/60),r=e%60;return(o?o+" h":"")+(o&&r?" ":"")+(r||!o?r+" min":"")};
var b=.789;
a.def("alcoolemia-estimada",function(a){var e=350*i(a.cerveja)*.05*b+150*i(a.vinho)*.12*b+50*i(a.destilado)*.4*b;if(null!=a.outro_ml||null!=a.outro_teor){if(null==a.outro_ml||null==a.outro_teor)return{error:'Para "outra bebida", informe o volume e o teor alcoólico.'};e+=a.outro_ml*a.outro_teor/100*b}if(!(e>0))return{error:"Informe ao menos uma bebida."};var r=e/(("F"===a.sexo?.55:.68)*a.peso),t=+a.horas,n=Math.max(0,r-.15*t),s=Math.max(0,r-.2*t),d=Math.max(0,r-.1*t),l=Math.max(0,r/.15-t),m=n>=.6?"high":n>0?"mid":"low",c=n>=.6?"Na faixa de crime de trânsito (art. 306 do CTB: 6 dg/L ou mais) e de infração gravíssima (art. 165)":n>0?"Ainda há álcool no sangue: dirigir é infração gravíssima (art. 165 do CTB), com qualquer concentração":"Alcoolemia estimada zerada pela eliminação média, mas o método tem incerteza grande";return{main:[o(n,2),"g/L"],label:"Alcoolemia estimada agora (Widmark)",level:m,verdict:c,rows:[["Etanol ingerido",o(e,1)+" g"],["Pico teórico (absorção completa)",o(r,2)+" g/L"],["Faixa com eliminação de 0,10 a 0,20 g/L/h",o(s,2)+" a "+o(d,2)+" g/L"],["Equivalente em ar expirado (÷ 2)",o(n/2,2)+" mg/L"],["Tempo estimado até zerar (a partir de agora)",l>0?h(l):"já zerada pela estimativa média"]],note:"Estimativa populacional, sem valor legal. Para dirigir, a única alcoolemia segura é zero: não use este cálculo para decidir se pode dirigir.",raw:{alcohol:e,c0:r,bac:n,zero:l}}});
})(window.CALC);
function calculate(input){
 if(!input||typeof input!=='object'||Array.isArray(input))return {error:'Informe um objeto com os campos da ferramenta.',code:'INVALID_INPUT'};
 const values=Object.create(null);
 for(const[name,,kind,o={}] of TOOL.fields){
  const v=Object.hasOwn(input,name)?input[name]:undefined;
  if(kind==='chk'){if(v!==undefined&&v!==null&&![true,false,1,0,'1','0'].includes(v))return {error:'Campo booleano inválido: '+name,field:name,code:'INVALID_INPUT'};values[name]=v===true||v===1||v==='1';continue;}
  const empty=v==null||(typeof v==='string'&&!v.trim());
  if(empty){if(!o.opt)return {error:'Campo obrigatório: '+name,field:name,code:'REQUIRED_FIELD'};values[name]=kind==='num'?null:'';continue;}
  if(kind==='num'){
   if(!['number','string'].includes(typeof v)||(typeof v==='string'&&!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(v.trim()))||!Number.isFinite(Number(v)))return {error:'Número inválido: '+name,field:name,code:'INVALID_INPUT'};
   const n=Number(v);if((Number.isFinite(o.min)&&n<o.min)||(Number.isFinite(o.max)&&n>o.max))return {error:'Valor fora do intervalo: '+name,field:name,code:'OUT_OF_RANGE'};
   values[name]=n;
  }else{if(!Object.hasOwn(o.opts||{},String(v)))return {error:'Opção inválida: '+name,field:name,code:'INVALID_OPTION'};values[name]=String(v);}
 }
 try{const r=window.CALC.run(TOOL.id,values,TOOL.config);if(r.error)return {error:String(r.error).replace(/<[^>]*>/g,''),code:'FORMULA_DOMAIN'};
  if(!Array.isArray(r.main)||r.main.some(v=>typeof v==='number'&&!Number.isFinite(v))||/\b(?:NaN|Infinity)\b/.test(String(r.main[0])))return {error:'Resultado não finito ou indisponível.',code:'INVALID_RESULT'};
  return {id:TOOL.id,main:r.main,label:r.label||TOOL.title,raw:r.raw||{},clinicalValidation:'not-performed'};
 }catch{return {error:'Confira os valores e o domínio da fórmula.',code:'FORMULA_DOMAIN'};}
}
const api=Object.freeze({metadata:TOOL,calculate});if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EluceniaTool=api;
})(typeof globalThis!=='undefined'?globalThis:this);
