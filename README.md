# Arqueologia Study Hub · UNEB — v7.5

Aplicativo independente de apoio aos estudos do Bacharelado em Arqueologia da UNEB — Campus VIII, organizado a partir do Projeto Político-Pedagógico (PPP) disponibilizado pelo curso.

## O que esta versão consolida

A v7.5 é uma revisão geral do conteúdo e do código. Ela mantém a estrutura curricular auditada, o caderno digital em folhas, exportação de folhas para PDF, progresso, flashcards, quiz, busca, favoritos, glossário e menu responsivo. Também corrige cruzamentos semânticos encontrados durante a auditoria final.

### Cobertura

- 8 semestres;
- 65 componentes obrigatórios;
- 14 optativas;
- 397 aulas aprofundadas nas obrigatórias;
- 70 aulas sugeridas nas optativas;
- 1.588 perguntas de revisão com respostas comentadas nas obrigatórias;
- 280 perguntas de revisão nas optativas;
- 498 conceitos de apoio nas obrigatórias;
- 4.020 h ao somar os componentes obrigatórios listados na matriz;
- 560 h ao somar as optativas listadas.

A matriz continua preservando as divergências internas do próprio PPP em vez de “corrigi-las” silenciosamente.

## Revisão semântica da v7.5

Foram corrigidos sentidos ambíguos que haviam sido herdados por correspondência de palavras:

- `contexto` em Sociologia passou a ser **contexto histórico-social**;
- `contexto` em Linguística passou a ser **contexto linguístico e discursivo**;
- Direito e Estágio receberam definições próprias de contexto, sem reutilizar a definição de contexto estratigráfico;
- `escrita` nos Seminários I e II passou a ser **escrita acadêmica**;
- Arqueogenética foi reconstruída conforme a ementa oficial de Genética: Mendel, segregação independente, herança extranuclear, gene molecular, regulação gênica e herança relacionada ao sexo;
- foram removidos de Arqueogenética trechos herdados de Antropologia Física, como estimativa biológica, população comparativa e diagnóstico osteológico;
- `assortimento independente` foi substituído pelo termo em português **segregação independente**.

O validador contém testes de regressão para impedir que esses cruzamentos reapareçam.

## Repetição de conteúdo

A v7.5 elimina duplicação literal artificial entre parágrafos longos, exemplos, perguntas de revisão e itens de resposta nas 397 aulas obrigatórias. As 70 aulas sugeridas das optativas também permanecem separadas e individualizadas.

Alguns conceitos aparecem legitimamente em mais de uma disciplina — por exemplo, contexto arqueológico, ética, cronologia, patrimônio, sítio e cultura material. Nesses casos a repetição conceitual é intencional porque o mesmo conceito é transversal ao curso. A estrutura visual das aulas também permanece consistente (explicação, aprofundamento, conceitos, exemplo, erros comuns e revisão), mas o conteúdo específico é separado por tópico.

## Caderno digital

Cada disciplina possui folhas independentes com:

- número permanente da folha;
- título e data;
- conteúdo aprendido em sala;
- conceitos e palavras-chave;
- dúvidas;
- tarefas, leituras e prazos;
- observações livres.

As folhas funcionam em acordeão: ao abrir uma, as outras são recolhidas. Cada folha pode ser preparada para **Salvar como PDF** pela impressão nativa do navegador.

## Progresso

Nas matérias com todos os componentes:

- 60% — aulas/tópicos;
- 20% — flashcards;
- 20% — quiz.

O quiz completa sua parcela ao atingir 70%. Matérias sem algum componente têm os pesos disponíveis normalizados. Marcar e desmarcar tópicos ou flashcards recalcula a porcentagem imediatamente.

## Responsividade

A v7.5 foi testada em 1440, 1024, 960, 834, 768, 620, 520, 430, 390, 360 e 320 px. A página e o modal das matérias não apresentaram overflow horizontal nessas larguras.

O menu sanduíche:

- recolhe/abre a sidebar no desktop;
- funciona como drawer no tablet e no celular.

## Arquivos

- `index.html`
- `styles.css`
- `app.js`
- `data.js`
- `data.json`
- `study-content.js`
- `lesson-content.js`
- `optative-content.js`
- `validate-data.js`
- `README.md`
- `AUDITORIA.md`

## Validação

Execute:

```bash
node validate-data.js
```

A validação confere matriz curricular, cargas, tópicos, conceitos, aulas, perguntas/respostas, regressões semânticas e duplicações literais já identificadas em versões anteriores.

## Limite acadêmico

O app é material independente de apoio. Ele não substitui o plano de ensino, as aulas do professor, as leituras indicadas nem bibliografia acadêmica revisada. A aba do PPP é mantida separada do conteúdo didático justamente para distinguir fonte institucional de material de estudo.
