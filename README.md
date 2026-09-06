# Arqueologia Study Hub · UNEB — v6 aulas e conteúdo

Aplicativo independente de apoio aos estudos do Bacharelado em Arqueologia da UNEB — Campus VIII (Paulo Afonso), organizado com base no Projeto Político-Pedagógico (PPP) disponibilizado na página oficial do curso.

> Este projeto não é um sistema oficial da UNEB. O PPP é usado como fonte curricular; aulas, roteiros, explicações, flashcards, quizzes e perguntas de revisão são material didático de apoio e não substituem o plano de ensino da turma.

## Base curricular conferida

A matriz foi conferida componente por componente nas páginas 25–28 do PPP.

- 8 semestres;
- 65 componentes obrigatórios, distribuídos em 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- cargas semestrais da lista da matriz: 420 / 480 / 560 / 560 / 560 / 560 / 500 / 380 h;
- 4.020 h ao somar os componentes obrigatórios efetivamente listados;
- 14 optativas, somando 560 h no catálogo apresentado;
- 79 pacotes de estudo no app: 65 obrigatórios + 14 optativas;
- 397 aulas/tópicos de estudo nos componentes obrigatórios;
- 499 conceitos usados no material obrigatório.

## O que mudou na v6

A v6 transforma a antiga aba **Conteúdo** em **Aulas**.

Cada aula obrigatória agora contém:

1. **Entenda o assunto** — explicação em texto corrido;
2. **Conceitos essenciais** — definições ligadas ao tema da aula;
3. **Exemplo aplicado** — situação arqueológica, metodológica ou histórica para concretizar o conceito;
4. **O que você precisa guardar** — resumo dos pontos centrais;
5. **Perguntas de revisão** — questões para recordação ativa;
6. botão para marcar/desmarcar a aula como estudada, integrado à porcentagem da matéria.

### Profundidade do conteúdo

- **1º semestre:** 46 aulas expandidas com texto próprio e exemplos específicos, cobrindo as 7 disciplinas iniciais.
- **2º ao 8º semestre:** 351 aulas guiadas, geradas a partir da ementa, do roteiro curricular e dos conceitos revisados de cada disciplina. Todas possuem explicação, conceitos, exemplo, resumo e revisão.

O objetivo é permitir que o estudante realmente leia e estude dentro do app. O conteúdo continua sendo material didático de apoio; quando o plano de ensino do professor estiver disponível, ele deve ser usado para atualizar ordem, leituras, atividades e aprofundamento.

## O que é oficial e o que é apoio

**Dados do PPP:** nome e carga horária da matriz, nome/carga/créditos do ementário, ementa e bibliografia quando existentes.

**Material didático do app:** aulas, roteiros, explicações, conceitos, exemplos, flashcards, quizzes, dicas e revisão.

As optativas são tratadas com cuidado: o PPP consultado lista nome e carga horária, mas não apresenta ementas específicas. Por isso o app identifica seus conteúdos como roteiros sugeridos e não os apresenta como ementa oficial.

## Progresso e migração

A v6 preserva a lógica corrigida da v5.3:

- marcar uma aula aumenta a porcentagem;
- desmarcar reduz a porcentagem novamente;
- status “Estudando” não adiciona porcentagem artificial;
- progresso é calculado por aulas/tópicos, flashcards e quiz;
- dados salvos nas versões v5.3, v5, v4, v3, v2 e v1 são migrados quando encontrados;
- anotações e dados de “Minha turma” continuam preservados.

## Responsividade

Testado em Chromium em:

- 1440 × 900;
- 1024 × 768;
- 834 × 1112;
- 768 × 1024;
- 390 × 844;
- 320 × 700.

Não foi detectado overflow horizontal nesses cenários. A sidebar é fixa em desktop e vira drawer em tablet/mobile; modal, cards, abas e aulas se reorganizam conforme a largura.

## Arquivos

- `index.html` — estrutura, metadados e crédito editorial
- `styles.css` — visual e responsividade
- `app.js` — navegação, aulas, progresso, revisão, glossário, quiz, backup e migração
- `data.js` — matriz, ementas, bibliografias e metadados
- `study-content.js` — conceitos, roteiros e guias de estudo
- `lesson-content.js` — aulas expandidas do 1º semestre
- `data.json` — espelho JSON dos dados curriculares
- `validate-data.js` — auditoria automatizada da matriz, pacotes e aulas expandidas
- `AUDITORIA.md` — relatório da revisão da v6

## Publicação no GitHub / Cloudflare Pages

1. extraia o ZIP;
2. coloque os arquivos diretamente na raiz do mesmo repositório;
3. substitua as versões antigas;
4. inclua também o novo arquivo `lesson-content.js`;
5. não envie apenas o ZIP como página do site;
6. aguarde o deploy automático do Cloudflare Pages.

## Validação local

Com Node.js instalado:

```bash
node validate-data.js
node --check app.js
node --check data.js
node --check study-content.js
node --check lesson-content.js
```

### Fontes oficiais

- Curso de Arqueologia — Campus VIII: https://dedc8.uneb.br/arqueologia/
- PPP: https://dedc8.uneb.br/wp-content/uploads/2023/05/Projeto-Politico-Pedagogico-Arqueologia-DEDC-VIII.pdf
