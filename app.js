/* Сладкая Учёба — логика игры. Слова и задания лежат в words.js. */
'use strict';

// ============================================================
//  Хранилище
// ============================================================
const store = {
    get(key, def) {
        try {
            const v = localStorage.getItem(key);
            return v == null ? def : JSON.parse(v);
        } catch (e) { return def; }
    },
    set(key, val) {
        try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* приватный режим */ }
    }
};

const ROUND_LEN = 10;
const LEARNED_STREAK = 3;           // столько раз подряд с первой попытки — слово выучено
const TTS_LANG = { en: 'en-US', ru: 'ru-RU', he: 'he-IL' };
const LANG_FLAG = { en: '🇬🇧', ru: '🇷🇺', he: '🇮🇱', math: '🔢' };

let items = store.get('kt_items', {});      // статистика по словам/буквам: {key: {l, lang, k, c, w, s, t}}
let days = store.get('kt_days', {});        // по дням: {'2026-11-12': {a, c, sec, r}}
let settings = Object.assign({ goal: 20, sound: true, onlyPics: false }, store.get('kt_settings', {}));
let totalScoreAllTime = parseInt(store.get('kids_total_score', 0), 10) || 0;

function saveItems() { store.set('kt_items', items); }
function saveDays() { store.set('kt_days', days); }
function saveSettings() { store.set('kt_settings', settings); }

function dayKey(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}
function today() {
    const k = dayKey();
    if (!days[k]) days[k] = { a: 0, c: 0, sec: 0, r: 0 };
    return days[k];
}

// ============================================================
//  Утилиты
// ============================================================
const $ = id => document.getElementById(id);
function esc(s) {
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function langClass(lang) { return lang === 'en' ? 'en-font' : (lang === 'he' ? 'he-font' : ''); }
function dirAttr(lang) { return lang === 'he' ? 'dir="rtl"' : ''; }
// Разбивка слова на «буквы»: для иврита буква вместе с огласовками.
function splitGraphemes(word) {
    return word.match(/[^֑-ׇ][֑-ׇ]*/g) || [];
}
const isHebrewMark = /[֑-ׇ]/g;

// ============================================================
//  Озвучка
// ============================================================
let voices = [];
function loadVoices() { try { voices = speechSynthesis.getVoices() || []; } catch (e) { voices = []; } }
if ('speechSynthesis' in window) {
    loadVoices();
    speechSynthesis.onvoiceschanged = loadVoices;
}
function findVoice(lang) {
    const full = (TTS_LANG[lang] || lang).toLowerCase();
    const short = full.slice(0, 2);
    const norm = v => (v.lang || '').replace('_', '-').toLowerCase();
    return voices.find(v => norm(v) === full) ||
        voices.find(v => norm(v).startsWith(short)) ||
        (short === 'he' ? voices.find(v => norm(v).startsWith('iw')) : null) || null;
}
function hasVoice(lang) { return !!findVoice(lang); }
function speak(text, lang) {
    if (!('speechSynthesis' in window) || !text) return;
    try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(String(text));
        u.lang = TTS_LANG[lang] || lang;
        const v = findVoice(lang);
        if (v) u.voice = v;
        u.rate = 0.85;
        speechSynthesis.speak(u);
    } catch (e) { /* нет озвучки */ }
}

// Любой элемент с data-say / data-say-lang озвучивается по нажатию и не считается ответом.
document.addEventListener('click', e => {
    const el = e.target.closest('[data-say]');
    if (!el) return;
    e.stopPropagation();
    e.preventDefault();
    if (el.dataset.reveal) el.textContent = el.dataset.reveal;
    speak(el.getAttribute('data-say'), el.getAttribute('data-say-lang') || 'ru');
}, true);

// ============================================================
//  Звуки и конфетти
// ============================================================
let audioCtx = null;
function tone(freq, start, dur, type, vol) {
    const ctx = audioCtx;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, ctx.currentTime + start + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
    o.connect(g); g.connect(ctx.destination);
    o.start(ctx.currentTime + start);
    o.stop(ctx.currentTime + start + dur + 0.05);
}
function sfx(kind) {
    if (!settings.sound) return;
    try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();
        if (kind === 'ok') {
            tone(784, 0, 0.15, 'triangle'); tone(1047, 0.1, 0.15, 'triangle'); tone(1319, 0.2, 0.25, 'triangle');
        } else if (kind === 'bad') {
            tone(220, 0, 0.25, 'sine', 0.12); tone(185, 0.15, 0.3, 'sine', 0.1);
        } else if (kind === 'win') {
            [523, 659, 784, 1047, 784, 1047, 1319].forEach((f, i) => tone(f, i * 0.13, 0.22, 'triangle', 0.2));
        } else if (kind === 'tap') {
            tone(660, 0, 0.06, 'sine', 0.08);
        }
    } catch (e) { /* без звука */ }
}

const confettiCanvas = $('confetti');
const cctx = confettiCanvas.getContext('2d');
let particles = [];
let confettiRunning = false;
const CONFETTI_COLORS = ['#ec4899', '#f472b6', '#c084fc', '#facc15', '#34d399', '#60a5fa', '#fb923c'];
function confetti(originEl, amount) {
    const W = window.innerWidth, H = window.innerHeight;
    confettiCanvas.width = W; confettiCanvas.height = H;
    let x = W / 2, y = H / 3;
    if (originEl && originEl.getBoundingClientRect) {
        const r = originEl.getBoundingClientRect();
        x = r.left + r.width / 2; y = r.top + r.height / 2;
    }
    amount = amount || 40;
    for (let i = 0; i < amount; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = 3 + Math.random() * (amount > 60 ? 9 : 6);
        particles.push({
            x: amount > 60 ? Math.random() * W : x, y: amount > 60 ? -10 - Math.random() * H * 0.3 : y,
            vx: Math.cos(a) * sp, vy: amount > 60 ? 2 + Math.random() * 3 : Math.sin(a) * sp - 4,
            s: 5 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3,
            c: rnd(CONFETTI_COLORS), life: 0
        });
    }
    if (!confettiRunning) { confettiRunning = true; requestAnimationFrame(confettiStep); }
}
function confettiStep() {
    cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles = particles.filter(p => p.life < 160 && p.y < confettiCanvas.height + 20);
    particles.forEach(p => {
        p.life++; p.vy += 0.18; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
        cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.r);
        cctx.fillStyle = p.c; cctx.globalAlpha = Math.max(0, 1 - p.life / 160);
        cctx.fillRect(-p.s / 2, -p.s / 3, p.s, p.s * 0.66);
        cctx.restore();
    });
    if (particles.length) requestAnimationFrame(confettiStep);
    else { confettiRunning = false; cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height); }
}

// ============================================================
//  Статистика слов и повтор ошибок
// ============================================================
function itemStat(key) { return items[key]; }
function isLearned(s) { return !!s && s.s >= LEARNED_STREAK; }
function isWeak(s) { return !!s && s.w > 0 && !isLearned(s); }

function recordItem(info, correct) {
    if (!info || !info.key) return;
    const s = items[info.key] || { l: info.label, lang: info.lang, k: info.kind, c: 0, w: 0, s: 0 };
    s.l = info.label; s.lang = info.lang; s.k = info.kind;
    if (correct) { s.c++; s.s++; } else { s.w++; s.s = 0; }
    s.t = Date.now();
    items[info.key] = s;
    saveItems();
}

// Очередь повтора: слово с ошибкой вернётся через несколько вопросов (в этой же игре).
let retryQueue = [];
let recentKeys = [];
let questionCounter = 0;

function scheduleRetry(key) {
    if (!key) return;
    retryQueue = retryQueue.filter(r => r.key !== key);
    retryQueue.push({ key, due: questionCounter + 3 });
}

/* Выбор следующего элемента: сначала «должники» из очереди повтора,
   затем с вероятностью 40% — слово, в котором раньше были ошибки,
   иначе — взвешенный выбор: новые и невыученные чаще, выученные реже. */
