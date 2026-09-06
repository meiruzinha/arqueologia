(() => {
  const DATA = window.ARCHAEOLOGY_DATA;
  const STUDY = window.ARCHAEOLOGY_STUDY_CONTENT || {};
  if (!DATA) throw new Error('Dados do curso não carregados.');

  const STORAGE_KEY = 'arqueologia-study-hub-v4';
  const V3_STORAGE_KEY = 'arqueologia-study-hub-v3';
  const V2_STORAGE_KEY = 'arqueologia-study-hub-v2';
  const V1_STORAGE_KEY = 'arqueologia-study-hub-v1';
  const defaultState = {
    currentSemester: 1,
    statuses: {},
    topicChecks: {},
    notes: {},
    favorites: {},
    flashcardMastery: {},
    quizScores: {},
    quizAttempts: {},
    coursePlans: {},
    view: 'dashboard',
    semesterFilter: 1,
  };

  let state = loadState();
  let searchQuery = '';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const view = $('#view');
  const dialog = $('#courseDialog');
  const dialogContent = $('#courseDialogContent');
  const sidebar = $('#sidebar');
  const overlay = $('#overlay');

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return mergeState(JSON.parse(raw));
      const v3 = localStorage.getItem(V3_STORAGE_KEY);
      if (v3) {
        const migrated = mergeState(JSON.parse(v3));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
      const v2 = localStorage.getItem(V2_STORAGE_KEY);
      if (v2) {
        const migrated = mergeState(JSON.parse(v2));
        // v3 auditou e reordenou conceitos; índices antigos de flashcards/quizzes não são confiáveis.
        migrated.flashcardMastery = {};
        migrated.quizScores = {};
        migrated.quizAttempts = {};
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
      const old = localStorage.getItem(V1_STORAGE_KEY);
      if (old) {
        const migrated = mergeState(JSON.parse(old));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
        return migrated;
      }
    } catch (_) {}
    return structuredCloneSafe(defaultState);
  }

  function structuredCloneSafe(obj) { return JSON.parse(JSON.stringify(obj)); }
  function plainObject(value) { return value && typeof value === 'object' && !Array.isArray(value) ? value : {}; }
  function safeSemester(value) { const n = Number(value); return Number.isInteger(n) && n >= 1 && n <= 8 ? n : 1; }
  function mergeState(incoming = {}) {
    const allowedViews = new Set(['dashboard', 'semester', 'all', 'review', 'optatives', 'favorites', 'glossary', 'about']);
    const viewName = allowedViews.has(incoming.view) ? incoming.view : 'dashboard';
    return {
      ...structuredCloneSafe(defaultState),
      ...incoming,
      currentSemester: safeSemester(incoming.currentSemester),
      semesterFilter: safeSemester(incoming.semesterFilter || incoming.currentSemester),
      view: viewName,
      statuses: plainObject(incoming.statuses), topicChecks: plainObject(incoming.topicChecks), notes: plainObject(incoming.notes), favorites: plainObject(incoming.favorites),
      flashcardMastery: plainObject(incoming.flashcardMastery), quizScores: plainObject(incoming.quizScores), quizAttempts: plainObject(incoming.quizAttempts),
      coursePlans: plainObject(incoming.coursePlans),
    };
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    updateGlobalProgress();
  }

  function esc(value = '') {
    return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  }

  function normalizeText(value = '') {
    return String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR').replace(/\s+/g, ' ').trim();
  }

  const CONCEPT_ALLOW = {
    'acao social': ['s1-4-sociologia'],
    'fato social': ['s1-4-sociologia'],
    'sig': ['s3-3-cartografia-topografia-e-geoprocessamento', 's7-2-pratica-de-laboratorio-ii'],
    'graficos': ['s2-8-estatistica'],
    'dna antigo': ['s6-7-arqueogenetica'],
    'andes': ['s5-5-arqueologia-latino-americana'],
    'reserva tecnica': ['s5-7-gestao-do-patrimonio-arqueologico', 's6-2-pratica-de-laboratorio-i', 's6-5-musealizacao-da-arqueologia'],
    'estado': ['s5-1-arqueologia-do-oriente-proximo', 's5-2-arqueologia-africana', 's5-3-arqueologia-asiatica'],
    'mito': ['s3-4-mitologia-e-ritual', 's5-3-arqueologia-asiatica'],
    'arqueologia historica': ['s3-6-arqueologia-historica-i', 's4-5-arqueologia-historica-ii', 's7-7-seminario-de-arqueologia-ii'],
    'evolucao humana na africa': ['s1-3-pre-historia-geral', 's5-2-arqueologia-africana', 's7-4-arqueologia-do-quaternario'],
    'avaliacao de projeto educativo': ['s8-2-educacao-patrimonial'],
    'analise tecnico-tipologica': ['s7-2-pratica-de-laboratorio-ii'],
    'comunicacao tecnica': ['s8-4-relatorio-tecnico-pareceres-e-pericia-profissionais']
  };

  function conceptIsRelevant(course, concept) {
    const key = normalizeText(concept?.term || '');
    if (!key) return false;
    const allowed = CONCEPT_ALLOW[key];
    return !allowed || allowed.includes(course.id);
  }

  function conceptsForCourse(course) {
    return (packFor(course).concepts || []).filter(c => conceptIsRelevant(course, c));
  }

  function courseById(id) { return [...DATA.courses, ...DATA.optatives].find(c => c.id === id); }
  function packFor(course) { return STUDY[course.id] || { overview: course.syllabus, concepts: [], studyTips: [] }; }
  function statusLabel(status) { return status === 'done' ? 'Concluída' : status === 'studying' ? 'Estudando' : 'Não iniciada'; }
  function semesterLabel(n) { return `${n}º semestre`; }

  function topicKey(course, index) { return course.topics[index] || String(index); }
  function topicChecked(course, index) {
    const checks = state.topicChecks[course.id] || {};
    const key = topicKey(course, index);
    return checks[key] === true || checks[index] === true || checks[String(index)] === true;
  }
  function completedTopicCount(course) {
    return course.topics.reduce((acc, _, index) => acc + (topicChecked(course, index) ? 1 : 0), 0);
  }

  function suggestedOptativeAnswer(topic, course) {
    return `Como preparação para ${course.title}, estude “${topic}” relacionando contexto histórico, evidências materiais, métodos de documentação/análise e limites de interpretação. O conteúdo exato deve ser confirmado no plano de ensino quando a optativa for ofertada.`;
  }

  function flashcardsForCourse(course) {
    const p = packFor(course);
    if (course.officialSyllabusAvailable === false) {
      return (course.topics || []).slice(0, 8).map(topic => ({
        q: `O que vale investigar em “${topic}”?`,
        a: suggestedOptativeAnswer(topic, course),
        term: topic
      }));
    }
    const cards = [{ q: `Qual é o foco central de ${course.title}?`, a: p.overview }];
    conceptsForCourse(course).slice(0, 8).forEach(c => cards.push({ q: `Explique: ${c.term}.`, a: c.definition, term: c.term }));
    return cards;
  }

  function flashKey(card, index) { return normalizeText(card.term || card.q || String(index)); }
  function flashState(course, card, index) {
    const m = state.flashcardMastery[course.id] || {};
    const key = flashKey(card, index);
    if (Object.prototype.hasOwnProperty.call(m, key)) return m[key];
    return m[index];
  }
  function masteredCardCount(course) {
    const cards = flashcardsForCourse(course);
    return cards.reduce((n, card, i) => n + (flashState(course, card, i) === true ? 1 : 0), 0);
  }

  function courseProgress(course) {
    if (state.statuses[course.id] === 'done') return 100;
    const topicPart = course.topics.length ? completedTopicCount(course) / course.topics.length * 60 : 0;
    const cards = flashcardsForCourse(course);
    const flashPart = cards.length ? masteredCardCount(course) / cards.length * 20 : 0;
    const quizPart = (Number(state.quizScores[course.id] || 0) / 100) * 20;
    const started = state.statuses[course.id] === 'studying' ? 4 : 0;
    return Math.min(99, Math.round(topicPart + flashPart + quizPart + started));
  }

  function globalProgress() {
    if (!DATA.courses.length) return 0;
    return Math.round(DATA.courses.reduce((sum, c) => sum + courseProgress(c), 0) / DATA.courses.length);
  }

  function updateGlobalProgress() {
    const p = globalProgress();
    if ($('#sidebarProgressText')) $('#sidebarProgressText').textContent = `${p}%`;
    if ($('#sidebarProgressBar')) $('#sidebarProgressBar').style.width = `${p}%`;
  }

  function statusBadge(course) {
    const status = state.statuses[course.id] || 'todo';
    const cls = status === 'done' ? 'done' : status === 'studying' ? 'study' : '';
    return `<span class="badge ${cls}">${statusLabel(status)}</span>`;
  }

  function setActiveNav(viewName) {
    $$('.nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === viewName));
  }

  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('show'); }
  function navigate(viewName, opts = {}) {
    searchQuery = '';
    const search = $('#searchInput');
    if (search) search.value = '';
    state.view = viewName;
    if (opts.semester) state.semesterFilter = Number(opts.semester);
    if (viewName === 'semester' && !opts.semester) state.semesterFilter = Number(state.currentSemester || 1);
    saveState(); setActiveNav(viewName); render(); closeSidebar(); window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function statsForSemester(semester) {
    const list = DATA.courses.filter(c => c.semester === semester);
    const hours = list.reduce((a, c) => a + c.matrixHours, 0);
    const done = list.filter(c => state.statuses[c.id] === 'done').length;
    const avg = list.length ? Math.round(list.reduce((a, c) => a + courseProgress(c), 0) / list.length) : 0;
    return { count: list.length, hours, done, avg };
  }

  function courseCard(course) {
    const p = courseProgress(course), fav = !!state.favorites[course.id], pack = packFor(course);
    const excerpt = pack.overview.length > 150 ? `${pack.overview.slice(0, 150).trim()}…` : pack.overview;
    const score = state.quizScores[course.id];
    return `<article class="course-card clickable" data-course-id="${esc(course.id)}" tabindex="0">
      <div class="course-card-top"><div class="badges">
        ${course.semester ? `<span class="badge">${course.semester}º sem.</span>` : `<span class="badge">Optativa</span>`}
        <span class="badge">${course.matrixHours}h</span>${course.officialSyllabusAvailable === false ? `<span class="badge warn">PPP: sem ementa</span>` : course.note ? `<span class="badge warn">PPP ⚠</span>` : ''}${statusBadge(course)}
        ${score !== undefined ? `<span class="badge quiz-badge">Quiz ${score}%</span>` : ''}
      </div><button class="favorite-btn ${fav ? 'active' : ''}" data-fav-id="${esc(course.id)}" aria-label="${fav ? 'Remover dos favoritos' : 'Favoritar matéria'}" aria-pressed="${fav ? 'true' : 'false'}">${fav ? '★' : '☆'}</button></div>
      <h3>${esc(course.title)}</h3><p>${esc(excerpt)}</p>
      <div class="course-card-footer"><div class="progress-track"><div class="progress-fill" style="width:${p}%"></div></div><small>${p}%</small></div>
    </article>`;
  }

  function semesterChips(active = null) {
    return `<div class="semester-chips">${Array.from({ length: 8 }, (_, i) => i + 1).map(s => `<button class="chip ${s === active ? 'active' : ''}" data-sem-chip="${s}">${s}º</button>`).join('')}</div>`;
  }

  function nextStudyItem() {
    const sem = Number(state.currentSemester || 1);
    const courses = DATA.courses.filter(c => c.semester === sem);
    for (const c of courses) {
      if (state.statuses[c.id] === 'done') continue;
      const idx = c.topics.findIndex((_, i) => !topicChecked(c, i));
      return { course: c, topic: idx >= 0 ? c.topics[idx] : 'Faça os flashcards e o quiz desta matéria.', topicIndex: idx };
    }
    return null;
  }

  function reviewCount() {
    return DATA.courses.reduce((n, c) => {
      const started = state.statuses[c.id] === 'studying' || completedTopicCount(c) > 0 || state.quizScores[c.id] !== undefined;
      if (!started) return n;
      const lowQuiz = state.quizScores[c.id] !== undefined && state.quizScores[c.id] < 70;
      const unmastered = masteredCardCount(c) < flashcardsForCourse(c).length;
      return n + (lowQuiz || unmastered ? 1 : 0);
    }, 0);
  }

  function dashboard() {
    const sem = Number(state.currentSemester || 1), stats = statsForSemester(sem), current = DATA.courses.filter(c => c.semester === sem);
    const next = nextStudyItem();
    const startedCourses = DATA.courses.filter(c => state.statuses[c.id] === 'studying').length;
    return `<section class="hero">
      <div class="eyebrow">Bacharelado em Arqueologia · UNEB Campus VIII</div>
      <h1>Um app para estudar a graduação inteira.</h1>
      <p>O PPP oficial fica separado do material de apoio. Em cada matéria você tem roteiro, explicações, conceitos-chave, flashcards, quiz, bibliografia e anotações.</p>
      <div class="hero-actions"><button class="btn btn-light" data-go-sem="${sem}">Abrir ${sem}º semestre</button><button class="btn" data-go-review>Ir para revisão</button></div>
    </section>

    <div class="stat-grid">
      <div class="stat-card"><span>Matérias obrigatórias</span><strong>${DATA.meta.requiredComponents}</strong><small>em 8 semestres</small></div>
      <div class="stat-card"><span>Progresso geral</span><strong>${globalProgress()}%</strong><small>${startedCourses} em estudo agora</small></div>
      <div class="stat-card"><span>${sem}º semestre</span><strong>${stats.avg}%</strong><small>${stats.done}/${stats.count} concluídas</small></div>
      <div class="stat-card"><span>Precisando de revisão</span><strong>${reviewCount()}</strong><small>matérias iniciadas</small></div>
    </div>

    ${next ? `<section class="today-card">
      <div><span class="eyebrow">Continuar estudando</span><h2>${esc(next.course.title)}</h2><p>Próximo tópico: <strong>${esc(next.topic)}</strong></p></div>
      <button class="btn" data-course-open="${esc(next.course.id)}" data-open-tab="content">Estudar agora →</button>
    </section>` : `<div class="notice info"><div>✓</div><div><strong>Semestre concluído</strong><p>Você marcou todas as matérias do ${sem}º semestre como concluídas. Use a revisão para manter os conceitos vivos.</p></div></div>`}

    <div class="section-head"><div><span class="eyebrow">Seu semestre atual</span><h2>${sem}º semestre</h2><p>${stats.count} componentes · ${stats.hours}h pela matriz.</p></div><button class="btn btn-outline btn-sm" data-go-sem="${sem}">Ver todas</button></div>
    <div class="card-grid">${current.map(courseCard).join('')}</div>

    <div class="notice" style="margin-top:24px"><div>⚠</div><div><strong>O plano do professor continua mandando</strong><p>O app cobre a matriz e o ementário do PPP e cria material de preparação a partir deles. Quando você receber o plano de ensino de uma disciplina, ele deve ser usado para atualizar a ordem, leituras e avaliações daquela turma.</p></div></div>`;
  }

  function semesterView(sem) {
    const courses = DATA.courses.filter(c => c.semester === sem), stats = statsForSemester(sem);
    return `<div class="section-head top-section"><div><span class="eyebrow">Matriz curricular</span><h1>${semesterLabel(sem)}</h1><p>${stats.count} componentes · ${stats.hours}h pela matriz · ${stats.avg}% estudado</p></div>${semesterChips(sem)}</div>
      <div class="notice info"><div>✦</div><div><strong>Como usar este semestre</strong><p>Abra uma matéria e siga Guia → Conteúdo → Flashcards → Quiz. A ementa e bibliografia oficiais ficam em abas próprias.</p></div></div>
      <div class="card-grid">${courses.map(courseCard).join('')}</div>`;
  }

  function allView() {
    return `<div class="section-head top-section"><div><span class="eyebrow">Do começo ao TCC</span><h1>Toda a grade</h1><p>Os 8 semestres da matriz curricular do PPP.</p></div>${semesterChips(null)}</div>
      ${Array.from({ length: 8 }, (_, i) => i + 1).map(sem => {
        const courses = DATA.courses.filter(c => c.semester === sem), st = statsForSemester(sem);
        return `<section class="semester-section" id="semester-${sem}"><div class="section-head"><div><h2>${sem}º semestre</h2><p>${st.count} componentes · ${st.hours}h · ${st.avg}% estudado</p></div><button class="btn btn-outline btn-sm" data-go-sem="${sem}">Abrir semestre</button></div><div class="card-grid">${courses.map(courseCard).join('')}</div></section>`;
      }).join('')}`;
  }

  function optativesView() {
    return `<div class="section-head top-section"><div><span class="eyebrow">Formação optativa</span><h1>Optativas</h1><p>${DATA.optatives.length} opções listadas no PPP.</p></div></div>
      <div class="notice"><div>i</div><div><strong>Atenção às optativas</strong><p>O PPP lista nomes e cargas horárias, mas não traz ementário específico dessas optativas. Por isso o conteúdo de estudo aqui é uma preparação sugerida e deve ser substituído/complementado pelo plano de ensino quando a disciplina for ofertada.</p></div></div>
      <div class="card-grid">${DATA.optatives.map(courseCard).join('')}</div>`;
  }

  function favoritesView() {
    const items = [...DATA.courses, ...DATA.optatives].filter(c => state.favorites[c.id]);
    return `<div class="section-head top-section"><div><span class="eyebrow">Sua seleção</span><h1>Favoritas</h1><p>Matérias que você quer manter por perto.</p></div></div>
      ${items.length ? `<div class="card-grid">${items.map(courseCard).join('')}</div>` : `<div class="empty"><h3>Nenhuma favorita ainda</h3><p>Toque na estrela de uma matéria para ela aparecer aqui.</p></div>`}`;
  }

  function glossaryView() {
    const entries = [];
    const seen = new Map();
    DATA.courses.forEach(course => conceptsForCourse(course).forEach(concept => {
      const key = normalizeText(concept.term);
      if (!key || seen.has(key)) return;
      seen.set(key, true);
      entries.push({ term: concept.term, definition: concept.definition, course });
    }));
    entries.sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'));
    return `<div class="section-head top-section"><div><span class="eyebrow">Conceitos-chave</span><h1>Glossário</h1><p>${entries.length} conceitos de apoio das disciplinas obrigatórias. Use a busca do topo para localizar termos.</p></div></div>
      <div class="notice info"><div>i</div><div><strong>Glossário de apoio</strong><p>As definições ajudam na revisão, mas não substituem a definição adotada pelo professor ou pela bibliografia da disciplina.</p></div></div>
      <div class="glossary-list">${entries.map(e => `<article class="glossary-item"><div><strong>${esc(e.term)}</strong><span>${e.course.semester}º · ${esc(e.course.title)}</span></div><p>${esc(e.definition)}</p><button class="btn btn-outline btn-sm" data-course-open="${esc(e.course.id)}" data-open-tab="content">Abrir matéria</button></article>`).join('')}</div>`;
  }

  function reviewView() {
    const sem = Number(state.currentSemester || 1);
    const current = DATA.courses.filter(c => c.semester === sem);
    const rows = current.map(c => {
      const cards = flashcardsForCourse(c), mastered = masteredCardCount(c), score = state.quizScores[c.id];
      const unchecked = c.topics.length - completedTopicCount(c);
      return { c, cards, mastered, score, unchecked, need: unchecked > 0 || mastered < cards.length || (score !== undefined && score < 70) };
    });
    const needs = rows.filter(r => r.need && (state.statuses[r.c.id] !== 'done'));
    return `<div class="section-head top-section"><div><span class="eyebrow">Memória ativa</span><h1>Revisão</h1><p>Veja o que ainda falta consolidar no ${sem}º semestre.</p></div><button class="btn btn-outline" data-go-sem="${sem}">Voltar às matérias</button></div>
      <div class="review-explainer"><strong>Regra simples:</strong> tente explicar sem olhar, confira a resposta e marque “Acertei” só quando conseguir responder com suas próprias palavras. No quiz, use 70% como mínimo para considerar o conteúdo razoavelmente consolidado.</div>
      ${needs.length ? `<div class="review-list">${needs.map(r => `<article class="review-row">
        <div><span class="eyebrow">${r.c.semester}º semestre</span><h3>${esc(r.c.title)}</h3><p>${r.unchecked} tópico(s) pendente(s) · ${r.mastered}/${r.cards.length} flashcards dominados · quiz ${r.score === undefined ? 'não feito' : `${r.score}%`}</p></div>
        <div class="review-actions"><button class="btn btn-soft btn-sm" data-course-open="${esc(r.c.id)}" data-open-tab="flash">Flashcards</button><button class="btn btn-outline btn-sm" data-course-open="${esc(r.c.id)}" data-open-tab="quiz">Quiz</button></div>
      </article>`).join('')}</div>` : `<div class="empty"><h3>Nada pendente neste semestre 🎉</h3><p>Quando você iniciar novas matérias ou errar quizzes, elas aparecerão aqui.</p></div>`}`;
  }

  function aboutView() {
    const discrepancyRows = DATA.courses.filter(c => c.note).map(c => `<tr><th>${esc(c.title)}</th><td>${esc(c.note)}</td></tr>`).join('');
    const m = DATA.meta;
    return `<div class="section-head top-section"><div><span class="eyebrow">Fonte e auditoria</span><h1>Sobre o PPP</h1><p>O que é oficial, o que é apoio e quais inconsistências existem no próprio documento.</p></div></div>
      <div class="about-grid"><section class="panel"><h2>Fonte oficial</h2><table class="detail-table">
        <tr><th>Curso</th><td>${esc(m.course)}</td></tr><tr><th>Instituição</th><td>${esc(m.institution)}</td></tr><tr><th>Campus</th><td>${esc(m.campus)}</td></tr><tr><th>Documento</th><td>${esc(m.sourceTitle)}</td></tr><tr><th>Semestres</th><td>${m.semesters}</td></tr><tr><th>Componentes listados</th><td>${m.matrixListedComponents} obrigatórios + ${m.optionalComponents} optativas</td></tr>
      </table><p class="source-link"><a href="${esc(m.sourceUrl)}" target="_blank" rel="noopener">Abrir PDF oficial da UNEB ↗</a></p></section>
      <section class="panel"><h2>O que cada camada significa</h2><p><strong>Oficial do PPP:</strong> nome na matriz, carga horária, ementa, créditos e bibliografia quando presentes.</p><p><strong>Roteiro sugerido:</strong> tópicos, explicações, flashcards, quiz e dicas criados para facilitar seus estudos a partir da ementa.</p><p><strong>Plano da turma:</strong> quando o professor entregar, ele é a referência para ordem das aulas, avaliações e leituras efetivamente cobradas.</p></section></div>
      <div class="section-head"><div><h2>Auditoria da matriz</h2><p>Conferência matemática e estrutural do próprio PPP.</p></div></div>
      <div class="audit-grid">
        <div class="audit-card"><span>Matriz enumerada</span><strong>${m.matrixListedComponents}</strong><small>componentes obrigatórios</small></div>
        <div class="audit-card"><span>Soma da matriz</span><strong>${m.matrixRequiredHoursSum}h</strong><small>pelas cargas listadas</small></div>
        <div class="audit-card warn"><span>PPP declara</span><strong>${m.pppDeclaredRequiredHours}h</strong><small>diferença de ${m.pppDeclaredRequiredHours - m.matrixRequiredHoursSum}h</small></div>
        <div class="audit-card warn"><span>Estágios</span><strong>${m.matrixListedStages}</strong><small>o texto introdutório fala em ${m.pppDeclaredStages}</small></div>
      </div>
      <div class="audit-grid audit-grid-secondary">
        <div class="audit-card warn"><span>Créditos no item 2.11</span><strong>${m.pppDeclaredCreditsMatrixSection}</strong><small>créditos mínimos declarados</small></div>
        <div class="audit-card warn"><span>Créditos no item 2.13</span><strong>${m.pppDeclaredCreditsRegimeSection}</strong><small>o mesmo PPP declara outro total</small></div>
        <div class="audit-card warn"><span>Percentuais declarados</span><strong>${m.pppDeclaredSpecificPercent}/${m.pppDeclaredOptionalPercent}/${m.pppDeclaredFreePercent}%</strong><small>específica / optativa / livre</small></div>
        <div class="audit-card"><span>Percentuais pela conta do PPP</span><strong>${m.recomputedSpecificPercent}/${m.recomputedOptionalPercent}/${m.recomputedFreePercent}%</strong><small>usando 4.840h como denominador</small></div>
      </div>
      <div class="notice"><div>⚠</div><div><strong>O PPP não fecha matematicamente</strong><p>A matriz listada soma ${m.matrixRequiredHoursSum}h. Somando as ${m.optionalCatalogHoursSum}h de optativas e ${m.freeFormationHours}h de formação livre, o total recomposto seria ${m.recomputedTotalFromListedMatrix}h, enquanto o documento declara ${m.pppDeclaredTotalHours}h. O app não inventa uma disciplina de 60h para completar a conta.</p></div></div>
      <div class="section-head"><div><h2>Divergências por disciplina</h2><p>Diferenças de nome ou carga horária encontradas entre matriz e ementário.</p></div></div><section class="panel"><table class="detail-table">${discrepancyRows}</table></section>
      <div class="section-head"><div><h2>Backup</h2><p>Salve seu progresso antes de trocar de celular, navegador ou domínio.</p></div></div><section class="panel"><div class="hero-actions"><button class="btn" data-export>Exportar backup</button><button class="btn btn-outline" data-import>Importar backup</button><button class="btn btn-danger" data-reset>Apagar meu progresso</button></div></section>`;
  }

  function searchView(query) {
    const q = normalizeText(query);
    const items = [...DATA.courses, ...DATA.optatives].filter(c => {
      const p = packFor(c);
      const hay = normalizeText([c.title, c.matrixNameOriginal, c.syllabus, c.ementaryName, ...(c.topics || []), c.bibliographyBasic, c.bibliographyComplementary, p.overview, ...conceptsForCourse(c).flatMap(x => [x.term, x.definition])].join(' '));
      return hay.includes(q);
    });
    return `<div class="section-head top-section"><div><span class="eyebrow">Busca</span><h1>“${esc(query)}”</h1><p>${items.length} resultado(s) em matérias, ementas, tópicos e conceitos.</p></div></div>${items.length ? `<div class="card-grid">${items.map(courseCard).join('')}</div>` : `<div class="empty"><h3>Nada encontrado</h3><p>Tente termos como “ossos”, “cerâmica”, “estratigrafia”, “patrimônio”, “DNA”, “estatística” ou “campo”.</p></div>`}`;
  }

  function render() {
    if (searchQuery.trim()) view.innerHTML = searchView(searchQuery);
    else {
      switch (state.view) {
        case 'semester': view.innerHTML = semesterView(Number(state.semesterFilter || state.currentSemester || 1)); break;
        case 'all': view.innerHTML = allView(); break;
        case 'review': view.innerHTML = reviewView(); break;
        case 'optatives': view.innerHTML = optativesView(); break;
        case 'favorites': view.innerHTML = favoritesView(); break;
        case 'glossary': view.innerHTML = glossaryView(); break;
        case 'about': view.innerHTML = aboutView(); break;
        default: view.innerHTML = dashboard();
      }
    }
    bindDynamic(); updateGlobalProgress();
  }

  function lessonText(topic, course) {
    const guide = (packFor(course).topicGuides || []).find(g => g.topic === topic);
    const points = (guide?.points || []).filter(c => conceptIsRelevant(course, c));
    if (points.length) return points.map(c => `<div class="concept-inline"><strong>${esc(c.term)}</strong><p>${esc(c.definition)}</p></div>`).join('');
    const prefix = course.officialSyllabusAvailable === false ? 'Roteiro sugerido para uma optativa sem ementa no PPP.' : 'Roteiro de apoio derivado da ementa oficial.';
    return `<div class="concept-inline"><strong>Como estudar este tópico</strong><p>${esc(prefix)} Entenda “${esc(topic)}”, identifique evidências, métodos, exemplos e limites de interpretação. Quando houver plano de ensino da turma, use-o como referência principal.</p></div>`;
  }

  function tabButton(id, label, active) { return `<button type="button" class="course-tab ${active === id ? 'active' : ''}" data-tab="${id}">${label}</button>`; }

  function quizForCourse(course) {
    if (course.officialSyllabusAvailable === false) return [];
    const unique = [];
    const seenDefinitions = new Set();
    conceptsForCourse(course).forEach(c => {
      const key = normalizeText(c.definition);
      if (!key || seenDefinitions.has(key)) return;
      seenDefinitions.add(key); unique.push(c);
    });
    if (unique.length < 4) return [];
    const pool = unique.slice(0, Math.min(10, unique.length));
    return pool.slice(0, Math.min(5, pool.length)).map((correct, qi) => {
      const distractors = [];
      for (let step = 1; distractors.length < 3 && step < pool.length + 3; step++) {
        const cand = pool[(qi + step) % pool.length];
        if (cand.term !== correct.term && cand.definition !== correct.definition && !distractors.some(d => d.definition === cand.definition)) distractors.push(cand);
      }
      if (distractors.length < 3) return null;
      const options = [correct, ...distractors].map((item, oi) => ({ item, order: (normalizeText(item.term).charCodeAt(0) + qi * 11 + oi * 7) % 97 })).sort((a, b) => a.order - b.order).map(x => x.item);
      return { q: `Qual alternativa define melhor “${correct.term}”?`, correct: correct.definition, correctTerm: correct.term, options: options.map(o => o.definition) };
    }).filter(Boolean);
  }

  function openCourse(course, initialTab = 'guide') {
    if (!course) return;
    const pack = packFor(course), status = state.statuses[course.id] || 'todo';
    const cards = flashcardsForCourse(course), quiz = quizForCourse(course);
    const score = state.quizScores[course.id];
    const plan = state.coursePlans[course.id] || {};
    const studyPct = courseProgress(course);

    dialogContent.innerHTML = `<header class="course-hero"><div class="badges">
      ${course.semester ? `<span class="badge">${course.semester}º semestre</span>` : `<span class="badge">Optativa</span>`}<span class="badge">${course.matrixHours}h na matriz</span>${course.credits ? `<span class="badge">${esc(course.credits)} no ementário</span>` : ''}${course.officialSyllabusAvailable === false ? `<span class="badge warn">PPP: sem ementa</span>` : course.note ? `<span class="badge warn">PPP ⚠</span>` : ''}
      </div><h2>${esc(course.title)}</h2><p>${course.matrixNameOriginal && course.matrixNameOriginal !== course.title ? `Como aparece na matriz: ${esc(course.matrixNameOriginal)}. ` : ''}${course.ementaryName && course.ementaryName !== course.title ? `Nome no ementário: ${esc(course.ementaryName)}.` : 'Guia organizado a partir do PPP do curso.'}</p>
      <div class="course-progress-line"><div class="progress-track"><div class="progress-fill" data-dialog-progress-bar style="width:${studyPct}%"></div></div><strong data-dialog-progress-text>${studyPct}%</strong></div>
      <div class="status-row">${[['todo', 'Não iniciada'], ['studying', 'Estudando'], ['done', 'Concluída']].map(([v, l]) => `<button type="button" class="status-btn ${status === v ? 'active' : ''}" data-status="${v}">${l}</button>`).join('')}</div></header>

      <div class="course-content">${course.note ? `<div class="notice"><div>${course.officialSyllabusAvailable === false ? 'ℹ' : '⚠'}</div><div><strong>${course.officialSyllabusAvailable === false ? 'Limite da fonte' : 'Divergência no PPP'}</strong><p>${esc(course.note)}</p></div></div>` : ''}
      <div class="source-split"><span class="source-pill official">PPP oficial</span><span>${course.officialSyllabusAvailable === false ? 'nome e carga horária da optativa' : 'ementa e bibliografia'}</span><span class="source-pill support">Apoio</span><span>${course.officialSyllabusAvailable === false ? 'roteiro, conteúdo e flashcards sugeridos' : 'roteiro, conteúdo, flashcards e quiz'}</span></div>
      <div class="course-tabs">${tabButton('guide', 'Guia', initialTab)}${tabButton('content', 'Conteúdo', initialTab)}${tabButton('flash', 'Flashcards', initialTab)}${tabButton('quiz', 'Quiz', initialTab)}${tabButton('syllabus', 'Ementa oficial', initialTab)}${tabButton('biblio', 'Bibliografia', initialTab)}${tabButton('class', 'Minha turma', initialTab)}${tabButton('notes', 'Anotações', initialTab)}</div>

      <section class="tab-panel ${initialTab === 'guide' ? 'active' : ''}" data-panel="guide">
        <div class="guide-intro"><span class="eyebrow">Visão geral</span><h3>Para que serve esta matéria?</h3><p>${esc(pack.overview)}</p></div>
        <div class="two-col"><div><h3>Roteiro sugerido de estudo</h3><p class="muted">Estes tópicos foram organizados como apoio a partir da ementa; não são uma lista oficial de aulas ou de questões de prova.</p><div class="study-list">${course.topics.map((topic, i) => `<label class="study-item ${topicChecked(course, i) ? 'checked' : ''}"><input type="checkbox" data-topic-check="${i}" ${topicChecked(course, i) ? 'checked' : ''}><span>${esc(topic)}</span></label>`).join('')}</div></div>
        <aside class="study-tips"><h3>Como estudar</h3><ol>${(pack.studyTips || []).map(t => `<li>${esc(t)}</li>`).join('')}</ol><div class="mini-rule"><strong>Teste de domínio</strong><p>Marque um tópico somente quando conseguir explicá-lo sem copiar a definição e dar pelo menos um exemplo ou aplicação.</p></div></aside></div>
      </section>

      <section class="tab-panel ${initialTab === 'content' ? 'active' : ''}" data-panel="content"><div class="tab-heading"><div><span class="eyebrow">Material de apoio</span><h3>Conteúdo guiado</h3><p>Os tópicos abaixo são um roteiro de apoio baseado na ementa. Abra cada bloco para estudar os conceitos associados e compare depois com o plano da sua turma.</p></div></div>
        <div class="lesson-list">${course.topics.map((topic, i) => `<details class="lesson-card" ${i === 0 ? 'open' : ''}><summary><span class="lesson-number">${String(i + 1).padStart(2, '0')}</span><span>${esc(topic)}</span><span class="lesson-state">${topicChecked(course, i) ? '✓ estudado' : 'abrir'}</span></summary><div class="lesson-body">${lessonText(topic, course)}<div class="recall-box"><strong>Antes de fechar, responda:</strong><ul><li>Como eu explicaria este assunto em 3 frases?</li><li>Que evidência, fonte ou método permite investigá-lo?</li><li>Qual é um limite ou cuidado na interpretação?</li></ul></div><button type="button" class="btn btn-soft btn-sm" data-mark-topic="${i}">${topicChecked(course, i) ? 'Marcar como não estudado' : 'Marcar tópico como estudado'}</button></div></details>`).join('')}</div>
      </section>

      <section class="tab-panel ${initialTab === 'flash' ? 'active' : ''}" data-panel="flash"><div class="tab-heading"><div><span class="eyebrow">Recordação ativa</span><h3>Flashcards</h3><p>Clique no cartão para revelar. Depois diga se conseguiu responder antes de olhar.</p></div><div class="score-chip">${masteredCardCount(course)}/${cards.length} dominados</div></div>
        <div class="flash-grid">${cards.map((card, i) => `<details class="flashcard ${flashState(course, card, i) === true ? 'mastered' : flashState(course, card, i) === false ? 'missed' : ''}" data-flashcard="${i}"><summary><span class="flash-label">Pergunta ${i + 1}</span><strong>${esc(card.q)}</strong><span class="reveal">Ver resposta</span></summary><div class="flash-answer"><p>${esc(card.a)}</p><div class="flash-actions"><button type="button" class="btn btn-outline btn-sm" data-flash-result="0" data-flash-index="${i}">Ainda não sei</button><button type="button" class="btn btn-soft btn-sm" data-flash-result="1" data-flash-index="${i}">Acertei</button></div></div></details>`).join('')}</div>
      </section>

      <section class="tab-panel ${initialTab === 'quiz' ? 'active' : ''}" data-panel="quiz"><div class="tab-heading"><div><span class="eyebrow">Autoteste</span><h3>Quiz da matéria</h3><p>As questões testam os conceitos do material de apoio. Tente sem consultar as outras abas.</p></div>${score !== undefined ? `<div class="score-chip">Melhor: ${score}%</div>` : ''}</div>
        ${quiz.length ? `<form class="quiz-form" data-quiz-form>${quiz.map((item, qi) => `<fieldset class="quiz-question" data-quiz-question="${qi}"><legend><span>${qi + 1}</span>${esc(item.q)}</legend>${item.options.map((opt, oi) => `<label class="quiz-option"><input type="radio" name="q${qi}" value="${oi}"><span>${esc(shortText(opt, 210))}</span></label>`).join('')}</fieldset>`).join('')}<button type="submit" class="btn">Corrigir quiz</button></form><div class="quiz-result" data-quiz-result></div>` : `<div class="empty"><p>${course.officialSyllabusAvailable === false ? 'O PPP não traz ementa desta optativa, então o app não gera um quiz como se o conteúdo fosse oficial. Use o roteiro sugerido e, quando a disciplina for ofertada, preencha o plano da sua turma.' : 'Esta matéria não possui conceitos únicos suficientes para gerar um quiz confiável. Use os tópicos, flashcards e anotações para revisão.'}</p></div>`}
      </section>

      <section class="tab-panel ${initialTab === 'syllabus' ? 'active' : ''}" data-panel="syllabus">
        ${course.officialSyllabusAvailable === false ? `<div class="notice"><div>i</div><div><strong>Optativa sem ementa neste PPP</strong><p>O documento oficial lista esta optativa e sua carga horária, mas não apresenta uma ementa específica. Por isso o app não chama o roteiro sugerido de “ementa oficial”.</p></div></div>` : `<div class="official-box"><span class="source-pill official">PPP oficial</span><h3>Ementa</h3><p class="syllabus">${esc(course.syllabus)}</p></div>`}
        <table class="detail-table"><tr><th>Nome como aparece na matriz</th><td>${esc(course.matrixNameOriginal || course.title)}</td></tr><tr><th>Carga horária na matriz</th><td>${course.matrixHours}h</td></tr><tr><th>Carga horária no ementário</th><td>${course.ementaryHours ? `${course.ementaryHours}h` : 'não informada'}</td></tr><tr><th>Créditos no ementário</th><td>${course.credits ? esc(course.credits) : 'não informados'}</td></tr></table>
      </section>

      <section class="tab-panel ${initialTab === 'biblio' ? 'active' : ''}" data-panel="biblio"><div class="official-box"><span class="source-pill official">PPP oficial</span><h3>Leituras indicadas</h3>${course.bibliographyBasic ? `<div class="biblio"><h4>Bibliografia básica</h4><p>${esc(course.bibliographyBasic)}</p></div>` : `<p class="syllabus">${course.officialSyllabusAvailable === false ? 'O PPP consultado não apresenta bibliografia específica para esta optativa.' : 'O PPP não informa bibliografia específica para este componente.'}</p>`}${course.bibliographyComplementary ? `<div class="biblio"><h4>Bibliografia complementar</h4><p>${esc(course.bibliographyComplementary)}</p></div>` : ''}</div></section>

      <section class="tab-panel ${initialTab === 'class' ? 'active' : ''}" data-panel="class"><div class="tab-heading"><div><span class="eyebrow">Sua turma real</span><h3>Plano da minha turma</h3><p>Preencha quando receber horários, professor, avaliações e o plano de ensino. Essas informações ficam salvas apenas neste navegador.</p></div></div><div class="class-plan-grid">
        <label><span>Professor(a)</span><input class="plan-input" data-plan-field="professor" value="${esc(plan.professor || '')}" placeholder="Nome do professor"></label>
        <label><span>Dias e horários</span><input class="plan-input" data-plan-field="schedule" value="${esc(plan.schedule || '')}" placeholder="Ex.: terça e quinta, 8h–10h"></label>
        <label><span>Sala / local</span><input class="plan-input" data-plan-field="location" value="${esc(plan.location || '')}" placeholder="Sala, laboratório ou campo"></label>
        <label class="span-2"><span>Avaliações e datas</span><textarea class="notes-area compact" data-plan-field="assessments" placeholder="Provas, seminários, trabalhos, entregas...">${esc(plan.assessments || '')}</textarea></label>
        <label class="span-2"><span>Plano de ensino / leituras realmente pedidas</span><textarea class="notes-area compact" data-plan-field="teachingPlan" placeholder="Cole aqui os tópicos, leituras e observações do plano da turma...">${esc(plan.teachingPlan || '')}</textarea></label>
      </div></section>

      <section class="tab-panel ${initialTab === 'notes' ? 'active' : ''}" data-panel="notes"><h3>Minhas anotações</h3><p class="muted">Salvas automaticamente neste navegador.</p><textarea class="notes-area" data-notes-id="${course.id}" placeholder="Resumo da aula, páginas do livro, conceitos para revisar, dúvidas para perguntar ao professor...">${esc(state.notes[course.id] || '')}</textarea></section>
      </div>`;

    bindDialog(course, quiz);
    if (typeof dialog.showModal === 'function') dialog.showModal(); else dialog.setAttribute('open', '');
  }

  function shortText(text, max) { const s = String(text); return s.length > max ? `${s.slice(0, max - 1).trim()}…` : s; }

  function refreshDialogProgress(course) {
    const p = courseProgress(course);
    const bar = $('[data-dialog-progress-bar]', dialogContent), text = $('[data-dialog-progress-text]', dialogContent);
    if (bar) bar.style.width = `${p}%`; if (text) text.textContent = `${p}%`;
  }

  function bindDialog(course, quiz) {
    $$('.course-tab', dialogContent).forEach(btn => btn.addEventListener('click', () => {
      $$('.course-tab', dialogContent).forEach(b => b.classList.remove('active')); $$('.tab-panel', dialogContent).forEach(p => p.classList.remove('active'));
      btn.classList.add('active'); $(`[data-panel="${btn.dataset.tab}"]`, dialogContent)?.classList.add('active');
    }));

    $$('[data-status]', dialogContent).forEach(btn => btn.addEventListener('click', () => {
      state.statuses[course.id] = btn.dataset.status;
      $$('[data-status]', dialogContent).forEach(b => b.classList.toggle('active', b === btn));
      if (btn.dataset.status === 'done') {
        state.topicChecks[course.id] = Object.fromEntries(course.topics.map((topic) => [topic, true]));
        const cards = flashcardsForCourse(course); state.flashcardMastery[course.id] = Object.fromEntries(cards.map((card, i) => [flashKey(card, i), true]));
        $$('[data-topic-check]', dialogContent).forEach(ch => { ch.checked = true; ch.closest('.study-item')?.classList.add('checked'); });
      }
      saveState(); refreshDialogProgress(course);
    }));

    $$('[data-topic-check]', dialogContent).forEach(ch => ch.addEventListener('change', () => setTopic(course, Number(ch.dataset.topicCheck), ch.checked, ch)));
    $$('[data-mark-topic]', dialogContent).forEach(btn => btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.markTopic), newValue = !topicChecked(course, idx);
      setTopic(course, idx, newValue, null); btn.textContent = newValue ? 'Marcar como não estudado' : 'Marcar tópico como estudado';
      const lesson = btn.closest('.lesson-card'); const stateEl = $('.lesson-state', lesson); if (stateEl) stateEl.textContent = newValue ? '✓ estudado' : 'abrir';
      const check = $(`[data-topic-check="${idx}"]`, dialogContent); if (check) { check.checked = newValue; check.closest('.study-item')?.classList.toggle('checked', newValue); }
    }));

    $$('[data-flash-result]', dialogContent).forEach(btn => btn.addEventListener('click', e => {
      e.preventDefault(); const idx = Number(btn.dataset.flashIndex), value = btn.dataset.flashResult === '1';
      const cardData = flashcardsForCourse(course)[idx];
      state.flashcardMastery[course.id] ||= {}; state.flashcardMastery[course.id][flashKey(cardData, idx)] = value;
      if (state.statuses[course.id] === 'todo') state.statuses[course.id] = 'studying'; saveState();
      const card = btn.closest('.flashcard'); card?.classList.toggle('mastered', value); card?.classList.toggle('missed', !value); refreshDialogProgress(course);
      const chip = $('[data-panel="flash"] .score-chip', dialogContent); if (chip) chip.textContent = `${masteredCardCount(course)}/${flashcardsForCourse(course).length} dominados`;
    }));

    const form = $('[data-quiz-form]', dialogContent);
    if (form) form.addEventListener('submit', e => {
      e.preventDefault(); let correct = 0, answered = 0; const feedback = [];
      quiz.forEach((item, qi) => {
        const chosen = form.querySelector(`input[name="q${qi}"]:checked`); const field = form.querySelector(`[data-quiz-question="${qi}"]`);
        field?.classList.remove('correct', 'wrong'); if (!chosen) { feedback.push(`Questão ${qi + 1}: não respondida.`); return; }
        answered++; const value = Number(chosen.value), selectedText = item.options[value]; const ok = selectedText === item.correct;
        if (ok) { correct++; field?.classList.add('correct'); } else { field?.classList.add('wrong'); feedback.push(`Questão ${qi + 1}: revise “${item.correctTerm}”. ${item.correct}`); }
      });
      const scoreNow = quiz.length ? Math.round(correct / quiz.length * 100) : 0;
      state.quizScores[course.id] = Math.max(Number(state.quizScores[course.id] || 0), scoreNow); state.quizAttempts[course.id] = Number(state.quizAttempts[course.id] || 0) + 1;
      if (state.statuses[course.id] === 'todo') state.statuses[course.id] = 'studying'; saveState(); refreshDialogProgress(course);
      const result = $('[data-quiz-result]', dialogContent);
      result.innerHTML = `<div class="quiz-score ${scoreNow >= 70 ? 'pass' : 'retry'}"><strong>${scoreNow}%</strong><div><b>${scoreNow >= 70 ? 'Bom resultado' : 'Vale revisar'}</b><p>${correct} de ${quiz.length} corretas${answered < quiz.length ? ` · ${quiz.length - answered} sem resposta` : ''}.</p></div></div>${feedback.length ? `<div class="quiz-feedback"><h4>O que revisar</h4>${feedback.map(f => `<p>${esc(f)}</p>`).join('')}</div>` : `<p class="success-note">Você acertou todas. Tente novamente outro dia sem consultar para confirmar que reteve.</p>`}`;
    });

    $$('[data-plan-field]', dialogContent).forEach(field => field.addEventListener('input', () => {
      state.coursePlans[course.id] ||= {};
      state.coursePlans[course.id][field.dataset.planField] = field.value;
      saveState();
    }));

    const notes = $('[data-notes-id]', dialogContent); if (notes) notes.addEventListener('input', () => { state.notes[course.id] = notes.value; saveState(); });
  }

  function setTopic(course, idx, value, checkbox) {
    state.topicChecks[course.id] ||= {}; state.topicChecks[course.id][topicKey(course, idx)] = value;
    if (checkbox) checkbox.closest('.study-item')?.classList.toggle('checked', value);
    const all = course.topics.length && course.topics.every((_, i) => topicChecked(course, i));
    if (all && state.quizScores[course.id] >= 70 && masteredCardCount(course) === flashcardsForCourse(course).length) state.statuses[course.id] = 'done';
    else if (Object.values(state.topicChecks[course.id]).some(Boolean)) state.statuses[course.id] = 'studying';
    saveState(); refreshDialogProgress(course); $$('[data-status]', dialogContent).forEach(b => b.classList.toggle('active', b.dataset.status === (state.statuses[course.id] || 'todo')));
  }

  function bindDynamic() {
    $$('[data-course-id]', view).forEach(card => {
      const open = e => { if (e.target.closest('[data-fav-id]')) return; openCourse(courseById(card.dataset.courseId)); };
      card.addEventListener('click', open); card.addEventListener('keydown', e => { if (e.target.closest('[data-fav-id]')) return; if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(e); } });
    });
    $$('[data-course-open]', view).forEach(btn => btn.addEventListener('click', () => openCourse(courseById(btn.dataset.courseOpen), btn.dataset.openTab || 'guide')));
    $$('[data-fav-id]', view).forEach(btn => btn.addEventListener('click', e => { e.stopPropagation(); const id = btn.dataset.favId; state.favorites[id] = !state.favorites[id]; saveState(); render(); }));
    $$('[data-sem-chip]', view).forEach(btn => btn.addEventListener('click', () => navigate('semester', { semester: btn.dataset.semChip })));
    $$('[data-go-sem]', view).forEach(btn => btn.addEventListener('click', () => navigate('semester', { semester: btn.dataset.goSem })));
    $$('[data-go-review]', view).forEach(btn => btn.addEventListener('click', () => navigate('review')));
    $$('[data-export]', view).forEach(btn => btn.addEventListener('click', exportBackup));
    $$('[data-import]', view).forEach(btn => btn.addEventListener('click', () => $('#importInput').click()));
    $$('[data-reset]', view).forEach(btn => btn.addEventListener('click', resetProgress));
  }

  function exportBackup() {
    const payload = { app: 'Arqueologia Study Hub UNEB', version: 4, exportedAt: new Date().toISOString(), state };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = `arqueologia-study-hub-backup-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function resetProgress() {
    if (!confirm('Apagar todo o progresso, quizzes, flashcards, anotações e favoritas deste navegador?')) return;
    state = structuredCloneSafe(defaultState); state.currentSemester = Number($('#currentSemester').value || 1); saveState(); render();
  }

  $('#importInput').addEventListener('change', async e => {
    const file = e.target.files?.[0]; if (!file) return;
    try { const parsed = JSON.parse(await file.text()); if (!parsed.state) throw new Error(); state = mergeState(parsed.state); saveState(); $('#currentSemester').value = state.currentSemester; render(); alert('Backup importado com sucesso.'); }
    catch (_) { alert('Não consegui importar esse arquivo de backup.'); } finally { e.target.value = ''; }
  });

  $$('.nav-item').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.view)));
  $('#menuBtn').addEventListener('click', () => { sidebar.classList.add('open'); overlay.classList.add('show'); }); overlay.addEventListener('click', closeSidebar);
  $('#exportBtn').addEventListener('click', exportBackup); $('#dialogClose').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); }); dialog.addEventListener('close', () => render());
  $('#searchInput').addEventListener('input', e => { searchQuery = e.target.value; render(); });

  const semSelect = $('#currentSemester'); semSelect.innerHTML = Array.from({ length: 8 }, (_, i) => i + 1).map(s => `<option value="${s}">${s}º semestre</option>`).join(''); semSelect.value = state.currentSemester || 1;
  semSelect.addEventListener('change', e => { state.currentSemester = Number(e.target.value); if (state.view === 'semester') state.semesterFilter = state.currentSemester; saveState(); render(); });

  setActiveNav(state.view); render();
})();
