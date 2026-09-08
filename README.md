# Arqueologia Study Hub · UNEB — v8.4

Aplicativo independente de organização acadêmica para o Bacharelado em Arqueologia da UNEB — Campus VIII, estruturado a partir da matriz curricular e do Projeto Político-Pedagógico (PPP) disponibilizado pelo curso.

## O que é esta versão

A v8.4 é uma revisão de estabilidade da linha v8. O foco foi corrigir incompatibilidades acumuladas entre HTML, CSS e JavaScript e manter o app como **grade oficial + caderno acadêmico + calendário + revisão e quiz criados pelo próprio estudante**.

Não há aulas, flashcards ou conteúdos didáticos gerados automaticamente no pacote.

## Estrutura acadêmica

- 8 semestres;
- 65 componentes obrigatórios;
- distribuição: 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- 4.020 h somadas a partir dos componentes obrigatórios listados na matriz;
- 14 optativas listadas no PPP.

Cada disciplina mantém:

- Visão geral;
- Ementa oficial;
- Bibliografia oficial;
- Minha turma;
- Caderno em folhas;
- Revisão personalizada;
- Meu quiz.

## Correções principais da v8.4

### Calendário

O bug das notas salvas foi corrigido. O HTML atual possuía dois blocos por item (conteúdo + ações), enquanto uma camada antiga de CSS ainda reservava três colunas. Isso espremia o texto da nota numa coluna estreita.

A v8.4 alinha novamente o markup e o CSS e também:

- corrige quebra de linha de observações longas;
- preserva o estado concluído ao editar e mudar a data;
- valida data e horário ao importar/salvar;
- permite clicar em um compromisso da Home para abrir diretamente o dia correspondente;
- inclui notas do calendário na busca global;
- melhora formulário, legenda, painel do dia e responsividade.

### Compatibilidade de layout

Foram corrigidas classes usadas pela interface atual que estavam sem estilo canônico, como `course-grid`, `empty-state`, `course-card-head`, `course-summary`, `calendar-day-number`, `calendar-day-items` e `calendar-detail-head`.

Isso estabiliza especialmente:

- Toda a grade;
- resultados de busca;
- estados vazios;
- calendário;
- cartões de matéria.

### Caderno e formulários

- escrita em campos longos passa a usar salvamento agendado para reduzir gravações excessivas no `localStorage` durante a digitação;
- mudança/saída do campo força gravação imediata;
- novas folhas recebem `createdAt` e a lista é normalizada por numeração;
- PDF aceita melhor anotações longas que atravessam mais de uma página.

### Modal e navegação

- fechar a matéria com `Esc` agora atualiza a página que ficou ao fundo;
- abas receberam estado `aria-selected`;
- favorito/status receberam estados de acessibilidade;
- atalhos de navegação limpam corretamente a pesquisa visível.

## Caderno digital

Cada matéria possui folhas independentes com:

- número permanente;
- data;
- título;
- o que foi aprendido;
- conceitos e palavras-chave;
- dúvidas;
- tarefas, leituras e prazos;
- observações livres;
- opção de salvar/imprimir a folha em PDF.

## Calendário

Permite registrar:

- notas;
- aulas;
- provas;
- trabalhos;
- leituras;
- prazos;
- lembretes.

Cada item pode receber matéria, horário, observações e status concluído/pendente.

## Revisão e quiz

A porcentagem de revisão representa somente os itens criados pelo usuário. O quiz também é criado pelo estudante e guarda pergunta, resposta, complemento e autoavaliação.

## Backup

O app continua usando a chave `arqueologia-study-hub-v8`, portanto dados salvos nas versões anteriores da linha v8 permanecem compatíveis. O backup JSON inclui caderno, calendário, revisões, quiz, favoritas, status e dados da turma.

## Validação

Execute:

```bash
node validate-data.js
node validate-app.js
```

`validate-data.js` confere a matriz curricular. `validate-app.js` acrescenta verificações de estrutura do pacote, arquivos, IDs, CSS essencial e consistência entre `data.js` e `data.json`.

## Arquivos

- `index.html`
- `styles.css`
- `app.js`
- `data.js`
- `data.json`
- `validate-data.js`
- `validate-app.js`
- `README.md`
- `AUDITORIA.md`

## Limite acadêmico

O app é um projeto independente. O PPP permanece como referência institucional; o conteúdo real das aulas é construído pelo estudante no caderno, nas revisões e no quiz conforme a turma e os professores avançam.
