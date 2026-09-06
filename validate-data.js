const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = __dirname;
const json = JSON.parse(fs.readFileSync(path.join(root, 'data.json'), 'utf8'));
const ctx = { window: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'data.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'study-content.js'), 'utf8'), ctx);
const data = ctx.window.ARCHAEOLOGY_DATA;
const study = ctx.window.ARCHAEOLOGY_STUDY_CONTENT;
const errors = [];
const assert = (cond, msg) => { if (!cond) errors.push(msg); };
assert(JSON.stringify(json) === JSON.stringify(data), 'data.js e data.json divergem');
assert(data.courses.length === 65, `esperados 65 obrigatórios; encontrados ${data.courses.length}`);
assert(data.optatives.length === 14, `esperadas 14 optativas; encontradas ${data.optatives.length}`);
const expected = {1:7,2:8,3:9,4:9,5:9,6:9,7:8,8:6};
for (const [sem, n] of Object.entries(expected)) assert(data.courses.filter(c => c.semester === +sem).length === n, `semestre ${sem}: esperado ${n}`);
assert(data.courses.reduce((s,c)=>s+c.matrixHours,0) === 4020, 'soma obrigatória da matriz != 4020h');
assert(data.optatives.reduce((s,c)=>s+c.matrixHours,0) === 560, 'soma das optativas != 560h');
for (const c of [...data.courses, ...data.optatives]) {
  assert(study[c.id], `sem pacote de estudo: ${c.id}`);
  assert(study[c.id]?.topicGuides, `sem topicGuides: ${c.id}`);
  const guideTopics = new Set((study[c.id]?.topicGuides || []).map(g => g.topic));
  for (const t of c.topics || []) assert(guideTopics.has(t), `sem guia do tópico ${c.id}: ${t}`);
}
for (const c of data.courses) {
  const concepts = (study[c.id]?.concepts || []);
  assert(concepts.length >= 4, `menos de 4 conceitos em ${c.id}`);
  const terms = concepts.map(x => String(x.term).trim().toLowerCase());
  const defs = concepts.map(x => String(x.definition).trim().toLowerCase());
  assert(new Set(terms).size === terms.length, `termos duplicados em ${c.id}`);
  assert(new Set(defs).size === defs.length, `definições duplicadas em ${c.id}`);
  assert(c.officialSyllabusAvailable !== false, `obrigatória marcada sem ementa: ${c.id}`);
}
for (const c of data.optatives) {
  assert(c.officialSyllabusAvailable === false, `optativa indevidamente marcada com ementa oficial: ${c.id}`);
  assert((study[c.id]?.concepts || []).length === 0, `optativa possui conceitos tratados como oficiais: ${c.id}`);
}
const credits = Object.fromEntries(data.courses.map(c => [c.id,c.credits]));
assert(credits['s6-1-pratica-de-campo-i'] === '1T3P', 'créditos Campo I incorretos');
assert(credits['s6-2-pratica-de-laboratorio-i'] === '1T3P', 'créditos Lab I incorretos');
assert(credits['s7-1-pratica-de-campo-ii'] === '1T3P', 'créditos Campo II incorretos');
assert(credits['s7-2-pratica-de-laboratorio-ii'] === '1T3T', 'créditos Lab II não reproduzem o PPP');
const forbidden = {
  'dna antigo': ['opt-1-arte-egipcia','s5-4-arqueologia-classica','s5-1-arqueologia-do-oriente-proximo'],
  'sig': ['s1-4-sociologia','s1-5-linguistica','s1-3-pre-historia-geral'],
  'estado': ['opt-5-restauracao-ceramica','s5-6-botanica-e-etno-botanica'],
  'andes': ['s5-3-arqueologia-asiatica','s8-4-relatorio-tecnico-pareceres-e-pericia-profissionais']
};
for (const [term, ids] of Object.entries(forbidden)) for (const id of ids) {
  const terms = (study[id]?.concepts || []).map(x => x.term.toLowerCase());
  assert(!terms.includes(term), `conceito contaminado '${term}' em ${id}`);
}
if (errors.length) {
  console.error(`FALHOU: ${errors.length} problema(s)`);
  errors.forEach(e => console.error('- ' + e));
  process.exit(1);
}
console.log('OK — auditoria estrutural aprovada');
console.log(JSON.stringify({required:data.courses.length,optatives:data.optatives.length,requiredHours:data.courses.reduce((s,c)=>s+c.matrixHours,0),optionalHours:data.optatives.reduce((s,c)=>s+c.matrixHours,0),topics:data.courses.reduce((s,c)=>s+(c.topics||[]).length,0),studyPacks:Object.keys(study).length,conceptsRequired:data.courses.reduce((s,c)=>s+(study[c.id]?.concepts||[]).length,0)}, null, 2));
