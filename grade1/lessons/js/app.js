// كتابُ لغتي التفاعليّ — الصفّ الأوّل — الجزء الأوّل
import { $, $$, AR, store, star, toast, shuf, pick, bare, loose, whyDiff, good, bad } from './kit.js';
import * as D from './data.js';
import { say, sayText, stop as stopTTS, rate, setRate, hasVoice } from './tts.js';
import { tabGames, openTools } from './play.js';
import { ITEMS, UNITS_META, ALLBOT, PRE, KHAT } from './units/index.js';
import { nafesTab, nafesHub, hasNafes } from './nafes.js';

const main = $('#main');
const EMBED = new URLSearchParams(location.search).has('embed') || location.protocol === 'blob:';
const toBook = p => parent.postMessage({ mb: 'go', p: +p }, '*');
if (EMBED) { document.documentElement.classList.add('embed'); const x = document.createElement('button'); x.className = 'hb'; x.id = 'mbClose'; x.title = 'العودة إلى الكتاب'; x.textContent = '📖'; x.onclick = () => { stopTTS(); parent.postMessage({ mb: 'close' }, '*'); }; $('.hrow').appendChild(x); }
const PIMG = p => { try { const M = window.__IMG || (EMBED && parent.__IMG); const k = 'pages/' + p + '.webp'; if (M && M[k]) return M[k]; } catch (e) {} return '../pages/' + p + '.webp'; };
const pg = p => `<button class="pg" data-go="${p}">📖 ص ${AR(p)}</button>`;
const esc = s => String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);
const clean = s => String(s).replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1').replace(/[{}]/g, '');
const spk = s => `<button class="spk" data-say="${esc(clean(s))}" title="استمع">🔊</button>`;

const UNITS = {};

/* ══════════ التوجيه ══════════ */
function route() {
  stopTTS(); const p = (location.hash.slice(1) || '/').split('/').filter(Boolean);
  $$('.gstage').forEach(s => { s._stop && s._stop(); s.remove(); }); document.body.classList.remove('gopen');
  if (p[0] === 'tools') { main.innerHTML = ''; setHead('أدواتُ الصفّ', 'العجلة · الاختيار العشوائي · المجموعات · المؤقّت', '/'); return openTools(GEN, true); }
  if (p[0] === 'fahm') { main.innerHTML = ''; setHead('📚 فهمُ المقروء', 'نصوصٌ من موضوعاتِ الدروس', '/', '📚'); return nafesHub(main, p[1], 'fahm'); }
  if (p[0] === 'nafes') { main.innerHTML = ''; setHead('🎯 تدريبات نافس', 'القراءة · الصفّ الأوّل', '/', '🎯'); return nafesHub(main, p[1]); }
  if (p[0] === 'u' && (UNITS[p[1]] || ITEMS[p[1]])) return openUnit(p[1], p[2]);
  home();
}
addEventListener('hashchange', route);
const go = h => { if (location.hash === '#' + h) route(); else location.hash = h; };
document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]'); if (g) { e.preventDefault(); stopTTS(); if (EMBED) toBook(g.dataset.go); else showPage(+g.dataset.go); return; }
  const s = e.target.closest('[data-say]'); if (s) { e.preventDefault(); const was = s.classList.contains('on'); $$('.spk.on').forEach(x => x.classList.remove('on')); stopTTS(); if (!was) { s.classList.add('on'); sayText(s.dataset.say, { onend: () => s.classList.remove('on') }); } }
});
function showPage(p) { const d = document.createElement('div'); d.className = 'pview'; d.innerHTML = `<div class="pvh"><b>صفحة ${AR(p)}</b><button class="btn s sm">إغلاق ✕</button></div><img src="${PIMG(p)}" alt="صفحة ${AR(p)}">`; d.onclick = e => { if (e.target.closest('button') || e.target === d) d.remove(); }; document.body.appendChild(d); }

function setHead(t, s, back, badge) { $('#ht').innerHTML = `${t}<small>${s || ''}</small>`; $('#hbadge').textContent = badge || '١'; $('#back').style.display = back ? '' : 'none'; $('#back').onclick = () => go(back); $('#tabs').innerHTML = ''; $('#tabs').style.display = 'none'; }

/* ══════════ الرئيسة ══════════ */
const ITEM = id => UNITS[id] || ITEMS[id];
function home() {
  setHead('لغتي — الصفّ الأوّل', 'الجزء الأوّل · كتابٌ تفاعليّ', null);
  const last = store.get('last');
  const lastI = last && ITEM(last);
  const nb = n => `<span class="un">${n}</span>`;
  const itemLink = id => { const U = ITEM(id); return `<a class="unit ${U.kind === 'test' ? 'test' : U.kind === 'entry' ? 'entry' : 'lesson'}" href="#/u/${id}">${nb(U.badge)}<span class="ut">${U.t}<small>ص ${AR(U.p[0])}–${AR(U.p[1])}</small></span></a>`; };
  main.innerHTML = `${lastI ? `<a class="resume" href="#/u/${last}">▶ تابعْ من حيثُ توقّفت: <b>${lastI.t}</b></a>` : ''}
    <div class="hero"><img src="${PIMG(1)}" alt=""><div><span class="tag">الصفّ الأوّل الابتدائيّ · الجزء الأوّل</span><h2>لُغَتِي</h2><p>التهيئةُ وثلاثُ وحدات: استمعْ، وتعرّفِ الحرفَ وصوتَه، وتتبّعْه بإصبعِك، والعبْ… كلُّ نشاطٍ مرتبطٌ بصفحتِه في الكتاب.</p></div></div>
    <div class="hgrid">${hasNafes(1, 'fahm') || hasNafes(2, 'fahm') ? `<a class="hcard nf fh" href="#/fahm">📚<b>فهمُ المقروء</b><small>نصوصٌ من موضوعاتِ الدروس وأسئلةُ فهمٍ وتحليل</small></a>` : ''}<a class="hcard tools" href="#/tools">🎡<b>أدواتُ الصفّ</b><small>العجلة · اختيارٌ عشوائيّ · مجموعات · مؤقّت</small></a></div>
    ${UNITS_META.map(M => `<section class="chap" style="--c:${M.c}"><div class="chh"><span class="chn">${M.n ? AR(M.n) : '★'}</span><div><b>${M.t}</b><small>ص ${AR(M.p[0])}–${AR(M.p[1])}</small></div>${hasNafes(M.n, 'fahm') ? `<a class="nfchip" href="#/fahm/${M.n}">📚 فهم المقروء</a>` : ''}${hasNafes(M.n) ? `<a class="nfchip" href="#/nafes/${M.n}">🎯 نافس</a>` : ''}</div>
      <div class="units">${M.items.filter(ITEM).map(itemLink).join('')}</div></section>`).join('')}
    <footer>تصميم: أ. فهد الشيخي</footer>`;
}

/* ══════════ الوحدة ══════════ */
function openUnit(id, tab) {
  const U = ITEM(id); store.set('last', id);
  setHead(U.t, U.s, '/', U.badge);
  const tabs = U.tabs.map(t => Array.isArray(t) ? t : [t.k, t.i, t.t]);
  const named = { nafes: 'nafes', games: 'games', read: 'read' };
  let ti = tabs.findIndex(t => t[0] === tab); if (ti < 0) ti = Math.min(+tab || 0, tabs.length - 1);
  const T = $('#tabs'); T.style.display = 'flex';
  T.innerHTML = tabs.map(([k, i, t], j) => `<button data-t="${j}" class="${j === ti ? 'on' : ''}"><span>${i}</span>${t}</button>`).join('');
  const show = j => { stopTTS(); $$('button', T).forEach((b, k) => b.classList.toggle('on', k === j)); const k = tabs[j][0]; main.innerHTML = ''; const el = document.createElement('div'); el.className = 'tabc'; main.appendChild(el);
    if (k === 'nafes') nafesTab(el, U.unit || 1);
    else if (k === 'fahm') nafesTab(el, U.unit || 1, 'fahm');
    else if (k === 'games') tabGames(el, UNITS[id] ? GEN : genFor(U), 'arabic1-' + id);
    else if (UNITS[id]) TABS[k](el);
    else renderBlocks(el, (U.blocks && U.blocks[k]) || [], U, k);
    el.insertAdjacentHTML('beforeend', `<div class="nav2">${j > 0 ? `<button class="btn s" data-j="${j - 1}">→ ${tabs[j - 1][2]}</button>` : '<span></span>'}${j < tabs.length - 1 ? `<button class="btn" data-j="${j + 1}">${tabs[j + 1][2]} ←</button>` : '<a class="btn s" href="#/">🏠 الرئيسة</a>'}</div>`);
    $$('.nav2 [data-j]', el).forEach(b => b.onclick = () => { show(+b.dataset.j); window.scrollTo(0, 0); }); };
  $$('button', T).forEach(b => b.onclick = () => { show(+b.dataset.t); b.scrollIntoView({ inline: 'center', block: 'nearest' }); });
  show(ti);
}

