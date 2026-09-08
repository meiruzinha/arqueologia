# Arqueologia Study Hub · UNEB — v8.1

Aplicativo independente de organização acadêmica para o Bacharelado em Arqueologia da UNEB — Campus VIII, estruturado a partir da matriz curricular e do Projeto Político-Pedagógico (PPP) disponibilizado pelo curso.


## Refinamento visual da v8.1

- O controle do menu foi simplificado: existe apenas o botão sanduíche branco da barra superior.
- No desktop, o mesmo botão recolhe e reabre a sidebar; no tablet/mobile, abre e fecha o drawer lateral.
- O Início foi redesenhado como painel acadêmico compacto, com resumo do semestre, atalhos, matérias em cartões leves e próximos compromissos.
- Os cards detalhados com ementa continuam nas páginas de grade/semestre; a home evita repetir informação e prioriza acesso rápido.

## Mudança central da v8.1

A v8.1 deixa de tentar prever o conteúdo que cada professor vai ministrar. O app passa a funcionar como um **caderno acadêmico digital baseado na grade oficial**.

Cada disciplina possui:

- Visão geral;
- Ementa oficial do PPP;
- Bibliografia oficial do PPP;
- Minha turma (professor, horário, sala, período, contato e plano de ensino);
- Caderno digital em folhas;
- Revisão criada pelo próprio estudante;
- Quiz criado pelo próprio estudante.

Os conteúdos, aulas, flashcards e quizzes gerados automaticamente nas versões anteriores foram removidos da interface e do pacote.

## Grade curricular

- 8 semestres;
- 65 componentes obrigatórios;
- distribuição: 7 / 8 / 9 / 9 / 9 / 9 / 8 / 6;
- 4.020 h somadas a partir dos componentes obrigatórios listados na matriz;
- 14 optativas listadas no PPP, totalizando 560 h.

As inconsistências internas do próprio PPP permanecem sinalizadas nos dados quando necessário; o aplicativo não inventa componentes para fechar divergências de carga horária do documento.

## Caderno digital

Cada matéria funciona como um caderno próprio. É possível criar folhas independentes para aulas, leituras, orientações e atividades.

Cada folha contém:

- número permanente;
- data;
- título;
- o que foi aprendido;
- conceitos e palavras-chave;
- dúvidas;
- tarefas, leituras e prazos;
- observações livres.

As folhas funcionam em acordeão: somente a folha aberta ocupa espaço. Cada folha pode ser preparada para impressão/salvamento em PDF pela caixa nativa do navegador.

## Revisões personalizadas

A aba **Revisão** não contém tópicos pré-definidos. O estudante adiciona os pontos que realmente surgiram nas aulas ou leituras e pode marcá-los como concluídos.

A porcentagem exibida representa apenas os itens de revisão criados pelo próprio usuário. Se nenhuma revisão tiver sido cadastrada, o app não inventa uma porcentagem de domínio da disciplina.

## Meu quiz

A aba **Meu quiz** também é criada pelo estudante. Cada pergunta pode conter:

- pergunta;
- resposta usada como gabarito;
- explicação/complemento opcional;
- autoavaliação: "Acertei" ou "Preciso revisar".

## Calendário acadêmico

A página Calendário permite registrar:

- notas livres;
- aulas;
- provas;
- trabalhos;
- leituras;
- prazos;
- lembretes.

Os compromissos podem ser associados a uma matéria, receber horário e observações e aparecer no Início quando estiverem próximos.

## Outros recursos

- status da disciplina: Não iniciada / Cursando / Concluída;
- favoritas;
- busca por matéria, ementa, professor, caderno, revisão e quiz;
- menu lateral recolhível no desktop e em formato drawer no tablet/celular;
- backup e importação dos dados locais;
- migração de dados compatíveis das versões anteriores;
- calendário e caderno incluídos no backup.

## Arquivos

- `index.html`
- `styles.css`
- `app.js`
- `data.js`
- `data.json`
- `validate-data.js`
- `README.md`
- `AUDITORIA.md`

## Validação

Execute:

```bash
node validate-data.js
```

O validador confere a estrutura da matriz usada pela v8.1 e também verifica que os arquivos de conteúdo gerado removidos não fazem parte do pacote.

## Armazenamento

Os dados pessoais do caderno ficam no `localStorage` do navegador. Por isso, o backup JSON é importante antes de limpar dados do navegador, trocar de dispositivo ou realizar mudanças grandes no site.

## Limite acadêmico

O aplicativo é um projeto independente de organização e estudo. Ele não é um sistema oficial da UNEB e não substitui o plano de ensino, as aulas, os textos indicados ou a orientação dos professores. A ementa e a bibliografia do PPP são mantidas separadas do conteúdo criado pelo usuário.