function pickItem(pool, keyFn) {
    if (!pool.length) return null;
    const dueIdx = retryQueue.findIndex(r => r.due <= questionCounter && pool.some(p => keyFn(p) === r.key));
    let chosen = null;
    if (dueIdx >= 0) {
        const r = retryQueue.splice(dueIdx, 1)[0];
        chosen = pool.find(p => keyFn(p) === r.key);
    }
    if (!chosen) {
        const recentLimit = Math.min(8, Math.floor(pool.length / 2));
        const recent = new Set(recentKeys.slice(-recentLimit));
        let cand = pool.filter(p => !recent.has(keyFn(p)));
        if (!cand.length) cand = pool;
        const weak = cand.filter(p => isWeak(items[keyFn(p)]));
        if (weak.length && Math.random() < 0.4) {
            chosen = rnd(weak);
        } else {
            const weights = cand.map(p => {
                const s = items[keyFn(p)];
                if (!s) return 3;
                if (isLearned(s)) return 0.4;
                if (isWeak(s)) return 4;
                return 2;
            });
            let total = weights.reduce((a, b) => a + b, 0);
            let r = Math.random() * total;
            for (let i = 0; i < cand.length; i++) {
                r -= weights[i];
                if (r <= 0) { chosen = cand[i]; break; }
            }
            if (!chosen) chosen = cand[cand.length - 1];
        }
    }
    recentKeys.push(keyFn(chosen));
    if (recentKeys.length > 30) recentKeys.shift();
    return chosen;
}

function wordKey(lang, w) { return lang + ':w:' + w.en; }
function wordInfo(lang, w) {
    return { key: wordKey(lang, w), label: lang === 'ru' ? w.ru : w[lang] + ' — ' + w.ru, lang, kind: 'word' };
}

// ============================================================
//  Описание разделов и игр
// ============================================================
const MODES = {
    find_letter:    { title: '🔤 Найди букву', desc: 'Слушай и найди букву', icon: '🗣️' },
    find_syllable:  { title: '🔠 Найди слог', desc: 'Слушай и найди слог', icon: '🎧' },
    word_syllables: { title: '🧩 Слово из слогов', desc: 'Собери слово по частям', icon: '📦' },
    words:          { title: '🖼️ Слова (500 слов)', desc: 'Прочитай сам — найди картинку', icon: '🍎', topics: true },
    picture:        { title: '🎴 Выбери слово по картинке', desc: 'Картинка → слово', icon: '🌞', topics: true },
    listen:         { title: '🔊 Слова на слух', desc: 'Звук → как пишется', icon: '👂', topics: true },
    spell:          { title: '⌨️ Собери слово по буквам', desc: 'Послушай и напиши', icon: '✏️', topics: true, spell: true },
    match:          { title: '🧩 Найди пару', desc: 'Соедини слово и картинку', icon: '🃏', topics: true },
    fill_blank:     { title: '✍️ Заполни пропуск', desc: 'Найди слово для фразы', icon: '📝', topics: true, fill: true },
    sentences:      { title: '💬 Фразы', desc: 'Собери предложение', icon: '✍️' },
    reading:        { title: '📜 Тексты', desc: 'Прочитай и ответь', icon: '📖' },
    math_table:     { title: '✖️ Умножение', desc: 'Таблица умножения', icon: '💖' },
    math_plus_minus:{ title: '➕ Счёт', desc: 'Плюс и минус', icon: '✨' },
    math_problems:  { title: '🧸 Задачи', desc: 'Слушай и решай', icon: '🎧' },
    math_compare:   { title: '⚖️ Сравнение', desc: 'Больше или меньше', icon: '⭐' }
};

const CATEGORIES = {
    en: { title: '🇬🇧 Английский', modes: ['find_letter', 'find_syllable', 'word_syllables', 'words', 'picture', 'listen', 'spell', 'match', 'fill_blank', 'sentences'] },
    he: { title: '🇮🇱 Иврит', modes: ['find_letter', 'find_syllable', 'word_syllables', 'words', 'picture', 'listen', 'spell', 'match', 'sentences', 'reading'] },
    ru: { title: '🇷🇺 Русский', modes: ['find_letter', 'find_syllable', 'word_syllables', 'words', 'picture', 'listen', 'spell', 'match', 'sentences'] },
    math: { title: '🔢 Математика', modes: ['math_table', 'math_plus_minus', 'math_problems', 'math_compare'] }
};

// Слоги иврита для «Найди слог»: согласная + огласовка. say — как произносить.
const HE_SYLLABLES = (() => {
    const cons = ['בּ', 'ג', 'ד', 'ל', 'מ', 'נ', 'ס', 'פּ', 'ר', 'שׁ', 'תּ', 'ק', 'כּ', 'ה', 'ז', 'ט'];
    const out = [];
    cons.forEach(c => {
        out.push({ show: c + 'ָ', say: c + 'ָה' });
        out.push({ show: c + 'ִי', say: c + 'ִי' });
        out.push({ show: c + 'וֹ', say: c + 'וֹ' });
        out.push({ show: c + 'וּ', say: c + 'וּ' });
        out.push({ show: c + 'ֶ', say: c + 'ֶה' });
    });
    return out;
})();

function syllablePool(lang) {
    if (lang === 'he') return HE_SYLLABLES.map(s => ({ show: s.show, say: s.say }));
    const seen = new Map();
    SYLLABLE_WORDS[lang].forEach(sw => sw.parts.forEach(p => {
        const k = p.toLowerCase();
        if (k.length > 1 && !seen.has(k)) seen.set(k, { show: k, say: k, word: sw });
    }));
    return [...seen.values()];
}

// ============================================================
//  Состояние игры
// ============================================================
let currentCategory = null;
let currentMode = null;
let currentTopic = 'all';
let score = 0, streak = 0, totalCorrect = 0, totalAttempts = 0, sessionProgress = 0, firstTryCount = 0, roundStars = 0;
let Q = null;
let advanceTimer = null;
let lastActivity = 0;
let pendingReload = false;

const screens = ['menuScreen', 'exercisesScreen', 'topicScreen', 'gameScreen', 'parentScreen'];
function showScreen(id) {
    screens.forEach(s => { $(s).style.display = s === id ? 'block' : 'none'; });
    const inGame = id === 'gameScreen';
    $('statsBar').style.display = inGame ? 'flex' : 'none';
    $('progressContainer').style.display = inGame ? 'block' : 'none';
    window.scrollTo(0, 0);
    if (id === 'menuScreen' && pendingReload) location.reload();
}

const gameContent = $('gameContent');

// ============================================================
//  Главное меню: цель дня, огонёк, карта достижений
// ============================================================
const iconsList = ['🌱','🐱','🔥','🐰','⭐','🐼','🧸','🏆','🦊','🦉','👑','🧚‍♀️','🧜‍♀️','🐉','🦄','🌟','🍎','🍪','🎨','🚀','💎','🎯','🎈','🍦','🍕','⚽','🎸','📚','🍀','⚡'];
const milestones = [];
for (let i = 1; i <= 100; i++) milestones.push({ level: i, score: 10 * i, icon: iconsList[(i - 1) % iconsList.length], name: 'Уровень ' + i });

