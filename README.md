# Arqueologia Study Hub · UNEB — v8.5

Aplicativo independente de organização acadêmica para o Bacharelado em Arqueologia da UNEB — Campus VIII, estruturado a partir da matriz curricular e do Projeto Político-Pedagógico (PPP) disponibilizado pelo curso.

A linha v8 funciona como **caderno acadêmico digital**, sem tentar prever o conteúdo que cada professor irá ministrar. O app mantém os dados institucionais do PPP e deixa caderno, revisões, quiz, calendário e informações da turma sob controle do estudante.

## O que existe no app

- Início com resumo do semestre e próximos compromissos;
- Meu semestre com as disciplinas do período;
- Toda a grade dos 8 semestres;
- 14 optativas listadas no PPP;
- Ementa e bibliografia oficiais quando disponíveis;
- Minha turma: professor(a), período, horário, sala/laboratório, contato e plano/orientações;
- Caderno digital com várias folhas por disciplina;
- Exportação individual de folhas pela impressão nativa para PDF;
- Revisões criadas pelo próprio estudante;
- Quiz pessoal criado pelo próprio estudante;
- Calendário mensal para nota, aula, prova, trabalho, leitura, prazo e lembrete;
- Favoritos, busca e status das disciplinas;
- Backup JSON e importação de backup;
- Menu recolhível no desktop e drawer em tablet/mobile.

## Correções da v8.5

### Calendário

O bug visual das notas salvas foi corrigido. O HTML atual do calendário usa duas áreas (`conteúdo + ações`), e o CSS foi alinhado a essa estrutura. Em telas com até 620 px, o cartão passa a empilhar conteúdo e ações, evitando que notas longas fiquem espremidas.

Também foram mantidos quebra de linha, texto multilinha, edição, conclusão e exclusão de itens.

### Estado e importação

- validação real de `AAAA-MM` para o mês do calendário;
- status, favoritos, anotação legada e dados de turma são normalizados ao carregar/importar;
- dados associados a IDs inexistentes são descartados na normalização;
- campos importados recebem limites seguros de tamanho;
- numerações duplicadas de folhas antigas são corrigidas durante a normalização.

### Acessibilidade e interface

- favorito também expõe `aria-pressed`;
- abas da matéria usam `tablist`/`tabpanel`;
- folhas do caderno expõem e atualizam `aria-expanded`;
- botões de autoavaliação do quiz expõem `aria-pressed`;
- botões de exclusão possuem rótulos acessíveis;
- versão do rodapé e versão do backup foram alinhadas para 8.5.

## Estrutura curricular validada

- 65 componentes obrigatórios;
- 14 optativas;
- distribuição por semestre: `7 / 8 / 9 / 9 / 9 / 9 / 8 / 6`;
- soma dos componentes obrigatórios listados na matriz: `4.020 h`.

O PPP contém inconsistências internas próprias; o app preserva a matriz usada como fonte em vez de inventar componentes para fechar contas divergentes do documento.

## Arquivos

- `index.html`
- `styles.css`
- `app.js`
- `data.js`
- `data.json`
- `README.md`
- `AUDITORIA.md`
- `validate-data.js`
- `validate-app.js`

Para publicar no GitHub/Cloudflare Pages, deixe esses arquivos na raiz do repositório.

## Validação local

```bash
node validate-data.js
node validate-app.js
node --check app.js
```

## Fonte institucional

- Projeto Político-Pedagógico (PPP) do Bacharelado em Arqueologia — UNEB Campus VIII;
- página oficial do curso no Campus VIII.

Projeto independente, sem vínculo institucional com a UNEB. Desenvolvido por Mei.
