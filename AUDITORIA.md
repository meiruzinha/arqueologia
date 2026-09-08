# Auditoria — Arqueologia Study Hub v8.2

## Escopo

A v8.2 foi reorganizada para funcionar como caderno acadêmico digital. A auditoria desta versão verifica a matriz curricular, a remoção do material didático gerado automaticamente e a estrutura das ferramentas que passam a ser preenchidas pelo próprio estudante.

## Matriz preservada

O validador confirma:

- 65/65 componentes obrigatórios;
- 14/14 optativas;
- 8 semestres;
- distribuição obrigatória: 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- 4.020 h dos componentes obrigatórios listados na matriz;
- 560 h das 14 optativas listadas.

`node validate-data.js` conclui sem erros.

## Conteúdo gerado removido

A v8.2 não carrega mais:

- `study-content.js`;
- `lesson-content.js`;
- `optative-content.js`;
- aulas geradas automaticamente;
- flashcards gerados automaticamente;
- quizzes gerados automaticamente;
- checklist artificial de conteúdos previstos.

A matéria passa a ser organizada a partir do que é institucionalmente conhecido (matriz, ementa e bibliografia) e do que o usuário registra durante a graduação.

## Estrutura de cada disciplina

Foram mantidas sete áreas:

1. Visão geral;
2. Ementa oficial;
3. Bibliografia;
4. Minha turma;
5. Caderno;
6. Revisão;
7. Meu quiz.

As optativas continuam identificadas como sem ementa detalhada quando o PPP consultado apenas lista nome e carga horária.

## Caderno

A estrutura suporta várias folhas por matéria, com numeração permanente, acordeão, autosalvamento e exportação de uma folha pela impressão nativa do navegador para PDF.

A normalização de dados preserva folhas compatíveis de versões anteriores e atribui número permanente a registros legados que ainda não possuíam `pageNumber`.

## Revisão

A porcentagem de revisão é calculada somente a partir dos itens criados pelo usuário:

`concluídos / total de itens × 100`.

Se não existirem itens, a interface informa que não há revisão cadastrada em vez de atribuir um percentual artificial à disciplina.

## Quiz personalizado

As perguntas são criadas pelo usuário e armazenam pergunta, resposta, complemento opcional e estado de autoavaliação. O app não atribui nota acadêmica nem presume o conteúdo cobrado pelo professor.

## Calendário

O estado da v8.2 preserva calendário mensal com título, tipo, matéria opcional, horário, observações e estado concluído/pendente. Os próximos compromissos podem aparecer no Início.

## Busca

A busca inclui dados institucionais e conteúdo criado pelo usuário: nome da disciplina, ementa, bibliografia, professor, dados da turma, caderno, revisões e perguntas do quiz.

## Backup e migração

O estado da v8.2 é salvo em `arqueologia-study-hub-v8`. A migração procura chaves anteriores compatíveis e preserva, quando disponíveis:

- semestre atual;
- status;
- favoritas;
- anotações antigas;
- dados da turma;
- folhas do caderno;
- calendário;
- revisões personalizadas;
- quizzes personalizados.

Os conteúdos automáticos antigos não são importados como conteúdo da nova interface.

## Responsividade

A estrutura CSS mantém os breakpoints já usados no projeto para desktop, tablet e mobile, incluindo menu lateral recolhível/drawer, grade de cartões, diálogo da disciplina, calendário e formulários.

A validação estrutural verifica que os arquivos locais referenciados pelo HTML existem. Nesta revisão, o mecanismo de captura automática do Chromium do ambiente não concluiu de forma confiável; por isso a auditoria não afirma uma inspeção por screenshot que não foi possível fechar.

## Limites

Esta auditoria não transforma o app em fonte oficial da UNEB. O objetivo da v8.2 é justamente evitar prever o que o professor ensinará. O PPP permanece como referência institucional e o conteúdo real passa a ser construído no caderno, nas revisões e nos quizzes do próprio usuário.

## Interface v8.2

A sidebar não possui mais um segundo botão interno de recolhimento. O único controle é `#menuBtn`, mantido na barra superior e disponível mesmo quando o menu está fechado. A home usa componentes próprios mais compactos e não altera os cards detalhados das demais páginas.

Checagens estáticas desta revisão: IDs HTML sem duplicação, um único `#menuBtn`, ausência de `#sidebarToggle`, CSS com blocos balanceados, JavaScript com sintaxe válida e matriz validada pelo `validate-data.js`.



## Correção do modal da disciplina

A v8.2 corrige um problema estrutural da v8/v8.1: a nova marcação interna das disciplinas (`course-dialog-page`, `course-dialog-header`, `course-meta` e `course-panels`) havia sido criada sem uma camada completa de estilos própria e acabava herdando parcialmente o CSS do modal antigo.

A correção estabelece:

- cabeçalho próprio e responsivo para a disciplina;
- botão de fechar posicionado sem sobrepor os campos;
- barra de status e indicadores com espaçamento consistente;
- abas horizontais com rolagem em telas estreitas;
- área de conteúdo com padding próprio;
- grade de campos 2→1 colunas conforme a largura;
- largura máxima e `box-sizing` consistente em inputs, selects e textareas;
- Caderno, Revisão e Meu Quiz protegidos contra estouro horizontal;
- modal quase em tela cheia no mobile sem perder margens de segurança.
