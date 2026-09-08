(() => {
  'use strict';

  const DATA = window.ARCHAEOLOGY_DATA;
  if (!DATA) throw new Error('Dados do curso não carregados.');

  const APP_VERSION = '8.2';
  const STORAGE_KEY = 'arqueologia-study-hub-v8';
  const LEGACY_KEYS = [
    'arqueologia-study-hub-v7', 'arqueologia-study-hub-v6-2', 'arqueologia-study-hub-v6-1',
    'arqueologia-study-hub-v6', 'arqueologia-study-hub-v5-3', 'arqueologia-study-hub-v5',
    'arqueologia-study-hub-v4', 'arqueologia-study-hub-v3', 'arqueologia-study-hub-v2',
    'arqueologia-study-hub-v1'
  ];

  const defaultState = {
    currentSemester: 1,
    semesterFilter: 1,
    statuses: {},
    favorites: {},
    notes: {},
    coursePlans: {},
    notebookEntries: {},
    reviewItems: {},
    customQuizzes: {},
    calendarEntries: {},
    calendarMonth: '',
    calendarSelectedDate: '',
    sidebarCollapsed: false,
    view: 'dashboard'
  };

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const view = $('#view');
  const dialog = $('#courseDialog');
  const dialogContent = $('#courseDialogContent');
  const sidebar = $('#sidebar');
  const overlay = $('#overlay');

  let state = loadState();
  let searchQuery = '';
  let calendarEditingId = null;

  function clone(obj) { return JSON.parse(JSON.stringify(obj)); }
  function plainObject(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  function safeSemester(value) { const n = Number(value); return Number.isInteger(n) && n >= 1 && n <= 8 ? n : 1; }
  function esc(value = '') {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }
  function normalizeText(value = '') {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ').trim();
  }
  function uid(prefix = 'id') {
    if (window.crypto?.randomUUID) return `${prefix}-${crypto.randomUUID()}`;
    return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
  function todayISO() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }
  function monthISO(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
  function formatDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(String(value || ''))) return '';
    const [y, m, d] = value.split('-');
    return `${d}/${m}/${y}`;
  }
  function formatMonth(value) {
    if (!/^\d{4}-\d{2}$/.test(String(value || ''))) return '';
    const [y, m] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(new Date(y, m - 1, 1));
  }
  function wordCount(text) { return String(text || '').trim() ? String(text).trim().split(/\s+/).length : 0; }

  function migrateLegacy(raw) {
    const incoming = plainObject(raw);
    return {
      ...clone(defaultState),
      currentSemester: safeSemester(incoming.currentSemester),
      semesterFilter: safeSemester(incoming.semesterFilter || incoming.currentSemester),
      statuses: plainObject(incoming.statuses),
      favorites: plainObject(incoming.favorites),
      notes: plainObject(incoming.notes),
      coursePlans: plainObject(incoming.coursePlans),
      notebookEntries: plainObject(incoming.notebookEntries),
      calendarEntries: plainObject(incoming.calendarEntries),
      calendarMonth: /^\d{4}-\d{2}$/.test(String(incoming.calendarMonth || '')) ? incoming.calendarMonth : '',
      calendarSelectedDate: /^\d{4}-\d{2}-\d{2}$/.test(String(incoming.calendarSelectedDate || '')) ? incoming.calendarSelectedDate : '',
      sidebarCollapsed: incoming.sidebarCollapsed === true,
      view: ['dashboard','semester','notebook','calendar','review','all','optatives','favorites','about'].includes(incoming.view) ? incoming.view : 'dashboard',
      reviewItems: plainObject(incoming.reviewItems),
      customQuizzes: plainObject(incoming.customQuizzes)
    };
  }

  function normalizeNotebookEntries(target) {
    const allowed = new Set(allCourses().map(c => c.id));
    const normalized = {};
    Object.entries(plainObject(target.notebookEntries)).forEach(([courseId, entries]) => {
      if (!allowed.has(courseId) || !Array.isArray(entries)) return;
      const cleaned = entries.filter(Boolean).map((entry, index) => ({
        id: String(entry.id || uid(`legacy-${courseId}-${index}`)),
        pageNumber: Number(entry.pageNumber) > 0 ? Number(entry.pageNumber) : null,
        date: /^\d{4}-\d{2}-\d{2}$/.test(String(entry.date || '')) ? String(entry.date) : '',
        title: String(entry.title || ''), learned: String(entry.learned || ''), concepts: String(entry.concepts || ''),
        questions: String(entry.questions || ''), tasks: String(entry.tasks || ''), free: String(entry.free || '')
      }));
      let max = Math.max(0, ...cleaned.map(e => e.pageNumber || 0));
      for (let i = cleaned.length - 1; i >= 0; i--) if (!cleaned[i].pageNumber) cleaned[i].pageNumber = ++max;
      if (cleaned.length) normalized[courseId] = cleaned;
    });
    target.notebookEntries = normalized;
  }

  function normalizeReviewItems(target) {
    const allowed = new Set(allCourses().map(c => c.id));
    const normalized = {};
    Object.entries(plainObject(target.reviewItems)).forEach(([courseId, items]) => {
      if (!allowed.has(courseId) || !Array.isArray(items)) return;
      const clean = items.filter(Boolean).map((item, i) => ({
        id: String(item.id || `review-${courseId}-${i}`),
        title: String(item.title || '').slice(0, 240),
        details: String(item.details || '').slice(0, 12000),
        done: item.done === true,
        createdAt: String(item.createdAt || '')
      })).filter(item => item.title || item.details);
      if (clean.length) normalized[courseId] = clean;
    });
    target.reviewItems = normalized;
  }

  function normalizeQuizzes(target) {
    const allowed = new Set(allCourses().map(c => c.id));
    const normalized = {};
    Object.entries(plainObject(target.customQuizzes)).forEach(([courseId, items]) => {
      if (!allowed.has(courseId) || !Array.isArray(items)) return;
      const clean = items.filter(Boolean).map((item, i) => ({
        id: String(item.id || `quiz-${courseId}-${i}`),
        question: String(item.question || '').slice(0, 4000),
        answer: String(item.answer || '').slice(0, 8000),
        explanation: String(item.explanation || '').slice(0, 8000),
        mastery: ['correct','review'].includes(item.mastery) ? item.mastery : '',
        createdAt: String(item.createdAt || '')
      })).filter(item => item.question || item.answer);
      if (clean.length) normalized[courseId] = clean;
    });
    target.customQuizzes = normalized;
  }

  function normalizeCalendar(target) {
    const allowed = new Set(allCourses().map(c => c.id));
    const normalized = {};
    Object.entries(plainObject(target.calendarEntries)).forEach(([date, entries]) => {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Array.isArray(entries)) return;
      const clean = entries.filter(Boolean).map((entry, i) => ({
        id: String(entry.id || `calendar-${date}-${i}`),
        title: String(entry.title || '').slice(0, 200),
        type: ['note','class','exam','assignment','reading','deadline','reminder'].includes(entry.type) ? entry.type : 'note',
        courseId: allowed.has(String(entry.courseId || '')) ? String(entry.courseId) : '',
        time: /^\d{2}:\d{2}$/.test(String(entry.time || '')) ? String(entry.time) : '',
        details: String(entry.details || '').slice(0, 10000),
        done: entry.done === true,
        createdAt: String(entry.createdAt || '')
      })).filter(entry => entry.title || entry.details);
      if (clean.length) normalized[date] = clean;
    });
    target.calendarEntries = normalized;
  }

  function loadState() {
    let result = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) result = migrateLegacy(JSON.parse(raw));
      if (!result) {
        for (const key of LEGACY_KEYS) {
          const old = localStorage.getItem(key);
          if (!old) continue;
          result = migrateLegacy(JSON.parse(old));
          break;
        }
      }
    } catch (error) { console.warn('Falha ao ler dados salvos.', error); }
    result ||= clone(defaultState);
    normalizeNotebookEntries(result);
    normalizeReviewItems(result);
    normalizeQuizzes(result);
    normalizeCalendar(result);
    return result;
  }

  let storageWarningShown = false;
  function showToast(message, tone = 'info') {
    let toast = $('.app-toast');
    if (!toast) {
      toast = document.createElement('div'); toast.className = 'app-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);
    }
    toast.className = `app-toast ${tone}`; toast.textContent = message; toast.classList.add('show');
    clearTimeout(showToast.timer); showToast.timer = setTimeout(() => toast.classList.remove('show'), 3800);
  }
  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) {
      console.warn('Não foi possível salvar o estado local.', error);
      if (!storageWarningShown) { storageWarningShown = true; showToast('Não foi possível salvar neste navegador. Exporte um backup.', 'warn'); }
    }
    updateSidebarProgress();
  }

  function allCourses() { return [...(DATA.courses || []), ...(DATA.optatives || [])]; }
  function requiredCourses() { return DATA.courses || []; }
  function optativeCourses() { return DATA.optatives || []; }
  function getCourse(id) { return allCourses().find(c => c.id === id); }
  function semesterCourses(semester = state.currentSemester) { return requiredCourses().filter(c => c.semester === Number(semester)); }
  function courseTypeLabel(course) { return course.type === 'optional' ? 'Optativa' : `${course.semester}º semestre`; }
  function statusLabel(status) { return status === 'done' ? 'Concluída' : status === 'studying' ? 'Cursando' : 'Não iniciada'; }
  function courseStatus(course) { return state.statuses[course.id] || 'todo'; }
  function notebookPages(course) { return Array.isArray(state.notebookEntries[course.id]) ? state.notebookEntries[course.id] : []; }
  function reviewItems(course) { return Array.isArray(state.reviewItems[course.id]) ? state.reviewItems[course.id] : []; }
  function quizItems(course) { return Array.isArray(state.customQuizzes[course.id]) ? state.customQuizzes[course.id] : []; }
  function reviewProgress(course) {
    const items = reviewItems(course); if (!items.length) return null;
    return Math.round((items.filter(i => i.done).length / items.length) * 100);
  }
  function coursePlan(course) {
    return { professor:'', schedule:'', room:'', period:'', contact:'', plan:'', ...plainObject(state.coursePlans[course.id]) };
  }
  function totalCurrentReviewProgress() {
    const items = semesterCourses().flatMap(c => reviewItems(c));
    if (!items.length) return 0;
    return Math.round((items.filter(i => i.done).length / items.length) * 100);
  }
  function updateSidebarProgress() {
    const p = totalCurrentReviewProgress();
    const text = $('#sidebarProgressText'), bar = $('#sidebarProgressBar');
    if (text) text.textContent = `${p}%`; if (bar) bar.style.width = `${p}%`;
  }

  function courseSearchText(course) {
    const plan = coursePlan(course);
    const pages = notebookPages(course).map(p => Object.values(p).join(' ')).join(' ');
    const reviews = reviewItems(course).map(r => `${r.title} ${r.details}`).join(' ');
    const quizzes = quizItems(course).map(q => `${q.question} ${q.answer} ${q.explanation}`).join(' ');
    return normalizeText([
      course.title, course.syllabus, course.bibliographyBasic, course.bibliographyComplementary, course.note,
      plan.professor, plan.schedule, plan.room, plan.period, plan.contact, plan.plan,
      state.notes[course.id], pages, reviews, quizzes
    ].join(' '));
  }

  function statCard(value, label, hint = '') {
    return `<div class="stat-card"><strong>${esc(value)}</strong><span>${esc(label)}</span>${hint ? `<small>${esc(hint)}</small>` : ''}</div>`;
  }
  function emptyState(title, text, action = '') {
    return `<div class="empty-state"><div class="empty-icon">⌁</div><h3>${esc(title)}</h3><p>${esc(text)}</p>${action}</div>`;
  }
  function sectionHead(title, text = '', action = '') {
    return `<div class="section-head"><div><h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ''}</div>${action}</div>`;
  }

  function courseCard(course) {
    const status = courseStatus(course), pages = notebookPages(course).length, reviews = reviewItems(course), p = reviewProgress(course);
    const fav = state.favorites[course.id] === true;
    return `<article class="course-card" data-course-card="${esc(course.id)}">
      <div class="course-card-head"><div><span class="course-sem">${esc(courseTypeLabel(course))}</span><h3>${esc(course.title)}</h3></div>
      <button class="favorite-btn ${fav ? 'active' : ''}" data-favorite="${esc(course.id)}" aria-label="${fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">${fav ? '★' : '☆'}</button></div>
      <div class="course-meta"><span>${course.matrixHours || 0}h</span><span class="status-chip status-${esc(status)}">${esc(statusLabel(status))}</span></div>
      <p class="course-summary">${esc(course.syllabus || (course.type === 'optional' ? 'Disciplina optativa listada no PPP.' : 'Sem ementa cadastrada.'))}</p>
      <div class="course-card-stats"><span>✎ ${pages} ${pages === 1 ? 'folha' : 'folhas'}</span><span>↻ ${reviews.length} ${reviews.length === 1 ? 'revisão' : 'revisões'}</span></div>
      <div class="course-card-footer">${p === null ? '<small>Sem revisão cadastrada</small>' : `<div class="progress-track"><div class="progress-fill" style="width:${p}%"></div></div><small>${p}% revisado</small>`}<button class="btn btn-soft btn-sm" data-course-open="${esc(course.id)}">Abrir</button></div>
    </article>`;
  }

  function dashboardCourseCard(course) {
    const status = courseStatus(course), pages = notebookPages(course).length, reviews = reviewItems(course), pending = reviews.filter(item => !item.done).length;
    return `<button type="button" class="dashboard-course-card" data-course-open="${esc(course.id)}" aria-label="Abrir ${esc(course.title)}">
      <div class="dashboard-course-main">
        <div class="dashboard-course-title"><span class="course-sem">${course.matrixHours || 0}h</span><h3>${esc(course.title)}</h3></div>
        <span class="dashboard-course-arrow" aria-hidden="true">→</span>
      </div>
      <div class="dashboard-course-meta"><span class="status-dot status-${esc(status)}"></span><span>${esc(statusLabel(status))}</span><span>✎ ${pages} ${pages === 1 ? 'folha' : 'folhas'}</span>${reviews.length ? `<span>↻ ${pending} pend.</span>` : '<span>↻ sem revisão</span>'}</div>
    </button>`;
  }

  function renderDashboard() {
    const courses = semesterCourses();
    const pages = courses.reduce((n,c) => n + notebookPages(c).length, 0);
    const reviews = courses.flatMap(c => reviewItems(c));
    const pending = reviews.filter(r => !r.done).length;
    const upcoming = upcomingCalendarEntries(4);
    const studying = courses.filter(c => courseStatus(c) === 'studying').length;
    view.innerHTML = `<div class="page-enter dashboard-home">
      <section class="dashboard-welcome">
        <div class="dashboard-welcome-copy">
          <span class="eyebrow">Arqueologia · UNEB Campus VIII</span>
          <h1>Meu ${state.currentSemester}º semestre</h1>
          <p>Seu espaço para acompanhar as disciplinas, registrar as aulas e organizar a rotina acadêmica.</p>
        </div>
        <div class="dashboard-semester-badge" aria-label="Semestre atual"><strong>${state.currentSemester}º</strong><span>semestre</span></div>
      </section>

      <section class="dashboard-summary" aria-label="Resumo do semestre">
        <div class="dashboard-summary-item"><span>Disciplinas</span><strong>${courses.length}</strong><small>${studying ? `${studying} em andamento` : 'nenhuma marcada como cursando'}</small></div>
        <div class="dashboard-summary-item"><span>Caderno</span><strong>${pages}</strong><small>${pages === 1 ? 'folha criada' : 'folhas criadas'}</small></div>
        <div class="dashboard-summary-item"><span>Revisões</span><strong>${pending}</strong><small>${pending === 1 ? 'pendente' : 'pendentes'}</small></div>
        <div class="dashboard-summary-item"><span>Calendário</span><strong>${upcoming.length}</strong><small>${upcoming.length === 1 ? 'próximo item' : 'próximos itens'}</small></div>
      </section>

      <section class="dashboard-shortcuts" aria-label="Atalhos">
        <button class="dashboard-shortcut" data-view-go="notebook"><span class="shortcut-icon">✎</span><span><strong>Caderno</strong><small>Registrar uma aula</small></span><b>→</b></button>
        <button class="dashboard-shortcut" data-view-go="calendar"><span class="shortcut-icon">▣</span><span><strong>Calendário</strong><small>Provas e prazos</small></span><b>→</b></button>
        <button class="dashboard-shortcut" data-view-go="review"><span class="shortcut-icon">↻</span><span><strong>Revisões</strong><small>Rever o que você cadastrou</small></span><b>→</b></button>
      </section>

      <div class="dashboard-content-grid">
        <section class="dashboard-section dashboard-courses-panel">
          <div class="dashboard-section-head"><div><span class="eyebrow">Neste semestre</span><h2>Minhas matérias</h2></div><button class="text-btn" data-view-go="semester">Ver semestre →</button></div>
          <div class="dashboard-course-list">${courses.map(dashboardCourseCard).join('')}</div>
        </section>

        <aside class="dashboard-section dashboard-upcoming-panel">
          <div class="dashboard-section-head"><div><span class="eyebrow">Agenda</span><h2>Próximos</h2></div><button class="text-btn" data-view-go="calendar">Abrir →</button></div>
          ${upcoming.length ? `<div class="dashboard-upcoming-list">${upcoming.map(calendarCompactCard).join('')}</div>` : `<div class="dashboard-empty-compact"><span>▣</span><strong>Agenda livre</strong><p>Adicione provas, trabalhos ou lembretes no calendário.</p><button class="btn btn-soft btn-sm" data-view-go="calendar">Adicionar item</button></div>`}
        </aside>
      </div>
    </div>`;
  }

  function renderSemester() {
    const s = Number(state.semesterFilter || state.currentSemester), courses = requiredCourses().filter(c => c.semester === s);
    view.innerHTML = `<div class="page-enter">${sectionHead('Meu semestre', 'A matriz é a referência oficial; seu caderno registra a experiência real da turma.')}
      <div class="semester-chips">${[1,2,3,4,5,6,7,8].map(n => `<button class="semester-chip ${n===s?'active':''}" data-semester-filter="${n}">${n}º</button>`).join('')}</div>
      <div class="notice info"><div>✦</div><div><strong>Como usar</strong><p>Abra uma matéria, consulte a ementa oficial e use Caderno, Revisão e Quiz conforme o professor avançar.</p></div></div>
      <div class="course-grid">${courses.map(courseCard).join('')}</div></div>`;
  }

  function renderAll() {
    view.innerHTML = `<div class="page-enter">${sectionHead('Toda a grade', '65 componentes obrigatórios organizados pelos 8 semestres do PPP.')}
      ${[1,2,3,4,5,6,7,8].map(s => `<section class="semester-block"><div class="semester-title"><h3>${s}º semestre</h3><span>${requiredCourses().filter(c=>c.semester===s).length} matérias</span></div><div class="course-grid">${requiredCourses().filter(c=>c.semester===s).map(courseCard).join('')}</div></section>`).join('')}
    </div>`;
  }

  function renderOptatives() {
    view.innerHTML = `<div class="page-enter">${sectionHead('Optativas', 'O PPP consultado lista estas disciplinas e suas cargas. O conteúdo será registrado por você quando alguma delas for ofertada.')}
      <div class="notice warn"><div>◇</div><div><strong>Sem ementa detalhada no PPP consultado</strong><p>Por isso o app não cria aulas nem conteúdos para as optativas. Use o caderno quando receber o plano da disciplina.</p></div></div>
      <div class="course-grid">${optativeCourses().map(courseCard).join('')}</div></div>`;
  }

  function renderFavorites() {
    const courses = allCourses().filter(c => state.favorites[c.id]);
    view.innerHTML = `<div class="page-enter">${sectionHead('Favoritas', 'Acesso rápido às matérias que você marcou.')}${courses.length ? `<div class="course-grid">${courses.map(courseCard).join('')}</div>` : emptyState('Nenhuma favorita', 'Use a estrela em uma matéria para fixá-la aqui.')}</div>`;
  }

  function renderNotebook() {
    const courses = semesterCourses();
    view.innerHTML = `<div class="page-enter">${sectionHead('Caderno digital', 'Cada disciplina funciona como um caderno próprio. Crie uma folha para cada aula, texto, orientação ou atividade.')}
      <div class="notebook-dashboard-grid">${courses.map(course => {
        const pages = notebookPages(course), last = pages[0];
        return `<article class="notebook-course-card"><span class="course-sem">${course.semester}º semestre</span><h3>${esc(course.title)}</h3><div class="notebook-card-count"><strong>${pages.length}</strong><span>${pages.length===1?'folha':'folhas'}</span></div>${last ? `<p>Última: <strong>${esc(last.title || `Folha ${String(last.pageNumber).padStart(2,'0')}`)}</strong>${last.date ? ` · ${formatDate(last.date)}` : ''}</p>` : '<p>Seu caderno desta matéria ainda está vazio.</p>'}<button class="btn btn-soft" data-course-open="${esc(course.id)}" data-open-tab="notes">${pages.length ? 'Abrir caderno' : '+ Começar caderno'}</button></article>`;
      }).join('')}</div></div>`;
  }

  function renderReview() {
    const courses = semesterCourses();
    const groups = courses.map(course => ({ course, items: reviewItems(course) })).filter(g => g.items.length);
    view.innerHTML = `<div class="page-enter">${sectionHead('Minhas revisões', 'Você decide o que precisa revisar com base nas aulas, leituras e orientações do professor.')}
      <div class="notice info"><div>↻</div><div><strong>Progresso real, criado por você</strong><p>A porcentagem desta página considera somente os itens de revisão que você cadastrou. Ela não tenta medir quanto da disciplina o professor já ensinou.</p></div></div>
      ${groups.length ? `<div class="review-overview">${groups.map(({course,items}) => {
        const done = items.filter(i=>i.done).length, pct = Math.round(done/items.length*100);
        return `<article class="review-course-block"><div class="review-course-head"><div><span class="course-sem">${course.semester}º semestre</span><h3>${esc(course.title)}</h3></div><strong>${pct}%</strong></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><div class="review-mini-list">${items.slice(0,5).map(i => `<label class="mini-check ${i.done?'done':''}"><input type="checkbox" data-review-toggle="${esc(course.id)}|${esc(i.id)}" ${i.done?'checked':''}><span>${esc(i.title || i.details)}</span></label>`).join('')}</div><button class="btn btn-soft btn-sm" data-course-open="${esc(course.id)}" data-open-tab="review">Abrir revisão</button></article>`;
      }).join('')}</div>` : emptyState('Nenhuma revisão cadastrada', 'Abra uma matéria e adicione os tópicos que o professor pedir ou que você quiser revisar.')}</div>`;
  }

  function renderAbout() {
    view.innerHTML = `<div class="page-enter">${sectionHead('Sobre o PPP e este app')}
      <section class="panel prose"><span class="source-pill official">Base oficial</span><h3>O que vem da UNEB</h3><p>O app mantém a estrutura da matriz curricular, a carga horária, a ementa e as bibliografias presentes no Projeto Político-Pedagógico consultado para o Bacharelado em Arqueologia — Campus VIII.</p>
      <h3>O que vem de você</h3><p>O conteúdo real das aulas fica no seu caderno, nas revisões e nos quizzes que você mesma cria. Assim o app não presume a ordem, as leituras, as avaliações ou o aprofundamento escolhido por cada professor.</p>
      <div class="hero-actions"><a class="btn" href="https://dedc8.uneb.br/wp-content/uploads/2023/05/Projeto-Politico-Pedagogico-Arqueologia-DEDC-VIII.pdf" target="_blank" rel="noopener noreferrer">Abrir PPP</a><a class="btn btn-outline" href="https://dedc8.uneb.br/arqueologia/" target="_blank" rel="noopener noreferrer">Site do curso</a></div></section>
      ${sectionHead('Backup', 'Guarde uma cópia antes de trocar de aparelho ou navegador.')}
      <section class="panel"><div class="hero-actions"><button class="btn" data-export>Exportar backup</button><button class="btn btn-outline" data-import>Importar backup</button><button class="btn btn-danger" data-reset>Apagar meus dados</button></div></section>
    </div>`;
  }

  function renderSearch() {
    const q = normalizeText(searchQuery);
    const results = allCourses().filter(c => courseSearchText(c).includes(q));
    view.innerHTML = `<div class="page-enter">${sectionHead(`Resultados para “${searchQuery}”`, `${results.length} ${results.length===1?'matéria encontrada':'matérias encontradas'}.`)}${results.length ? `<div class="course-grid">${results.map(courseCard).join('')}</div>` : emptyState('Nada encontrado', 'Tente o nome da matéria, professor, uma frase do caderno, revisão ou pergunta de quiz.')}</div>`;
  }

  function renderCurrentView() {
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === state.view));
    if (searchQuery.trim()) return renderSearch();
    ({ dashboard: renderDashboard, semester: renderSemester, notebook: renderNotebook, calendar: renderCalendar, review: renderReview, all: renderAll, optatives: renderOptatives, favorites: renderFavorites, about: renderAbout }[state.view] || renderDashboard)();
    updateSidebarProgress();
  }

  // ---------- CALENDÁRIO ----------
  const CAL_TYPES = {
    note:['Nota','•'], class:['Aula','A'], exam:['Prova','P'], assignment:['Trabalho','T'], reading:['Leitura','L'], deadline:['Prazo','!'], reminder:['Lembrete','○']
  };
  function calendarEntriesFor(date) { return Array.isArray(state.calendarEntries[date]) ? state.calendarEntries[date] : []; }
  function upcomingCalendarEntries(limit = 6) {
    const today = todayISO();
    return Object.entries(state.calendarEntries).flatMap(([date,entries]) => entries.map(entry => ({...entry,date}))).filter(e => e.date >= today && !e.done).sort((a,b) => `${a.date} ${a.time||'99:99'}`.localeCompare(`${b.date} ${b.time||'99:99'}`)).slice(0,limit);
  }
  function calendarCompactCard(entry) {
    const course = getCourse(entry.courseId), type = CAL_TYPES[entry.type] || CAL_TYPES.note;
    return `<article class="upcoming-item ${entry.done?'done':''}"><div class="upcoming-date"><strong>${entry.date.slice(8,10)}</strong><span>${new Intl.DateTimeFormat('pt-BR',{month:'short'}).format(new Date(`${entry.date}T12:00:00`)).replace('.','')}</span></div><div><span class="calendar-type type-${esc(entry.type)}">${type[1]} ${type[0]}</span><h4>${esc(entry.title || 'Sem título')}</h4><p>${entry.time ? `${esc(entry.time)} · ` : ''}${course ? esc(course.title) : 'Sem matéria vinculada'}</p></div></article>`;
  }
  function calendarCell(date, day, currentMonth) {
    const entries = calendarEntriesFor(date), isToday = date === todayISO(), selected = date === state.calendarSelectedDate;
    return `<button class="calendar-day ${currentMonth?'':'outside'} ${isToday?'today':''} ${selected?'selected':''}" data-calendar-date="${date}"><span class="day-number">${day}</span><div class="day-events">${entries.slice(0,3).map(e => `<span class="day-event type-${esc(e.type)}" title="${esc(e.title)}">${esc(e.title || 'Nota')}</span>`).join('')}${entries.length>3?`<small>+${entries.length-3}</small>`:''}</div></button>`;
  }
  function renderCalendar() {
    const month = state.calendarMonth || monthISO(); state.calendarMonth = month;
    if (!state.calendarSelectedDate || !state.calendarSelectedDate.startsWith(month)) state.calendarSelectedDate = month === monthISO() ? todayISO() : `${month}-01`;
    const [year, mon] = month.split('-').map(Number), first = new Date(year,mon-1,1), start = new Date(year,mon-1,1-first.getDay());
    const cells = [];
    for (let i=0;i<42;i++) { const d=new Date(start); d.setDate(start.getDate()+i); const iso=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; cells.push(calendarCell(iso,d.getDate(),d.getMonth()===mon-1)); }
    const selectedEntries = calendarEntriesFor(state.calendarSelectedDate);
    view.innerHTML = `<div class="page-enter">${sectionHead('Calendário', 'Provas, trabalhos, leituras, aulas, prazos e notas em uma visão mensal.', '<button class="btn btn-soft" data-calendar-today>Hoje</button>')}
      <div class="calendar-layout"><section class="calendar-panel panel"><div class="calendar-toolbar"><button class="icon-btn" data-calendar-prev aria-label="Mês anterior">‹</button><h3>${esc(formatMonth(month))}</h3><button class="icon-btn" data-calendar-next aria-label="Próximo mês">›</button></div><div class="calendar-weekdays">${['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'].map(d=>`<span>${d}</span>`).join('')}</div><div class="calendar-grid">${cells.join('')}</div></section>
      <aside class="calendar-detail panel"><div class="calendar-detail-head"><div><span class="eyebrow">Dia selecionado</span><h3>${formatDate(state.calendarSelectedDate)}</h3></div><button class="btn btn-soft btn-sm" data-calendar-new>+ Adicionar</button></div>
      <div class="calendar-entry-list">${selectedEntries.length ? selectedEntries.map(e => calendarEntryCard(state.calendarSelectedDate,e)).join('') : '<p class="muted">Nenhum item neste dia.</p>'}</div><div id="calendarFormSlot"></div></aside></div></div>`;
    if (calendarEditingId === 'new') renderCalendarForm(state.calendarSelectedDate, null);
    else if (calendarEditingId) renderCalendarForm(state.calendarSelectedDate, selectedEntries.find(e=>e.id===calendarEditingId));
  }
  function calendarEntryCard(date, entry) {
    const course=getCourse(entry.courseId), type=CAL_TYPES[entry.type]||CAL_TYPES.note;
    return `<article class="calendar-entry ${entry.done?'done':''}"><div class="calendar-entry-main"><div class="calendar-entry-title"><span class="calendar-type type-${esc(entry.type)}">${type[1]} ${type[0]}</span><strong>${esc(entry.title || 'Sem título')}</strong></div><p>${entry.time?`${esc(entry.time)} · `:''}${course?esc(course.title):'Sem matéria vinculada'}</p>${entry.details?`<small>${esc(entry.details)}</small>`:''}</div><div class="calendar-entry-actions"><button class="icon-btn small" data-calendar-done="${esc(date)}|${esc(entry.id)}" title="${entry.done?'Reabrir':'Concluir'}">${entry.done?'↶':'✓'}</button><button class="icon-btn small" data-calendar-edit="${esc(entry.id)}" title="Editar">✎</button><button class="icon-btn small danger" data-calendar-delete="${esc(date)}|${esc(entry.id)}" title="Excluir">×</button></div></article>`;
  }
  function renderCalendarForm(date, entry) {
    const slot=$('#calendarFormSlot'); if(!slot)return;
    slot.innerHTML=`<form class="calendar-form" data-calendar-form><h4>${entry?'Editar item':'Novo item'}</h4><div class="form-grid two"><label>Título<input name="title" required maxlength="200" value="${esc(entry?.title||'')}"></label><label>Tipo<select name="type">${Object.entries(CAL_TYPES).map(([k,v])=>`<option value="${k}" ${entry?.type===k?'selected':''}>${v[0]}</option>`).join('')}</select></label></div><div class="form-grid two"><label>Data<input type="date" name="date" value="${esc(date)}" required></label><label>Horário<input type="time" name="time" value="${esc(entry?.time||'')}"></label></div><label>Matéria<select name="courseId"><option value="">Sem matéria</option>${allCourses().map(c=>`<option value="${esc(c.id)}" ${entry?.courseId===c.id?'selected':''}>${esc(c.title)}</option>`).join('')}</select></label><label>Observações<textarea name="details" rows="4">${esc(entry?.details||'')}</textarea></label><div class="form-actions"><button class="btn" type="submit">Salvar</button><button class="btn btn-outline" type="button" data-calendar-cancel>Cancelar</button></div></form>`;
  }

  // ---------- DIÁLOGO DA MATÉRIA ----------
  function tabButton(id,label,active){return `<button type="button" class="course-tab ${active===id?'active':''}" data-tab="${id}">${label}</button>`;}
  function openCourse(courseId, initialTab='overview', openNotebookId=null) {
    const course=getCourse(courseId); if(!course)return;
    const status=courseStatus(course), fav=state.favorites[course.id]===true, pages=notebookPages(course), reviews=reviewItems(course), quizzes=quizItems(course), rp=reviewProgress(course);
    dialogContent.innerHTML=`<article class="course-dialog-page" data-course-dialog="${esc(course.id)}">
      <header class="course-dialog-header"><div><span class="course-sem">${esc(courseTypeLabel(course))}</span><h2>${esc(course.title)}</h2><div class="course-meta"><span>${course.matrixHours||0}h</span>${course.credits?`<span>${esc(course.credits)}</span>`:''}${course.officialSyllabusAvailable===false?'<span class="source-pill suggested">PPP: sem ementa</span>':'<span class="source-pill official">PPP oficial</span>'}</div></div><button class="favorite-btn large ${fav?'active':''}" data-favorite="${esc(course.id)}">${fav?'★':'☆'}</button></header>
      <div class="status-row">${[['todo','Não iniciada'],['studying','Cursando'],['done','Concluída']].map(([v,l])=>`<button class="status-btn ${status===v?'active':''}" data-status="${v}">${l}</button>`).join('')}</div>
      <div class="course-quick-stats"><span>✎ ${pages.length} ${pages.length===1?'folha':'folhas'}</span><span>↻ ${reviews.length} revisões</span><span>? ${quizzes.length} perguntas</span>${rp===null?'<span>Sem progresso de revisão</span>':`<span>${rp}% das revisões concluídas</span>`}</div>
      <div class="course-tabs">${tabButton('overview','Visão geral',initialTab)}${tabButton('syllabus','Ementa oficial',initialTab)}${tabButton('biblio','Bibliografia',initialTab)}${tabButton('class','Minha turma',initialTab)}${tabButton('notes','Caderno',initialTab)}${tabButton('review','Revisão',initialTab)}${tabButton('quiz','Meu quiz',initialTab)}</div>
      <div class="course-panels">
        <section class="tab-panel ${initialTab==='overview'?'active':''}" data-panel="overview">${renderCourseOverview(course)}</section>
        <section class="tab-panel ${initialTab==='syllabus'?'active':''}" data-panel="syllabus">${renderSyllabus(course)}</section>
        <section class="tab-panel ${initialTab==='biblio'?'active':''}" data-panel="biblio">${renderBibliography(course)}</section>
        <section class="tab-panel ${initialTab==='class'?'active':''}" data-panel="class">${renderClassPanel(course)}</section>
        <section class="tab-panel ${initialTab==='notes'?'active':''}" data-panel="notes"><div data-notebook-root></div></section>
        <section class="tab-panel ${initialTab==='review'?'active':''}" data-panel="review"><div data-review-root></div></section>
        <section class="tab-panel ${initialTab==='quiz'?'active':''}" data-panel="quiz"><div data-quiz-root></div></section>
      </div></article>`;
    renderNotebookList(course, openNotebookId);
    renderReviewPanel(course);
    renderQuizPanel(course);
    if (!dialog.open) dialog.showModal();
  }
  function renderCourseOverview(course) {
    const plan=coursePlan(course);
    return `<div class="tab-heading"><div><span class="eyebrow">Disciplina</span><h3>Seu espaço desta matéria</h3><p>O app não presume o conteúdo das aulas. Use a ementa como referência e construa o restante conforme sua turma avançar.</p></div></div>
      <div class="overview-grid"><div class="overview-card"><span>Professor(a)</span><strong>${esc(plan.professor || 'Ainda não informado')}</strong></div><div class="overview-card"><span>Horário</span><strong>${esc(plan.schedule || 'Ainda não informado')}</strong></div><div class="overview-card"><span>Caderno</span><strong>${notebookPages(course).length} folhas</strong></div><div class="overview-card"><span>Revisão</span><strong>${reviewItems(course).length} itens</strong></div></div>
      <div class="notice info"><div>✦</div><div><strong>Fluxo sugerido</strong><p>Depois da aula, crie uma folha no Caderno. Quando aparecer algo importante para prova ou fixação, adicione em Revisão. Se quiser testar sua memória, transforme o conteúdo em perguntas no Meu quiz.</p></div></div>
      ${state.notes[course.id] ? `<div class="legacy-note"><h4>Anotação geral antiga</h4><p>${esc(state.notes[course.id])}</p></div>` : ''}`;
  }
  function renderSyllabus(course) {
    return `<div class="official-box"><span class="source-pill official">PPP oficial</span><h3>Ementa</h3><p class="syllabus">${esc(course.syllabus || 'O PPP não informa ementa específica para este componente.')}</p>${course.note?`<div class="notice warn"><div>!</div><div><strong>Observação</strong><p>${esc(course.note)}</p></div></div>`:''}</div>`;
  }
  function renderBibliography(course) {
    return `<div class="official-box"><span class="source-pill official">PPP oficial</span><h3>Bibliografia</h3>${course.bibliographyBasic?`<div class="biblio"><h4>Bibliografia básica</h4><p>${esc(course.bibliographyBasic)}</p></div>`:`<p class="syllabus">${course.officialSyllabusAvailable===false?'O PPP consultado não apresenta bibliografia específica para esta optativa.':'O PPP não informa bibliografia específica para este componente.'}</p>`}${course.bibliographyComplementary?`<div class="biblio"><h4>Bibliografia complementar</h4><p>${esc(course.bibliographyComplementary)}</p></div>`:''}</div>`;
  }
  function renderClassPanel(course) {
    const p=coursePlan(course);
    return `<div class="tab-heading"><div><span class="eyebrow">Sua turma</span><h3>Informações práticas</h3><p>Preencha quando receber os dados da disciplina. Tudo salva automaticamente.</p></div></div><form class="class-form" data-class-form="${esc(course.id)}"><div class="form-grid two"><label>Professor(a)<input name="professor" value="${esc(p.professor)}"></label><label>Período letivo<input name="period" placeholder="Ex.: 2026.2" value="${esc(p.period)}"></label></div><div class="form-grid two"><label>Horário<input name="schedule" placeholder="Ex.: segunda, 14h–18h" value="${esc(p.schedule)}"></label><label>Sala / laboratório<input name="room" value="${esc(p.room)}"></label></div><label>Contato / AVA / grupo<input name="contact" value="${esc(p.contact)}"></label><label>Plano de ensino / observações<textarea name="plan" rows="6">${esc(p.plan)}</textarea></label><div class="autosave-note">Salvamento automático</div></form>`;
  }

  // ---------- CADERNO ----------
  function nextPageNumber(course) { return Math.max(0,...notebookPages(course).map(e=>Number(e.pageNumber)||0))+1; }
  function createNotebookPage(course) {
    const entry={ id:uid('page'), pageNumber:nextPageNumber(course), date:todayISO(), title:'', learned:'', concepts:'', questions:'', tasks:'', free:'' };
    state.notebookEntries[course.id]=[entry,...notebookPages(course)]; saveState(); openCourse(course.id,'notes',entry.id); return entry;
  }
  function notebookPreview(entry) {
    const text=[entry.learned,entry.concepts,entry.questions,entry.tasks,entry.free].filter(Boolean).join(' ');
    return text.length>140?`${text.slice(0,140)}…`:text;
  }
  function renderNotebookList(course, openEntryId=null) {
    const root=$('[data-notebook-root]',dialogContent); if(!root)return;
    const pages=notebookPages(course);
    root.innerHTML=`<div class="tab-heading"><div><span class="eyebrow">Caderno digital</span><h3>Folhas da matéria</h3><p>Crie uma folha para cada aula, orientação, leitura ou atividade. As folhas antigas ficam recolhidas.</p></div><button class="btn" data-notebook-new="${esc(course.id)}">+ Nova folha</button></div>${pages.length?`<div class="notebook-pages">${pages.map(entry=>renderNotebookPage(course,entry,entry.id===openEntryId)).join('')}</div>`:emptyState('Caderno vazio','Crie sua primeira folha quando a disciplina começar pelo botão acima.')}`;
  }
  function renderNotebookPage(course,entry,isOpen=false) {
    const label=`Folha ${String(entry.pageNumber||0).padStart(2,'0')}`;
    return `<article class="notebook-page ${isOpen?'open':''}" data-notebook-page="${esc(entry.id)}"><button class="notebook-page-cover" data-notebook-toggle="${esc(course.id)}|${esc(entry.id)}"><div><span class="page-number">${label}</span><h4>${esc(entry.title || 'Sem título')}</h4><p>${entry.date?formatDate(entry.date):'Sem data'} · ${wordCount([entry.learned,entry.concepts,entry.questions,entry.tasks,entry.free].join(' '))} palavras</p>${notebookPreview(entry)?`<small>${esc(notebookPreview(entry))}</small>`:''}</div><span class="page-chevron">⌄</span></button><div class="notebook-page-body"><div class="paper-sheet"><div class="form-grid two"><label>Data<input type="date" data-note-field="date" value="${esc(entry.date)}"></label><label>Título da aula / folha<input data-note-field="title" value="${esc(entry.title)}" placeholder="Ex.: Aula 03 — Cultura material"></label></div><label>O que aprendi na sala<textarea data-note-field="learned" rows="9" placeholder="Registre a explicação do professor com suas próprias palavras...">${esc(entry.learned)}</textarea></label><label>Conceitos e palavras-chave<textarea data-note-field="concepts" rows="4">${esc(entry.concepts)}</textarea></label><label>Dúvidas para perguntar ou revisar<textarea data-note-field="questions" rows="4">${esc(entry.questions)}</textarea></label><label>Tarefas, leituras e prazos<textarea data-note-field="tasks" rows="4">${esc(entry.tasks)}</textarea></label><label>Observações livres<textarea data-note-field="free" rows="5">${esc(entry.free)}</textarea></label></div><div class="notebook-page-actions"><button class="btn btn-soft btn-sm" data-note-pdf="${esc(course.id)}|${esc(entry.id)}">Salvar PDF</button><button class="btn btn-danger btn-sm" data-note-delete="${esc(course.id)}|${esc(entry.id)}">Excluir folha</button></div></div></article>`;
  }
  function getNotebookEntry(courseId,entryId){return notebookPages(getCourse(courseId)).find(e=>e.id===entryId);}
  function saveNotebookField(courseId,entryId,field,value){const entry=getNotebookEntry(courseId,entryId); if(!entry||!['date','title','learned','concepts','questions','tasks','free'].includes(field))return; entry[field]=String(value); saveState();}
  function deleteNotebookPage(courseId,entryId){const course=getCourse(courseId); if(!course)return; if(!confirm('Excluir esta folha do caderno?'))return; state.notebookEntries[courseId]=notebookPages(course).filter(e=>e.id!==entryId); saveState(); openCourse(courseId,'notes');}
  function printNotebookPage(courseId,entryId) {
    const course=getCourse(courseId), entry=getNotebookEntry(courseId,entryId); if(!course||!entry)return;
    const sections=[['O que aprendi',entry.learned],['Conceitos e palavras-chave',entry.concepts],['Dúvidas',entry.questions],['Tarefas, leituras e prazos',entry.tasks],['Observações',entry.free]].filter(([,v])=>String(v).trim());
    const html=`<!doctype html><html><head><meta charset="utf-8"><title>${esc(course.title)} — Folha ${entry.pageNumber}</title><style>@page{size:A4;margin:18mm}body{font-family:Arial,sans-serif;color:#28231f;line-height:1.55;font-size:11pt}header{border-bottom:2px solid #765746;padding-bottom:10px;margin-bottom:20px}small{color:#766b63}h1{font-size:20pt;margin:4px 0}h2{font-size:13pt;margin:22px 0 6px;color:#684a3a;page-break-after:avoid}p{white-space:pre-wrap;margin:0}.meta{display:flex;justify-content:space-between;gap:20px}.brand{font-weight:700;color:#684a3a}section{break-inside:avoid;margin-bottom:14px}footer{margin-top:28px;padding-top:8px;border-top:1px solid #ddd;color:#777;font-size:9pt}</style></head><body><header><div class="brand">Arqueologia Study Hub · UNEB</div><small>${esc(course.title)} · Folha ${String(entry.pageNumber).padStart(2,'0')}</small><h1>${esc(entry.title||'Anotação de aula')}</h1><div class="meta"><span>${entry.date?formatDate(entry.date):'Sem data'}</span><span>${wordCount(sections.map(s=>s[1]).join(' '))} palavras</span></div></header>${sections.map(([h,t])=>`<section><h2>${esc(h)}</h2><p>${esc(t)}</p></section>`).join('')}<footer>Caderno acadêmico pessoal · Projeto independente baseado na grade do Bacharelado em Arqueologia da UNEB — Campus VIII.</footer><script>window.onload=()=>window.print()<\/script></body></html>`;
    const w=window.open('','_blank'); if(!w){showToast('O navegador bloqueou a janela de impressão. Permita pop-ups e tente novamente.','warn');return;} try{w.opener=null;}catch(_){} w.document.open();w.document.write(html);w.document.close();
  }

  // ---------- REVISÃO PERSONALIZADA ----------
  function renderReviewPanel(course) {
    const root=$('[data-review-root]',dialogContent); if(!root)return;
    const items=reviewItems(course), done=items.filter(i=>i.done).length, pct=items.length?Math.round(done/items.length*100):0;
    root.innerHTML=`<div class="tab-heading"><div><span class="eyebrow">Criado por você</span><h3>Revisão da matéria</h3><p>Adicione somente o que realmente apareceu na sua turma ou o que você decidiu revisar.</p></div></div>
      ${items.length?`<div class="review-progress-box"><div><strong>${done}/${items.length}</strong><span>itens concluídos</span></div><div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div><strong>${pct}%</strong></div>`:''}
      <form class="creator-form" data-review-form="${esc(course.id)}"><label>Tópico / questão para revisar<input name="title" required placeholder="Ex.: Diferença entre contexto primário e secundário"></label><label>Notas de revisão <span>(opcional)</span><textarea name="details" rows="3" placeholder="O que você precisa lembrar, página do texto, observação do professor..."></textarea></label><button class="btn" type="submit">+ Adicionar à revisão</button></form>
      <div class="custom-list">${items.length?items.map(item=>`<article class="custom-review-item ${item.done?'done':''}"><label class="review-check"><input type="checkbox" data-review-toggle="${esc(course.id)}|${esc(item.id)}" ${item.done?'checked':''}><span><strong>${esc(item.title||'Item sem título')}</strong>${item.details?`<small>${esc(item.details)}</small>`:''}</span></label><button class="icon-btn small danger" data-review-delete="${esc(course.id)}|${esc(item.id)}" title="Excluir">×</button></article>`).join(''):emptyState('Nenhum item de revisão','Adicione o primeiro tópico depois de uma aula ou leitura.')}</div>`;
  }
  function addReviewItem(courseId,title,details){state.reviewItems[courseId]=[{id:uid('review'),title:String(title).trim(),details:String(details).trim(),done:false,createdAt:new Date().toISOString()},...reviewItems(getCourse(courseId))];saveState();}
  function toggleReview(courseId,itemId){const item=reviewItems(getCourse(courseId)).find(i=>i.id===itemId);if(!item)return;item.done=!item.done;saveState();}
  function deleteReview(courseId,itemId){state.reviewItems[courseId]=reviewItems(getCourse(courseId)).filter(i=>i.id!==itemId);saveState();}

  // ---------- QUIZ PERSONALIZADO ----------
  function renderQuizPanel(course) {
    const root=$('[data-quiz-root]',dialogContent); if(!root)return;
    const items=quizItems(course), correct=items.filter(i=>i.mastery==='correct').length, review=items.filter(i=>i.mastery==='review').length;
    root.innerHTML=`<div class="tab-heading"><div><span class="eyebrow">Criado por você</span><h3>Meu quiz</h3><p>Transforme o que o professor passou em perguntas. Na revisão, tente responder antes de revelar o gabarito e faça sua própria avaliação.</p></div></div>
      ${items.length?`<div class="quiz-summary"><span><strong>${items.length}</strong> perguntas</span><span><strong>${correct}</strong> acertei</span><span><strong>${review}</strong> preciso revisar</span></div>`:''}
      <form class="creator-form" data-quiz-form="${esc(course.id)}"><label>Pergunta<textarea name="question" required rows="3" placeholder="Ex.: O que diferencia um artefato de um ecofato?"></textarea></label><label>Resposta correta<textarea name="answer" required rows="4" placeholder="Escreva a resposta que você quer usar como gabarito."></textarea></label><label>Explicação / complemento <span>(opcional)</span><textarea name="explanation" rows="3" placeholder="Observação do professor, exemplo, página do texto..."></textarea></label><button class="btn" type="submit">+ Adicionar pergunta</button></form>
      <div class="quiz-custom-list">${items.length?items.map((item,index)=>`<article class="custom-quiz-card"><div class="quiz-question-head"><span>Questão ${items.length-index}</span><button class="icon-btn small danger" data-quiz-delete="${esc(course.id)}|${esc(item.id)}" title="Excluir">×</button></div><h4>${esc(item.question)}</h4><details><summary>Ver resposta</summary><div class="answer-box"><strong>Resposta</strong><p>${esc(item.answer)}</p>${item.explanation?`<strong>Complemento</strong><p>${esc(item.explanation)}</p>`:''}</div></details><div class="self-grade"><span>Depois de conferir:</span><button class="btn btn-soft btn-sm ${item.mastery==='correct'?'active':''}" data-quiz-mastery="${esc(course.id)}|${esc(item.id)}|correct">✓ Acertei</button><button class="btn btn-soft btn-sm ${item.mastery==='review'?'active':''}" data-quiz-mastery="${esc(course.id)}|${esc(item.id)}|review">↻ Preciso revisar</button></div></article>`).join(''):emptyState('Nenhuma pergunta criada','Crie perguntas a partir do que foi ensinado em sala.')}</div>`;
  }
  function addQuizItem(courseId,question,answer,explanation){state.customQuizzes[courseId]=[{id:uid('quiz'),question:String(question).trim(),answer:String(answer).trim(),explanation:String(explanation).trim(),mastery:'',createdAt:new Date().toISOString()},...quizItems(getCourse(courseId))];saveState();}
  function setQuizMastery(courseId,itemId,mastery){const item=quizItems(getCourse(courseId)).find(i=>i.id===itemId);if(!item)return;item.mastery=item.mastery===mastery?'':mastery;saveState();}
  function deleteQuiz(courseId,itemId){state.customQuizzes[courseId]=quizItems(getCourse(courseId)).filter(i=>i.id!==itemId);saveState();}

  // ---------- BACKUP ----------
  function exportBackup() {
    const payload={ app:'Arqueologia Study Hub · UNEB', version:APP_VERSION, exportedAt:new Date().toISOString(), state };
    const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}), url=URL.createObjectURL(blob), a=document.createElement('a');
    a.href=url;a.download=`arqueologia-study-hub-backup-${todayISO()}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
    showToast('Backup exportado.');
  }
  function importBackupFile(file) {
    const reader=new FileReader(); reader.onload=()=>{try{const parsed=JSON.parse(reader.result);const incoming=parsed?.state||parsed;if(!incoming||typeof incoming!=='object')throw new Error('Formato inválido');state=migrateLegacy(incoming);normalizeNotebookEntries(state);normalizeReviewItems(state);normalizeQuizzes(state);normalizeCalendar(state);saveState();syncSemesterSelect();applySidebarState();renderCurrentView();showToast('Backup importado com sucesso.');}catch(e){console.error(e);showToast('Não foi possível importar este backup.','warn');}};reader.readAsText(file);
  }
  function resetData(){if(!confirm('Apagar caderno, calendário, revisões, quizzes, dados da turma, favoritas e status deste navegador?'))return;state=clone(defaultState);localStorage.removeItem(STORAGE_KEY);saveState();syncSemesterSelect();applySidebarState();renderCurrentView();showToast('Dados locais apagados.');}

  // ---------- NAVEGAÇÃO / EVENTOS ----------
  function syncSemesterSelect() {
    const select=$('#currentSemester'); if(!select)return; select.innerHTML=[1,2,3,4,5,6,7,8].map(n=>`<option value="${n}" ${n===state.currentSemester?'selected':''}>${n}º semestre</option>`).join('');
  }
  function applySidebarState() {
    const desktop=window.matchMedia('(min-width: 961px)').matches;
    document.body.classList.toggle('sidebar-collapsed', desktop && state.sidebarCollapsed);
    if (!desktop) sidebar.classList.remove('open');
    const expanded=desktop?!state.sidebarCollapsed:sidebar.classList.contains('open');
    $('#menuBtn')?.setAttribute('aria-expanded', String(expanded));
  }
  function toggleSidebar() {
    if(window.matchMedia('(min-width: 961px)').matches){state.sidebarCollapsed=!state.sidebarCollapsed;saveState();applySidebarState();}
    else{sidebar.classList.toggle('open');overlay.classList.toggle('show',sidebar.classList.contains('open'));$('#menuBtn')?.setAttribute('aria-expanded',String(sidebar.classList.contains('open')));}
  }
  function closeMobileSidebar(){sidebar.classList.remove('open');overlay.classList.remove('show');}
  function closeDialog(){if(dialog.open)dialog.close();renderCurrentView();}
  function refreshOpenCourse(courseId,tab){openCourse(courseId,tab);}

  document.addEventListener('click', event => {
    const t=event.target.closest('button,a'); if(!t)return;
    if(t.matches('[data-view]')){state.view=t.dataset.view;searchQuery='';$('#searchInput').value='';saveState();renderCurrentView();closeMobileSidebar();return;}
    if(t.matches('[data-view-go]')){state.view=t.dataset.viewGo;searchQuery='';saveState();renderCurrentView();return;}
    if(t.matches('[data-semester-filter]')){state.semesterFilter=Number(t.dataset.semesterFilter);saveState();renderSemester();return;}
    if(t.matches('[data-course-open]')){openCourse(t.dataset.courseOpen,t.dataset.openTab||'overview');return;}
    if(t.matches('[data-favorite]')){const id=t.dataset.favorite;state.favorites[id]=!state.favorites[id];saveState(); if(dialog.open&&$('[data-course-dialog]',dialogContent)?.dataset.courseDialog===id)refreshOpenCourse(id,$('.course-tab.active',dialogContent)?.dataset.tab||'overview'); else renderCurrentView();return;}
    if(t.matches('[data-tab]')){$$('.course-tab',dialogContent).forEach(b=>b.classList.toggle('active',b===t));$$('.tab-panel',dialogContent).forEach(p=>p.classList.toggle('active',p.dataset.panel===t.dataset.tab));return;}
    if(t.matches('[data-status]')){const id=$('[data-course-dialog]',dialogContent)?.dataset.courseDialog;if(!id)return;state.statuses[id]=t.dataset.status;saveState();refreshOpenCourse(id,$('.course-tab.active',dialogContent)?.dataset.tab||'overview');return;}
    if(t.matches('[data-notebook-new]')){createNotebookPage(getCourse(t.dataset.notebookNew));return;}
    if(t.matches('[data-notebook-toggle]')){const [courseId,entryId]=t.dataset.notebookToggle.split('|');const page=t.closest('.notebook-page'),wasOpen=page.classList.contains('open');$$('.notebook-page',dialogContent).forEach(p=>p.classList.remove('open'));if(!wasOpen)page.classList.add('open');return;}
    if(t.matches('[data-note-delete]')){const [c,e]=t.dataset.noteDelete.split('|');deleteNotebookPage(c,e);return;}
    if(t.matches('[data-note-pdf]')){const [c,e]=t.dataset.notePdf.split('|');printNotebookPage(c,e);return;}
    if(t.matches('[data-review-delete]')){const [c,i]=t.dataset.reviewDelete.split('|');deleteReview(c,i);openCourse(c,'review');return;}
    if(t.matches('[data-quiz-delete]')){const [c,i]=t.dataset.quizDelete.split('|');deleteQuiz(c,i);openCourse(c,'quiz');return;}
    if(t.matches('[data-quiz-mastery]')){const [c,i,m]=t.dataset.quizMastery.split('|');setQuizMastery(c,i,m);openCourse(c,'quiz');return;}
    if(t.matches('[data-calendar-prev],[data-calendar-next]')){const [y,m]=state.calendarMonth.split('-').map(Number),d=new Date(y,m-1+(t.matches('[data-calendar-next]')?1:-1),1);state.calendarMonth=monthISO(d);state.calendarSelectedDate=`${state.calendarMonth}-01`;calendarEditingId=null;saveState();renderCalendar();return;}
    if(t.matches('[data-calendar-today]')){state.calendarMonth=monthISO();state.calendarSelectedDate=todayISO();calendarEditingId=null;saveState();renderCalendar();return;}
    if(t.matches('[data-calendar-date]')){state.calendarSelectedDate=t.dataset.calendarDate;state.calendarMonth=t.dataset.calendarDate.slice(0,7);calendarEditingId=null;saveState();renderCalendar();return;}
    if(t.matches('[data-calendar-new]')){calendarEditingId='new';renderCalendar();return;}
    if(t.matches('[data-calendar-edit]')){calendarEditingId=t.dataset.calendarEdit;renderCalendar();return;}
    if(t.matches('[data-calendar-cancel]')){calendarEditingId=null;renderCalendar();return;}
    if(t.matches('[data-calendar-done]')){const [date,id]=t.dataset.calendarDone.split('|'),entry=calendarEntriesFor(date).find(e=>e.id===id);if(entry){entry.done=!entry.done;saveState();renderCalendar();}return;}
    if(t.matches('[data-calendar-delete]')){const [date,id]=t.dataset.calendarDelete.split('|');if(confirm('Excluir este item do calendário?')){state.calendarEntries[date]=calendarEntriesFor(date).filter(e=>e.id!==id);if(!state.calendarEntries[date].length)delete state.calendarEntries[date];saveState();renderCalendar();}return;}
    if(t.matches('[data-export]')||t.id==='exportBtn'){exportBackup();return;}
    if(t.matches('[data-import]')){$('#importInput').click();return;}
    if(t.matches('[data-reset]')){resetData();return;}
  });

  document.addEventListener('change', event => {
    const el=event.target;
    if(el.id==='currentSemester'){state.currentSemester=safeSemester(el.value);state.semesterFilter=state.currentSemester;saveState();renderCurrentView();return;}
    if(el.matches('[data-note-field]')){const page=el.closest('[data-notebook-page]'),courseId=$('[data-course-dialog]',dialogContent)?.dataset.courseDialog;if(page&&courseId)saveNotebookField(courseId,page.dataset.notebookPage,el.dataset.noteField,el.value);return;}
    if(el.matches('[data-review-toggle]')){const [c,i]=el.dataset.reviewToggle.split('|');toggleReview(c,i);if(dialog.open&&$('[data-course-dialog]',dialogContent)?.dataset.courseDialog===c)openCourse(c,'review');else renderCurrentView();return;}
  });
  document.addEventListener('input', event => {
    const el=event.target;
    if(el.matches('[data-note-field]')){const page=el.closest('[data-notebook-page]'),courseId=$('[data-course-dialog]',dialogContent)?.dataset.courseDialog;if(page&&courseId)saveNotebookField(courseId,page.dataset.notebookPage,el.dataset.noteField,el.value);return;}
    if(el.closest('[data-class-form]')){const form=el.closest('[data-class-form]'),id=form.dataset.classForm;state.coursePlans[id]={...coursePlan(getCourse(id)),[el.name]:el.value};saveState();return;}
  });
  document.addEventListener('submit', event => {
    const form=event.target;
    if(form.matches('[data-review-form]')){event.preventDefault();const id=form.dataset.reviewForm,fd=new FormData(form);addReviewItem(id,fd.get('title'),fd.get('details'));openCourse(id,'review');return;}
    if(form.matches('[data-quiz-form]')){event.preventDefault();const id=form.dataset.quizForm,fd=new FormData(form);addQuizItem(id,fd.get('question'),fd.get('answer'),fd.get('explanation'));openCourse(id,'quiz');return;}
    if(form.matches('[data-calendar-form]')){event.preventDefault();const fd=new FormData(form),date=String(fd.get('date')),entry={id:calendarEditingId&&calendarEditingId!=='new'?calendarEditingId:uid('calendar'),title:String(fd.get('title')).trim(),type:String(fd.get('type')),courseId:String(fd.get('courseId')),time:String(fd.get('time')),details:String(fd.get('details')).trim(),done:false,createdAt:new Date().toISOString()};if(!entry.title){showToast('Dê um título ao item.','warn');return;}if(calendarEditingId&&calendarEditingId!=='new'){for(const [d,entries] of Object.entries(state.calendarEntries)){const old=entries.find(e=>e.id===calendarEditingId);if(old){entry.done=old.done;state.calendarEntries[d]=entries.filter(e=>e.id!==calendarEditingId);if(!state.calendarEntries[d].length)delete state.calendarEntries[d];break;}}}state.calendarEntries[date]=[entry,...calendarEntriesFor(date)];state.calendarMonth=date.slice(0,7);state.calendarSelectedDate=date;calendarEditingId=null;saveState();renderCalendar();return;}
  });

  $('#searchInput').addEventListener('input', e => { searchQuery=e.target.value; renderCurrentView(); });
  $('#menuBtn').addEventListener('click', toggleSidebar);
  overlay.addEventListener('click', closeMobileSidebar);
  $('#dialogClose').addEventListener('click', closeDialog);
  dialog.addEventListener('click', e => { if(e.target===dialog)closeDialog(); });
  $('#importInput').addEventListener('change', e => { const file=e.target.files?.[0]; if(file) importBackupFile(file); e.target.value=''; });
  window.addEventListener('resize', applySidebarState);

  // Pequena API interna para testes automatizados do pacote.
  window.__ARCH_TEST__ = {
    getState: () => clone(state),
    courseCount: () => requiredCourses().length,
    optativeCount: () => optativeCourses().length,
    reviewProgress: id => reviewProgress(getCourse(id)),
    addReview: (id,title='Teste') => { addReviewItem(id,title,''); return reviewProgress(getCourse(id)); },
    toggleFirstReview: id => { const item=reviewItems(getCourse(id))[0]; if(item)toggleReview(id,item.id); return reviewProgress(getCourse(id)); },
    addQuiz: id => { addQuizItem(id,'Pergunta teste?','Resposta teste',''); return quizItems(getCourse(id)).length; },
    addPage: id => createNotebookPage(getCourse(id)).pageNumber
  };

  syncSemesterSelect();
  applySidebarState();
  saveState();
  renderCurrentView();
})();