function buildAchievements() {
    $('mapPath').innerHTML = milestones.map(m =>
        `<div class="map-node" data-score="${m.score}">${m.icon}<span class="node-score">${m.score}⭐</span></div>`).join('');
    $('rewardsGrid').innerHTML = milestones.map(m =>
        `<div class="reward-card-item" data-score="${m.score}" data-name="${m.name}">${m.icon}<span class="reward-tooltip">${m.score}⭐</span></div>`).join('');
    updateRewardsDisplay();
}
function updateRewardsDisplay() {
    document.querySelectorAll('.map-node').forEach(n => n.classList.toggle('active-node', totalScoreAllTime >= +n.dataset.score));
    document.querySelectorAll('.reward-card-item').forEach(n => n.classList.toggle('unlocked', totalScoreAllTime >= +n.dataset.score));
}
function addScore(points) {
    const before = totalScoreAllTime;
    totalScoreAllTime += points;
    store.set('kids_total_score', totalScoreAllTime);
    const m = milestones.find(m => before < m.score && totalScoreAllTime >= m.score);
    if (m) showToast(`🗺️ Новый рубеж! Открыто достижение «${m.name}» ${m.icon}`);
    updateRewardsDisplay();
}
let toastTimer = null;
function showToast(text) {
    $('rewardText').textContent = text;
    $('rewardPopup').classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $('rewardPopup').classList.remove('show'), 3500);
}

function goalDone(d) { return d && d.c >= settings.goal; }
function dayStreak() {
    let n = 0;
    const d = new Date();
    if (!goalDone(days[dayKey(d)])) d.setDate(d.getDate() - 1);   // сегодня ещё можно успеть
    while (goalDone(days[dayKey(d)])) { n++; d.setDate(d.getDate() - 1); }
    return n;
}
function renderDaily() {
    const t = today();
    const pct = Math.min(100, Math.round(t.c / settings.goal * 100));
    const streakN = dayStreak();
    const done = t.c >= settings.goal;
    $('dailyCard').innerHTML = `
        <div class="daily-row">
            <div class="daily-goal">
                <div class="daily-title">🎯 Цель на сегодня</div>
                <div class="daily-num">${Math.min(t.c, settings.goal)} / ${settings.goal} ${done ? '✅' : '⭐'}</div>
            </div>
            <div class="daily-fire ${streakN ? 'lit' : ''}">
                <div class="fire-icon">🔥</div>
                <div class="fire-num">${streakN}</div>
                <div class="fire-label">${plural(streakN, 'день', 'дня', 'дней')} подряд</div>
            </div>
        </div>
        <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div>
        <div class="daily-hint">${done ? 'Цель выполнена! Огонёк горит 🔥' : `Ещё ${settings.goal - t.c} ${plural(settings.goal - t.c, 'правильный ответ', 'правильных ответа', 'правильных ответов')} — и огонёк загорится!`}</div>`;
}
function plural(n, one, few, many) {
    n = Math.abs(n) % 100;
    const n1 = n % 10;
    if (n > 10 && n < 20) return many;
    if (n1 > 1 && n1 < 5) return few;
    if (n1 === 1) return one;
    return many;
}

function goMenu() {
    stopTimers();
    currentCategory = null;
    renderDaily();
    updateRewardsDisplay();
    showScreen('menuScreen');
}

// ============================================================
//  Список упражнений и выбор темы
// ============================================================
function openCategory(cat) {
    currentCategory = cat;
    const c = CATEGORIES[cat];
    $('categoryTitle').textContent = c.title;
    let html = '';
    if (cat !== 'math' && voices.length && !hasVoice(cat)) {
        html += `<div class="voice-warning">🔇 На этом устройстве нет голоса для языка «${c.title}». Задания на слух будут без звука — голос можно добавить в настройках телефона (Синтез речи).</div>`;
    }
    c.modes.forEach(m => {
        const md = MODES[m];
        html += `<div class="exercise-card" data-mode="${m}">
            <div class="ex-icon">${md.icon}</div>
            <div><h4>${md.title}</h4><div class="ex-desc">${md.desc}</div></div>
        </div>`;
    });
    $('exerciseListContainer').innerHTML = html;
    $('exerciseListContainer').querySelectorAll('[data-mode]').forEach(el => {
        el.onclick = () => chooseMode(el.dataset.mode);
    });
    showScreen('exercisesScreen');
}

function chooseMode(mode) {
    currentMode = mode;
    if (MODES[mode].topics) openTopics();
    else startGame();
}