/* ══════════ مكوّنات عامّة ══════════ */
/** فقرةٌ قابلةٌ للقراءة: كلماتٌ مستقلّة مع المفردات الجديدة */
function wordsOf(s) { const out = []; String(s).replace(/\[\[([^|\]]+)\|([^\]]+)\]\]|(\S+)/g, (m, v, mean, w) => { if (v) v.split(/\s+/).forEach((x, i) => out.push({ w: x, mean: i === 0 ? mean : null, voc: 1 })); else if (/^[،.؛:؟!»«]+$/.test(w) && out.length) out[out.length - 1].w += w; else if (/^[\u060C.\u061B:\u061F!»]+/.test(w) && out.length && out[out.length - 1].voc) { const p = w.match(/^[\u060C.\u061B:\u061F!»]+/)[0]; out[out.length - 1].w += p; const r = w.slice(p.length); if (r) out.push({ w: r }); } else out.push({ w }); return ''; }); return out; }
function readerHTML(paras, opt = {}) {
  const SP = opt.spk || D.SPK;
  let wi = 0;
  return paras.map(([sp, txt, p], k) => { const S = SP[sp] || SP.n || D.SPK.n; const halves = opt.poem ? String(txt).split(' | ') : [txt];
    // ألحقِ الترقيم الملتصق بالمفردة
    return `<div class="para sp-${sp}" data-k="${k}" style="--sc:${S[1]}">${opt.roles !== false && sp !== 'n' ? `<span class="who">${S[0]}</span>` : ''}<button class="pplay" data-k="${k}" title="استمع للفقرة">▶</button><p>${halves.map(h => (opt.poem ? '<span class="sh">' : '') + wordsOf(h).map(o => `<span class="w${o.voc ? ' voc' : ''}" data-i="${wi++}"${o.mean ? ` data-m="${esc(o.mean)}"` : ''}>${esc(o.w)}</span>`).join(' ') + (opt.poem ? '</span>' : '')).join('')}</p></div>`; }).join('');
}
function reader(host, T, key) {
  const st = { role: null, mode: 'voice', on: false }; const SP = T.spk || D.SPK; const ROLES = T === D.TEXT ? ['a', 'd', 'f', 't'] : T.roles ? Object.keys(SP).filter(k => k !== 'n') : null;
  host.innerHTML = `<div class="card rd"><div class="rdh"><h2>${T.title}</h2>${pg(T.page)}${T.paras.some(p => p[2] !== T.page) ? pg(T.page + 1) : ''}</div>
    <div class="rctl"><button class="btn" data-a="all">▶ استمعْ إلى النصّ</button><button class="btn s sm" data-a="stop">⏹ إيقاف</button>
      <span class="seg" data-a="rate"><button data-r=".65">🐢 بطيء</button><button data-r=".85">عاديّ</button><button data-r="1">🐇 أسرع</button></span>
      <button class="btn s sm" data-a="karaoke" title="يُظلَّلُ النصُّ دونَ صوتٍ لتقرأَه أنت">🖍 أقرأُ أنا مع التظليل</button></div>
    ${ROLES ? `<div class="roles"><b>🎭 القراءةُ بالأدوار:</b> ${ROLES.map(r => `<button data-role="${r}" style="--sc:${SP[r][1]}">${SP[r][0]}</button>`).join('')}<small>اخترْ شخصيّةً تقرأُ جملَها أنت، ويقرأُ الجهازُ الباقي.</small></div>` : ''}
    <div class="text${T.poem ? ' poem' : ''}">${readerHTML(T.paras, { spk: SP, poem: T.poem, roles: !!ROLES || T.roles !== false })}</div>
    <div class="vocdef" hidden></div>
    ${T.note ? `<p class="meta">${T === D.TEXT ? '(١) ' : ''}${T.note}</p>` : ''}${T.src ? `<p class="meta">${T.src}</p>` : ''}
    <p class="meta tts-note">🔊 القراءةُ النموذجيّة ${hasVoice() ? 'بصوتٍ آليٍّ من جهازك' : '— لا يوجدُ صوتٌ عربيٌّ على هذا الجهاز؛ سيُظلَّلُ النصُّ فقط'}. المسِ أيَّ كلمةٍ لتسمعَها، والكلماتُ <span class="voc">الملوّنة</span> مفرداتٌ جديدةٌ تظهرُ معانيها عندَ لمسِها.</p></div>`;
  const all = $$('.w', host), paraEls = $$('.para', host);
  const mark = i => { all.forEach(w => w.classList.remove('cur')); const w = all[i]; if (w) { w.classList.add('cur'); w.closest('.para').classList.add('act'); if (st.follow) w.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } };
  const clear = () => { all.forEach(w => w.classList.remove('cur')); paraEls.forEach(p => p.classList.remove('act', 'mine')); $('.waitme', host)?.remove(); st.on = false; };
  const paraWords = k => $$('.w', paraEls[k]);
  const playFrom = (k, only, silent) => {
    if (k >= paraEls.length) { clear(); if (!only) star(1, 'استمعتَ إلى النصِّ كاملًا'); return; }
    paraEls.forEach(p => p.classList.remove('act')); const P = paraEls[k]; P.classList.add('act'); st.on = true; st.follow = true;
    const ws = paraWords(k), base = +ws[0].dataset.i;
    const sp = ROLES ? T.paras[k][0] : 'n';
    const nextP = () => only ? clear() : playFrom(k + 1, false, silent);
    if (st.role && sp === st.role && !silent) { // دورُ الطالب
      P.classList.add('mine'); P.scrollIntoView({ block: 'center', behavior: 'smooth' });
      P.insertAdjacentHTML('beforeend', `<div class="waitme">🎤 دورُك يا ${SP[sp][0]}! اقرأ الجملة ثم اضغط <button class="btn sm">انتهيتُ ←</button></div>`);
      $('.waitme button', P).onclick = () => { $('.waitme', P).remove(); P.classList.remove('mine'); nextP(); }; return;
    }
    say(ws.map(w => w.textContent), { key: key + '-p' + (k + 1), silent, onword: i => mark(base + i), onend: stopped => { if (!stopped) nextP(); else clear(); } });
  };
  $('[data-a="all"]', host).onclick = () => { st.mode = 'voice'; playFrom(0); };
  $('[data-a="karaoke"]', host).onclick = () => playFrom(0, false, true);
  $('[data-a="stop"]', host).onclick = () => { stopTTS(); clear(); };
  $$('.pplay', host).forEach(b => b.onclick = () => playFrom(+b.dataset.k, true));
  const rs = $$('[data-r]', host); const setR = () => rs.forEach(b => b.classList.toggle('on', Math.abs(+b.dataset.r - rate()) < .01)); setR();
  rs.forEach(b => b.onclick = () => { setRate(+b.dataset.r); setR(); });
  $$('[data-role]', host).forEach(b => b.onclick = () => { st.role = st.role === b.dataset.role ? null : b.dataset.role; $$('[data-role]', host).forEach(x => x.classList.toggle('on', x.dataset.role === st.role)); if (st.role) toast('اضغطْ «استمعْ إلى النصّ» وابدأ القراءةَ بالأدوار'); });
  const def = $('.vocdef', host);
  all.forEach(w => w.onclick = () => { if (st.on) return; stopTTS(); say([w.textContent], { onword: () => w.classList.add('cur'), onend: () => w.classList.remove('cur') });
    const m = w.dataset.m || (w.classList.contains('voc') ? w.previousElementSibling?.dataset.m : null);
    if (m) { def.hidden = false; def.innerHTML = `📘 <b>${esc(w.textContent.replace(/[،.؛:]/g, ''))}</b> = ${esc(m)}`; } });
  return { jump: k => { paraEls[k]?.scrollIntoView({ block: 'center', behavior: 'smooth' }); paraEls[k]?.classList.add('flash'); setTimeout(() => paraEls[k]?.classList.remove('flash'), 1800); } };
}

