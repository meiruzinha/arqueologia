const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = __dirname;

const json = JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'));
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'study-content.js'), 'utf8'), ctx);
const data = ctx.window.ARCHAEOLOGY_DATA;
const study = ctx.window.ARCHAEOLOGY_STUDY_CONTENT;

const errors = [];
const assert = (cond, msg) => { if (!cond) errors.push(msg); };
const norm = (v) => String(v ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// Matriz curricular conferida visualmente nas páginas 25–28 do PPP.
const expectedRequired = [
  [1,'Introdução da Arqueologia',60],
  [1,'Introdução Antropologia',60],
  [1,'Pré-História Geral',60],
  [1,'Sociologia',60],
  [1,'Lingüística',60],
  [1,'Metodologia da Pesquisa Quantitativa',60],
  [1,'Arqueologia e Gestão de Território',60],
  [2,'Teoria da Arqueológica I',60],
  [2,'Teoria Antropológica',60],
  [2,'Pré-História do Brasil',60],
  [2,'História da Arte e Registro Rupestre',60],
  [2,'Paleontologia',60],
  [2,'Direito Aplicado a Arqueologia',60],
  [2,'Administração de Gestão de Projetos Arqueológicos',60],
  [2,'Estatística',60],
  [3,'Teoria Arqueológica II',60],
  [3,'Pré-História do Nordeste',60],
  [3,'Cartografia, Topografia, Geoprocessamento',60],
  [3,'Mitologia e Ritual',60],
  [3,'Comportamento Simbólico do Homem Pré-Histórico',60],
  [3,'Arqueologia Histórica I',60],
  [3,'Palinologia, Sedimentologia e Estratigrafia',60],
  [3,'Ecologia Humana',60],
  [3,'Estágio I',80],
  [4,'Tecnologia Lítica Pré-Histórica',60],
  [4,'Tecnologia Cerâmica Pré-Histórica',60],
  [4,'Contexto Arqueológico e a Interpretação dos Vestígios',60],
  [4,'Metodologia da Pesquisa Arqueológica',60],
  [4,'Arqueologia Histórica II',60],
  [4,'Geologia e Geomorfologia',60],
  [4,'Antropologia Física',60],
  [4,'Gestão Socioambiental',60],
  [4,'Estágio II',80],
  [5,'Arqueologia do Oriente Próximo',60],
  [5,'Arqueologia Africana',60],
  [5,'Arqueologia Asiática',60],
  [5,'Arqueologia Clássica',60],
  [5,'Arqueologia Latino Americana',60],
  [5,'Botânica e Etno-Botânica',60],
  [5,'Gestão do Patrimônio Arqueológico',60],
  [5,'Direito Natural e Patrimonial',60],
  [5,'Estágio III',80],
  [6,'Pratica de Campo I',60],
  [6,'Pratica de Laboratório I',60],
  [6,'Etnoarqueologia',60],
  [6,'Patrimônio Cultural',60],
  [6,'Musealização da Arqueologia',60],
  [6,'Arqueologia Americana',60],
  [6,'Arqueogenética',60],
  [6,'Seminário de Arqueologia I',60],
  [6,'Estágio IV',80],
  [7,'Pratica de Campo II',60],
  [7,'Pratica de Laboratório II',60],
  [7,'Zooarqueologia',60],
  [7,'Arqueologia do Quaternário',60],
  [7,'Métodos e Técnicas de Elaboração de Relatório de Pesquisa',60],
  [7,'Ética na Profissão',60],
  [7,'Seminário de Arqueologia II',60],
  [7,'Estágio V',80],
  [8,'Leituras Etnográficas',60],
  [8,'Educação Patrimonial',60],
  [8,'Arqueologia de Contrato',60],
  [8,'Relatório Técnico, Parece e Pericia Profissionais',60],
  [8,'Trabalho de Conclusão de Curso',60],
  [8,'Estágio VI',80]
];

const expectedOptional = [
  ['Arte Egípcia',40], ['A cidade e Estado Grega',40], ['Desenho de peças arqueológicas',40],
  ['Roma e sua historicidade',40], ['Arqueologia Industrial',40], ['Arqueologia e Arquitetura',40],
  ['Arqueologia Pública',40], ['Restauração cerâmica',40], ['Registro Gráfico Nordestino',40],
  ['Sambaquis e sua contextualização',40], ['Índios e sua trajetória de 500 anos',40],
  ['Quilombos e suas trajetórias',40], ['Arte, plumagem e cestarias indígenas',40],
  ['Métodos e técnicas em fotografia e filmagem',40]
];

assert(JSON.stringify(json) === JSON.stringify(data), 'data.js e data.json divergem');
assert(data.meta?.appDataRevision === 'v5-final-release-2026-09-06', 'revisão de dados não é v5');
assert(data.courses.length === expectedRequired.length, `esperados ${expectedRequired.length} obrigatórios; encontrados ${data.courses.length}`);
assert(data.optatives.length === expectedOptional.length, `esperadas ${expectedOptional.length} optativas; encontradas ${data.optatives.length}`);

const expectedSemesterCounts = {1:7,2:8,3:9,4:9,5:9,6:9,7:8,8:6};
const expectedSemesterHours  = {1:420,2:480,3:560,4:560,5:560,6:560,7:500,8:380};
for (const sem of Object.keys(expectedSemesterCounts)) {
  const courses = data.courses.filter(c => c.semester === +sem);
  assert(courses.length === expectedSemesterCounts[sem], `semestre ${sem}: quantidade esperada ${expectedSemesterCounts[sem]}, encontrada ${courses.length}`);
  assert(courses.reduce((s,c)=>s+c.matrixHours,0) === expectedSemesterHours[sem], `semestre ${sem}: carga esperada ${expectedSemesterHours[sem]}h`);
}

for (let i=0; i<expectedRequired.length; i++) {
  const [sem, matrixName, hours] = expectedRequired[i];
  const c = data.courses[i];
  assert(c.semester === sem, `ordem/semestre incorreto no componente ${i+1}`);
  assert(norm(c.matrixNameOriginal) === norm(matrixName), `nome da matriz diverge no componente ${i+1}: '${c.matrixNameOriginal}' != '${matrixName}'`);
  assert(c.matrixHours === hours, `carga da matriz diverge em ${c.id}: ${c.matrixHours} != ${hours}`);
}
for (let i=0; i<expectedOptional.length; i++) {
  const [matrixName, hours] = expectedOptional[i];
  const c = data.optatives[i];
  assert(norm(c.matrixNameOriginal) === norm(matrixName), `nome da optativa diverge: '${c.matrixNameOriginal}' != '${matrixName}'`);
  assert(c.matrixHours === hours, `carga da optativa diverge em ${c.id}`);
}

assert(data.courses.reduce((s,c)=>s+c.matrixHours,0) === 4020, 'soma obrigatória da matriz != 4020h');
assert(data.optatives.reduce((s,c)=>s+c.matrixHours,0) === 560, 'soma das optativas != 560h');
assert(data.meta.recomputedTotalFromListedMatrix === 4780, 'total recalculado (4020+560+200) deveria ser 4780h');
assert(data.meta.pppDeclaredTotalHours === 4840, 'total declarado no PPP deveria estar registrado como 4840h');
assert(data.meta.pppDeclaredCreditsMatrixSection === 236 && data.meta.pppDeclaredCreditsRegimeSection === 265, 'divergência 236/265 créditos do PPP não está registrada');

const all = [...data.courses, ...data.optatives];
assert(new Set(all.map(c=>c.id)).size === all.length, 'há IDs de disciplinas duplicados');
for (const c of all) {
  assert(c.title && c.matrixNameOriginal, `nome ausente: ${c.id}`);
  assert(Number.isFinite(c.matrixHours) && c.matrixHours > 0, `carga inválida: ${c.id}`);
  assert(Array.isArray(c.topics) && c.topics.length >= 4, `roteiro de tópicos insuficiente: ${c.id}`);
  assert(new Set(c.topics.map(norm)).size === c.topics.length, `tópicos duplicados: ${c.id}`);
  assert(study[c.id], `sem pacote de estudo: ${c.id}`);
  assert(Array.isArray(study[c.id]?.topicGuides), `sem topicGuides: ${c.id}`);
  const guides = study[c.id]?.topicGuides || [];
  const guideTopics = new Map(guides.map(g => [norm(g.topic), g]));
  for (const t of c.topics) {
    const g = guideTopics.get(norm(t));
    assert(Boolean(g), `sem guia do tópico ${c.id}: ${t}`);
    assert(Array.isArray(g?.points) && g.points.some(p=>String(p).trim().length > 8), `guia vazio/genérico demais em ${c.id}: ${t}`);
  }
}

for (const c of data.courses) {
  assert(c.officialSyllabusAvailable !== false, `obrigatória marcada sem ementa: ${c.id}`);
  assert(String(c.ementaryName || '').trim().length > 0, `nome do ementário ausente: ${c.id}`);
  assert(Number.isFinite(c.ementaryHours) && c.ementaryHours > 0, `carga do ementário ausente: ${c.id}`);
  assert(String(c.credits || '').trim().length > 0, `créditos ausentes: ${c.id}`);
  assert(String(c.syllabus || '').trim().length > 20, `ementa curta/ausente: ${c.id}`);
  assert(String(c.bibliographyBasic || '').trim().length > 10, `bibliografia básica ausente: ${c.id}`);
  const concepts = study[c.id]?.concepts || [];
  assert(concepts.length >= 4, `menos de 4 conceitos em ${c.id}`);
  assert(new Set(concepts.map(x=>norm(x.term))).size === concepts.length, `termos duplicados em ${c.id}`);
  assert(new Set(concepts.map(x=>norm(x.definition))).size === concepts.length, `definições duplicadas em ${c.id}`);
  for (const x of concepts) {
    assert(String(x.term || '').trim().length > 1, `termo vazio em ${c.id}`);
    assert(String(x.definition || '').trim().length > 25, `definição curta em ${c.id}: ${x.term}`);
  }
}

for (const c of data.optatives) {
  assert(c.officialSyllabusAvailable === false, `optativa indevidamente marcada com ementa oficial: ${c.id}`);
  assert(c.supportTopicsStatus === 'suggested_from_title_only', `optativa sem rótulo de roteiro sugerido: ${c.id}`);
  assert((study[c.id]?.concepts || []).length === 0, `optativa possui conceitos tratados como oficiais: ${c.id}`);
}

// Divergências e erros editoriais do PPP que devem continuar visíveis, não “corrigidos” silenciosamente.
const byId = Object.fromEntries(data.courses.map(c => [c.id,c]));
assert(byId['s1-6-metodologia-da-pesquisa-quantitativa'].ementaryName === 'Metodologia da Pesquisa Qualitativa', 'divergência Quantitativa/Qualitativa perdida');
assert(byId['s4-4-metodologia-da-pesquisa-arqueologica'].ementaryHours === 68, 'Metodologia Arqueológica deveria preservar 68h no ementário');
assert(byId['s6-9-estagio-iv'].ementaryHours === 60, 'Estágio IV deveria preservar 60h no ementário');
assert(byId['s7-1-pratica-de-campo-ii'].ementaryHours === 68, 'Prática de Campo II deveria preservar 68h no ementário');
assert(byId['s7-3-zooarqueologia'].ementaryHours === 68, 'Zooarqueologia deveria preservar 68h no ementário');
assert(byId['s7-8-estagio-v'].ementaryHours === 60, 'Estágio V deveria preservar 60h no ementário');
assert(byId['s7-2-pratica-de-laboratorio-ii'].credits === '1T3T', 'Prática de Laboratório II deve reproduzir 1T3T do PPP e sinalizar possível erro');
assert(byId['s8-1-leituras-etnograficas'].ementaryName === 'Leituras Etnográficas I', 'divergência Leituras Etnográficas/I perdida');
assert(byId['s8-5-trabalho-de-conclusao-de-curso'].credits === '4T', 'TCC deve preservar 4T do ementário');

// Regressões específicas encontradas nas versões anteriores.
const estagioVI = byId['s8-6-estagio-vi'];
assert(norm(estagioVI.bibliographyComplementary) === norm('A ser fornecida pelos orientadores'), 'bibliografia complementar de Estágio VI voltou a capturar seções seguintes do PDF');
for (const c of data.courses) {
  const joined = norm([c.syllabus,c.bibliographyBasic,c.bibliographyComplementary].join(' '));
  assert(!joined.includes('bacharelado em antropologia carga horaria total'), `contaminação da seção 2.13 em ${c.id}`);
}
const forbidden = {
  'dna antigo': ['opt-1-arte-egipcia','s5-4-arqueologia-classica','s5-1-arqueologia-do-oriente-proximo'],
  'sig': ['s1-4-sociologia','s1-5-linguistica','s1-3-pre-historia-geral'],
  'estado': ['opt-5-restauracao-ceramica','s5-6-botanica-e-etno-botanica'],
  'andes': ['s5-3-arqueologia-asiatica','s8-4-relatorio-tecnico-pareceres-e-pericia-profissionais']
};
for (const [term, ids] of Object.entries(forbidden)) for (const id of ids) {
  const terms = (study[id]?.concepts || []).map(x => norm(x.term));
  assert(!terms.includes(norm(term)), `conceito contaminado '${term}' em ${id}`);
}

// Alinhamentos mantidos e validados na v5: temas essenciais da ementa precisam aparecer no roteiro.
const mustContain = {
  's3-6-arqueologia-historica-i': ['fontes escritas','faiança','vidros'],
  's4-2-tecnologia-ceramica-pre-historica': ['osso','madeira','louça'],
  's4-5-arqueologia-historica-ii': ['escravidão','fontes históricas'],
  's4-6-geologia-e-geomorfologia': ['tectônica','ciclos biogeoquímicos','legislação'],
  's4-7-antropologia-fisica': ['paleopatologia','causa de morte','dna'],
  's5-2-arqueologia-africana': ['pós-abolição','quilombo','intolerância religiosa'],
  's5-3-arqueologia-asiatica': ['pós-abolição','territórios asiáticos','intolerância religiosa'],
  's6-7-arqueogenetica': ['mendel','gene','herança'],
  's7-4-arqueologia-do-quaternario': ['quaternário','mapeamentos geomorfológicos','planejamento ambiental'],
  's7-5-metodos-e-tecnicas-de-elaboracao-de-relatorio-de-pesquisa': ['projetos de pesquisa','relatórios de pesquisa','redação técnica']
};
for (const [id, terms] of Object.entries(mustContain)) {
  const hay = norm((byId[id]?.topics || []).join(' '));
  for (const term of terms) assert(hay.includes(norm(term)), `roteiro de ${id} não cobre tema-chave: ${term}`);
}

if (errors.length) {
  console.error(`FALHOU: ${errors.length} problema(s)`);
  errors.forEach(e => console.error('- ' + e));
  process.exit(1);
}

const summary = {
  required: data.courses.length,
  optatives: data.optatives.length,
  semesters: Object.fromEntries(Object.keys(expectedSemesterCounts).map(s => [s, {
    components: data.courses.filter(c=>c.semester===+s).length,
    hours: data.courses.filter(c=>c.semester===+s).reduce((a,c)=>a+c.matrixHours,0)
  }])),
  requiredHours: data.courses.reduce((s,c)=>s+c.matrixHours,0),
  optionalHours: data.optatives.reduce((s,c)=>s+c.matrixHours,0),
  supportTopics: data.courses.reduce((s,c)=>s+(c.topics||[]).length,0),
  allTopicGuides: all.reduce((s,c)=>s+(study[c.id]?.topicGuides||[]).length,0),
  studyPacks: Object.keys(study).length,
  conceptsRequired: data.courses.reduce((s,c)=>s+(study[c.id]?.concepts||[]).length,0)
};
console.log('OK — auditoria curricular, estrutural e de publicação v5.3 aprovada');
console.log(JSON.stringify(summary, null, 2));
