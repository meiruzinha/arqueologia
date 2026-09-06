# Auditoria final da v5.3 — 06/09/2026

## 1. Conferência da matriz curricular

A matriz foi novamente conferida visualmente nas páginas 25–28 do PPP do Bacharelado em Arqueologia — UNEB Campus VIII.

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

As 14 optativas listadas também estão cadastradas e somam 560 h.

O `validate-data.js` mantém uma referência independente da sequência de nomes, semestres e cargas da matriz. A validação falha se um componente obrigatório for removido, duplicado, deslocado de semestre ou tiver sua carga da matriz alterada por engano.

## 2. Integridade do material

Resultado da validação estrutural da v5.3:

- 65 componentes obrigatórios;
- 14 optativas;
- 8 semestres;
- 397 tópicos de apoio obrigatórios;
- 467 guias de tópico considerando todo o material;
- 79 pacotes de estudo;
- 499 conceitos nos componentes obrigatórios;
- nenhum ID duplicado;
- nenhum componente sem pacote de estudo;
- nenhum componente obrigatório sem ementa cadastrada;
- nenhum componente obrigatório sem bibliografia básica cadastrada;
- nenhum tópico obrigatório sem guia associado.

Bibliografia complementar é exibida apenas quando há conteúdo correspondente no ementário. A ausência em alguns componentes não é preenchida artificialmente.

## 3. Separação entre fonte oficial e apoio

A interface distingue claramente:

- **PPP oficial:** dados curriculares, ementa e bibliografia;
- **Apoio:** roteiro de estudo, conteúdo explicado, flashcards e quiz;
- **Minha turma:** professor, horários, avaliações e plano de ensino real do semestre.

Nas optativas, como o PPP consultado não apresenta ementas específicas, o app não chama o roteiro sugerido de “ementa oficial”.

## 4. Inconsistências preservadas do PPP

O app sinaliza, entre outras:

- 56 disciplinas / 3 estágios / 200 h / 236 créditos declarados versus 65 componentes / 6 estágios na lista;
- 4.080 h declaradas versus 4.020 h somadas da lista;
- 4.840 h declaradas versus 4.780 h ao somar 4.020 + 560 + 200;
- 236 créditos em uma seção versus 265 em outra;
- Metodologia da Pesquisa Quantitativa na matriz versus Qualitativa no ementário;
- Metodologia da Pesquisa Arqueológica: 60 h na matriz versus 68 h no ementário;
- Estágio IV: 80 h versus 60 h;
- Prática de Campo II: 60 h versus 68 h;
- Zooarqueologia: 60 h versus 68 h;
- Estágio V: 80 h versus 60 h;
- Leituras Etnográficas versus Leituras Etnográficas I;
- Prática de Laboratório II com `1T3T`;
- divergências editoriais em alguns trechos do ementário.

Essas diferenças não são normalizadas silenciosamente porque não há base segura para decidir qual versão a instituição pretende adotar.

## 5. Revisão de código e funcionamento

Foram executados nesta v5.3:

- `node validate-data.js`;
- `node --check` em `app.js`, `data.js`, `study-content.js` e `validate-data.js`;
- carregamento completo do app em Chromium headless com CSS e JavaScript reais da versão;
- visualização `Toda a grade`, confirmando 65 cartões;
- busca sem acento (`arqueogenetica` → `Arqueogenética`);
- abertura de disciplina e navegação pelas 8 abas;
- abertura/fechamento do menu lateral em tablet e mobile;
- verificação do link de autoria para `https://www.instagram.com/meiarqueo/`;
- monitoramento de erros JavaScript durante a bateria de testes.

A validação curricular retornou 65 obrigatórias, 14 optativas, 397 tópicos de apoio obrigatórios, 79 pacotes de estudo e 499 conceitos nos componentes obrigatórios.

## 6. Layout e responsividade

A v5.3 foi conferida em cenários representativos de desktop, notebook, tablet e mobile:

- 1440 × 900 — desktop;
- 1024 × 768 — notebook / tablet em paisagem;
- 834 × 1112 — tablet;
- 768 × 1024 — tablet retrato;
- 390 × 844 — celular;
- 320 × 700 — celular estreito.

Resultado:

- nenhum overflow horizontal da página nas larguras testadas;
- nenhum erro JavaScript detectado na bateria principal;
- sidebar permanece fixa em desktop e vira drawer até 960 px;
- menu lateral abre e fecha corretamente em tablet e celular;
- 65 cartões são renderizados em `Toda a grade`;
- busca e abertura das disciplinas continuam funcionando;
- as 8 abas do modal permanecem navegáveis;
- grade usa 3, 2 ou 1 coluna conforme a largura disponível;
- modal ocupa a tela inteira em celulares até 520 px;
- abas, chips e controles horizontais podem rolar quando a largura é insuficiente;
- o menu lateral mantém rolagem vertical em telas baixas, permitindo acessar o crédito completo sem comprimir a navegação.

## 7. Crédito e identificação do projeto

O texto exibido no rodapé lateral é:

> Desenvolvido para fins de estudo, com organização baseada no Projeto Político-Pedagógico (PPP) do Bacharelado em Arqueologia da UNEB — Campus VIII, disponibilizado no site oficial do curso.
>
> Projeto independente, sem vínculo institucional com a UNEB. — Mei.

Na interface:

- **Projeto Político-Pedagógico (PPP)** abre o PDF disponibilizado pela UNEB;
- **site oficial do curso** abre a página do Bacharelado em Arqueologia do Campus VIII;
- somente **Mei** é clicável na autoria e aponta para `https://www.instagram.com/meiarqueo/`;
- o identificador `@meiarqueo` não é mostrado.

## 8. Resultado

A v5.3 mantém a base curricular e as funções da versão auditada e acrescenta uma camada responsiva mais robusta para PC, tablet e celular. O plano de ensino de cada professor continua sendo a referência final para ordem das aulas, leituras e avaliações durante o semestre.