/** سؤال اختيار من متعدد */
function mcq(host, q, opts, a, o = {}) {
  const d = document.createElement('div'); d.className = 'pc'; host.appendChild(d);
  d.innerHTML = `<div class="ph">${o.tag ? `<span class="ptag">${o.tag}</span>` : ''}${o.page ? pg(o.page) : ''}${spk(q)}</div><div class="ptext">${q}</div><div class="opts${o.g2 ? ' g2' : ''}">${opts.map((x, i) => `<button data-i="${i}">${o.box ? '<i class="bx"></i>' : ''}${x}</button>`).join('')}</div><div class="fb"></div>`;
  let done = false;
  $$('.opts button', d).forEach(b => b.onclick = () => { if (done) return; const ok = +b.dataset.i === a; b.classList.add(ok ? 'ok' : 'no'); if (ok) { done = true; good(); $('.fb', d).innerHTML = '✓ أحسنت!' + (o.e ? ` <span class="meta">${o.e}</span>` : ''); star(1); $$('.opts button', d).forEach(x => x.disabled = true); } else { bad(); $('.fb', d).textContent = '✗ حاولْ مرّةً أخرى'; } });
  return d;
}
/** سؤال مفتوح بإجابة نموذجية */
function openQ(host, n, q, ans, o = {}) {
  const d = document.createElement('div'); d.className = 'pc oq'; host.appendChild(d);
  d.innerHTML = `<div class="ph"><span class="ptag">${AR(n)}</span>${spk(q)}${o.page ? pg(o.page) : ''}</div><div class="ptext">${q}</div>
    <textarea placeholder="${o.oral ? 'أجبْ شفهيًّا، أو اكتبْ إجابتَك هنا…' : 'اكتبْ إجابتَك…'}"></textarea>
    <div class="row"><button class="btn s sm" data-a="show">👁️ الإجابةُ النموذجيّة</button>${o.jump != null && o.jump >= 0 ? '<button class="lnk" data-a="jump">📍 أين في النصّ؟</button>' : ''}</div><div class="sol" hidden>${ans} ${spk(ans)}</div>`;
  const key = 'oq:' + o.id, ta = $('textarea', d); ta.value = store.get(key, ''); ta.oninput = () => store.set(key, ta.value);
  $('[data-a="show"]', d).onclick = () => { $('.sol', d).hidden = !$('.sol', d).hidden; };
  if (o.jump >= 0 && $('[data-a="jump"]', d)) $('[data-a="jump"]', d).onclick = () => o.onJump(o.jump);
}
/** توصيل: كلمة ↔ معنى (بالنقر) */
function matcher(host, L, R, opt = {}) {
  const d = document.createElement('div'); d.className = 'match'; host.appendChild(d);
  const order = shuf(R.map((r, i) => i)); const extra = opt.extra ? [opt.extra] : [];
  d.innerHTML = `<div class="mcol">${L.map((l, i) => `<button class="ml" data-i="${i}">${l}</button>`).join('')}</div><div class="mcol">${shuf([...order.map(i => `<button class="mr" data-i="${i}">${R[i]}</button>`), ...extra.map(x => `<button class="mr" data-i="-1">${x}</button>`)]).join('')}</div><div class="fb"></div>`;
  let sel = null, n = 0;
  $$('.ml', d).forEach(b => b.onclick = () => { if (b.classList.contains('done')) return; $$('.ml', d).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = b; sayText(b.textContent); });
  $$('.mr', d).forEach(b => b.onclick = () => { if (!sel || b.classList.contains('done')) { if (!sel) toast('اخترِ الكلمةَ أوّلًا من العمودِ الأيمن'); return; }
    if (b.dataset.i === sel.dataset.i) { good(); [b, sel].forEach(x => { x.classList.remove('sel'); x.classList.add('done'); x.style.setProperty('--mc', `hsl(${n * 70 + 190},60%,45%)`); }); sel = null; n++; if (n === L.length) { $('.fb', d).innerHTML = '🎉 ممتاز! وصّلتَ الكلماتِ كلَّها.'; star(2); opt.done && opt.done(); } }
    else { bad(); b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); $('.fb', d).textContent = b.dataset.i === '-1' ? 'هذه الكلمةُ زائدة… ليست معنى أيٍّ من الكلمات.' : 'ليست هذه… حاولْ مرّةً أخرى.'; } });
}
/** فرز إلى سلال */
function sorter(host, bins, items, opt = {}) {
  const d = document.createElement('div'); d.className = 'sorter'; host.appendChild(d);
  const all = shuf(items.map((x, i) => ({ ...x, i })));
  d.innerHTML = `<div class="kw pool">${all.map(x => `<button data-i="${x.i}">${x.w}</button>`).join('')}</div><div class="bins">${bins.map((b, j) => `<div class="bin" data-b="${j}"><b>${b}</b><div class="in"></div></div>`).join('')}</div><div class="fb"></div>`;
  let sel = null, left = items.length;
  $$('.pool button', d).forEach(b => b.onclick = () => { $$('.pool button', d).forEach(x => x.classList.remove('sel')); b.classList.add('sel'); sel = b; if (opt.speak !== false) sayText(b.textContent); });
  $$('.bin', d).forEach(B => B.onclick = () => { if (!sel) return toast('اخترْ كلمةً أوّلًا ثم السلّة'); const it = items[+sel.dataset.i];
    if (it.b === +B.dataset.b) { good(); $('.in', B).insertAdjacentHTML('beforeend', `<span>${it.w}</span>`); sel.classList.add('used'); sel.disabled = true; sel = null; if (--left === 0) { $('.fb', d).innerHTML = '🎉 أحسنت! صنّفتَ الكلماتِ كلَّها.'; star(2); } }
    else { bad(); sel.classList.add('no'); const s = sel; setTimeout(() => s.classList.remove('no'), 400); $('.fb', d).textContent = it.why || 'ليس في هذه السلّة… فكّرْ مرّةً أخرى.'; } });
}
/** ترتيب عناصر بالنقر */
function orderer(host, items, ok, opt = {}) {
  const d = document.createElement('div'); d.className = 'order'; host.appendChild(d);
  const accept = (Array.isArray(ok) ? ok : [ok]).map(s => bare(s).replace(/\s+/g, ' '));
  const draw = () => { d.innerHTML = `<div class="kw pool">${shuf(items.map((x, i) => i)).map(i => `<button data-i="${i}">${items[i]}</button>`).join('')}</div><div class="line ${opt.list ? 'list' : ''}"><span class="ph0">${opt.ph || 'اضغطِ الكلماتِ بالترتيب…'}</span></div><div class="row"><button class="btn sm" data-a="chk">تحقّق ✓</button><button class="btn s sm" data-a="rst">↺ من جديد</button></div><div class="fb"></div>`;
    const line = $('.line', d); const seq = [];
    $$('.pool button', d).forEach(b => b.onclick = () => { if (b.disabled) return; b.disabled = true; b.classList.add('used'); seq.push(+b.dataset.i); $('.ph0', line)?.remove(); line.insertAdjacentHTML('beforeend', `<button class="tile" data-i="${b.dataset.i}">${opt.list ? AR(seq.length) + ') ' : ''}${items[+b.dataset.i]}</button>`); });
    line.onclick = e => { const t = e.target.closest('.tile'); if (!t) return; const i = +t.dataset.i; seq.splice(seq.indexOf(i), 1); t.remove(); const pb = $(`.pool [data-i="${i}"]`, d); pb.disabled = false; pb.classList.remove('used'); if (opt.list) $$('.tile', line).forEach((x, k) => x.textContent = AR(k + 1) + ') ' + items[+x.dataset.i]); };
    $('[data-a="rst"]', d).onclick = draw;
    $('[data-a="chk"]', d).onclick = () => { if (seq.length < items.length) return toast('استعملِ العناصرَ كلَّها أوّلًا'); const s = bare(seq.map(i => items[i]).join(' ')).replace(/\s+/g, ' ');
      if (accept.includes(s)) { good(); star(2); $('.fb', d).innerHTML = '✓ ترتيبٌ صحيح! ' + (opt.say ? spk(seq.map(i => items[i]).join(' ')) : ''); line.classList.add('ok'); } else { bad(); $('.fb', d).textContent = '✗ ليس هذا الترتيب… أعدِ المحاولة.'; line.classList.add('no'); setTimeout(() => line.classList.remove('no'), 500); } };
  };
  draw();
}
/** فراغٌ يُكمَل بالاختيار */
function blank(host, a, b, ans, opts, o = {}) {
  const d = document.createElement('div'); d.className = 'blank'; host.appendChild(d);
  d.innerHTML = `${o.img ? `<span class="bimg">${o.img}</span>` : ''}<div class="bs">${a} <span class="gap">&nbsp;</span> ${b}</div><div class="kw">${opts.map(x => `<button>${x}</button>`).join('')}</div>`;
  $$('.kw button', d).forEach(btn => btn.onclick = () => { if (d.classList.contains('ok')) return; if (bare(btn.textContent) === bare(ans)) { good(); star(1); d.classList.add('ok'); $('.gap', d).textContent = ans; $('.gap', d).insertAdjacentHTML('afterend', ' ' + spk(a + ' ' + ans + ' ' + b)); } else { bad(); btn.classList.add('no'); setTimeout(() => btn.classList.remove('no'), 400); } });
}
const card = (host, h, html = '', cls = '') => { host.insertAdjacentHTML('beforeend', `<div class="card ${cls}">${h ? `<h2>${h}</h2>` : ''}${html}</div>`); return host.lastElementChild; };

