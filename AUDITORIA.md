# Auditoria completa — Arqueologia Study Hub v8.4

## Motivo da revisão

A revisão começou por um bug relatado ao salvar notas no calendário. A análise mostrou que o problema não estava nos dados salvos, e sim numa incompatibilidade entre o HTML atual e CSS legado acumulado de versões anteriores.

O item do calendário possuía `conteúdo + ações`, mas a regra antiga ainda usava uma grade com `28px + conteúdo + ações`. O texto acabava ocupando a coluna de 28 px. A v8.4 corrige essa origem e não apenas o sintoma.

## Auditoria curricular

Validado por `validate-data.js` e `validate-app.js`:

- 65 componentes obrigatórios;
- 14 optativas;
- 8 semestres;
- distribuição 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- 4.020 h na soma dos componentes obrigatórios da matriz;
- IDs de disciplinas únicos;
- `data.js` e `data.json` idênticos.

Os arquivos curriculares da v8.4 são byte a byte idênticos aos da v8.3; esta revisão não altera a grade nem as informações oficiais já cadastradas.

## Bugs corrigidos

1. **Notas do calendário espremidas** — corrigido o grid incompatível entre markup e CSS.
2. **Classes atuais sem estilo** — `course-grid`, `empty-state`, `course-card-head`, `course-summary` e classes atuais do calendário ganharam camada canônica.
3. **Compromissos da Home sem navegação direta** — agora abrem o dia correspondente no calendário.
4. **Busca não encontrava notas do calendário** — agora pesquisa título, observações e matéria vinculada.
5. **Edição de calendário** — preserva status concluído, `createdAt`, mudança de data e adiciona `updatedAt`.
6. **Datas/horários importados** — normalização passou de regex simples para validação real de calendário/relógio.
7. **Modal fechado por Esc** — a tela ao fundo agora é atualizada também nesse caminho.
8. **Atalho de navegação com busca antiga visível** — o campo de busca é limpo junto com o estado da busca.
9. **Gravação excessiva durante digitação** — caderno e dados da turma usam salvamento agendado durante `input` e gravação imediata ao confirmar mudança.
10. **PDF de folha longa** — conteúdo pode quebrar entre páginas e palavras extensas podem quebrar linha.
11. **Acessibilidade das abas/status/favorito** — estados `aria-selected`/`aria-pressed` foram adicionados.

## Testes dinâmicos no Chromium

Foi executada uma bateria automatizada com o app inteiro injetado no Chromium e interação real de DOM. Resultado: **100/100 verificações passaram**.

A bateria cobriu:

- inicialização do app;
- 65 obrigatórias e 14 optativas;
- abrir calendário;
- criar nota longa com múltiplas linhas;
- confirmar largura útil do texto e ausência de overflow;
- concluir item;
- editar item;
- mover item para outra data;
- preservar estado concluído durante edição;
- reabrir item;
- abrir um compromisso da Home diretamente no calendário;
- encontrar a nota pela busca;
- criar duas folhas no caderno;
- confirmar acordeão com apenas uma folha aberta;
- atualizar estado dos campos da folha;
- gerar HTML de impressão/PDF sem sidebar;
- adicionar, marcar e desmarcar revisão (0% → 100% → 0%);
- criar pergunta no quiz;
- alternar as sete abas de uma disciplina;
- editar dados de Minha turma;
- abrir **todas as 65 obrigatórias + 14 optativas** no modal;
- menu sanduíche no desktop;
- drawer no mobile;
- ausência de exceções JavaScript.

## Responsividade testada

As nove páginas principais e o modal da disciplina foram verificados em:

- 1440 × 900;
- 1024 × 768;
- 834 × 1112;
- 768 × 1024;
- 430 × 900;
- 390 × 844;
- 320 × 700.

Em todos os casos testados, `scrollWidth - clientWidth` ficou em **0** para a página, calendário e modal.

## Verificações estáticas adicionais

- todos os arquivos `.js` passam em `node --check`;
- CSS com chaves balanceadas;
- nenhum ID duplicado no `index.html`;
- arquivos locais referenciados pelo HTML existem;
- um único `#menuBtn`;
- arquivos antigos de conteúdo gerado (`lesson-content.js`, `study-content.js`, `optative-content.js`) não fazem parte do pacote;
- todas as classes estáticas atuais do app possuem estilo, exceto `.meta`, que existe apenas dentro do HTML isolado de impressão e é estilizada ali mesmo.

## Observação sobre persistência

O harness usado para injetar o app no Chromium não fornece acesso a `localStorage` por política de origem do documento injetado. Por isso o teste dinâmico valida atualização do estado interno, normalização e fluxo de backup, enquanto a persistência real continua implementada com `localStorage` e tratamento de erro. O app avisa o usuário se o navegador impedir o salvamento e recomenda exportar backup.

## Melhorias de produto incluídas

Além das correções, a v8.4 melhora a experiência sem alterar a filosofia da v8:

- calendário pesquisável;
- compromissos da Home clicáveis;
- formulários e notas longas mais robustos;
- salvamento durante digitação mais leve;
- validador `validate-app.js` para evitar regressões estruturais.

## Resultado

A v8.4 é a primeira revisão da linha v8 em que o calendário, caderno, revisão, quiz, modal, menu e todas as páginas principais foram submetidos à mesma bateria automatizada de interface e responsividade.
