#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const root = __dirname;
const EXPECTED_VERSION = '8.5';
let failed = false;
const fail = msg => { console.error(`❌ ${msg}`); failed = true; };
const ok = msg => console.log(`✅ ${msg}`);
const read = f => fs.readFileSync(path.join(root, f), 'utf8');

const expectedFiles = ['index.html','styles.css','app.js','data.js','data.json','README.md','AUDITORIA.md','validate-data.js','validate-app.js'];
for (const file of expectedFiles) if (!fs.existsSync(path.join(root,file))) fail(`Arquivo ausente: ${file}`);
if (failed) process.exit(1);

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

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
const duplicateHtmlIds = htmlIds.filter((id,i,a)=>a.indexOf(id)!==i);
if (duplicateHtmlIds.length) fail(`IDs HTML duplicados: ${[...new Set(duplicateHtmlIds)].join(', ')}`); else ok('IDs HTML únicos');
if ((html.match(/id="menuBtn"/g)||[]).length !== 1) fail('Deve existir exatamente um botão sanduíche #menuBtn'); else ok('Um único botão sanduíche');
if (!html.includes(`v${EXPECTED_VERSION}`)) fail(`index.html não exibe v${EXPECTED_VERSION}`); else ok(`Rodapé identificado como v${EXPECTED_VERSION}`);
if (!app.includes(`const APP_VERSION = '${EXPECTED_VERSION}'`)) fail(`APP_VERSION não é ${EXPECTED_VERSION}`); else ok(`APP_VERSION ${EXPECTED_VERSION}`);
for (const ref of ['styles.css','data.js','app.js']) if (!html.includes(ref)) fail(`index.html não referencia ${ref}`);

for (const selector of ['.course-dialog-page','.course-tabs','.notebook-page','.calendar-entry','.calendar-entry-main','.calendar-day-number','.calendar-day-items','.calendar-detail-head','.calendar-form-grid']) {
  if (!css.includes(selector)) fail(`CSS atual sem seletor essencial: ${selector}`);
}
for (const token of ['data-calendar-jump','calendar-entry-details','isISODate','isISOMonth','normalizeSimpleCourseMaps','scheduleSaveState',"dialog.addEventListener('close'"]) {
  if (!app.includes(token)) fail(`app.js sem proteção esperada: ${token}`);
}
if (!/@media\s*\(max-width:\s*620px\)[\s\S]*?\.calendar-entry\s*\{[^}]*display:\s*block;[^}]*grid-template-columns:\s*none\s*!important;/m.test(css)) {
  fail('Correção mobile do cartão do calendário não encontrada');
} else ok('Cartão do calendário empilha ações em telas estreitas');

const currentSource = `${html}\n${app}`;
const classNames = new Set();
for (const m of currentSource.matchAll(/class=["'`]([^"'`]+)["'`]/g)) {
  for (const token of m[1].split(/\s+/)) if (/^[A-Za-z_][\w-]*$/.test(token) && !token.includes('$')) classNames.add(token);
}
const allowedInlineOnly = new Set(['meta']); // usado apenas no HTML de impressão gerado pelo JS.
const missingClasses = [...classNames].filter(c => !allowedInlineOnly.has(c) && !new RegExp(`\\.${c.replace(/[.*+?^${}()|[\\]\\]/g,'\\$&')}(?![\\w-])`).test(css));
if (missingClasses.length) fail(`Classes do HTML atual sem regra CSS: ${missingClasses.join(', ')}`); else ok('Classes estruturais atuais cobertas pelo CSS');

if (css.split('{').length !== css.split('}').length) fail('Quantidade de chaves CSS não confere'); else ok('Chaves CSS balanceadas');
for (const obsolete of ['lesson-content.js','study-content.js','optative-content.js']) {
  if (fs.existsSync(path.join(root,obsolete)) || html.includes(obsolete)) fail(`Conteúdo gerado legado não deveria estar no pacote: ${obsolete}`);
}
if (/v8\.3|v8\.4/.test(read('README.md').split('\n')[0]) || /v8\.3|v8\.4/.test(read('AUDITORIA.md').split('\n')[0])) fail('Documentação ainda usa versão antiga no título');

if (failed) process.exit(1);
console.log(`\n🎓 Auditoria estática v${EXPECTED_VERSION} concluída sem erros.`);