/* ══════════ تصحيحُ الإملاء ══════════ */
function checkDict(typed, right) {
  const T = typed.trim().split(/\s+/).filter(Boolean), R = clean(right).split(/\s+/).filter(Boolean);
  const out = []; let j = 0, errs = 0;
  for (let i = 0; i < R.length; i++) {
    const r = R[i], t = T[j];
    if (t != null && bare(t) === bare(r)) { out.push(`<span class="dk ok">${r}</span>`); j++; continue; }
    if (t != null && loose(t) === loose(r)) { errs++; out.push(`<span class="dk no" title="${whyDiff(t, r)}">${esc(t)}<small>✎ ${r} — ${whyDiff(t, r)}</small></span>`); j++; continue; }
    if (t != null && R[i + 1] && bare(t) === bare(R[i + 1])) { errs++; out.push(`<span class="dk miss"><small>نسيتَ: ${r}</small></span>`); continue; }
    if (t == null) { errs++; out.push(`<span class="dk miss"><small>نقصَ: ${r}</small></span>`); continue; }
    errs++; out.push(`<span class="dk no">${esc(t)}<small>✎ ${r} — ${whyDiff(t, r)}</small></span>`); j++;
  }
  if (j < T.length) { errs += T.length - j; out.push(`<span class="dk no">${esc(T.slice(j).join(' '))}<small>كلماتٌ زائدة</small></span>`); }
  return { errs, html: out.join(' '), n: R.length };
}
function dictBox(host, mode, sentences, title) {
  const c = card(host, title, '', 'dict');
  let k = 0;
  const draw = () => {
    const s = sentences[k % sentences.length];
    c.innerHTML = `<h2>${title}</h2>${mode === 'copy' ? `<p class="meta">انقلِ النصَّ كما هو. يُصحَّحُ دونَ الحركات، فاكتبْ بالشكلِ في دفترك.</p><div class="model">${s} ${spk(s)}</div>`
      : mode === 'seen' ? `<p class="meta">اقرأِ الجملةَ وتأمّلْ كلماتِها (الهمزات، التاء المربوطة، الشدّة)، ثم أخفِها واكتبْها.</p><div class="model">${s}</div><div class="row"><button class="btn sm" data-a="hide">🙈 أخفِ النصَّ وابدأِ الكتابة</button></div>`
      : `<p class="meta">استمعْ إلى الجملة ثم اكتبْها. يمكنُك إعادةُ الاستماع.</p><div class="row c"><button class="btn" data-a="play">🔊 استمعْ إلى الجملة (${AR(k % sentences.length + 1)} من ${AR(sentences.length)})</button></div>`}
      <textarea class="dta" ${mode === 'seen' ? 'hidden' : ''} placeholder="اكتبْ هنا…"></textarea>
      <div class="row"><button class="btn" data-a="chk">صحّحْ ✓</button>${sentences.length > 1 ? '<button class="btn s sm" data-a="next">الجملةُ التالية ←</button>' : ''}<button class="btn s sm" data-a="show">👁️ أظهرِ النصّ</button></div><div class="dres"></div>`;
    const ta = $('.dta', c);
    $('[data-a="hide"]', c) && ($('[data-a="hide"]', c).onclick = () => { $('.model', c).classList.add('blur'); ta.hidden = false; ta.focus(); $('[data-a="hide"]', c).remove(); });
    $('[data-a="play"]', c) && ($('[data-a="play"]', c).onclick = () => sayText(s));
    $('[data-a="show"]', c).onclick = () => { const m = $('.model', c); if (m) m.classList.toggle('blur'); else $('.dres', c).innerHTML = `<div class="model">${s}</div>`; };
    $('[data-a="next"]', c) && ($('[data-a="next"]', c).onclick = () => { k++; draw(); });
    $('[data-a="chk"]', c).onclick = () => { if (!ta.value.trim()) return toast('اكتبْ أوّلًا'); const r = checkDict(ta.value, s);
      $('.dres', c).innerHTML = `<div class="dsum ${r.errs ? 'no' : 'ok'}">${r.errs ? `عددُ الأخطاء: ${AR(r.errs)} من ${AR(r.n)} كلمة — المسِ الكلمةَ الحمراء لترى التصويب` : '🎉 كتابةٌ صحيحةٌ تمامًا!'}</div><div class="dout">${r.html}</div>`;
      if (!r.errs) { good(); star(3, 'إملاءٌ صحيح'); } else bad(); };
  };
  draw();
}

