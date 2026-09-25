# Alcoolemia estimada (fórmula de Widmark)

Identificador: `alcoolemia-estimada`. Pacote independente da interface ELUCENIA, para navegador e Node.js.

## Situação

- Revisão: **needs-review**. Revisão documental e clínica independente pendente.
- Execução: **disponível para reprodução técnica da fórmula**.
- Validação clínica independente: **não realizada**. Os testes abaixo verificam aritmética e transporte dos campos.
- Fonte importada: Panorama Médico; arquivo `app/content/ferramentas/saude-coletiva.php`.
- 5/5 casos de referência conferidos na importação. 0 casos independentes desta ferramenta.
- Dados: o exemplo funciona localmente, sem rede, armazenamento ou identificação de pacientes.

## Uso no Node.js

```js
const { calculate } = require('./calculator.js');
const example = require('./examples.json')[0];
console.log(calculate(example.input));
```

Execute `node test.cjs` (ou `npm test`) para conferir os exemplos. Abra `index.html` para usar a versão local do navegador. Não há dependências npm.

## Contrato

`calculate(input)` recebe um objeto, devolve `{id, main, label, raw, clinicalValidation}` ou `{error, code, field?}`. Consulte `tool.json` e `metadata.fields` para nomes, unidades, opções e intervalos. Números aceitam valores finitos ou strings numéricas; opções precisam corresponder às chaves documentadas. Campos obrigatórios vazios, booleanos inválidos, valores fora de intervalo e resultados não finitos são rejeitados. Somente checkbox omitido representa falso; um campo numérico ou uma opção obrigatória nunca é preenchido automaticamente.

Interpretações, ordens terapêuticas e tabelas herdadas não são retornadas pelo adaptador. Classificações e valores ainda dependem da população e das limitações da fonte.

## Fórmula / versão

Álcool ingerido (g) = volume (mL) × teor (%) / 100 × 0,789 (densidade do etanol).Widmark: C = A / (r × P) − β × t, em que A = gramas de álcool, P = peso (kg), r = fator de distribuição (0,68 no homem e 0,55 na mulher), β = eliminação (0,15 g/L por hora; faixa usual de 0,10 a 0,20) e t = horas desde o início do consumo. O resultado sai em g/kg, aproximado aqui a g/L de sangue.Equivalente no ar expirado: g/L de sangue ÷ 2 = mg/L de ar (proporção do art. 306 do CTB: 6 dg/L de sangue = 0,3 mg/L de ar).

A transcrição acima documenta o acervo de origem e pode requerer atualização. 

## Condições e limites

Estima a concentração de álcool no sangue depois de beber, pela fórmula de Widmark, para ensino, orientação e perícia retrospectiva, com os limites legais brasileiros.

Confirme população, exclusões, unidades, versão e diretriz aplicável ao país e serviço. O resultado não deve ser utilizado isoladamente para diagnóstico, alta ou prescrição. O pacote não representa certificação clínica, aprovação regulatória ou indicação para toda população. Veja a revisão completa em `tool.json`.

## Fontes originais

- [Posey D, Mozayani A. The estimation of blood alcohol concentration: Widmark revisited. Forensic Sci Med Pathol, 2007.](https://doi.org/10.1385/fsmp:3:1:33)
- [Searle J. Alcohol calculations and their uncertainty. Med Sci Law, 2015.](https://doi.org/10.1177/0025802414524385)
- [Brasil. Lei nº 9.503, de 23 de setembro de 1997: Código de Trânsito Brasileiro (arts. 165, 276 e 306), texto compilado.](https://www.planalto.gov.br/ccivil_03/leis/l9503compilado.htm)

## Exemplos e rastreabilidade

`examples.json` preserva `originalInput`, expectativa e entrada explícita do exemplo. Não foi necessário expandir opções zero nos exemplos.

## Direitos e repositório

Este pacote integra o acervo privado de desenvolvimento da ELUCENIA. A publicação externa depende de liberação expressa. A licença MIT (arquivo LICENSE) cobre o código de integração, preservando o aviso de autoria e a licença; não transfere direitos sobre instrumentos, traduções, questionários, artigos, marcas ou outros materiais de terceiros. Consulte NOTICE.md e as condições de cada titular. O acesso a este adaptador não publica nem licencia automaticamente o restante da plataforma ELUCENIA.

## Acesso ao repositório

Repositório privado da organização ELUCENIA. A abertura pública depende de liberação expressa.
