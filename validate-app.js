#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = __dirname;
const fail = msg => { console.error(`❌ ${msg}`); process.exitCode = 1; };
const ok = msg => console.log(`✅ ${msg}`);
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

for (const file of ['index.html','styles.css','app.js','data.js','data.json','validate-data.js']) {
  if (!fs.existsSync(path.join(root,file))) fail(`Arquivo ausente: ${file}`);
}
const html = read('index.html');
const css = read('styles.css');
const app = read('app.js');
const json = JSON.parse(read('data.json'));
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(read('data.js'), sandbox, { filename: 'data.js' });
const data = sandbox.window.ARCHAEOLOGY_DATA;
if (!data) fail('data.js não expõe window.ARCHAEOLOGY_DATA');
if (JSON.stringify(data) !== JSON.stringify(json)) fail('data.js e data.json divergem'); else ok('data.js e data.json idênticos');
if ((data.courses||[]).length !== 65) fail(`Obrigatórias: ${(data.courses||[]).length}, esperado 65`); else ok('65 componentes obrigatórios');
if ((data.optatives||[]).length !== 14) fail(`Optativas: ${(data.optatives||[]).length}, esperado 14`); else ok('14 optativas');
const distribution = [1,2,3,4,5,6,7,8].map(s => data.courses.filter(c=>c.semester===s).length);
if (distribution.join(',') !== '7,8,9,9,9,9,8,6') fail(`Distribuição por semestre incorreta: ${distribution.join('/')}`); else ok('Distribuição 7/8/9/9/9/9/8/6');
const hours = data.courses.reduce((n,c)=>n+Number(c.matrixHours||0),0);
if (hours !== 4020) fail(`Carga obrigatória ${hours}h, esperado 4020h`); else ok('Matriz obrigatória soma 4020h');
const ids = [...data.courses,...data.optatives].map(c=>c.id);
if (new Set(ids).size !== ids.length) fail('IDs de disciplinas duplicados'); else ok('IDs de disciplinas únicos');
if ((html.match(/id="menuBtn"/g)||[]).length !== 1) fail('Deve existir exatamente um botão sanduíche #menuBtn'); else ok('Um único botão sanduíche');
for (const ref of ['styles.css','data.js','app.js']) if (!html.includes(ref)) fail(`index.html não referencia ${ref}`);
for (const selector of ['.course-grid','.empty-state','.calendar-entry','.calendar-entry-main','.calendar-day-number','.calendar-day-items','.calendar-detail-head','.calendar-form-grid']) {
  if (!css.includes(selector)) fail(`CSS atual sem seletor essencial: ${selector}`);
}
for (const token of ['data-calendar-jump','calendar-entry-details','isISODate','scheduleSaveState','dialog.addEventListener(\'close\'']) {
  if (!app.includes(token)) fail(`app.js sem reparo esperado: ${token}`);
}
if (css.split('{').length !== css.split('}').length) fail('Quantidade de chaves CSS não confere'); else ok('Chaves CSS balanceadas');
for (const obsolete of ['lesson-content.js','study-content.js','optative-content.js']) {
  if (fs.existsSync(path.join(root,obsolete))) fail(`Arquivo legado não deveria estar no pacote: ${obsolete}`);
}
if (!process.exitCode) console.log('\n🎓 Auditoria estática v8.4 concluída sem erros.');