/* ══════════ تبويبات الدرس ══════════ */
let RD = null;
const TABS = {
  read(el) {
    card(el, '🔮 قبلَ أن أقرأ: أتنبّأُ وأتساءل', `<p class="meta">إستراتيجيّةُ التنبّؤِ والتساؤل (ص ٤١): تأمّلِ العنوانَ والصورة.</p><div class="tq"><label>ماذا أتوقّعُ أن يحدثَ في أوّلِ يومٍ دراسيّ؟</label><input data-k="pred"></div><div class="tq"><label>سؤالٌ أريدُ أن أعرفَ إجابتَه من النصّ:</label><input data-k="ask"></div>`, 'pre');
    $$('.pre input', el).forEach(i => { i.value = store.get('pre:' + i.dataset.k, ''); i.oninput = () => store.set('pre:' + i.dataset.k, i.value); });
    const h = document.createElement('div'); el.appendChild(h); RD = reader(h, D.TEXT, 'd2');
    card(el, '👥 شخصيّاتُ النصّ وأمنيّاتُهم', `<div class="chars">${D.WISHES.map(([n, s, w]) => `<div class="chr" style="--sc:${D.SPK[s][1]}"><b>${n}</b><span>${w}</span></div>`).join('')}<div class="chr" style="--sc:${D.SPK.t[1]}"><b>المعلّم</b><span>يُرشِدُ التلاميذَ إلى التفوّقِ وحُسنِ الخُلُق.</span></div></div>`);
  },
  comp(el) {
    const c = card(el, 'أوّلًا: أُجيبُ شفهيًّا عن الأسئلةِ الآتية ' + pg(36));
    const jump = k => { const b = $('#tabs [data-t="0"]'); b.click(); setTimeout(() => RD && RD.jump(k), 120); };
    D.ORAL.forEach(([q, a, p], i) => openQ(c, i + 1, q, a, { id: 'oral' + i, oral: 1, jump: p, onJump: jump }));
    const c2 = card(el, '٢. أضعُ علامةَ (✓) أمامَ الإجابةِ الصحيحة');
    D.TICK.forEach(([q, o, a], i) => mcq(c2, q, o, a, { tag: AR(i + 1), box: 1 }));
    const c3 = card(el, '🎯 مَن تمنّى ماذا؟', '<p class="meta">وصّلْ كلَّ شخصيّةٍ بأمنيّتِها.</p>');
    matcher(c3, D.WISHES.map(w => w[0]), D.WISHES.map(w => w[2]));
    card(el, '💭 وأنتَ… ماذا تتمنّى مع بدايةِ العامِ الدراسيّ؟', '<textarea id="mywish" placeholder="أتمنّى أنْ…"></textarea><p class="meta">تُحفظُ أمنيّتُك على هذا الجهاز.</p>');
    const w = $('#mywish'); w.value = store.get('wish', ''); w.oninput = () => store.set('wish', w.value);
  },
  vocab(el) {
    const c = card(el, '١. أختارُ المعنى المناسبَ ' + pg(37), '<p class="meta">اضغطِ الكلمةَ ثم معناها. انتبه: هناك معنًى زائد!</p>');
    matcher(c, D.MEAN.words, D.MEAN.means, { extra: D.MEAN.extra });
    card(el, '🃏 بطاقاتُ المفردات', `<div class="flips">${D.MEAN.words.map((w, i) => `<div class="flip2" tabindex="0"><div class="fi"><div class="ff">${w}</div><div class="fbk">${D.MEAN.means[i]}</div></div></div>`).join('')}<div class="flip2"><div class="fi"><div class="ff">مَحَطُّ</div><div class="fbk">مَوْضِعُ</div></div></div></div><p class="meta">اقلبِ البطاقةَ لترى المعنى.</p>`);
    $$('.flip2', el).forEach(f => f.onclick = () => { f.classList.toggle('on'); if (f.classList.contains('on')) sayText($('.ff', f).textContent + '، ' + $('.fbk', f).textContent); });
    const m = card(el, '٢. أُكملُ خريطةَ المفردة', `<div class="wmap"><div class="wc">${D.WMAP.w}</div>${D.WMAP.fields.map(([l, o, a], i) => `<div class="wf" data-f="${i}"><b>${l}:</b> <span class="kw">${o.map((x, j) => `<button data-j="${j}">${x}</button>`).join('')}</span></div>`).join('')}<div class="wf ws"><b>الْكَلِمَةُ فِي جُمْلَةٍ:</b><input placeholder="اكتبْ جملةً فيها (أُسْعِدُ)"><button class="btn sm">تحقّق</button></div></div><div class="fb"></div>`);
    $$('.wf[data-f]', m).forEach(f => { const [, , a] = D.WMAP.fields[+f.dataset.f]; $$('button', f).forEach(b => b.onclick = () => { if (f.classList.contains('ok')) return; if (+b.dataset.j === a) { good(); star(1); f.classList.add('ok'); b.classList.add('sel'); $$('button', f).forEach(x => x !== b && x.remove()); } else { bad(); b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); } }); });
    $('.ws button', m).onclick = () => { const v = $('.ws input', m).value; const ok = /[اأ]سعد/.test(bare(v)) && bare(v).split(/\s+/).length >= 3; $('.fb', m).innerHTML = ok ? '✓ جملةٌ جميلة! ' + spk(v) : `اكتبْ جملةً من ثلاثِ كلماتٍ على الأقلّ فيها (أُسْعِدُ). مثال: ${D.WMAP.sent}`; if (ok) { good(); star(1); } };
  },
  perf(el) {
    el.insertAdjacentHTML('beforeend', `<div class="card"><h2>أَقْرَأُ وَأُلَاحِظُ ${pg(38)}</h2><p class="meta">استمعْ إلى الجملة، ثم اقرأْها بصوتٍ مرتفع، والمسِ الكلمةَ الملوّنةَ لتسمعَها وحدَها.</p></div>`);
    D.PERF.forEach((P, i) => { const c = card(el, `${AR(i + 1)}. ${P.t}`, `<div class="psent">${P.s.replace(/\{([^}]+)\}/g, (m, w) => `<button class="hot" data-say="${w}">${w}</button>`)} ${spk(P.s)}</div><details class="tip"><summary>💡 لاحظْ</summary>${P.tip}</details>`); });
    const c = card(el, '🛑 أَقِفُ أَمْ أَصِلُ؟ (التاءُ المربوطة)', `<div class="bubble">إِذَا وَقَفْتُ عَلَى <b>(التَّاءِ الْمَرْبُوطَةِ)</b> بِالسُّكُونِ نَطَقْتُهَا <b>(هَاءً)</b></div><div class="kw stopw">${D.STOPW.map(w => `<button>${w}</button>`).join('')}</div><div class="svis"><span class="sw0">اخترْ كلمة</span></div><div class="row c"><button class="btn" data-a="wasl">🔗 أَصِلُ</button><button class="btn s" data-a="waqf">✋ أَقِفُ</button></div>`);
    let W = D.STOPW[0]; const vis = $('.svis', c);
    const pick1 = w => { W = w; $$('.stopw button', c).forEach(b => b.classList.toggle('sel', b.textContent === w)); vis.innerHTML = `<span class="sw0">${w}<b class="tm">ة</b></span>`; };
    $$('.stopw button', c).forEach(b => b.onclick = () => pick1(b.textContent)); pick1(W);
    const base = W => W.replace(/ة$/, '');
    $('[data-a="wasl"]', c).onclick = () => { const s = base(W) + 'ةُ جَمِيلَةٌ'; vis.innerHTML = `<span class="sw0">${base(W)}<b class="tm">ةُ</b> جَمِيلَةٌ</span><small>عندَ الوصلِ تُنطقُ <b>تاءً</b></small>`; sayText(s); };
    $('[data-a="waqf"]', c).onclick = () => { vis.innerHTML = `<span class="sw0">${base(W)}<b class="tm">هْ</b></span><small>عندَ الوقفِ تُنطقُ <b>هاءً ساكنة</b></small>`; sayText(base(W) + 'هْ'); };
    const q = card(el, '✅ اختبرْ نفسك');
    mcq(q, 'كَيْفَ أَنْطِقُ التَّاءَ الْمَرْبُوطَةَ فِي (الْمَدْرَسَة) إِذَا وَقَفْتُ عَلَيْهَا؟', ['تَاءً', 'هَاءً سَاكِنَةً', 'أَلِفًا'], 1);
    mcq(q, 'الْحَرْفُ الْمُشَدَّدُ فِي (الْمُعَلِّمُ) هُوَ:', ['الْمِيمُ', 'الْعَيْنُ', 'اللَّامُ'], 2, { e: 'المُعَلِّم = المُعَلْلِم.' });
    mcq(q, 'فِي (أَنِ اكْتَمَلَ) هَمْزَةُ (اكْتَمَلَ):', ['هَمْزَةُ وَصْلٍ لَا تُنْطَقُ عِنْدَ الْوَصْلِ', 'هَمْزَةُ قَطْعٍ تُنْطَقُ دَائِمًا'], 0);
  },
  struct(el) {
    // أستخرج من النص
    const c = card(el, 'أوّلًا: أَسْتَخْرِجُ مِنَ النَّصِّ ' + pg(39), `<p class="meta">اخترِ المطلوب، ثم المسِ الكلماتِ في النصّ. تحتاجُ كلمتين لكلِّ مطلوب.</p><div class="ext-cats">${D.EXTRACT.map(([k, t], i) => `<button data-c="${i}" class="${i ? '' : 'on'}">${AR(i + 1)}. ${t} <em>( <i></i> ، <i></i> )</em></button>`).join('')}</div><div class="text ext">${readerHTML(D.TEXT.paras, { roles: false })}</div><div class="fb"></div>`);
    $$('.pplay', c).forEach(b => b.remove());
    let cat = 0; const got = D.EXTRACT.map(() => []);
    $$('.ext-cats button', c).forEach(b => b.onclick = () => { cat = +b.dataset.c; $$('.ext-cats button', c).forEach(x => x.classList.toggle('on', x === b)); });
    $$('.ext .w', c).forEach(w => w.onclick = () => { const bw = bare(w.textContent); const [, t, test] = D.EXTRACT[cat];
      if (got[cat].length >= 2) return toast('أكملتَ هذا المطلوب ✓ اخترْ مطلوبًا آخر');
      if (got[cat].includes(bw)) return toast('اخترتَ هذه الكلمةَ من قبل');
      if (test(bw)) { good(); got[cat].push(bw); w.classList.add('picked'); const em = $$(`[data-c="${cat}"] i`, c)[got[cat].length - 1]; em.textContent = w.textContent.replace(/[،.؛:؟!]/g, ''); if (got[cat].length === 2) { $(`[data-c="${cat}"]`, c).classList.add('done'); star(1); const nx = got.findIndex(g => g.length < 2); if (nx >= 0) $(`[data-c="${nx}"]`, c).click(); else { $('.fb', c).innerHTML = '🎉 أحسنت! استخرجتَ المطلوبَ كلَّه.'; star(2); } } }
      else { bad(); w.classList.add('nope'); setTimeout(() => w.classList.remove('nope'), 500); $('.fb', c).textContent = `(${w.textContent.replace(/[،.؛:؟!]/g, '')}) ليست من: ${t}`; } });
    const c2 = card(el, 'ثانيًا: ١. أُكملُ بكلماتٍ تنتهي بتاءٍ مربوطةٍ أو تاءٍ مفتوحةٍ أو هاء');
    D.FILLT.forEach(([a, b, ans, o]) => blank(c2, a, b, ans, o));
    const c3 = card(el, '٢. (ال) الشمسيّةُ و(ال) القمريّة', '<p class="meta">اخترِ الكلمةَ لتسمعَها، ثم ضعْها في سلّتِها: الشمسيّةُ لا تُنطَقُ ويُشدَّدُ ما بعدها، والقمريّةُ تُنطَق.</p>');
    sorter(c3, ['☀️ (ال) الشمسيّة — مثل: الدِّراسيّ', '🌙 (ال) القمريّة — مثل: الْجديد'], [...D.SUNMOON.sun.slice(1).map(w => ({ w, b: 0, why: 'استمعْ: هل تُنطَقُ اللام؟ هنا تُنطق، فهي قمريّة.' })), ...D.SUNMOON.moon.slice(1).map(w => ({ w, b: 1, why: 'استمعْ: اللامُ هنا لا تُنطَق والحرفُ بعدها مشدّد، فهي شمسيّة.' }))]);
    const c4 = card(el, 'رابعًا: أَسْتَخْدِمُ — بمحاكاةِ المثالِ الأوّل أستثني بـ(غَيْرَ) ' + pg(41), `<div class="blank ok"><span class="bimg">${D.GHAYR[0].img}</span><div class="bs">${D.GHAYR[0].s} ${spk(D.GHAYR[0].s)}</div></div>`);
    D.GHAYR.slice(1).forEach(g => blank(c4, g.a, g.b, g.ans, g.opts, { img: g.img }));
    const c5 = card(el, 'خامسًا: أُحَوِّلُ — أُحاكي المثالَ في تحويلِ الزمن (صَبَاحًا، مَسَاءً)');
    D.TIME.forEach(([s, a, ex]) => { if (ex) c5.insertAdjacentHTML('beforeend', `<div class="blank ok"><div class="bs">${s} <span class="gap ${a === 'صَبَاحًا' ? 'am' : 'pm'}">${a}</span>. ${spk(s + ' ' + a)}</div></div>`); else blank(c5, s, '.', a, ['صَبَاحًا', 'مَسَاءً']); });
  },
  dict(el) {
    card(el, '', `<h2>ثالثًا: أَكْتُبُ حَسَبَ الْمَطْلُوبِ ${pg(40)}</h2><p class="meta">يُشيرُ التصحيحُ إلى نوعِ الخطأ: الهمزة، التاء المربوطة والهاء، الألف اللينة، التاء المفتوحة، «ال».</p>`);
    dictBox(el, 'copy', [D.DICT.copy], '١. إِمْلَاءٌ مَنْسُوخٌ');
    dictBox(el, 'seen', D.DICT.seen, '٢. إِمْلَاءٌ مَنْظُورٌ');
    dictBox(el, 'test', shuf(D.DICT.test), '٣. إِمْلَاءٌ اخْتِبَارِيٌّ (يُمليه الجهاز)');
  },
  khat(el) {
    card(el, '', `<h2>أَرْسُمُ بِخَطِّيَ الْجَمِيلِ ${pg(42)}</h2><p class="meta">أَقْرَأُ الْحَدِيثَ الشَّرِيفَ، ثُمَّ أَرْسُمُهُ بِخَطِّ النَّسْخِ مُبْتَدِئًا مِنَ السَّطْرِ الْأَخِيرِ. تتبّعِ الكلماتِ الباهتةَ بإصبعِك أو بالقلم.</p><p>قَالَ ﷺ: <b class="hd">«${D.HADITH}»</b> ${spk('قَالَ ﷺ: ' + D.HADITH)}</p>`);
    const c = card(el, '', `<div class="row"><span class="seg pc2"><button data-c="#1a4a9a" class="on">🔵</button><button data-c="#111">⚫</button><button data-c="#c0392b">🔴</button><button data-c="#2f8f4a">🟢</button></span><span class="seg pw"><button data-w="3">رفيع</button><button data-w="5" class="on">متوسّط</button><button data-w="8">عريض</button></span><button class="btn s sm" data-a="undo">↶ تراجع</button><button class="btn s sm" data-a="clr">🗑 مسح</button></div><div class="khw"><canvas id="khat"></canvas></div><p class="meta">💡 أستفيدُ من قواعدِ كتابةِ الحروفِ بالرجوعِ إلى: أتعلّمُ فنَّ الخطّ (صفحة ١٢).</p>`, 'khc');
    khat(c);
  },
  expr(el) {
    const c = card(el, 'أُعَبِّرُ — أُكملُ كلَّ جملةٍ بكلمةٍ مناسبةٍ ممّا يأتي، ثم أقرؤُها ' + pg(43), `<div class="bank">( ${D.EXPR.bank.join(' – ')} )</div>`);
    D.EXPR.items.forEach(([a, b, ans]) => blank(c, a, b, ans, shuf(D.EXPR.bank)));
    const h = card(el, '🏠 في دفترِ واجباتي المنزليّة', `<p><b>كَيْفَ يُمْكِنُ أَنْ أَجْعَلَ الدِّرَاسَةَ مُمْتِعَةً بِالنِّسْبَةِ لِي؟</b><br>أُقَدِّمُ خُطَّةً مَكْتُوبَةً بِعُنْوَانِ: <b>(أَدْرُسُ وَأَسْتَمْتِعُ)</b>.</p><p class="meta">أفكارٌ تساعدُك (المسْها لتُضيفَها):</p><div class="kw ideas">${['أُنَظِّمُ وَقْتِي بَيْنَ الدِّرَاسَةِ وَاللَّعِبِ.', 'أَقْرَأُ الدَّرْسَ قَبْلَ شَرْحِهِ.', 'أَدْرُسُ مَعَ زُمَلَائِي فِي مَجْمُوعَاتٍ.', 'أَسْتَعْمِلُ الْأَلْوَانَ وَالْخَرَائِطَ الذِّهْنِيَّةَ.', 'أُكَافِئُ نَفْسِي بَعْدَ الْإِنْجَازِ.', 'أَنَامُ مُبَكِّرًا لِأَسْتَيْقِظَ نَشِيطًا.'].map(x => `<button>${x}</button>`).join('')}</div><textarea id="plan" rows="7" placeholder="خُطَّتِي: أَدْرُسُ وَأَسْتَمْتِعُ&#10;١. …"></textarea><div class="row"><button class="btn s sm" data-a="print">🖨️ طباعة الخطّة</button></div>`);
    const ta = $('#plan', h); ta.value = store.get('plan', ''); ta.oninput = () => store.set('plan', ta.value);
    $$('.ideas button', h).forEach(b => b.onclick = () => { const n = ta.value.split('\n').filter(l => /^[٠-٩\d]+\./.test(l)).length; ta.value += (ta.value && !ta.value.endsWith('\n') ? '\n' : '') + AR(n + 1) + '. ' + b.textContent; ta.oninput(); b.classList.add('used'); });
    $('[data-a="print"]', h).onclick = () => { const w = open('', '_blank'); if (!w) return; w.document.write(`<html dir="rtl"><body style="font:20px Tajawal,sans-serif;padding:30px"><h2>أَدْرُسُ وَأَسْتَمْتِعُ</h2><pre style="font:inherit;white-space:pre-wrap">${esc(ta.value)}</pre></body></html>`); w.print(); };
  },
  games(el) { tabGames(el, GEN, 'arabic1'); },
  bees(el) { const h = document.createElement('div'); el.appendChild(h); RD = reader(h, D.BEES, 't1'); card(el, '', '<p class="meta">أَتَدَرَّبُ فِي نَمُوذَجِ الِاخْتِبَارِ حَتَّى أُعَزِّزَ مَهَارَةَ الْفَهْمِ الْقِرَائِيِّ الَّتِي هِيَ مِنَ الْمَهَارَاتِ الْأَسَاسِيَّةِ الَّتِي يَتَحَقَّقُ مِنْ خِلَالِهَا الْهَدَفُ مِنَ الْقِرَاءَةِ.</p>', 'tip0'); },
  tq(el) {
    const c = card(el, 'اختيارٌ من متعدّد ' + pg(46));
    D.TMCQ.forEach(([q, o, a, p], i) => mcq(c, q, o, a, { tag: AR([9, 10, 11, 12, 13, 18][i]), page: p }));
    const c2 = card(el, '٥. رَتِّبْ أَحْدَاثَ النَّصِّ كَمَا وَرَدَتْ فِي الْقِصَّةِ ' + pg(45), '<p class="meta">اضغطِ الأحداثَ من الأوّلِ إلى الأخير.</p>');
    orderer(c2, D.TORDER, D.TORDER.join(' '), { list: 1, ph: 'الحدثُ الأوّل…' });
    const c3 = card(el, 'أسئلةٌ مفتوحة (أكتبُ ثم أقارنُ بالإجابةِ النموذجيّة)');
    D.TOPEN.forEach(([n, q, a]) => openQ(c3, n, q, a, { id: 'top' + n }));
  },
  eval(el) {
    card(el, 'أوّلًا: أَقْرَأُ ثُمَّ أُجِيبُ ' + pg(48), `<div class="model big">${D.EVAL_TEXT} ${spk(D.EVAL_TEXT)}</div>`);
    const a = card(el, 'أ. التصرّفاتُ الإيجابيّةُ والسلبيّةُ في الفقرة');
    sorter(a, ['👍 تصرّفاتٌ إيجابيّة', '👎 تصرّفاتٌ سلبيّة'], [...D.EPOS.map(w => ({ w, b: 0 })), ...D.ENEG.map(w => ({ w, b: 1 }))], { speak: false });
    openQ(a, 'ب', 'أَكْتُبُ النَّتَائِجَ الْمُتَرَتِّبَةَ عَلَى حُسْنِ التَّعَامُلِ مَعَ الْآخَرِينَ.', 'مَحَبَّةُ النَّاسِ — رِضَا اللَّهِ تَعَالَى — انْتِشَارُ التَّعَاوُنِ — رَاحَةُ الْجَمِيعِ وَسَعَادَتُهُمْ.', { id: 'ev-b' });
    const b = card(el, 'جـ / د / هـ. أختارُ الإجابةَ الصحيحة ' + pg(49));
    D.EMCQ.forEach(([q, o, x, p]) => mcq(b, q, o, x, { page: p, g2: o.length < 4 }));
    const op = card(el, 'ثانيًا: أَقْرَأُ ثُمَّ أُجِيبُ ' + pg(49), '<div class="model">الْمُعَلِّمُ: مِنَ الْمُشْكِلَاتِ الَّتِي تُوَاجِهُ التَّلَامِيذَ الْاسْتِيقَاظُ صَبَاحًا لِلذَّهَابِ إِلَى الْمَدْرَسَةِ، حَيْثُ يَتَمَنَّوْنَ أَنْ يَنَامُوا مُدَّةً أَطْوَلَ. وَحَلُّ هَذِهِ الْمُشْكِلَةِ سَهْلٌ لِلْغَايَةِ.</div>');
    D.EOPEN.forEach(([n, q, a]) => openQ(op, n, q, a, { id: 'eo' + n }));
    const f3 = card(el, 'ثالثًا: أ. أُكْمِلُ الْجُمَلَ بِالْكَلِمَاتِ الْمُنَاسِبَةِ ' + pg(50));
    blank(f3, 'بَعْدَ التَّشَهُّدِ الْأَخِيرِ يُسَلِّمُ الْمُصَلِّي عَنْ', 'ثُمَّ عَنْ شِمَالِهِ.', 'يَمِينِهِ', ['يَمِينِهِ', 'شِمَالِهِ', 'أَمَامِهِ']);
    const g = card(el, 'ب. أَرْبِطُ بَيْنَ الْجُمَلِ بِاسْتِخْدَامِ (الْوَاوِ، الْفَاءِ، ثُمَّ) ' + pg(50));
    blank(g, 'صَعِدَ عَادِلٌ إِلَى الطَّائِرَةِ بِهُدُوءٍ', 'جَلَسَ عَلَى مَقْعَدِهِ', 'ثُمَّ', ['ثُمَّ', 'لَكِنْ', 'أَوْ']);
    blank(g, 'اسْتَمَعَ إِلَى تَعْلِيمَاتِ السَّلَامَةِ', 'رَدَّدَ دُعَاءَ السَّفَرِ', 'وَ', ['وَ', 'لَكِنْ', 'أَمْ']);
    const o = card(el, 'جـ. أُرَتِّبُ الْكَلِمَاتِ لِأُكَوِّنَ جُمْلَةً ' + pg(51));
    D.ORDERW.forEach(([w, ok]) => orderer(o, w, ok, { say: 1 }));
    const w = card(el, 'د. أَكْتُبُ الْمَطْلُوبَ');
    D.WRITE.forEach(([s, q, opts, x]) => mcq(w, `${s} <span class="tag">${q}</span>`, opts, x, { g2: 1 }));
    const e = card(el, 'هـ. أُكْمِلُ الْكَلِمَاتِ الْآتِيَةَ بِـ(ة – ـة – ت – ـه – ه)');
    e.insertAdjacentHTML('beforeend', `<div class="ends">${D.ENDS.map(([s, x, full], i) => `<div class="end" data-i="${i}"><b>${s}<span>…</span></b><div class="kw">${['ة', 'ـة', 'ت', 'ـه', 'ه'].map(l => `<button>${l}</button>`).join('')}</div></div>`).join('')}</div>`);
    $$('.end', e).forEach(d => { const [s, x, full] = D.ENDS[+d.dataset.i]; $$('button', d).forEach(b => b.onclick = () => { if (d.classList.contains('ok')) return; if (b.textContent === x) { good(); star(1); d.classList.add('ok'); $('b', d).innerHTML = full; sayText(full); } else { bad(); b.classList.add('no'); setTimeout(() => b.classList.remove('no'), 400); } }); });
    card(el, '', `<h2>رابعًا: أَكْتُبُ حَسَبَ الْمَطْلُوبِ ${pg(52)}</h2>`);
    dictBox(el, 'copy', [D.DICT2.copy], 'أ. إِمْلَاءٌ مَنْسُوخٌ');
    dictBox(el, 'seen', D.DICT2.seen, 'ب. إِمْلَاءٌ مَنْظُورٌ');
    dictBox(el, 'test', shuf(D.DICT.test), 'جـ. إِمْلَاءٌ اخْتِبَارِيٌّ');
  },
};

