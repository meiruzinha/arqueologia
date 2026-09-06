# Arqueologia Study Hub · UNEB — v4 auditoria completa

Aplicativo de estudos offline para o Bacharelado em Arqueologia da UNEB, Campus VIII (Paulo Afonso), organizado a partir do Projeto Político-Pedagógico (PPP) disponibilizado pela página oficial do curso.

## O que foi conferido na v4

A matriz curricular foi conferida componente por componente nas páginas 25–28 do PPP, e o ementário foi revisado disciplina por disciplina.

- 8 semestres;
- 65 componentes obrigatórios na distribuição 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- cargas semestrais da lista da matriz: 420 / 480 / 560 / 560 / 560 / 560 / 500 / 380 h;
- 4.020 h na lista de componentes obrigatórios;
- 14 optativas, totalizando 560 h no catálogo apresentado;
- ementas, nomes do ementário, créditos e bibliografias mantidos separados do material de apoio;
- 79 pacotes de estudo, um para cada componente obrigatório/optativo;
- todos os tópicos cadastrados possuem guia de estudo não vazio;
- optativas continuam identificadas como roteiros sugeridos a partir do título, porque este PPP não traz ementas específicas para elas.

## Correções importantes da v4

- corrigida a bibliografia complementar de **Estágio VI**, que na versão anterior havia capturado indevidamente texto das seções seguintes do PDF;
- roteiros de **Arqueologia Histórica I e II, Tecnologia Cerâmica, Geologia e Geomorfologia, Antropologia Física, Arqueologia Africana, Arqueologia Asiática, Arqueogenética, Arqueologia do Quaternário e Métodos/Relatórios** foram realinhados à ementa oficial;
- removidos guias vazios e fallbacks excessivamente genéricos;
- preservados e explicados erros ou trechos estranhos do próprio PPP em vez de transformá-los silenciosamente em “conteúdo oficial”;
- a navegação agora limpa uma busca ativa, evitando ficar visualmente em uma seção enquanto ainda eram mostrados resultados da busca;
- corrigido o comportamento de teclado do botão de favorito e adicionados `aria-pressed`/rótulo dinâmico;
- o painel inicial mostra todos os componentes do semestre selecionado, em vez de ocultar o último atrás de “Ver todas”;
- sidebar passou a rolar em telas de pouca altura;
- modal de disciplina passou a ocupar a tela inteira no celular e suas abas ficam acessíveis/roláveis;
- textos longos de bibliografia, notas e tabelas agora quebram linha com segurança;
- adicionada preferência de movimento reduzido;
- migração de progresso da v3 para a v4 preservada.

## Divergências do próprio PPP

O documento tem inconsistências internas que o app **não tenta consertar inventando dados**. Entre elas:

- a seção da matriz declara 56 disciplinas, 3 estágios/200 h, 236 créditos e 4.080 h de formação específica, mas a lista efetivamente apresentada contém 65 componentes, Estágio I a VI e soma 4.020 h;
- 4.020 + 560 + 200 = 4.780 h, enquanto o PPP declara 4.840 h;
- os percentuais declarados (74% / 13% / 13%) não correspondem às próprias cargas declaradas de 4.080 / 560 / 200 h; o app exibe também o recálculo aproximado;
- outra seção registra 265 créditos mínimos, em conflito com os 236 da seção da matriz;
- há diferenças entre matriz e ementário em nome/carga horária de alguns componentes;
- Prática de Laboratório II aparece com `1T3T` no ementário, grafia preservada e sinalizada;
- o TCC é descrito como oito créditos em uma seção, mas aparece como 60 h / 4T no ementário;
- existem trechos com sinais de edição/cópia no texto oficial, como Arqueologia Asiática e uma frase desconectada na ementa de Métodos/Relatórios.

## Oficial x material de apoio

**Oficial do PPP:** nome e carga da matriz, nome/carga/créditos do ementário, ementa e bibliografias quando existentes.

**Material de apoio:** tópicos explicados, conceitos, flashcards, quizzes, dicas e roteiros. Eles derivam da ementa para ajudar na preparação, mas não substituem o plano de ensino real da turma. Quando a disciplina for ofertada, o plano do professor deve ser a referência final para ordem, leituras, avaliações e aprofundamento.

## Arquivos

- `index.html` — estrutura do aplicativo
- `styles.css` — visual e responsividade
- `app.js` — navegação, progresso, revisão, glossário, quiz e backup
- `data.js` — matriz, ementas, bibliografias e metadados
- `study-content.js` — material de apoio e guias de estudo
- `data.json` — espelho JSON dos dados curriculares
- `validate-data.js` — auditoria automatizada da matriz e dos pacotes de estudo
- `AUDITORIA.md` — relatório resumido da conferência da v4

## Como abrir/publicar

O projeto é HTML/CSS/JavaScript puro, sem framework, npm, banco de dados ou servidor obrigatório. Pode ser publicado diretamente no Cloudflare Pages/GitHub Pages.

Para atualizar o site já conectado ao Cloudflare Pages, substitua no repositório os arquivos antigos pelos arquivos **extraídos** deste pacote. Não envie o ZIP como página do site.

## Validação local

Com Node.js instalado:

```bash
node validate-data.js
node --check app.js
node --check data.js
node --check study-content.js
```
