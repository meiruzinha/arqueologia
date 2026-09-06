# Auditoria da v6 — aulas e conteúdo

Data da revisão: 06/09/2026.

## 1. Matriz curricular

A base curricular permanece igual à versão auditada anterior e foi novamente validada pelo `validate-data.js`.

| Semestre | Componentes | Carga da lista |
|---|---:|---:|
| 1º | 7 | 420 h |
| 2º | 8 | 480 h |
| 3º | 9 | 560 h |
| 4º | 9 | 560 h |
| 5º | 9 | 560 h |
| 6º | 9 | 560 h |
| 7º | 8 | 500 h |
| 8º | 6 | 380 h |
| **Total** | **65** | **4.020 h** |

As 14 optativas listadas no PPP continuam cadastradas e somam 560 h.

## 2. Nova camada de conteúdo

A v6 adiciona uma camada de aulas que não existia de forma satisfatória nas versões anteriores.

### Componentes obrigatórios

- 65 disciplinas/componentes conferidos;
- 397 aulas/tópicos no total;
- **46 aulas expandidas no 1º semestre**;
- **351 aulas guiadas do 2º ao 8º semestre**;
- 499 conceitos de apoio;
- todas as 397 aulas renderizam explicação, exemplo, resumo e perguntas de revisão.

### Estrutura de uma aula

Cada aula possui:

- “Entenda o assunto”;
- conceitos essenciais quando disponíveis;
- exemplo aplicado;
- pontos que precisam ser guardados;
- perguntas de revisão;
- controle reversível de estudado/não estudado.

As 46 aulas do 1º semestre possuem textos próprios com aprofundamento específico. As demais usam a ementa, o roteiro da disciplina, os conceitos revisados e uma abordagem metodológica adequada à área para produzir uma aula guiada.

## 3. Teste automatizado das 65 disciplinas

Foi executado um teste em Chromium que abriu **cada um dos 65 componentes obrigatórios** individualmente.

Para cada componente, o teste verificou:

- abertura do modal;
- presença das 8 abas;
- aba **Aulas** abrindo corretamente;
- quantidade de aulas igual à quantidade de tópicos cadastrados;
- presença de “Entenda o assunto”, “Exemplo aplicado”, “O que você precisa guardar” e “Perguntas de revisão”;
- conteúdo mínimo não vazio na primeira aula.

Resultado:

- **65/65 componentes aprovados**;
- **397/397 aulas encontradas**;
- **0 erros** nessa bateria.

As 14 optativas também foram abertas em teste separado e seus 70 tópicos sugeridos renderizaram corretamente.

## 4. Progresso

O bug relatado na v5.2 não voltou.

Foi testado o seguinte ciclo:

1. abrir uma matéria;
2. marcar a primeira aula como estudada;
3. confirmar aumento da porcentagem;
4. desmarcar a mesma aula;
5. confirmar retorno da porcentagem ao valor anterior.

Resultado: aprovado.

A porcentagem continua sendo composta por:

- 60% aulas/tópicos;
- 20% flashcards;
- 20% quiz.

O status “Estudando” não soma pontos artificialmente.

## 5. Responsividade

Bateria executada em:

- 1440 × 900 — desktop;
- 1024 × 768 — notebook;
- 834 × 1112 — tablet;
- 768 × 1024 — tablet retrato;
- 390 × 844 — mobile;
- 320 × 700 — mobile estreito.

Resultado:

- zero overflow horizontal detectado;
- zero erros JavaScript detectados na bateria principal;
- sidebar fixa em desktop e drawer em tablet/mobile;
- modal sem overflow horizontal;
- conteúdo de aula reorganizado para uma coluna em telas menores;
- abas permanecem navegáveis horizontalmente quando necessário.

## 6. Separação entre fonte oficial e material didático

O app continua distinguindo:

- **PPP oficial:** matriz, ementa, créditos, cargas e bibliografia;
- **material didático:** aulas, exemplos, resumos, conceitos, flashcards e quizzes;
- **Minha turma:** informações reais do professor, horários, avaliações e plano de ensino.

As aulas não são apresentadas como transcrição oficial do que o professor necessariamente ministrará. O plano de ensino da turma continua sendo a referência final para ordem, leituras e avaliações.

## 7. Inconsistências do PPP preservadas

Continuam registradas e visíveis as inconsistências já auditadas, incluindo:

- 56 disciplinas / 3 estágios / 200 h / 236 créditos declarados versus 65 componentes / 6 estágios na lista;
- 4.080 h declaradas versus 4.020 h somadas da lista;
- 4.840 h declaradas versus 4.780 h ao somar 4.020 + 560 + 200;
- 236 créditos em uma seção versus 265 em outra;
- diferenças de nome e carga entre matriz e ementário;
- Metodologia da Pesquisa Quantitativa na matriz versus Qualitativa no ementário;
- outros possíveis erros editoriais preservados e sinalizados.

## 8. Crédito do projeto

O rodapé continua exibindo:

> Desenvolvido para fins de estudo, com organização baseada no Projeto Político-Pedagógico (PPP) do Bacharelado em Arqueologia da UNEB — Campus VIII, disponibilizado no site oficial do curso.
>
> Projeto independente, sem vínculo institucional com a UNEB. — Mei.

Somente **Mei** é linkado ao Instagram configurado (`https://www.instagram.com/meiarqueo/`).

## 9. Resultado

A v6 deixa de ser apenas um rastreador do que estudar. Ela passa a oferecer material legível dentro das disciplinas, preservando a matriz auditada, o acompanhamento de progresso, flashcards, quiz, bibliografia, anotações e responsividade.
