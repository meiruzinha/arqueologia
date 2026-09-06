# Arqueologia Study Hub · UNEB — v3 auditada

Aplicativo de estudos offline para o Bacharelado em Arqueologia da UNEB, Campus VIII (Paulo Afonso), organizado a partir do Projeto Político-Pedagógico (PPP) disponibilizado pela página oficial do curso.

## O que foi auditado na v3

- os 8 semestres da matriz curricular foram conferidos;
- 65 componentes obrigatórios estão cadastrados, na distribuição 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- as 14 optativas listadas no PPP estão cadastradas;
- a soma da lista efetiva da matriz é 4.020 h obrigatórias e 560 h de optativas;
- as ementas e bibliografias foram mantidas separadas do material de apoio;
- optativas sem ementário no PPP agora aparecem explicitamente como **sem ementa específica neste PPP**;
- créditos de Prática de Campo I, Prática de Laboratório I, Prática de Campo II e Prática de Laboratório II foram corrigidos conforme o ementário;
- conceitos automáticos fora de contexto foram removidos;
- quizzes agora eliminam alternativas com definições duplicadas;
- progresso de tópicos e flashcards passou a usar chaves estáveis, evitando trocar de assunto após futuras reorganizações;
- importação de backup tem validação mais defensiva;
- busca ignora acentos;
- foram adicionados Glossário e a aba **Minha turma** para registrar professor, horários, avaliações e o plano de ensino real.

## Atenção às divergências do próprio PPP

O PPP contém inconsistências internas. O texto introdutório declara 56 disciplinas, 3 estágios (200 h), 4.080 h de formação específica e 4.840 h no total. Porém, a lista efetiva da matriz contém 65 componentes obrigatórios, incluindo 6 estágios, e soma 4.020 h. Somando a lista obrigatória (4.020 h), as optativas catalogadas (560 h) e a formação livre declarada (200 h), chega-se a 4.780 h, não 4.840 h.

O app **não inventa uma disciplina ou 60 h para fechar essa diferença**. Ele reproduz a matriz listada e sinaliza as divergências. Também mantém alertas quando matriz e ementário divergem em nome ou carga horária.

## O que é oficial e o que é apoio

**Oficial do PPP:** nome/carga horária da matriz, ementa quando existe no documento, créditos e bibliografias do ementário.

**Material de apoio:** roteiros de estudo, explicações, tópicos, conceitos, flashcards, quizzes e dicas. Esses itens servem para preparação, mas não significam que o professor dará exatamente aquelas aulas ou cobrará exatamente aquelas questões. O plano de ensino da turma é a referência final para a disciplina ofertada.

## Arquivos

- `index.html` — estrutura do aplicativo
- `styles.css` — visual e responsividade
- `app.js` — navegação, progresso, revisão, glossário, quiz e backup
- `data.js` — matriz, ementas, bibliografias e metadados
- `study-content.js` — material de apoio e guias de estudo
- `data.json` — espelho JSON dos dados curriculares
- `validate-data.js` — auditoria automatizada dos dados
- `AUDITORIA.md` — resumo das verificações e correções da v3

## Como abrir

Abra `index.html` diretamente para uma visualização rápida. Para uso normal, prefira publicar a pasta em HTTPS (por exemplo, Cloudflare Pages) para que o armazenamento local seja consistente.

Não há npm, framework, banco de dados ou servidor obrigatório: o app é HTML/CSS/JavaScript puro.

## Validação opcional

Com Node.js instalado, rode:

```bash
node validate-data.js
node --check app.js
node --check data.js
node --check study-content.js
```