function wordsForMode(mode, lang, topic) {
    let list = WORDS;
    if (topic && topic !== 'all') list = list.filter(w => w.topic === topic);
    if (settings.onlyPics) list = list.filter(hasPic);
    if (MODES[mode].spell) list = list.filter(w => isSpellable(w[lang], lang));
    if (MODES[mode].fill) {
        const ok = new Set(TOPICS.filter(t => FILL_TEMPLATES[t.kind]).map(t => t.id));
        list = list.filter(w => ok.has(w.topic));
    }
    return list;
}
function isSpellable(word, lang) {
    if (/[\s\-־'’]/.test(word)) return false;
    const n = lang === 'he' ? splitGraphemes(word).length : word.length;
    return n >= 2 && n <= 9;
}

function openTopics() {
    const lang = currentCategory;
    $('topicTitle').textContent = MODES[currentMode].title;
    const all = wordsForMode(currentMode, lang, 'all');
    const learnedIn = list => list.filter(w => isLearned(items[wordKey(lang, w)])).length;
    const withPics = WORDS.filter(hasPic).length;
    let html = `<label class="pics-toggle">
        <input type="checkbox" id="onlyPicsToggle" ${settings.onlyPics ? 'checked' : ''}>
        <span class="toggle-track"><span class="toggle-thumb"></span></span>
        <span>🖼️ Только слова с картинками <span class="muted">(${withPics} из ${WORDS.length})</span></span>
    </label>
    <div class="topic-card topic-all" data-topic="all">
        <div class="topic-emoji">🌈</div><div class="topic-name">Все темы</div>
        <div class="topic-count">✓ ${learnedIn(all)} / ${all.length}</div></div>`;
    TOPICS.forEach(t => {
        const list = wordsForMode(currentMode, lang, t.id);
        if (list.length < 4) return;
        html += `<div class="topic-card" data-topic="${t.id}">
            <div class="topic-emoji">${t.emoji}</div><div class="topic-name">${t.name}</div>
            <div class="topic-count">✓ ${learnedIn(list)} / ${list.length}</div></div>`;
    });
    $('topicGrid').innerHTML = html;
    $('onlyPicsToggle').onchange = e => { settings.onlyPics = e.target.checked; saveSettings(); openTopics(); };
    $('topicGrid').querySelectorAll('[data-topic]').forEach(el => {
        el.onclick = () => { currentTopic = el.dataset.topic; startGame(); };
    });
    showScreen('topicScreen');
}

function backFromGame() {
    stopTimers();
    if (MODES[currentMode] && MODES[currentMode].topics) openTopics();
    else openCategory(currentCategory);
}

// ============================================================
//  Ход игры: вопрос → ответ → следующий вопрос → «Ура!»
// ============================================================
function stopTimers() {
    clearTimeout(advanceTimer);
    advanceTimer = null;
    try { speechSynthesis.cancel(); } catch (e) { /* */ }
}

function startGame() {
    stopTimers();
    score = 0; streak = 0; totalCorrect = 0; totalAttempts = 0;
    sessionProgress = 0; firstTryCount = 0; roundStars = 0;
    retryQueue = []; recentKeys = []; questionCounter = 0;
    lastActivity = Date.now();
    showScreen('gameScreen');
    updateStats();
    updateProgressUI();
    nextQuestion();
}

function updateStats() {
    $('scoreVal').textContent = score;
    $('streakVal').textContent = streak;
    $('accuracyVal').textContent = (totalAttempts ? Math.round(totalCorrect / totalAttempts * 100) : 100) + '%';
}
function updateProgressUI() {
    $('progressBarFill').style.width = Math.min(100, sessionProgress / ROUND_LEN * 100) + '%';
    $('progressText').textContent = Math.min(sessionProgress, ROUND_LEN) + ' / ' + ROUND_LEN;
}

function trackTime() {
    const now = Date.now();
    const t = today();
    t.sec += Math.min(60, Math.max(0, (now - lastActivity) / 1000));
    lastActivity = now;
}

function beginQuestion(q) {
    Q = Object.assign({ wrong: 0, done: false, maxWrong: 2, pts: 10 }, q);
    questionCounter++;
}

// Правильный ответ
function answerCorrect(el, opts) {
    opts = opts || {};
    if (!Q || Q.done) return;
    totalAttempts++; totalCorrect++; streak++;
    const pts = opts.pts || Q.pts;
    score += pts; roundStars += pts;
    addScore(pts);
    const t = today(); t.a++; t.c++;
    trackTime(); saveDays();
    sfx('ok');
    confetti(el, 36);
    updateStats();
    if (opts.partial) {          // часть задания (пара в «Найди пару»)
        return;
    }
    Q.done = true;
    if (Q.wrong === 0) firstTryCount++;
    if (Q.info && Q.wrong === 0) recordItem(Q.info, true);
    finishQuestion(opts.delay || 1300);
}

// Неправильный ответ
function answerWrong(el, opts) {
    opts = opts || {};
    if (!Q || Q.done) return;
    totalAttempts++; streak = 0;
    const t = today(); t.a++;
    trackTime(); saveDays();
    sfx('bad');
    updateStats();
    const info = opts.info || Q.info;
    if (opts.info) {             // ошибка в конкретном слове (пары)
        recordItem(opts.info, false);
        scheduleRetry(opts.info.key);
        return;
    }
    Q.wrong++;
    if (Q.wrong === 1 && info) { recordItem(info, false); scheduleRetry(info.key); }
    if (Q.wrong >= Q.maxWrong) {
        Q.done = true;
        if (Q.reveal) Q.reveal();
        finishQuestion(1900);
    }
}

function finishQuestion(delay) {
    sessionProgress++;
    updateProgressUI();
    clearTimeout(advanceTimer);
    advanceTimer = setTimeout(() => {
        if (sessionProgress >= ROUND_LEN) showRoundEnd();
        else nextQuestion();
    }, delay);
}

function showRoundEnd() {
    const t = today();
    t.r++; saveDays();
    sfx('win');
    confetti(null, 160);
    setTimeout(() => confetti(null, 100), 700);
    const praise = firstTryCount >= 9 ? 'Ты супер-звезда! 🌟' : firstTryCount >= 6 ? 'Отлично получается! 💪' : 'Молодец, ты стараешься! 💖';
    const goalLeft = Math.max(0, settings.goal - t.c);
    gameContent.innerHTML = `
        <div class="round-end">
            <div class="ura">🎉 Ура! 🎉</div>
            <div class="round-sub">Раунд пройден!</div>
            <div class="round-stats">
                <div><b>${firstTryCount}</b> из ${ROUND_LEN}<br><span>с первой попытки</span></div>
                <div><b>+${roundStars}</b> ⭐<br><span>звёздочек</span></div>
            </div>
            <div class="round-praise">${praise}</div>
            <div class="round-goal">${goalLeft ? `🎯 До цели дня осталось ${goalLeft}` : '🔥 Цель дня выполнена!'}</div>
            <div class="round-buttons">
                <button class="big-btn" id="againBtn">🔁 Ещё раунд</button>
                <button class="big-btn secondary" id="toListBtn">📋 К списку</button>
            </div>
        </div>`;
    speak(currentCategory === 'en' ? 'Hooray! Great job!' : currentCategory === 'he' ? 'יֵשׁ! כׇּל הַכָּבוֹד!' : 'Ура! Молодец!', currentCategory === 'math' ? 'ru' : currentCategory);
    $('againBtn').onclick = startGame;
    $('toListBtn').onclick = backFromGame;
}

function nextQuestion() {
    const lang = currentCategory;
    switch (currentMode) {
        case 'find_letter': return genFindLetter(lang);
        case 'find_syllable': return genFindSyllable(lang);
        case 'word_syllables': return genWordSyllables(lang);
        case 'words': return genWordToPicture(lang);
        case 'picture': return genPictureToWord(lang);
        case 'listen': return genListen(lang);
        case 'spell': return genSpell(lang);
        case 'match': return genMatch(lang);
        case 'fill_blank': return genFillBlank();
        case 'sentences': return genSentence(lang);
        case 'reading': return genReading();
        case 'math_table': return genMathTable();
        case 'math_plus_minus': return genMathPlusMinus();
        case 'math_problems': return genMathProblem();
        case 'math_compare': return genMathCompare();
    }
}

// ============================================================
//  Общие кусочки разметки
// ============================================================
// Есть ли у слова картинка (эмодзи, цвет, число или фигура)
function hasPic(w) { return !!(w.emoji || w.color || w.digits || w.shape); }
// Ключ картинки — чтобы в вариантах не было двух одинаковых картинок
function picKey(w) { return w.emoji || (w.color && 'c' + w.color) || (w.digits && 'd' + w.digits) || (w.shape && 's' + w.shape) || 't' + w.ru; }
const DIGIT_COLORS = ['#ec4899', '#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'];

function picHTML(w, big) {
    const b = big ? 'big' : '';
    if (w.emoji) return `<span class="emoji-pic ${b}">${w.emoji}</span>`;
    if (w.color) return `<span class="swatch-pic ${b}" style="background:${w.color}"></span>`;
    if (w.digits) {
        const c = DIGIT_COLORS[parseInt(w.digits, 10) % DIGIT_COLORS.length];
        return `<span class="digit-pic ${b} ${w.digits.length > 2 ? 'three' : ''}" style="color:${c}">${esc(w.digits)}</span>`;
    }
    if (w.shape) return `<span class="shape-pic shape-${w.shape} ${b}"></span>`;
    // Кнопка 🔊 — отдельно, сбоку от надписи: нажатие на неё только озвучивает и не выбирает ответ.
    const len = w.ru.replace(/\s.*/, '').length;   // длина самого длинного первого слова
    const size = len > 9 ? 'xlong' : len > 5 ? 'long' : '';
    return `<span class="text-pic-wrap"><span class="text-pic ${big ? 'big' : ''} ${size}" lang="ru">${esc(w.ru)}</span>${sideSay(w.ru, 'ru')}</span>`;
}
function sideSay(text, lang) {
    return `<button type="button" class="side-say" data-say="${esc(text)}" data-say-lang="${lang}" aria-label="Послушать">🔊</button>`;
}
function speakBtn(text, lang, small) {
    return `<button class="speak-btn ${small ? 'small' : ''}" data-say="${esc(text)}" data-say-lang="${lang}" aria-label="Послушать">🔊</button>`;
}
function bindOptions(container, handler) {
    container.querySelectorAll('[data-i]').forEach(el => {
        el.onclick = () => { if (!Q || Q.done || el.classList.contains('disabled')) return; handler(el, +el.dataset.i); };
    });
}
function disableAll(container) { container.querySelectorAll('[data-i]').forEach(el => el.classList.add('disabled')); }
function markWrong(el) { el.classList.add('incorrect', 'disabled'); }

// Обычный вопрос «выбери из 4»: options — массив, correctIdx — номер правильного.
function choiceQuestion({ headerHTML, options, correctIdx, renderOption, gridClass, onPick, info, after }) {
    let html = `<div class="question-box">${headerHTML}</div><div class="options-grid ${gridClass || ''}">`;
    options.forEach((o, i) => { html += `<div class="option-card" data-i="${i}">${renderOption(o, i)}</div>`; });
    html += '</div>';
    gameContent.innerHTML = html;
    const grid = gameContent.querySelector('.options-grid');
    beginQuestion({
        info, answer: correctIdx,
        reveal: () => {
            const el = grid.querySelector(`[data-i="${correctIdx}"]`);
            if (el) el.classList.add('correct');
            disableAll(grid);
            if (after) after(false);
        }
    });
    bindOptions(grid, (el, i) => {
        if (onPick) onPick(options[i], i);
        if (i === correctIdx) {
            el.classList.add('correct');
            disableAll(grid);
            if (after) after(true);
            answerCorrect(el);
        } else {
            markWrong(el);
            answerWrong(el);
        }
    });
}

// Подбор отвлекающих слов с другими картинками
function distractors(correct, pool, n, lang) {
    const others = shuffle(pool.filter(w => w !== correct &&
        picKey(w) !== picKey(correct) &&
        (!lang || w[lang] !== correct[lang])));
    let res = others.slice(0, n);
    if (res.length < n) {
        const extra = shuffle(WORDS.filter(w => w !== correct && !res.includes(w) && picKey(w) !== picKey(correct)));
        res = res.concat(extra.slice(0, n - res.length));
    }
    return res;
}

// ============================================================
//  Найди букву
// ============================================================
function genFindLetter(lang) {
    const letters = LETTERS[lang];
    const target = pickItem(letters, l => lang + ':letter:' + l.ch);
    const options = shuffle([target, ...shuffle(letters.filter(l => l !== target)).slice(0, 3)]);
    setTimeout(() => speak(target.say, lang), 300);
    choiceQuestion({
        headerHTML: `<div class="question-title"><span>Найди букву на слух</span>${speakBtn(target.say, lang)}</div>`,
        options, correctIdx: options.indexOf(target),
        renderOption: o => `<span class="letter-opt ${langClass(lang)}">${o.ch}</span>`,
        onPick: o => speak(o.say, lang),
        info: { key: lang + ':letter:' + target.ch, label: 'буква ' + target.ch, lang, kind: 'letter' }
    });
}

// ============================================================
//  Найди слог
// ============================================================
function genFindSyllable(lang) {
    const pool = syllablePool(lang);
    const target = pickItem(pool, s => lang + ':syl:' + s.show);
    const options = shuffle([target, ...shuffle(pool.filter(s => s.show !== target.show)).slice(0, 3)]);
    setTimeout(() => speak(target.say, lang), 300);
    choiceQuestion({
        headerHTML: `<div class="question-title"><span>Найди слог на слух</span>${speakBtn(target.say, lang)}</div>
                     <div class="hint-line" id="sylHint"></div>`,
        options, correctIdx: options.indexOf(target),
        renderOption: o => `<span class="syl-opt ${langClass(lang)}" ${dirAttr(lang)}>${esc(o.show)}</span>`,
        info: { key: lang + ':syl:' + target.show, label: 'слог ' + target.show, lang, kind: 'syl' },
        after: () => {
            if (target.word) {
                $('sylHint').innerHTML = `<span class="${langClass(lang)}">${esc(target.word.parts.join('-'))}</span> ${target.word.emoji || ''}`;
                setTimeout(() => speak(target.word.word, lang), 500);
            }
        }
    });
}

// ============================================================
//  Конструктор (слоги / слова фразы / буквы)
// ============================================================
/* target — массив частей в правильном порядке, pool — все фишки (с лишними).
   onDone(correct) вызывается, когда собрано столько частей, сколько в target. */
function builder({ headerHTML, target, pool, lang, joiner, info, onSuccess, pts, strictLetters, maxWrong }) {
    const rtl = lang === 'he';
    gameContent.innerHTML = `<div class="question-box">${headerHTML}</div>
        <div class="sentence-drop-zone ${langClass(lang)}" ${rtl ? 'dir="rtl"' : ''} id="dropZone"></div>
        <div class="builder-tools"><button class="small-btn" id="undoBtn">⬅️ Убрать</button></div>
        <div class="word-pool ${langClass(lang)}" ${rtl ? 'dir="rtl"' : ''} id="chipPool"></div>`;
    const dz = $('dropZone'), poolEl = $('chipPool');
    let chosen = [];
    poolEl.innerHTML = pool.map((p, i) => `<div class="word-chip" data-c="${i}">${esc(p)}</div>`).join('');

    function render() {
        if (strictLetters) {
            dz.innerHTML = target.map((_, i) => `<span class="letter-slot ${chosen[i] != null ? 'filled' : ''}">${chosen[i] != null ? esc(pool[chosen[i]]) : ''}</span>`).join('');
        } else {
            dz.innerHTML = chosen.map(i => `<div class="selected-word-chip">${esc(pool[i])}</div>`).join('');
        }
    }
    function reset() {
        chosen = [];
        poolEl.querySelectorAll('.word-chip').forEach(c => c.classList.remove('used'));
        dz.classList.remove('dz-ok', 'dz-bad');
        render();
    }
    beginQuestion({
        info, pts: pts || 15, maxWrong: maxWrong || 2, target, pool,
        reveal: () => {
            dz.classList.remove('dz-bad');
            dz.classList.add('dz-reveal');
            dz.innerHTML = strictLetters
                ? target.map(t => `<span class="letter-slot filled">${esc(t)}</span>`).join('')
                : target.map(t => `<div class="selected-word-chip">${esc(t)}</div>`).join('');
            poolEl.querySelectorAll('.word-chip').forEach(c => c.classList.add('used'));
        }
    });
    render();
    $('undoBtn').onclick = () => {
        if (!Q || Q.done || !chosen.length) return;
        const i = chosen.pop();
        poolEl.querySelector(`[data-c="${i}"]`).classList.remove('used');
        render();
    };
    poolEl.querySelectorAll('.word-chip').forEach(chip => {
        chip.onclick = () => {
            if (!Q || Q.done || chip.classList.contains('used')) return;
            const i = +chip.dataset.c;
            if (strictLetters) {
                // по буквам: неверная буква сразу подсвечивается
                const need = target[chosen.length];
                if (pool[i] !== need) {
                    chip.classList.add('shake');
                    setTimeout(() => chip.classList.remove('shake'), 500);
                    answerWrong(chip);
                    return;
                }
                sfx('tap');
            } else {
                speak(pool[i], lang);
            }
            chosen.push(i);
            chip.classList.add('used');
            render();
            if (chosen.length === target.length) {
                const built = chosen.map(k => pool[k]);
                const ok = built.join(joiner).toLowerCase() === target.join(joiner).toLowerCase();
                if (ok) {
                    dz.classList.add('dz-ok');
                    if (onSuccess) onSuccess();
                    answerCorrect(dz, { delay: 1700 });
                } else {
                    dz.classList.add('dz-bad');
                    answerWrong(dz);
                    if (!Q.done) setTimeout(reset, 800);
                }
            }
        };
    });
}

// ============================================================
//  Слово из слогов
// ============================================================
function genWordSyllables(lang) {
    const bank = SYLLABLE_WORDS[lang];
    const sw = pickItem(bank, s => lang + ':sw:' + s.word);
    const extraPool = bank.flatMap(b => b.parts).filter(p => !sw.parts.includes(p));
    const pool = shuffle([...sw.parts, rnd(extraPool)]);
    setTimeout(() => speak(sw.word, lang), 300);
    const pic = sw.emoji ? `<span class="emoji-pic">${sw.emoji}</span>` : '';
    builder({
        headerHTML: `<div class="question-title col">
            <div class="hint-pill">${pic} ${lang === 'ru' ? '' : '🇷🇺 ' + esc(sw.ru)}</div>
            <div class="row">${speakBtn(sw.word, lang)}<span class="q-text">Собери слово из слогов</span></div></div>`,
        target: sw.parts, pool, lang, joiner: '',
        info: { key: lang + ':sw:' + sw.word, label: sw.word, lang, kind: 'sw' },
        onSuccess: () => setTimeout(() => speak(sw.word, lang), 300)
    });
}

// ============================================================
//  Слова (500): слово → картинка (в вариантах только картинки)
// ============================================================
function genWordToPicture(lang) {
    const pool = wordsForMode('words', lang, currentTopic);
    const w = pickItem(pool, x => wordKey(lang, x));
    const options = shuffle([w, ...distractors(w, pool, 3)]);
    // Здесь ребёнок читает сам: слово не озвучивается, пока не дан ответ.
    choiceQuestion({
        headerHTML: `<div class="question-title"><span class="${langClass(lang)} word-big" ${dirAttr(lang)}>${esc(w[lang])}</span></div>`,
        options, correctIdx: options.indexOf(w),
        renderOption: o => picHTML(o),
        gridClass: 'pic-grid',
        info: wordInfo(lang, w),
        after: () => setTimeout(() => speak(w[lang], lang), 250)
    });
}

// ============================================================
//  Картинка → слово
// ============================================================
function genPictureToWord(lang) {
    const pool = wordsForMode('picture', lang, currentTopic);
    const w = pickItem(pool, x => wordKey(lang, x));
    const options = shuffle([w, ...distractors(w, pool, 3, lang)]);
    choiceQuestion({
        headerHTML: `<div class="question-title col"><div class="q-text">Что на картинке?</div>
            <div class="pic-question">${hasPic(w) ? picHTML(w, true) :
                `<span class="text-pic big" data-say="${esc(w.ru)}" data-say-lang="ru">${esc(w.ru)}<span class="text-pic-sound">🔊</span></span>`}</div></div>`,
        options, correctIdx: options.indexOf(w),
        renderOption: o => `<span class="${langClass(lang)} word-opt" ${dirAttr(lang)}>${esc(o[lang])}</span>`,
        onPick: o => speak(o[lang], lang),
        info: wordInfo(lang, w)
    });
}

// ============================================================
//  Звук → написание
// ============================================================
function similarWords(w, pool, lang, n) {
    const plain = s => s.replace(isHebrewMark, '').toLowerCase();
    const first = plain(w[lang])[0];
    const len = plain(w[lang]).length;
    const cand = shuffle(pool.filter(x => x !== w && x[lang] !== w[lang]));
    cand.sort((a, b) => {
        const sa = (plain(a[lang])[0] === first ? 0 : 2) + Math.abs(plain(a[lang]).length - len) * 0.5;
        const sb = (plain(b[lang])[0] === first ? 0 : 2) + Math.abs(plain(b[lang]).length - len) * 0.5;
        return sa - sb;
    });
    const res = cand.slice(0, Math.max(n * 3, 6));
    return shuffle(res).slice(0, n);
}
function genListen(lang) {
    const pool = wordsForMode('listen', lang, currentTopic);
    const w = pickItem(pool, x => wordKey(lang, x));
    const options = shuffle([w, ...similarWords(w, WORDS, lang, 3)]);
    setTimeout(() => speak(w[lang], lang), 300);
    choiceQuestion({
        headerHTML: `<div class="question-title col"><div class="q-text">Послушай и найди, как пишется</div>
            ${speakBtn(w[lang], lang)}<div class="hint-line" id="listenPic"></div></div>`,
        options, correctIdx: options.indexOf(w),
        renderOption: o => `<span class="${langClass(lang)} word-opt" ${dirAttr(lang)}>${esc(o[lang])}</span>`,
        info: wordInfo(lang, w),
        after: () => { $('listenPic').innerHTML = picHTML(w); }
    });
}

// ============================================================
//  Собери слово по буквам (звук → написание)
// ============================================================
function genSpell(lang) {
    const pool = wordsForMode('spell', lang, currentTopic);
    const w = pickItem(pool, x => wordKey(lang, x));
    const word = lang === 'en' || lang === 'ru' ? w[lang].toLowerCase() : w[lang];
    const target = lang === 'he' ? splitGraphemes(word) : word.split('');
    // 2 лишние буквы из других слов
    const others = shuffle(pool.filter(x => x !== w)).slice(0, 6)
        .flatMap(x => lang === 'he' ? splitGraphemes(x[lang]) : x[lang].toLowerCase().split(''))
        .filter(ch => !target.includes(ch));
    const extra = shuffle([...new Set(others)]).slice(0, 2);
    const chips = shuffle([...target, ...extra]);
    setTimeout(() => speak(w[lang], lang), 300);
    builder({
        headerHTML: `<div class="question-title col">
            <div class="row">${picHTML(w)} ${speakBtn(w[lang], lang)}</div>
            <div class="q-text">Собери слово по буквам</div></div>`,
        target, pool: chips, lang, joiner: '', strictLetters: true, maxWrong: 3,
        info: wordInfo(lang, w),
        onSuccess: () => setTimeout(() => speak(w[lang], lang), 300)
    });
}

// ============================================================
//  Найди пару (5 пар; каждая пара — шаг раунда)
// ============================================================
function genMatch(lang) {
    const pool = wordsForMode('match', lang, currentTopic);
    const need = Math.min(5, ROUND_LEN - sessionProgress);
    const chosen = [];
    while (chosen.length < need) {
        const w = pickItem(pool, x => wordKey(lang, x));
        if (!w) break;
        if (chosen.includes(w) || chosen.some(c => picKey(c) === picKey(w))) {
            const alt = shuffle(pool).find(x => !chosen.includes(x) && !chosen.some(c => picKey(c) === picKey(x)));
            if (!alt) break;
            chosen.push(alt);
        } else chosen.push(w);
    }
    const cards = shuffle(chosen.flatMap((w, i) => [{ type: 'word', w, i }, { type: 'pic', w, i }]));
    let html = `<div class="question-box"><div class="question-title"><span class="q-text">Соедини слово и картинку</span></div></div><div class="match-grid">`;
    cards.forEach((c, n) => {
        html += c.type === 'word'
            ? `<div class="match-card" data-n="${n}"><span class="${langClass(lang)}" ${dirAttr(lang)}>${esc(c.w[lang])}</span></div>`
            : `<div class="match-card" data-n="${n}">${picHTML(c.w)}</div>`;
    });
    html += '</div>';
    gameContent.innerHTML = html;
    const firstTry = chosen.map(() => true);
    let selected = null, matched = 0;
    beginQuestion({ maxWrong: 999, cards });

    gameContent.querySelectorAll('.match-card').forEach(el => {
        el.onclick = () => {
            if (el.classList.contains('matched') || !Q) return;
            const c = cards[+el.dataset.n];
            if (c.type === 'word') speak(c.w[lang], lang);
            if (!selected) { selected = { el, c }; el.classList.add('selected'); return; }
            if (selected.el === el) { el.classList.remove('selected'); selected = null; return; }
            if (selected.c.type === c.type) {       // выбрали другую карточку того же типа — переключаем
                selected.el.classList.remove('selected');
                selected = { el, c }; el.classList.add('selected'); return;
            }
            const a = selected; selected = null;
            if (a.c.i === c.i) {
                a.el.classList.remove('selected');
                a.el.classList.add('matched'); el.classList.add('matched');
                matched++;
                if (firstTry[c.i]) { recordItem(wordInfo(lang, c.w), true); firstTryCount++; }
                answerCorrect(el, { partial: true, pts: 5 });
                sessionProgress++;
                updateProgressUI();
                if (matched === chosen.length) {
                    Q.done = true;
                    clearTimeout(advanceTimer);
                    advanceTimer = setTimeout(() => {
                        if (sessionProgress >= ROUND_LEN) showRoundEnd(); else nextQuestion();
                    }, 900);
                }
            } else {
                a.el.classList.add('incorrect'); el.classList.add('incorrect');
                const wordCard = a.c.type === 'word' ? a.c : c;
                if (firstTry[wordCard.i]) {
                    firstTry[wordCard.i] = false;
                    answerWrong(el, { info: wordInfo(lang, wordCard.w) });
                } else answerWrong(el, { info: null });
                setTimeout(() => {
                    a.el.classList.remove('incorrect', 'selected');
                    el.classList.remove('incorrect');
                }, 500);
            }
        };
    });
}

// ============================================================
//  Заполни пропуск (английский)
// ============================================================
function genFillBlank() {
    const lang = 'en';
    const pool = wordsForMode('fill_blank', lang, currentTopic);
    const w = pickItem(pool, x => wordKey(lang, x));
    const kind = TOPICS.find(t => t.id === w.topic).kind;
    const tpl = rnd(FILL_TEMPLATES[kind]);
    const sameKind = pool.filter(x => TOPICS.find(t => t.id === x.topic).kind === kind);
    const options = shuffle([w, ...distractors(w, sameKind.length >= 4 ? sameKind : pool, 3, 'en')]);
    const full = tpl.en.replace('___', w.en);
    const ruText = tpl.ru + ' ' + w.ru;
    choiceQuestion({
        headerHTML: `<div class="question-title col">
            <div class="hint-pill" data-say="${esc(ruText)}" data-say-lang="ru">🇷🇺 ${esc(ruText)} 🔊</div>
            <div class="row en-font fill-sentence"><span id="blankSentence">${esc(tpl.en).replace('___', '<span class="blank">___</span>')}</span>
            <button class="speak-btn small" id="blankSpeak" aria-label="Послушать">🔊</button></div></div>`,
        options, correctIdx: options.indexOf(w),
        renderOption: o => `<span class="text-pic-wrap"><span class="en-font word-opt">${esc(o.en)}</span>${sideSay(o.en, 'en')}</span>`,
        onPick: o => speak(o.en, 'en'),
        info: wordInfo(lang, w),
        after: () => {
            $('blankSentence').textContent = full;
            setTimeout(() => speak(full, 'en'), 400);
        }
    });
    // Кнопка 🔊 читает фразу так, как она сейчас написана (без jQuery)
    $('blankSpeak').onclick = () => speak($('blankSentence').textContent.replace('___', '…'), 'en');
}

// ============================================================
//  Фразы
// ============================================================
function genSentence(lang) {
    const bank = SENTENCES[lang];
    const s = pickItem(bank, x => lang + ':sent:' + x.text);
    const words = s.text.split(' ');
    setTimeout(() => speak(s.text, lang), 300);
    const hint = lang === 'ru'
        ? `<div class="hint-pill"><span class="emoji-pic">${s.emoji}</span></div>`
        : `<div class="hint-pill" data-say="${esc(s.ru)}" data-say-lang="ru">${s.emoji} 🇷🇺 ${esc(s.ru)} 🔊</div>`;
    builder({
        headerHTML: `<div class="question-title col">${hint}
            <div class="row">${speakBtn(s.text, lang)}<span class="q-text">Собери фразу</span></div></div>`,
        target: words, pool: shuffle(words), lang, joiner: ' ',
        info: { key: lang + ':sent:' + s.text, label: s.text, lang, kind: 'sent' },
        onSuccess: () => setTimeout(() => speak(s.text, lang), 300)
    });
}

// ============================================================
//  Тексты на иврите
// ============================================================
const READING_QS = [];
HEBREW_READING.forEach((t, ti) => t.questions.forEach((q, qi) => READING_QS.push({ t, q, key: `he:read:${ti}-${qi}` })));

function genReading() {
    const item = pickItem(READING_QS, x => x.key);
    const { t, q } = item;
    const options = shuffle(q.options);
    choiceQuestion({
        headerHTML: `<div class="reading-box">
                <div class="reading-text he-font" dir="rtl">${esc(t.text)}</div>
                <div class="row">${speakBtn(t.text, 'he', true)}<span class="reading-ru" data-say="${esc(t.ru)}" data-say-lang="ru" data-reveal="${esc('🇷🇺 ' + t.ru)}">🇷🇺 перевод</span></div>
            </div>
            <div class="reading-q"><span class="he-font" dir="rtl">${esc(q.q)}</span> ${speakBtn(q.q, 'he', true)}</div>
            <div class="reading-q-ru">${esc(q.ru)}</div>`,
        options, correctIdx: options.indexOf(q.answer),
        renderOption: o => `<span class="he-font word-opt" dir="rtl">${esc(o)}</span>`,
        gridClass: 'text-grid',
        onPick: o => speak(o, 'he'),
        info: { key: item.key, label: q.q + ' (' + q.ru + ')', lang: 'he', kind: 'read' }
    });
    setTimeout(() => speak(t.text, 'he'), 300);
}

// ============================================================
//  Математика
// ============================================================
function numberOptions(correct, spread, min) {
    const opts = [correct];
    let guard = 0;
    while (opts.length < 4 && guard++ < 100) {
        const off = (Math.floor(Math.random() * spread) + 1) * (Math.random() > 0.5 ? 1 : -1);
        const f = correct + off;
        if (f >= min && !opts.includes(f)) opts.push(f);
    }
    return shuffle(opts);
}
function mathQuestion(title, options, correct, info, extraHeader) {
    choiceQuestion({
        headerHTML: `<div class="question-title">${title}</div>${extraHeader || ''}`,
        options, correctIdx: options.indexOf(correct),
        renderOption: o => `<span class="num-opt">${o}</span>`,
        gridClass: options.length === 3 ? 'three' : '',
        info
    });
}
function genMathTable() {
    const facts = [];
    for (let a = 2; a <= 9; a++) for (let b = 2; b <= 9; b++) facts.push({ a, b });
    const f = pickItem(facts, x => `math:x:${x.a}x${x.b}`);
    const ans = f.a * f.b;
    mathQuestion(`${f.a} × ${f.b} = ?`, numberOptions(ans, 8, 1), ans,
        { key: `math:x:${f.a}x${f.b}`, label: `${f.a} × ${f.b} = ${ans}`, lang: 'math', kind: 'math' });
}
function genMathPlusMinus() {
    const plus = Math.random() > 0.5;
    let a, b, ans;
    if (plus) { a = Math.floor(Math.random() * 70) + 10; b = Math.floor(Math.random() * (90 - a)) + 1; ans = a + b; }
    else { a = Math.floor(Math.random() * 70) + 20; b = Math.floor(Math.random() * (a - 5)) + 1; ans = a - b; }
    mathQuestion(`${a} ${plus ? '+' : '−'} ${b} = ?`, numberOptions(ans, 10, 0), ans, null);
}
function genMathProblem() {
    const p = pickItem(MATH_PROBLEMS, x => 'math:p:' + x.text);
    setTimeout(() => speak(p.text, 'ru'), 300);
    mathQuestion(speakBtn(p.text, 'ru'), shuffle(p.options), p.answer,
        { key: 'math:p:' + p.text, label: p.text, lang: 'math', kind: 'math' },
        `<div class="problem-text">${esc(p.text)}</div>`);
}
function genMathCompare() {
    const a = Math.floor(Math.random() * 90) + 10;
    const b = Math.random() < 0.15 ? a : Math.floor(Math.random() * 90) + 10;
    const sign = a > b ? '>' : a < b ? '<' : '=';
    mathQuestion(`${a} &nbsp;?&nbsp; ${b}`, ['>', '<', '='], sign, null);
}

// ============================================================
//  Страница для родителя
// ============================================================
let parentGateAnswer = 0;
function openParentGate() {
    const a = 3 + Math.floor(Math.random() * 7), b = 3 + Math.floor(Math.random() * 7);
    parentGateAnswer = a * b;
    $('parentContent').innerHTML = `
        <div class="parent-gate">
            <h3>👨‍👩‍👧 Только для взрослых</h3>
            <p>Сколько будет ${a} × ${b}?</p>
            <input id="gateInput" type="number" inputmode="numeric" class="gate-input" autocomplete="off">
            <button class="big-btn" id="gateBtn">Войти</button>
            <div id="gateMsg" class="gate-msg"></div>
        </div>`;
    showScreen('parentScreen');
    const check = () => {
        if (+$('gateInput').value === parentGateAnswer) renderParent();
        else { $('gateMsg').textContent = 'Неверно, попробуйте ещё раз'; $('gateInput').value = ''; }
    };
    $('gateBtn').onclick = check;
    $('gateInput').onkeydown = e => { if (e.key === 'Enter') check(); };
}

function fmtMin(sec) {
    const m = Math.round(sec / 60);
    return m < 1 && sec > 0 ? '<1 мин' : m + ' мин';
}

function renderParent() {
    const langs = ['en', 'ru', 'he'];
    const langName = { en: 'Английский', ru: 'Русский', he: 'Иврит' };
    const allItems = Object.entries(items).map(([key, s]) => Object.assign({ key }, s));

    // выучено слов
    let html = '<div class="parent-card"><h3>📚 Выучено слов</h3><p class="muted">Слово считается выученным, если ребёнок ответил на него правильно с первой попытки 3 раза подряд.</p>';
    langs.forEach(l => {
        const learned = WORDS.filter(w => isLearned(items[wordKey(l, w)])).length;
        const seen = WORDS.filter(w => items[wordKey(l, w)]).length;
        const pct = Math.round(learned / WORDS.length * 100);
        html += `<div class="lang-row"><div>${LANG_FLAG[l]} ${langName[l]}: <b>${learned}</b> из ${WORDS.length} <span class="muted">(встречались: ${seen})</span></div>
            <div class="progress-bar-bg"><div class="progress-bar-fill" style="width:${pct}%"></div></div></div>`;
    });
    html += '</div>';

    // по темам (все языки вместе)
    html += '<div class="parent-card"><h3>🗂️ По темам</h3><table class="ptable"><tr><th>Тема</th><th>🇬🇧</th><th>🇷🇺</th><th>🇮🇱</th></tr>';
    TOPICS.forEach(t => {
        const list = WORDS.filter(w => w.topic === t.id);
        html += `<tr><td>${t.emoji} ${t.name}</td>` + langs.map(l =>
            `<td>${list.filter(w => isLearned(items[wordKey(l, w)])).length}/${list.length}</td>`).join('') + '</tr>';
    });
    html += '</table></div>';

    // ошибки
    const weak = allItems.filter(s => s.w > 0).sort((a, b) => (isLearned(a) - isLearned(b)) || (b.w - a.w) || ((b.t || 0) - (a.t || 0))).slice(0, 25);
    html += '<div class="parent-card"><h3>❗ Где ошибки</h3>';
    if (!weak.length) html += '<p class="muted">Пока ошибок нет — или ещё не занимались.</p>';
    else {
        html += '<p class="muted">Слова и задания с ошибками. Они чаще появляются в игре, пока не будут выучены.</p><table class="ptable"><tr><th></th><th>Что</th><th>✗</th><th>✓</th><th>Статус</th></tr>';
        weak.forEach(s => {
            html += `<tr><td>${LANG_FLAG[s.lang] || ''}</td><td class="${s.lang === 'he' ? 'he-font' : ''}">${esc(s.l)}</td><td class="bad">${s.w}</td><td class="good">${s.c}</td><td>${isLearned(s) ? '✅ выучено' : '🔁 повторяем'}</td></tr>`;
        });
        html += '</table>';
    }
    // ошибки по типам заданий
    const kindName = { word: 'Слова', letter: 'Буквы', syl: 'Слоги', sw: 'Слова из слогов', sent: 'Фразы', read: 'Тексты', math: 'Математика' };
    const byKind = {};
    allItems.forEach(s => { const k = s.k || 'word'; byKind[k] = byKind[k] || { c: 0, w: 0 }; byKind[k].c += s.c; byKind[k].w += s.w; });
    const kinds = Object.keys(byKind);
    if (kinds.length) {
        html += '<h4 style="margin-top:12px">Точность по типам заданий (первая попытка)</h4><table class="ptable">';
        kinds.forEach(k => {
            const b = byKind[k], tot = b.c + b.w;
            html += `<tr><td>${kindName[k] || k}</td><td>${tot ? Math.round(b.c / tot * 100) : 0}%</td><td class="muted">${b.c} ✓ / ${b.w} ✗</td></tr>`;
        });
        html += '</table>';
    }
    html += '</div>';

    // по дням
    const last = [];
    for (let i = 13; i >= 0; i--) { const d = new Date(); d.setDate(d.getDate() - i); last.push({ d, k: dayKey(d), v: days[dayKey(d)] || { a: 0, c: 0, sec: 0, r: 0 } }); }
    const maxSec = Math.max(60, ...last.map(x => x.v.sec));
    const week = last.slice(-7).reduce((s, x) => s + x.v.sec, 0);
    const wd = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
    html += `<div class="parent-card"><h3>📅 Занятия по дням</h3>
        <p>За 7 дней: <b>${fmtMin(week)}</b> · огонёк: <b>🔥 ${dayStreak()}</b> ${plural(dayStreak(), 'день', 'дня', 'дней')} подряд</p>
        <div class="day-chart">` + last.map(x => {
            const h = Math.round(x.v.sec / maxSec * 100);
            const met = goalDone(x.v);
            return `<div class="day-col" title="${x.k}: ${fmtMin(x.v.sec)}, ответов ${x.v.c}/${x.v.a}">
                <div class="day-bar-wrap"><div class="day-bar ${met ? 'met' : ''}" style="height:${h}%"></div></div>
                <div class="day-lbl">${wd[x.d.getDay()]}<br>${x.d.getDate()}</div></div>`;
        }).join('') + `</div>
        <table class="ptable"><tr><th>День</th><th>Время</th><th>Правильно</th><th>Раунды</th></tr>` +
        last.slice().reverse().filter(x => x.v.a > 0).map(x =>
            `<tr><td>${x.d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}</td><td>${fmtMin(x.v.sec)}</td><td>${x.v.c} из ${x.v.a}</td><td>${x.v.r}</td></tr>`).join('') +
        '</table></div>';

    // настройки
    html += `<div class="parent-card"><h3>⚙️ Настройки</h3>
        <label class="set-row">Цель на день (правильных ответов):
            <select id="goalSelect">${[10, 20, 30, 50, 80].map(g => `<option value="${g}" ${g === settings.goal ? 'selected' : ''}>${g}</option>`).join('')}</select></label>
        <label class="set-row">Звуки в игре: <input type="checkbox" id="soundToggle" ${settings.sound ? 'checked' : ''}></label>
        <button class="small-btn danger" id="resetBtn">🗑️ Сбросить весь прогресс</button>
        <p class="muted" style="margin-top:10px">Данные хранятся только на этом устройстве.</p></div>`;

    $('parentContent').innerHTML = html;
    $('goalSelect').onchange = e => { settings.goal = +e.target.value; saveSettings(); renderParent(); };
    $('soundToggle').onchange = e => { settings.sound = e.target.checked; saveSettings(); };
    $('resetBtn').onclick = () => {
        if (!confirm('Удалить всю статистику, звёзды и историю занятий?')) return;
        items = {}; days = {}; totalScoreAllTime = 0;
        saveItems(); saveDays(); store.set('kids_total_score', 0);
        renderParent(); updateRewardsDisplay();
    };
}

// ============================================================
//  Запуск
// ============================================================
document.querySelectorAll('[data-cat]').forEach(el => { el.onclick = () => openCategory(el.dataset.cat); });
$('backToMenuBtn').onclick = goMenu;
$('backToListBtn').onclick = () => openCategory(currentCategory);
$('backFromGameBtn').onclick = backFromGame;
$('parentBtn').onclick = openParentGate;
$('parentBackBtn').onclick = goMenu;
window.addEventListener('pagehide', () => { if ($('gameScreen').style.display === 'block') { trackTime(); saveDays(); } });

buildAchievements();
renderDaily();
showScreen('menuScreen');

// PWA: офлайн-режим и обновления
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(reg => {
            reg.update().catch(() => {});
        }).catch(() => {});
    });
    let hadController = !!navigator.serviceWorker.controller;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!hadController) { hadController = true; return; }   // первая установка — перезагрузка не нужна
        if ($('menuScreen').style.display === 'block') location.reload();
        else { pendingReload = true; showToast('✨ Загружена новая версия — обновится в главном меню'); }
    });
}

// для автотестов
window.__kt = { get Q() { return Q; }, get mode() { return currentMode; }, get progress() { return sessionProgress; }, items: () => items, days: () => days };
