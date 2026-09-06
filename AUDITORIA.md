# Auditoria da v6.2 — conteúdo aprofundado dos 8 semestres

## Objetivo

A v6.2 corrige a diferença de profundidade que existia entre o 1º semestre e os demais. O aplicativo não deve chamar de “aula” um texto que funcione apenas como lembrete do que pesquisar. Por isso, a camada didática foi ampliada para todos os tópicos obrigatórios.

## Cobertura

A auditoria estrutural encontrou:

- 65 componentes obrigatórios;
- 14 optativas;
- 397 tópicos obrigatórios;
- 397 aulas aprofundadas;
- 499 conceitos nas disciplinas obrigatórias;
- 1.588 perguntas de revisão;
- 1.588 respostas comentadas.

Todas as aulas obrigatórias possuem material aprofundado. Nenhum tópico dos semestres 2, 3, 4, 5, 6, 7 ou 8 permanece marcado apenas como “aula guiada”.

## Estrutura mínima por aula

O `validate-data.js` exige, para cada um dos 397 tópicos:

1. explicação contextualizada;
2. seção de aprofundamento;
3. exemplo aplicado;
4. roteiro de raciocínio;
5. erros comuns;
6. resumo/pontos de retenção;
7. pelo menos quatro perguntas de revisão;
8. resposta comentada para cada pergunta;
9. mínimo de 500 palavras na camada principal validada.

Na validação final desta versão:

- média: aproximadamente 758 palavras por aula;
- menor aula: 540 palavras;
- maior aula: 1.014 palavras.

Esses números não incluem todo o texto de interface, bibliografias, ementas, flashcards e quiz.

## Coerência didática

As aulas dos semestres 2–8 são construídas com três fontes internas já auditadas no projeto:

- a ementa oficial da disciplina;
- o roteiro de tópicos derivado da ementa;
- os conceitos específicos cadastrados para a matéria.

Também são aplicados perfis de estudo diferentes conforme a natureza da disciplina: teoria, patrimônio, tecnologia/material, métodos quantitativos, ciências ambientais/biológicas, Direito, arqueologias regionais, metodologia, Arqueologia Histórica, Geologia/Geomorfologia, Bioantropologia, campo, laboratório e formação profissional.

Isso evita tratar, por exemplo, Estatística, Teoria Arqueológica, Arqueogenética, Prática de Campo e Direito como se exigissem o mesmo tipo de raciocínio.

## Perguntas e respostas

Cada aula possui quatro ou mais perguntas. Todas têm uma resposta comentada fechada por padrão. A pergunta deve poder ser respondida a partir da própria aula; o estudante tenta primeiro e abre a resposta depois para comparar o raciocínio.

## Limite acadêmico

O material didático não é apresentado como plano oficial de aula da UNEB. A ementa do PPP é a base institucional; o aprofundamento é material independente de apoio. Quando o professor fornecer plano de ensino, textos obrigatórios, cronograma ou critérios de avaliação, esses dados devem prevalecer para a turma e podem ser incorporados na área “Minha turma”.

## Regressões preservadas

A v6.2 mantém as correções anteriores:

- marcação e desmarcação de tópico como toggle real;
- cálculo de porcentagem sem bônus artificial;
- migração de progresso por chave canônica do tópico;
- responsividade em desktop, tablet e mobile;
- 65 obrigatórias + 14 optativas;
- divergências reais do PPP sinalizadas;
- bibliografia de Estágio VI sem contaminação de seções posteriores do PDF;
- filtros que impedem conceitos deslocados entre matérias.

## Resultado

O comando `node validate-data.js` conclui a auditoria curricular, estrutural e de conteúdo da v6.2 sem erros.