/* ══════════ محرّكُ الدروسِ المبنيّةِ على البيانات ══════════ */
const PC = ['#e0592a', '#1f7ae0', '#2f8f4a', '#8a3ab8', '#c8102e'];
const pgs = b => b.page ? ' ' + pg(b.page) : '';
const BLOCK = {
  text(el, b) { card(el, b.h ? b.h + pgs(b) : '', b.html || '', b.cls || ''); },
  read(el, b, U, i) { const h = document.createElement('div'); el.appendChild(h); RD = reader(h, b.text, b.key || U.id + '-' + (b.k || 'r' + i)); },
  poem(el, b, U, i) { const h = document.createElement('div'); el.appendChild(h); reader(h, { ...b, poem: 1, roles: false, paras: b.lines.map(l => ['n', Array.isArray(l) ? l.join(' | ') : l, b.page]) }, b.key || U.id + '-' + (b.k || 'p' + i)); },
  mcq(el, b) { const c = card(el, (b.h || 'أختارُ الإجابةَ الصحيحة') + pgs(b)); b.items.forEach(([q, o, a, e, p], i) => mcq(c, q, o, a, { tag: b.num === false ? '' : AR(i + 1), e, page: p, g2: o.length === 2 || b.g2, box: b.box })); },
  tf(el, b) { const c = card(el, (b.h || 'أضعُ علامةَ (✓) أمامَ العبارةِ الصحيحة، وعلامةَ (✗) أمامَ الخطأ') + pgs(b)); b.items.forEach(([q, ok, e], i) => mcq(c, q, ['✓ صحيحة', '✗ خطأ'], ok ? 0 : 1, { tag: AR(i + 1), e, g2: 1 })); },
  open(el, b, U, i) { const c = card(el, (b.h || 'أُجيبُ') + pgs(b), b.intro || ''); b.items.forEach(([q, a], j) => openQ(c, b.nums ? b.nums[j] : j + 1, q, a, { id: U.id + i + '-' + j, oral: b.oral })); },
  match(el, b) { const c = card(el, (b.h || 'أُوصِّلُ') + pgs(b), `<p class="meta">${b.hint || 'اضغطْ ما في العمودِ الأيمنِ ثم ما يناسبُه في الأيسر.'}</p>`); matcher(c, b.left, b.right, { extra: b.extra }); },
  sort(el, b) { const c = card(el, (b.h || 'أُصنِّفُ') + pgs(b), b.hint ? `<p class="meta">${b.hint}</p>` : ''); sorter(c, b.bins, b.items.map(([w, x, why]) => ({ w, b: x, why })), { speak: b.speak !== false }); },
  order(el, b) { const c = card(el, (b.h || 'أُرتِّبُ الكلماتِ لأُكوِّنَ جملةً مفيدة') + pgs(b)); b.items.forEach(([w, ok]) => orderer(c, w, ok, { say: 1 })); },
  seq(el, b) { const c = card(el, (b.h || 'أُرتِّبُ الأحداثَ كما وردتْ في النصّ') + pgs(b), '<p class="meta">اضغطِ العناصرَ من الأوّلِ إلى الأخير.</p>'); orderer(c, b.items, b.items.join(' '), { list: 1, ph: 'الأوّل…' }); },
  blank(el, b) { const c = card(el, (b.h || 'أُكملُ الفراغَ بالكلمةِ المناسبة') + pgs(b), b.bank ? `<div class="bank">( ${b.bank.join(' – ')} )</div>` : ''); b.items.forEach(([x, y, ans, opts]) => blank(c, x, y, ans, opts || shuf(b.bank))); },
  dict(el, b) { dictBox(el, b.mode || 'copy', b.mode === 'test' ? shuf(b.items) : b.items, (b.h || '') + pgs(b)); },
  khat(el, b, U, i) { card(el, '', `<h2>${b.h || 'أَكْتُبُ بِخَطٍّ جَمِيلٍ'}${pgs(b)}</h2>${b.note ? `<p class="meta">${b.note}</p>` : ''}<div class="model big">${b.text} ${spk(b.text)}</div>`);
    const c = card(el, '', `<div class="row"><span class="seg pc2"><button data-c="#1a4a9a" class="on">🔵</button><button data-c="#111">⚫</button><button data-c="#c0392b">🔴</button><button data-c="#2f8f4a">🟢</button></span><span class="seg pw"><button data-w="3">رفيع</button><button data-w="5" class="on">متوسّط</button><button data-w="8">عريض</button></span><button class="btn s sm" data-a="undo">↶ تراجع</button><button class="btn s sm" data-a="clr">🗑 مسح</button></div><div class="khw"><canvas id="khat"></canvas></div><p class="meta">اكتبْ بإصبعِك فوقَ النموذجِ الباهتِ في الأسطر، مبتدئًا من اليمين، ومراعيًا موضعَ الحروفِ على السطر.</p>`);
    khat(c, b.text, 'khat:' + U.id + i); },
  cards(el, b) { const c = card(el, (b.h || '🃏 بطاقاتُ المفردات') + pgs(b), `<p class="meta">اقلبِ البطاقةَ لترى المعنى.</p><div class="flips">${b.items.map(([w, m]) => `<div class="flip2" tabindex="0"><div class="fi"><div class="ff">${w}</div><div class="fbk">${m}</div></div></div>`).join('')}</div>`);
    $$('.flip2', c).forEach(f => f.onclick = () => { f.classList.toggle('on'); if (f.classList.contains('on')) sayText($('.ff', f).textContent + '، ' + $('.fbk', f).textContent); }); },
  write(el, b, U, i) { const key = 'wr:' + U.id + i; const c = card(el, (b.h || '✍️ أكتبُ') + pgs(b), `${b.prompt ? `<p>${b.prompt}</p>` : ''}${b.ideas ? `<p class="meta">💡 أفكارٌ تساعدُك (اضغطْ لإضافتِها):</p><div class="kw ideas">${b.ideas.map(x => `<button>${x}</button>`).join('')}</div>` : ''}<textarea class="wta" placeholder="${b.ph || 'أكتبُ هنا…'}"></textarea>${b.model ? `<div class="row"><button class="btn s sm" data-a="model">👁️ نموذجٌ مقترح</button></div><div class="sol" hidden>${b.model}</div>` : ''}<p class="meta">تُحفظُ كتابتُك على هذا الجهاز.</p>`);
    const ta = $('.wta', c); ta.value = store.get(key, ''); ta.oninput = () => store.set(key, ta.value);
    $$('.ideas button', c).forEach(x => x.onclick = () => { ta.value += (ta.value && !/\s$/.test(ta.value) ? '\n' : '') + x.textContent; ta.oninput(); x.classList.add('used'); });
    const m = $('[data-a="model"]', c); if (m) m.onclick = () => { $('.sol', c).hidden = !$('.sol', c).hidden; }; },
  check(el, b, U, i) { const key = 'ck:' + U.id + i, st = store.get(key, {}); const c = card(el, (b.h || '✅ أُقيِّمُ نفسي') + pgs(b), `<div class="cklist">${b.items.map((t, j) => `<label class="ck"><input type="checkbox" data-j="${j}" ${st[j] ? 'checked' : ''}> <span>${t}</span></label>`).join('')}</div>`);
    $$('input', c).forEach(x => x.onchange = () => { st[x.dataset.j] = x.checked; store.set(key, st); if (x.checked) good(); }); },
  parts(el, b, U, i) { const c = card(el, (b.h || '🎨 أُلوِّنُ أركانَ الجملة') + pgs(b), `<p class="meta">اخترْ لونًا ثم اضغطْ الكلمات. الكلماتُ التي لا تنتمي لأيِّ ركنٍ اتركْها.</p><div class="row pcats">${b.cats.map((x, j) => `<button class="pc" data-c="${j}" style="--pc:${PC[j % PC.length]}">${x}</button>`).join('')}<button class="pc" data-c="-1" style="--pc:#bbb">ممحاة</button></div>`);
    let cur = 0; const pcs = $$('.pc', c); const sel = j => { cur = j; pcs.forEach(x => x.classList.toggle('on', +x.dataset.c === j)); }; pcs.forEach(x => x.onclick = () => sel(+x.dataset.c)); sel(0);
    b.items.forEach(([w, ans]) => { const r = document.createElement('div'); r.className = 'psent'; r.innerHTML = `<div class="pws">${w.map((x, j) => `<span class="pw" data-j="${j}">${x}</span>`).join(' ')}</div><button class="btn sm">تحقّق</button><span class="pres"></span>`; c.appendChild(r);
      const st = w.map(() => -1); $$('.pw', r).forEach(x => x.onclick = () => { const j = +x.dataset.j; st[j] = cur; x.style.background = cur < 0 ? '' : PC[cur % PC.length] + '33'; x.style.borderColor = cur < 0 ? 'transparent' : PC[cur % PC.length]; x.classList.remove('ok', 'no'); });
      $('button', r).onclick = () => { let ok = true; $$('.pw', r).forEach((x, j) => { const g = st[j] === ans[j]; if (!g) ok = false; if (ans[j] >= 0 || st[j] >= 0) x.classList.toggle('no', !g); }); $('.pres', r).textContent = ok ? '✓ أحسنت' : '✗ راجعِ الكلماتِ المعلَّمة'; ok ? good() : bad(); }; }); },
  page(el, b) { card(el, (b.h || '📖 صفحةُ الكتاب') + pgs(b), `${b.note ? `<p class="meta">${b.note}</p>` : ''}<img class="bookimg" src="${PIMG(b.page)}" alt="صفحة ${AR(b.page)}" loading="lazy">`); },
};
function renderBlocks(el, blocks, U, tabKey) { blocks.forEach((b, i) => { const f = BLOCK[b.type]; if (!f) { console.warn('unknown block', b.type); return; } try { f(el, b, U, tabKey + i); } catch (e) { console.error('block', U.id, tabKey, i, e); } }); }

