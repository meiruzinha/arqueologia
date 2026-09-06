# Auditoria completa da v4 — 06/09/2026

## 1. Matriz curricular

A matriz foi conferida visualmente nas páginas 25–28 do PPP do Bacharelado em Arqueologia — UNEB Campus VIII.

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

As 14 optativas listadas no PPP também estão cadastradas e somam 560 h.

O script `validate-data.js` contém uma cópia independente da sequência de nomes/cargas mostrada nas páginas da matriz e falha se uma disciplina for removida, deslocada de semestre, renomeada na fonte ou tiver a carga da matriz alterada.

## 2. Ementário e material de estudo

Todos os 65 componentes obrigatórios possuem no app nome do ementário, carga do ementário, créditos, ementa e bibliografia básica. Bibliografia complementar só é exibida quando existe no trecho correspondente do PPP.

A v4 revisou o alinhamento dos roteiros de estudo com as ementas. Foram corrigidos especialmente:

- Arqueologia Histórica I;
- Tecnologia Cerâmica Pré-Histórica;
- Arqueologia Histórica II;
- Geologia e Geomorfologia;
- Antropologia Física;
- Arqueologia Africana;
- Arqueologia Asiática;
- Arqueogenética;
- Arqueologia do Quaternário;
- Métodos e Técnicas de Elaboração de Relatório de Pesquisa.

Todos os tópicos de apoio agora possuem um guia não vazio. O validador também testa duplicatas de termos/definições e regressões de conceitos que já haviam contaminado matérias por coincidência de palavras.

## 3. Erro real de extração corrigido

Em Estágio VI, a bibliografia complementar havia capturado texto posterior ao ementário, incluindo seções gerais do PPP. Na v4, Básica e Complementar estão corretamente limitadas a `A ser fornecida pelos orientadores`.

## 4. Inconsistências que pertencem ao PPP

O app sinaliza e preserva, entre outras:

- 56 disciplinas/3 estágios/200 h/236 créditos declarados na seção da matriz versus 65 componentes/6 estágios na lista efetiva;
- 4.080 h declaradas versus 4.020 h somadas da lista;
- 4.840 h de total declarado versus 4.780 h ao somar 4.020 + 560 + 200;
- percentuais 74/13/13 que não correspondem às cargas declaradas;
- 236 créditos em uma seção versus 265 em outra;
- Metodologia da Pesquisa **Quantitativa** na matriz versus **Qualitativa** no ementário;
- Metodologia da Pesquisa Arqueológica: 60 h na matriz versus 68 h no ementário;
- Estágio IV: 80 h versus 60 h;
- Prática de Campo II: 60 h versus 68 h;
- Zooarqueologia: 60 h versus 68 h;
- Estágio V: 80 h versus 60 h;
- Leituras Etnográficas versus Leituras Etnográficas I;
- Prática de Laboratório II com `1T3T` no ementário;
- TCC descrito como oito créditos em uma seção, porém 60 h / 4T no ementário;
- trechos editoriais estranhos em algumas ementas.

Essas diferenças não são bugs do aplicativo e não foram “normalizadas” como se soubéssemos qual versão a UNEB pretende adotar.

## 5. Layout e interação

A auditoria responsiva testa o app em desktop e celular. Foram corrigidos na v4:

- busca ativa interferindo com a troca de seção;
- favorito por teclado abrindo a disciplina por propagação do evento;
- rótulo de acessibilidade do favorito;
- dashboard mostrando apenas seis cartões do semestre;
- sidebar sem rolagem em telas de pouca altura;
- modal/tabs pouco confortáveis em celular;
- risco de estouro de layout por textos muito longos;
- ausência de tratamento para `prefers-reduced-motion`.

O objetivo da v4 é separar três camadas com clareza: **o que o PPP diz**, **o que o PPP contradiz** e **o que o app sugere para estudo**.

## 6. Teste automatizado de layout/funcionalidade da v4

A v4 foi carregada em Chromium headless com os assets reais do pacote e testada nas larguras de **1440, 1024, 820, 768, 620, 520, 430, 390, 360 e 320 px**.

Resultado:

- zero overflow horizontal da página em todas as larguras testadas;
- zero erro de JavaScript no console/page;
- dashboard do 1º semestre renderizando os 7 cartões;
- busca sem acento encontrando `Arqueogenética`;
- troca de seção limpando a busca ativa;
- favorito por teclado sem abrir o modal indevidamente;
- `aria-pressed` do favorito atualizando corretamente;
- modal sem overflow horizontal em 390 px;
- as 8 abas da disciplina abriram corretamente;
- a interface mostrou 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6 cartões ao alternar do 1º ao 8º semestre.
