# Arqueologia Study Hub · UNEB — v6.2

Aplicativo independente de apoio aos estudos do Bacharelado em Arqueologia da UNEB — Campus VIII, organizado a partir do Projeto Político-Pedagógico (PPP) disponibilizado pelo curso.

## O que muda na v6.2

A principal mudança é pedagógica: **todos os 397 tópicos das 65 disciplinas obrigatórias dos 8 semestres agora são renderizados como aulas aprofundadas**, e não apenas como listas ou resumos curtos.

Cada aula contém:

- explicação contextualizada;
- aprofundamento desenvolvido;
- conceitos essenciais;
- roteiro de raciocínio;
- exemplo aplicado;
- erros comuns;
- pontos que precisam ser guardados;
- pelo menos 4 perguntas de revisão;
- resposta comentada escondida para cada pergunta;
- botão para marcar/desmarcar a aula como estudada.

A camada de conteúdo usa a ementa oficial, o roteiro de tópicos e os conceitos auditados já existentes no projeto. O conteúdo didático é material de apoio: o plano de ensino do professor continua sendo a referência para ordem das aulas, autores, avaliações e recortes específicos da turma.

## Escala atual do conteúdo

- 8 semestres;
- 65 componentes obrigatórios;
- 14 optativas;
- 397 aulas aprofundadas;
- 499 conceitos de apoio;
- 1.588 perguntas de revisão com 1.588 respostas comentadas;
- aproximadamente 758 palavras por aula em média na camada didática principal;
- aula mais curta validada com mais de 500 palavras no material principal.

## Grade curricular

A matriz permanece auditada contra as páginas 25–28 do PPP. O app preserva divergências internas do próprio documento em vez de inventar componentes ou cargas para fechar contas.

Distribuição dos componentes obrigatórios por semestre:

- 1º: 7;
- 2º: 8;
- 3º: 9;
- 4º: 9;
- 5º: 9;
- 6º: 9;
- 7º: 8;
- 8º: 6.

A lista da matriz soma 4.020 h de componentes obrigatórios e 560 h nas 14 optativas listadas.

## Progresso e migração

A v6.2 utiliza a chave `arqueologia-study-hub-v6-2` e migra automaticamente o progresso salvo pela v6.1 e por versões anteriores compatíveis. O sistema continua preservando:

- matérias estudadas;
- tópicos marcados;
- favoritos;
- flashcards;
- resultados de quiz;
- anotações;
- dados de “Minha turma”.

## Arquivos do projeto

- `index.html`
- `styles.css`
- `app.js`
- `data.js`
- `data.json`
- `study-content.js`
- `lesson-content.js`
- `validate-data.js`
- `README.md`
- `AUDITORIA.md`

## Validação

Execute:

```bash
node validate-data.js
```

O validador confere grade, carga horária, ementas, bibliografias, conceitos, tópicos e a presença/estrutura das 397 aulas aprofundadas.