/** أسئلةُ الألعاب من محتوى الدرس */
function genFor(U, raw) {
  const P = [], add = (q, r, w) => { w = [...new Set(w.filter(x => x && bare(x) !== bare(r)))]; if (w.length) P.push([q, r, w]); };
  Object.values(U.blocks || {}).flat().forEach(b => {
    if (b.type === 'mcq') b.items.forEach(([q, o, a]) => add(q, o[a], o.filter((_, j) => j !== a)));
    if (b.type === 'tf') b.items.forEach(([q, ok]) => add(q + ' (صحيحة أم خطأ؟)', ok ? 'صحيحة' : 'خطأ', [ok ? 'خطأ' : 'صحيحة']));
    if (b.type === 'blank') b.items.forEach(([x, y, ans, o]) => add(`${x} ـــــ ${y}`, ans, o || b.bank || []));
    if (b.type === 'match') b.left.forEach((l, i) => add(`${b.gq || 'ما يناسبُ'} (${l}):`, b.right[i], b.right.filter((_, j) => j !== i).concat(b.extra || [])));
    if (b.type === 'cards') b.items.forEach(([w, m], i) => add(`مَعْنَى (${w}):`, m, b.items.filter((_, j) => j !== i).map(x => x[1])));
    if (b.type === 'sort') b.items.forEach(([w, x]) => add(`(${w}) ${b.gq || 'تُصنَّفُ ضمن'}:`, b.bins[x], b.bins.filter((_, j) => j !== x)));
  });
  (U.gq || []).forEach(([q, o, a]) => add(q, o[a], o.filter((_, j) => j !== a)));
  if (raw) return P;
  if (P.length < 4) return GEN;
  let bag = [];
  return () => { if (!bag.length) bag = shuf(P.map((_, i) => i)); const [q, r, w] = P[bag.pop()]; const opts = shuf([r, ...shuf(w).slice(0, 3)]); return { q, opts, a: opts.indexOf(r), e: '✓ ' + r }; };
}

