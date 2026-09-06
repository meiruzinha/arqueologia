# Arqueologia Study Hub · UNEB — v5.3 responsiva

Aplicativo independente de apoio aos estudos do Bacharelado em Arqueologia da UNEB — Campus VIII (Paulo Afonso), organizado com base no Projeto Político-Pedagógico (PPP) disponibilizado na página oficial do curso.

> Este projeto não é um sistema oficial da UNEB. O PPP é usado como fonte curricular; roteiros, explicações, flashcards e quizzes são material de apoio e não substituem o plano de ensino da turma.

## Base curricular conferida

A matriz foi conferida componente por componente nas páginas 25–28 do PPP.

- 8 semestres;
- 65 componentes obrigatórios, distribuídos em 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- cargas semestrais da lista da matriz: 420 / 480 / 560 / 560 / 560 / 560 / 500 / 380 h;
- 4.020 h ao somar os componentes obrigatórios efetivamente listados;
- 14 optativas, somando 560 h no catálogo apresentado;
- 79 pacotes de estudo no app: 65 obrigatórios + 14 optativas;
- 397 tópicos de apoio nos componentes obrigatórios;
- 499 conceitos usados no material de estudo obrigatório.

## O que é oficial e o que é apoio

**Dados do PPP:** nome e carga horária da matriz, nome/carga/créditos do ementário, ementa e bibliografia quando existentes.

**Material de apoio do app:** roteiros, explicações, tópicos, conceitos, flashcards, quizzes, dicas e revisão. Esses recursos são derivados da ementa para preparação e organização do estudo, mas o plano de ensino do professor deve ser a referência final para ordem, leituras, avaliações e aprofundamento.

As optativas são tratadas com cuidado: o PPP consultado lista nome e carga horária, mas não apresenta ementas específicas. Por isso o app identifica seus conteúdos como roteiros sugeridos.

## O que mudou na v5.3

- Corrigido o toggle reversível de tópicos estudados/não estudados.
- Corrigida a migração de chaves antigas de progresso por índice para chaves por nome do tópico.
- A porcentagem não recebe mais +4% apenas por estar com status “Estudando”; agora representa somente tópicos, flashcards e quiz.
- Ao desmarcar o último progresso real de uma matéria, o status volta automaticamente para “Não iniciada”.
- Ao escolher manualmente “Não iniciada” em uma matéria com progresso, o app pede confirmação e zera apenas tópicos/flashcards/quiz da matéria, preservando anotações e dados da turma.


- responsividade refinada para desktop, notebook, tablet e celular;
- sidebar fixa em desktop e transformada em menu lateral até 960 px, liberando espaço útil em tablets;
- grade com 3 colunas em desktop largo, 2 em notebook/tablet e 1 em telas menores;
- cards, estatísticas, chips, abas e botões adaptados a larguras intermediárias;
- modal de disciplina responsivo e em tela cheia no mobile;
- barra de abas rolável horizontalmente quando necessário;
- ajustes específicos para 320–360 px e para telas de pouca altura;
- crédito editorial completo restaurado com links para o PPP e para o site oficial do curso;
- somente **Mei** é clicável na autoria e abre `https://www.instagram.com/meiarqueo/`; o `@meiarqueo` não aparece na interface;
- a base curricular e todo o material de estudo permanecem os mesmos da v5 auditada, preservando o progresso salvo.

## Divergências do próprio PPP

O documento contém inconsistências internas que o app preserva e sinaliza em vez de inventar uma correção. Entre elas:

- a seção da matriz declara 56 disciplinas, 3 estágios/200 h, 236 créditos e 4.080 h de formação específica, enquanto a lista efetivamente apresentada contém 65 componentes, Estágio I a VI e soma 4.020 h;
- 4.020 + 560 + 200 = 4.780 h, enquanto o PPP declara 4.840 h;
- outra seção registra 265 créditos mínimos, em conflito com os 236 da seção da matriz;
- existem diferenças de nome/carga entre matriz e ementário em alguns componentes;
- Prática de Laboratório II aparece com `1T3T` no ementário;
- o TCC é descrito como oito créditos em uma seção, mas aparece como 60 h / 4T no ementário;
- alguns trechos têm sinais de edição/cópia no texto oficial.

## Arquivos

- `index.html` — estrutura, metadados e crédito editorial
- `styles.css` — visual e responsividade
- `app.js` — navegação, progresso, revisão, glossário, quiz, backup e migração
- `data.js` — matriz, ementas, bibliografias e metadados
- `study-content.js` — material de apoio e guias de estudo
- `data.json` — espelho JSON dos dados curriculares
- `validate-data.js` — auditoria automatizada da matriz e dos pacotes de estudo
- `AUDITORIA.md` — relatório da revisão final

## Publicação no GitHub / Cloudflare Pages

O projeto usa apenas HTML, CSS e JavaScript. Para atualizar o site:

1. extraia o ZIP;
2. coloque os arquivos acima diretamente na raiz do mesmo repositório;
3. substitua as versões antigas;
4. não envie o ZIP como página do site;
5. aguarde o deploy automático do Cloudflare Pages.

## Validação local

Com Node.js instalado:

```bash
node validate-data.js
node --check app.js
node --check data.js
node --check study-content.js
```

### Fontes oficiais

- Curso de Arqueologia — Campus VIII: https://dedc8.uneb.br/arqueologia/
- PPP: https://dedc8.uneb.br/wp-content/uploads/2023/05/Projeto-Politico-Pedagogico-Arqueologia-DEDC-VIII.pdf
