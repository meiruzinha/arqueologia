# Auditoria — Arqueologia Study Hub v8.5

## Objetivo

A v8.5 é uma versão de **estabilidade e consolidação**. O foco da auditoria foi corrigir o bug das notas do calendário e revisar o funcionamento do app inteiro sem acrescentar uma funcionalidade grande nova.

## Bug confirmado e corrigido: notas do calendário

O cartão atual do calendário possui duas áreas: conteúdo e ações. Camadas antigas de CSS ainda esperavam uma estrutura diferente, fazendo o texto da nota perder largura em telas estreitas.

Correção aplicada:

- estrutura canônica: `conteúdo + ações`;
- até 620 px o cartão usa bloco único e os botões descem para uma linha própria;
- títulos podem quebrar linha;
- observações preservam múltiplas linhas e quebra de palavras;
- sem overflow horizontal em 390 e 320 px nos testes.

## Auditoria curricular/estática

`node validate-data.js` e `node validate-app.js` verificam:

- 65/65 componentes obrigatórios;
- 14/14 optativas;
- 8 semestres;
- distribuição `7 / 8 / 9 / 9 / 9 / 9 / 8 / 6`;
- 4.020 h na matriz obrigatória listada;
- IDs de disciplinas únicos;
- `data.js` e `data.json` idênticos;
- IDs HTML únicos;
- exatamente um botão sanduíche;
- versão visual e `APP_VERSION` em 8.5;
- classes estruturais atuais cobertas pelo CSS;
- chaves CSS balanceadas;
- ausência dos antigos arquivos de conteúdo gerado (`lesson-content.js`, `study-content.js`, `optative-content.js`).

## Testes reais de navegador

O app foi carregado em Chromium por protocolo de depuração e testado com o HTML/CSS/JS reais.

### Responsividade

As 9 páginas principais foram verificadas em:

- 1440 px;
- 1024 px;
- 834 px;
- 768 px;
- 430 px;
- 390 px;
- 320 px.

Foram 63 combinações de página/largura, sem overflow horizontal detectado.

### Disciplinas

Todas as **79 entradas** (65 obrigatórias + 14 optativas) foram abertas em:

- 1024 px;
- 390 px.

Em cada uma, foram ativadas as 7 abas:

1. Visão geral;
2. Ementa oficial;
3. Bibliografia;
4. Minha turma;
5. Caderno;
6. Revisão;
7. Meu quiz.

Total: **1.106 ativações de abas** sem overflow do modal e sem falha de abertura.

### Calendário

Testado:

- nota longa em 1440, 390 e 320 px;
- criação pelo formulário;
- edição;
- horário;
- observações;
- marcar como concluído/reabrir;
- exclusão pelo estado;
- navegação e layout mensal.

A nota longa manteve o texto integral e passou a ocupar a largura útil do cartão em telas pequenas.

### Caderno

Testado:

- criação de múltiplas folhas;
- numeração;
- acordeão com somente uma folha aberta;
- atualização de `aria-expanded`;
- edição dos campos;
- estado em memória;
- geração do HTML de impressão/PDF com título, matéria e conteúdo da folha.

### Revisão e quiz

Testado:

- criação de item de revisão;
- marcar e desmarcar;
- porcentagem `0% → 100% → 0%` em cenário unitário;
- criação de pergunta de quiz;
- resposta e complemento;
- `Acertei` e desfazer autoavaliação.

### Minha turma, status e favoritos

Testado:

- professor e horário;
- status `Cursando`;
- favoritar/desfavoritar;
- mudança do semestre atual.

### Backup

Testado:

- exportação gera payload com versão `8.5`;
- nome do arquivo segue `arqueologia-study-hub-backup-AAAA-MM-DD.json`;
- importação de um arquivo JSON válido atualiza o estado no app.

## Robustez adicionada

- mês do calendário é validado de 01 a 12;
- mapas simples de estado são normalizados por IDs válidos;
- valores importados são convertidos/limitados;
- números duplicados de folhas antigas são normalizados;
- controles importantes receberam estados ARIA coerentes.

## Limitação do ambiente de teste

O navegador automatizado do ambiente bloqueia `localStorage` em documentos injetados localmente por política administrativa. Por isso, a persistência foi validada pela lógica de estado, normalização e fluxo de backup/importação, enquanto a gravação persistente real continua baseada no `localStorage` padrão usado normalmente quando o app é servido pelo Cloudflare Pages.

## Resultado

A bateria funcional terminou sem erros JavaScript detectados nos fluxos testados. A v8.5 é considerada a base estável recomendada desta linha.
