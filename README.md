# Arqueologia Study Hub · UNEB — v7

Aplicativo independente de apoio aos estudos do Bacharelado em Arqueologia da UNEB — Campus VIII, organizado a partir do Projeto Político-Pedagógico (PPP) disponibilizado pelo curso.

## O que muda na v7

A v7 consolida o app como **material de estudo + caderno digital de sala**.

### Caderno digital

Cada disciplina ganhou um caderno próprio com registros separados por aula. Cada registro pode guardar:

- título da aula;
- data;
- o que foi aprendido em sala;
- conceitos e palavras-chave;
- dúvidas para perguntar/revisar;
- tarefas, leituras e prazos;
- observações livres.

As anotações são salvas automaticamente no navegador, entram no backup do app e podem ser encontradas pela busca. A anotação geral das versões anteriores continua preservada.

Há também uma visão **Caderno** no menu principal, reunindo as matérias do semestre atual e mostrando quantos registros existem em cada uma.

### Menu recolhível

O menu lateral agora pode ser aberto e fechado pelo botão sanduíche também no desktop. Ao recolher o menu, o conteúdo ocupa a largura liberada. Em tablet e celular ele continua funcionando como drawer sobreposto.

### Progresso

A porcentagem mede conclusão do percurso de estudo, não a nota acadêmica.

Nas matérias com todos os componentes:

- 60% — aulas/tópicos estudados;
- 20% — flashcards dominados;
- 20% — quiz.

A parcela do quiz é considerada completa a partir de 70%. A melhor nota do quiz continua registrada separadamente. Matérias sem algum componente têm os pesos disponíveis normalizados, para que nenhuma atividade inexistente seja necessária para chegar a 100%.

Marcar e desmarcar aulas ou flashcards recalcula a porcentagem imediatamente. Uma matéria concluída mostra 100%; se um item necessário for desmarcado, o status volta a “Estudando” e a porcentagem diminui.

## Cobertura acadêmica

- 8 semestres;
- 65 componentes obrigatórios;
- 14 optativas;
- 397 aulas aprofundadas;
- 498 conceitos de apoio nas obrigatórias após a revisão conceitual da v7;
- 1.588 perguntas de revisão;
- 1.588 respostas comentadas;
- média aproximada de 755 palavras por aula na camada principal validada;
- menor aula validada: 540 palavras;
- maior aula validada: 1.046 palavras.

A matriz continua auditada contra as páginas 25–28 do PPP. A lista efetiva da matriz soma 4.020 h de componentes obrigatórios e 560 h nas 14 optativas listadas. Divergências internas do próprio PPP permanecem sinalizadas em vez de serem corrigidas silenciosamente.

## Revisão conceitual da v7

A revisão final separa com mais rigor **transcrição oficial do PPP** e **conteúdo didático**. Alguns trechos do documento exigem cautela terminológica e receberam notas críticas sem alterar a ementa oficial exibida no app.

Entre as correções de material de apoio:

- “hominização” não é ensinada como processo ocorrido nas Américas; em Arqueologia Americana e Latino-Americana o roteiro trabalha povoamento/ocupação das Américas;
- em Antropologia Física, estimativa de sexo biológico é diferenciada de gênero social;
- análise de DNA não é apresentada como equivalente simples a uma datação arqueológica direta;
- “ecofato” é explicado no sentido arqueológico usual, sem reproduzir como definição técnica uma repetição confusa do PPP;
- conceitos automáticos deslocados foram removidos de Teoria Antropológica, Direito Aplicado à Arqueologia e Arqueologia Americana.

O conteúdo do app é material independente de apoio. O plano de ensino, as leituras, avaliações e orientações do professor continuam prevalecendo para cada turma.

## Persistência e migração

A v7 usa a chave `arqueologia-study-hub-v7` e migra automaticamente dados compatíveis da v6.2 e versões anteriores. São preservados:

- semestre atual;
- tópicos/aulas marcados;
- favoritos;
- domínio de flashcards;
- resultados de quiz;
- anotações gerais;
- dados de “Minha turma”;
- novos registros do caderno digital;
- preferência do menu lateral recolhido/aberto no desktop.

## Responsividade testada

A v7 foi testada em 1440, 1024, 960, 834, 768, 620, 520, 430, 390, 360 e 320 px. A bateria automatizada verifica ausência de overflow horizontal tanto na página quanto no caderno dentro da matéria.

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

O validador confere matriz curricular, cargas, campos obrigatórios, conceitos, tópicos, estrutura das 397 aulas, perguntas/respostas, arquivos e regressões conceituais já encontradas em versões anteriores.
