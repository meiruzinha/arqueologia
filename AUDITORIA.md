# Auditoria — Arqueologia Study Hub v8

## Escopo

A v8 foi reorganizada para funcionar como caderno acadêmico digital. A auditoria desta versão verifica a matriz curricular, a remoção do material didático gerado automaticamente e a estrutura das ferramentas que passam a ser preenchidas pelo próprio estudante.

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

A v8 não carrega mais:

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

O estado da v8 preserva calendário mensal com título, tipo, matéria opcional, horário, observações e estado concluído/pendente. Os próximos compromissos podem aparecer no Início.

## Busca

A busca inclui dados institucionais e conteúdo criado pelo usuário: nome da disciplina, ementa, bibliografia, professor, dados da turma, caderno, revisões e perguntas do quiz.

## Backup e migração

O estado da v8 é salvo em `arqueologia-study-hub-v8`. A migração procura chaves anteriores compatíveis e preserva, quando disponíveis:

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

Foram produzidas prévias da v8 em desktop, tablet e mobile durante o desenvolvimento. A validação estrutural também verifica que os arquivos locais referenciados pelo HTML existem.

## Limites

Esta auditoria não transforma o app em fonte oficial da UNEB. O objetivo da v8 é justamente evitar prever o que o professor ensinará. O PPP permanece como referência institucional e o conteúdo real passa a ser construído no caderno, nas revisões e nos quizzes do próprio usuário.
