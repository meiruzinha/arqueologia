# Auditoria final — Arqueologia Study Hub · UNEB v7

## Escopo

A auditoria da v7 revisou quatro camadas separadamente:

1. matriz curricular e ementário do PPP;
2. conteúdo didático e conceitos usados pelo app;
3. lógica de progresso e persistência;
4. layout/responsividade e novas funções de caderno/menu.

## 1. Estrutura curricular

Resultado validado:

- 65 componentes obrigatórios;
- 14 optativas;
- 8 semestres;
- distribuição obrigatória: 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- 4.020 h ao somar os componentes efetivamente listados na matriz;
- 560 h ao somar as 14 optativas listadas.

O validador mantém uma referência independente de nome, semestre e carga horária dos 65 componentes. Alterações acidentais na sequência ou na carga fazem a validação falhar.

As inconsistências internas conhecidas do PPP permanecem sinalizadas no app, incluindo diferenças de nomes/cargas entre matriz e ementário e a divergência entre os totais declarados no texto e os componentes efetivamente listados.

## 2. Conteúdo didático

Cobertura atual:

- 397/397 tópicos obrigatórios com aula aprofundada;
- 1.588 perguntas de revisão;
- 1.588 respostas comentadas;
- 498 conceitos de apoio nas disciplinas obrigatórias após a limpeza conceitual;
- média aproximada de 755 palavras por aula na camada principal validada;
- mínimo: 540 palavras;
- máximo: 1.046 palavras.

Cada aula obrigatória precisa ter explicação, aprofundamento, exemplo, pontos de retenção, roteiro de raciocínio, erros comuns e pelo menos quatro perguntas com respostas comentadas.

### Correções conceituais adicionadas na v7

Foram removidos cruzamentos automáticos que poderiam induzir ao erro:

- `hominização` não pode aparecer como conceito de Arqueologia Latino-Americana ou Arqueologia Americana;
- `arqueologia social latino-americana` não pode aparecer como conceito automático de Arqueologia Americana;
- `cultura arqueológica` não pode aparecer como conceito automático de Teoria Antropológica ou Direito Aplicado à Arqueologia.

Foram inseridos em seu lugar conceitos coerentes com as ementas, como `povoamento das Américas`, `diversidade social e cultural americana`, `ordenamento jurídico` e `tradições antropológicas americana e britânica`.

Também foram adicionadas notas críticas para trechos do próprio PPP que exigem cautela:

- hominização x povoamento das Américas;
- sexo biológico x gênero em análise de restos humanos;
- uso de DNA x datação arqueológica;
- ecofato x artefato/fatores culturais.

A redação oficial continua disponível na aba de ementa. A nota crítica altera apenas o material didático, não a fonte institucional.

## 3. Caderno digital

A v7 acrescenta registros de aula por disciplina com:

- título;
- data;
- conteúdo aprendido em sala;
- conceitos/palavras-chave;
- dúvidas;
- tarefas, leituras e prazos;
- observações livres.

Testes realizados:

- criação de registro;
- edição e autosave;
- atualização ao vivo do título e contagem de palavras;
- persistência após recarregar o app;
- inclusão no estado/backup;
- busca por texto escrito pelo usuário;
- contagem de registros na visão global “Caderno”;
- preservação da anotação geral antiga durante a migração.

## 4. Porcentagem e status

Regra da v7:

- aulas = 60%;
- flashcards = 20%;
- quiz = 20%;
- a parcela do quiz é completada ao atingir 70%;
- componentes ausentes têm seus pesos normalizados.

Testes de regressão:

- marcar aula aumenta o progresso;
- desmarcar a mesma aula restaura o valor anterior;
- dominar flashcard aumenta o progresso;
- marcar “Ainda não sei” novamente reduz/restaura o progresso;
- “Concluída” mostra 100%;
- desmarcar item depois de “Concluída” reduz a porcentagem e volta o status para “Estudando”;
- registros antigos por índice não impedem mais desmarcação;
- o status “Estudando” não adiciona bônus artificial.

## 5. Menu e responsividade

O botão sanduíche funciona nos três cenários:

- desktop: recolhe a sidebar e expande o conteúdo;
- tablet: abre/fecha drawer lateral;
- mobile: abre/fecha drawer lateral.

Também existe um botão de recolher dentro da própria sidebar; quando ela está fechada no desktop, o botão do topo permite reabri-la.

Larguras testadas automaticamente:

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

Resultado: nenhum overflow horizontal detectado na página base nem no caderno de uma matéria, e nenhum erro JavaScript na bateria automatizada.

## 6. Migração

Foi testada migração de estado da v6.2 para v7, incluindo semestre atual e anotações antigas. O novo formato mantém compatibilidade com as informações salvas pelas versões anteriores suportadas.

## Limite da auditoria

A auditoria reduz erros estruturais, conceituais e de regressão, mas não transforma o material didático gerado pelo app em bibliografia acadêmica revisada por pares. Para trabalhos, provas e aprofundamento, devem prevalecer o professor, o plano de ensino e as referências bibliográficas da disciplina. O app separa a ementa oficial do material independente justamente para deixar esse limite claro.

## Resultado

`node validate-data.js` conclui a auditoria curricular, estrutural e de conteúdo da v7 sem erros. A bateria de navegador também conclui sem erros nas funções e resoluções testadas.
