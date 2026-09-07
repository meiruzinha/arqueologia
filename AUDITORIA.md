# Auditoria final — Arqueologia Study Hub v7.5

## Resultado curricular

- 65/65 componentes obrigatórios;
- 14/14 optativas;
- 8 semestres;
- distribuição: 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- 4.020 h obrigatórias somadas a partir da lista da matriz;
- 560 h das optativas listadas;
- 397/397 tópicos obrigatórios com aula aprofundada;
- 70/70 aulas sugeridas das optativas;
- 1.588/1.588 perguntas obrigatórias com resposta comentada;
- 280 perguntas de revisão nas optativas.

`node validate-data.js` conclui sem erros.

## Revisão de conteúdo

A auditoria final separou três camadas:

1. texto oficial do PPP;
2. conceitos/roteiros de apoio;
3. aulas aprofundadas.

Foram corrigidos cruzamentos semânticos que surgiram por palavras iguais usadas com sentidos diferentes:

- Sociologia: contexto histórico-social, sem definição estratigráfica;
- Linguística: contexto linguístico/discursivo, sem definição estratigráfica;
- Direito: contexto jurídico/institucional;
- Estágio II: contexto de atuação profissional;
- Seminários: escrita acadêmica, não “sistema gráfico”;
- Arqueogenética: reconstruída para seguir a ementa de Genética do PPP.

Arqueogenética não contém mais blocos de Antropologia Física sobre estimativa biológica, diagnóstico, população comparativa ou características anatômicas. O termo `segregação independente` substitui a expressão anterior inadequada `assortimento independente`.

## Repetição

O validador impede duplicação literal de:

- parágrafos longos;
- exemplos;
- perguntas de revisão;
- itens de resumo, erros comuns, passos de estudo e respostas comentadas.

Isso não significa que conceitos transversais sejam removidos. Termos como sítio, ética, cronologia, patrimônio e cultura material podem reaparecer quando são pertinentes a mais de uma disciplina. A repetição da estrutura visual das aulas também é intencional para manter o caderno didático previsível.

## Testes de interface

### Todas as disciplinas

Teste automatizado em Chromium:

- 65/65 matérias obrigatórias abriram o modal;
- todas apresentaram abas e aulas;
- 14/14 optativas abriram em 390 px;
- optativas exibiram `Aula sugerida aprofundada` e a fórmula `75% aulas · 25% flashcards`;
- nenhum erro JavaScript foi registrado nessas baterias.

### Progresso

Teste funcional em Introdução à Arqueologia:

- tópico: 0% → 9% → 0% ao marcar e desmarcar;
- flashcard: 0% → 2% → 0% ao marcar “Acertei” e depois “Ainda não sei”.

O cálculo mantém 100% reservado à conclusão dos critérios ou à declaração manual de matéria concluída; ao desmarcar um componente necessário, o estado é recalculado.

### Caderno

- três folhas criadas com numeração permanente `Folha 01`, `Folha 02`, `Folha 03`;
- somente uma folha permanece aberta por vez;
- troca de folha preserva o comportamento de acordeão;
- título e conteúdo entram no HTML preparado para PDF;
- o documento de impressão contém os campos do caderno sem os controles do app.

### Responsividade

Testado em:

- 1440;
- 1024;
- 960;
- 834;
- 768;
- 620;
- 520;
- 430;
- 390;
- 360;
- 320 px.

Resultado: página principal e modal sem overflow horizontal nas larguras testadas.

### Menu

No desktop, o botão sanduíche alternou corretamente a classe de sidebar recolhida. Em larguras menores, o mesmo sistema usa drawer responsivo.

## Estrutura do código

`study-content.js` e `lesson-content.js` foram consolidados após a auditoria. Isso removeu a necessidade de manter conteúdo antigo “por baixo” de patches de correção em tempo de execução. Os arquivos agora representam diretamente o estado final usado pelo app.

Todos os arquivos JavaScript passam em `node --check`.

## Limite da conclusão

Esta auditoria é estrutural, funcional e de coerência semântica. Ela não equivale a revisão por um corpo docente ou revisão por pares de cada afirmação acadêmica. O app continua identificando o PPP oficial separadamente e deve ser complementado pelo plano de ensino, professor e bibliografia da turma.