/* ══════════ لوحة الخطّ ══════════ */
function khat(c, TXT = '«' + D.HADITH + '».', KEY = 'khat') {
  const cv = $('#khat', c), wrap = $('.khw', c), ctx = cv.getContext('2d');
  const strokes = store.get(KEY, []); let color = '#1a4a9a', width = 5, curS = null;
  const ROWS = 7, LH = 120;
  const draw = () => {
    const W = wrap.clientWidth, dpr = devicePixelRatio || 1, H = ROWS * LH; cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + 'px'; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    for (let r = 0; r < ROWS; r++) { const y = r * LH + 80; [['#8fcf8f', -38], ['#f0a0a0', 0], ['#9ad0f0', 14, 1], ['#d0a0e0', 22]].forEach(([c0, dy, dash]) => { ctx.strokeStyle = c0; ctx.lineWidth = 1.5; ctx.setLineDash(dash ? [8, 6] : []); ctx.beginPath(); ctx.moveTo(10, y + dy); ctx.lineTo(W - 10, y + dy); ctx.stroke(); }); ctx.setLineDash([]);
      if (r === 0 || r >= 4) { ctx.save(); ctx.direction = 'rtl'; ctx.textAlign = 'center'; let fs = 52; const T0 = TXT; do { ctx.font = `${fs}px ${QRX.test(T0) ? "\"AmiriQuran\"," : ""}"Noto Naskh Arabic","Amiri","Traditional Arabic","Times New Roman",serif`; fs -= 2; } while (fs > 14 && ctx.measureText(T0).width > W - 36); ctx.fillStyle = r === 0 ? '#1a6ab0' : 'rgba(120,120,120,.28)'; ctx.fillText(T0, W / 2, y); ctx.restore(); } }
    const S = W / 1000; strokes.forEach(s => { ctx.strokeStyle = s.c; ctx.lineWidth = s.w; ctx.lineCap = ctx.lineJoin = 'round'; ctx.beginPath(); s.p.forEach(([x, y], i) => i ? ctx.lineTo(x * S, y) : ctx.moveTo(x * S, y)); ctx.stroke(); });
  };
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * 1000 / r.width, e.clientY - r.top]; };
  cv.onpointerdown = e => { cv.setPointerCapture(e.pointerId); curS = { c: color, w: width, p: [pos(e)] }; strokes.push(curS); };
  cv.onpointermove = e => { if (!curS) return; curS.p.push(pos(e)); draw(); };
  cv.onpointerup = cv.onpointercancel = () => { if (curS) { curS = null; store.set(KEY, strokes.slice(-400)); } };
  $$('.pc2 button', c).forEach(b => b.onclick = () => { color = b.dataset.c; $$('.pc2 button', c).forEach(x => x.classList.toggle('on', x === b)); });
  $$('.pw button', c).forEach(b => b.onclick = () => { width = +b.dataset.w; $$('.pw button', c).forEach(x => x.classList.toggle('on', x === b)); });
  $('[data-a="undo"]', c).onclick = () => { strokes.pop(); store.set(KEY, strokes); draw(); };
  $('[data-a="clr"]', c).onclick = () => { strokes.length = 0; store.set(KEY, []); draw(); };
  draw(); addEventListener('resize', draw);
}

/* ══════════ مولّد أسئلة الألعاب ══════════ */
const POOL = (() => {
  const P = []; Object.values(ITEMS).forEach(U => { const g = genFor(U, true); if (Array.isArray(g)) P.push(...g.map(([q, r, w]) => [q, r, w, ''])); });
  return P;
})();
let bag = [];
export function GEN() { if (!bag.length) bag = shuf(POOL.map((_, i) => i)); const [q, r, w, e] = POOL[bag.pop()]; const opts = shuf([r, ...shuf(w).slice(0, 3)]); return { q, opts, a: opts.indexOf(r), e: e || '✓ ' + r }; }

/* ══════════ المساعد ══════════ */
const BOT = { ctx: '' };
function botAns(q) { const s = loose(q); let best = null, sc = 0; for (const [keys, a] of [...D.BOT, ...ALLBOT]) { const n = keys.filter(k => s.includes(loose(k))).length; if (n > sc) { sc = n; best = a; } } return best || 'لم أجدْ هذا في الدرس 🙂 جرّبْ كلمةً مثل: التاء المربوطة، همزة الوصل، الشمسية، غير، يسر، عادل، الحديث.'; }
function botSay(t, who = 'a') { $('#botLog').insertAdjacentHTML('beforeend', `<div class="m ${who}">${t}</div>`); $('#botLog').scrollTop = 1e6; }
$('#botBtn').onclick = () => { $('#bot').classList.add('open'); if (!$('#botLog').children.length) botSay('أهلًا! أنا مساعدُ لغتي 🤖 أجيبُ من محتوى هذا الدرسِ فقط، ودونَ إنترنت. اخترْ سؤالًا أو اكتبْ كلمة.'); };
$('#botX').onclick = () => $('#bot').classList.remove('open');
$$('#botQ button').forEach(b => b.onclick = () => { botSay(b.textContent, 'u'); botSay(botAns(b.dataset.q)); });
$('#botIn').onkeydown = e => { if (e.key !== 'Enter' || !e.target.value.trim()) return; const v = e.target.value; e.target.value = ''; botSay(esc(v), 'u'); botSay(botAns(v)); };

/* ══════════ عامّ ══════════ */
$('#stars').textContent = '⭐ ' + AR(store.get('stars', 0));
$('#present').onclick = () => { document.body.classList.toggle('present'); toast(document.body.classList.contains('present') ? '🖥️ وضعُ العرضِ على السبّورة' : 'الوضعُ العاديّ'); };
route();

/* ══════════ الرسم العثمانيّ: خطٌّ قرآنيّ لما فيه علاماتُ المصحف ══════════ */
const QRX = /[\u065E\u06D6-\u06DC\u06DF-\u06E8\u06EA-\u06ED\u08F0-\u08F2\u0671]/;
function markQuran(root) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); let n;
  while ((n = w.nextNode())) { if (!QRX.test(n.nodeValue)) continue; if (n.nodeValue.includes('\u065E')) n.nodeValue = n.nodeValue.replace(/\u065E/g, '\u08F1'); const e = n.parentElement; if (!e || e.closest('.qr')) continue; (e.closest('.para p, p, li, label, button, .model, .ff, .fbk, .nfq, .sl, td, h2, h3') || e).classList.add('qr'); }
}
new MutationObserver(() => markQuran(document.body)).observe(document.body, { childList: true, subtree: true });
markQuran(document.body);
