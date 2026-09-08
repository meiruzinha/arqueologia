const fs = require('fs');
const vm = require('vm');
const path = require('path');
const root = __dirname;
const json = JSON.parse(fs.readFileSync(path.join(root,'data.json'),'utf8'));
const ctx={window:{}}; vm.createContext(ctx); vm.runInContext(fs.readFileSync(path.join(root,'data.js'),'utf8'),ctx);
const data=ctx.window.ARCHAEOLOGY_DATA; const errors=[]; const assert=(c,m)=>{if(!c)errors.push(m)};
const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const expectedSemesterCounts={1:7,2:8,3:9,4:9,5:9,6:9,7:8,8:6};
const expectedSemesterHours={1:420,2:480,3:560,4:560,5:560,6:560,7:500,8:380};
const expectedOptional=['Arte Egípcia','A cidade e Estado Grega','Desenho de peças arqueológicas','Roma e sua historicidade','Arqueologia Industrial','Arqueologia e Arquitetura','Arqueologia Pública','Restauração cerâmica','Registro Gráfico Nordestino','Sambaquis e sua contextualização','Índios e sua trajetória de 500 anos','Quilombos e suas trajetórias','Arte, plumagem e cestarias indígenas','Métodos e técnicas em fotografia e filmagem'];
assert(JSON.stringify(json)===JSON.stringify(data),'data.js e data.json divergem');
assert(data.meta?.appDataRevision==='v8-official-only-2026-09-07','revisão de dados incorreta');
assert(data.courses.length===65,`obrigatórias: ${data.courses.length} != 65`);
assert(data.optatives.length===14,`optativas: ${data.optatives.length} != 14`);
for(const s of Object.keys(expectedSemesterCounts)){
  const list=data.courses.filter(c=>c.semester===+s);
  assert(list.length===expectedSemesterCounts[s],`semestre ${s}: quantidade incorreta`);
  assert(list.reduce((a,c)=>a+c.matrixHours,0)===expectedSemesterHours[s],`semestre ${s}: carga incorreta`);
}
assert(data.courses.reduce((a,c)=>a+c.matrixHours,0)===4020,'soma obrigatória != 4020h');
assert(data.optatives.reduce((a,c)=>a+c.matrixHours,0)===560,'soma optativas != 560h');
assert(expectedOptional.every((name,i)=>norm(data.optatives[i]?.matrixNameOriginal)===norm(name)),'ordem/nome das optativas diverge');
const all=[...data.courses,...data.optatives];
assert(new Set(all.map(c=>c.id)).size===all.length,'IDs duplicados');
for(const c of all){
  assert(c.id&&c.title&&c.matrixNameOriginal,`campos básicos ausentes em ${c.id}`);
  assert(Number.isFinite(c.matrixHours)&&c.matrixHours>0,`carga inválida em ${c.id}`);
  assert(!('topics' in c),`v8 não deve conter tópicos sugeridos em ${c.id}`);
  assert(!('supportTopicsStatus' in c),`v8 não deve conter status de tópicos em ${c.id}`);
}
for(const c of data.courses){
  assert(c.officialSyllabusAvailable!==false,`obrigatória sem ementa: ${c.id}`);
  assert(String(c.syllabus||'').trim().length>20,`ementa ausente/curta: ${c.id}`);
  assert(String(c.bibliographyBasic||'').trim().length>10,`bibliografia básica ausente: ${c.id}`);
}
for(const c of data.optatives) assert(c.officialSyllabusAvailable===false,`optativa marcada com ementa oficial: ${c.id}`);
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const removed of ['study-content.js','lesson-content.js','optative-content.js']) assert(!html.includes(removed),`index ainda carrega ${removed}`);
for(const required of ['data.js','app.js','styles.css']) assert(html.includes(required),`index não referencia ${required}`);
for(const file of ['index.html','styles.css','app.js','data.js','data.json','README.md','AUDITORIA.md']) assert(fs.existsSync(path.join(root,file)),`arquivo ausente: ${file}`);
if(errors.length){console.error('\n❌ Validação falhou:\n- '+errors.join('\n- '));process.exit(1)}
console.log('✅ v8 validada');
console.log(`Obrigatórias: ${data.courses.length} | Optativas: ${data.optatives.length} | Matriz: 4020h`);
console.log('Conteúdo gerado removido: aulas, tópicos sugeridos e flashcards não fazem parte do pacote.');
