// تدريباتُ «نافس» — القراءة (الصفّ الثالث): نصوصٌ وأسئلةُ اختيارٍ من متعدّد على نمطِ الاختبارِ الوطنيّ
import { $, $$, AR, store, star, toast, shuf, good, bad } from './kit.js';
import { NAFES as NF, FAHM, UNITS_META } from './units/index.js';
const DS = { nafes: NF, fahm: FAHM };
let NAFES = NF, KIND = 'nafes';
const use = k => { KIND = k; NAFES = DS[k]; };
const NAME = () => KIND === 'fahm' ? 'فهمُ المقروء' : 'نافس';
import { sayText, stop as stopTTS } from './tts.js';

export const hasNafes = (n, k = 'nafes') => !!(DS[k][n] && DS[k][n].length);
const LBL = 'أبجد';
const esc = s => String(s).replace(/[<>&]/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);
const uTitle = n => (UNITS_META.find(m => m.n === n) || {}).t || '';
const passHTML = P => `<div class="nfpass"><div class="nfph"><span class="pill">${P.kind || 'نصّ'}</span><b>${P.title}</b><button class="spk" data-say="${esc(P.paras.join(' '))}" title="استمع">🔊</button></div>${P.paras.map(x => `<p>${x}</p>`).join('')}${P.src ? `<small class="meta">${P.src}</small>` : ''}</div>`;

/** صفحةُ نافس العامّة */
export function nafesHub(main, sel, kind = 'nafes') {
  use(kind);
  if (sel && hasNafes(+sel)) return nafesTab(main, +sel);
  if (sel === 'all') return runExam(main, allSets(), 'اختبارُ ' + NAME() + ' الشامل');
  if (KIND === 'fahm') return fahmHub(main);
  const units = Object.keys(NAFES).map(Number);
  main.innerHTML = `<div class="card nfhead"><h2>🎯 تدريباتٌ على نمطِ اختبارِ «نافس» — القراءة</h2>
    <p>في اختبارِ نافس تقرأُ نصًّا قصيرًا (أدبيًّا أو معلوماتيًّا) ثم تجيبُ عن أسئلةِ اختيارٍ من متعدّد: معنى كلمة، ومعلومةٌ وردت في النصّ، واستنتاج، والفكرةُ الرئيسة… وغيرها.</p>
    <p class="meta">هذه نصوصٌ وأسئلةٌ تدريبيّةٌ محاكية، أُعِدّت لموضوعاتِ وحداتِ الكتاب، وليست من الاختبارِ الرسميّ.</p></div>
    <div class="units nfunits">${units.map(n => `<a class="unit" href="#/${KIND}/${n}"><span class="un">${AR(n)}</span><span class="ut">${uTitle(n)}<small>${AR(NAFES[n].length)} نصوص · ${AR(NAFES[n].reduce((s, P) => s + P.qs.length, 0))} سؤالًا${best(n) != null ? ` · أفضلُ نتيجة ${AR(best(n))}٪` : ''}</small></span></a>`).join('')}
    <a class="unit test" href="#/${KIND}/all"><span class="un">⏱️</span><span class="ut">اختبارُ نافس الشامل<small>نصٌّ من كلِّ وحدة · وقتٌ محدّد · تقريرٌ بالمهارات</small></span></a></div>
    <footer>تصميم: أ. فهد الشيخي</footer>`;
}
const best = k => (store.get('nafesA', {}))[KIND === 'nafes' ? k : KIND + k];
const allSets = () => Object.values(NAFES).map(L => shuf(L)[0]);

/** تبويبُ نافس لوحدة */
export function nafesTab(el, n, kind = 'nafes') {
  use(kind);
  const L = NAFES[n] || [];
  if (!L.length) { el.innerHTML = '<div class="card"><p>لا توجدُ تدريباتُ نافس لهذه الوحدة.</p></div>'; return; }
  el.innerHTML = `<div class="card nfhead"><h2>${KIND === 'fahm' ? '📚' : '🎯'} ${NAME()} — ${uTitle(n)}</h2><p class="meta">اقرأِ النصَّ بتمعّن، ثم أجبْ. في «التدريب» ترى الشرحَ بعدَ كلِّ إجابة، وفي «الاختبار المؤقّت» تُعرَضُ نتيجتُك ومهاراتُك في النهاية.</p>
    <div class="nfmodes"><button class="btn" data-m="exam">⏱️ اختبارٌ مؤقّتٌ للوحدة</button></div></div>
    ${L.map((P, i) => `<div class="card"><div class="row"><b class="nft">${AR(i + 1)}. ${P.title}</b><span class="pill">${P.kind || ''}</span><span class="pill">${AR(P.qs.length)} أسئلة</span><button class="btn sm" data-p="${i}">📘 تدرّبْ مع الشرح</button></div></div>`).join('')}
    <div id="nfq"></div>`;
  const host = $('#nfq', el);
  $$('[data-p]', el).forEach(b => b.onclick = () => runLearn(host, L[+b.dataset.p]));
  $('[data-m="exam"]', el).onclick = () => runExam(host, L, 'اختبارُ ' + NAME() + ': ' + uTitle(n), KIND + n);
}

function qHTML(Q, i, N, ans, learn) {
  const done = ans >= 0;
  return `<div class="nfprog"><i style="width:${(i / N) * 100}%"></i></div><div class="nfq"><span class="pill">سؤال ${AR(i + 1)} من ${AR(N)}</span> ${Q[0]}</div>
    <div class="opts nfo">${Q.order.map((k, j) => `<button data-k="${k}" class="${done && learn ? (k === Q[2] ? 'ok' : k === ans ? 'no' : '') : ans === k ? 'sel' : ''}"><b class="nfl">${LBL[j]}</b> ${Q[1][k]}</button>`).join('')}</div>
    ${done && learn ? `<div class="nfe ${ans === Q[2] ? 'ok' : 'no'}"><b>${ans === Q[2] ? '✓ إجابةٌ صحيحة!' : '✗ الإجابةُ الصحيحة: ' + Q[1][Q[2]]}</b><br>${Q[3] || ''}${Q[4] ? `<br><small>المهارة: ${Q[4]}</small>` : ''}</div>` : ''}`;
}
function runLearn(host, P) {
  stopTTS(); const qs = P.qs.map(q => Object.assign([...q], { order: shuf(q[1].map((_, k) => k)) }));
  const ans = qs.map(() => -1); let i = 0;
  const draw = () => {
    host.innerHTML = `<div class="card nfcard">${passHTML(P)}<div class="nfbox">${qHTML(qs[i], i, qs.length, ans[i], true)}<div class="row c">${i > 0 ? '<button class="btn s sm" data-a="prev">→ السابق</button>' : ''}${ans[i] >= 0 ? `<button class="btn sm" data-a="next">${i < qs.length - 1 ? 'التالي ←' : 'النتيجة ←'}</button>` : ''}</div></div></div>`;
    $$('.nfo button', host).forEach(b => b.onclick = () => { if (ans[i] >= 0) return; ans[i] = +b.dataset.k; ans[i] === qs[i][2] ? good() : bad(); draw(); });
    const nx = $('[data-a="next"]', host); if (nx) nx.onclick = () => { if (i < qs.length - 1) { i++; draw(); } else report(host, [P], [qs], [ans], null, () => runLearn(host, P)); };
    const pv = $('[data-a="prev"]', host); if (pv) pv.onclick = () => { i--; draw(); };
  };
  draw(); host.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
function runExam(host, sets, title, key = 'all') {
  stopTTS(); const QS = sets.map(P => P.qs.map(q => Object.assign([...q], { order: shuf(q[1].map((_, k) => k)) })));
  const ANS = QS.map(q => q.map(() => -1)); const flat = []; QS.forEach((q, s) => q.forEach((_, i) => flat.push([s, i])));
  let f = 0; const t0 = Date.now(), limit = flat.length * 75; let timer;
  const draw = () => {
    const [s, i] = flat[f], P = sets[s];
    host.innerHTML = `<div class="card nfcard"><div class="nfbar"><b>${title}</b><span class="pill py" id="nfT">⏱️</span></div>
      <details class="nfpd" ${i === 0 ? 'open' : ''}><summary>📄 النصّ: ${P.title} (اضغطْ للإظهار/الإخفاء)</summary>${passHTML(P)}</details>
      <div class="nfbox">${qHTML(QS[s][i], f, flat.length, ANS[s][i], false)}<div class="row c">${f > 0 ? '<button class="btn s sm" data-a="prev">→ السابق</button>' : ''}<button class="btn sm" data-a="next">${f < flat.length - 1 ? 'التالي ←' : 'إنهاءُ الاختبار ✓'}</button></div></div></div>`;
    $$('.nfo button', host).forEach(b => b.onclick = () => { ANS[s][i] = +b.dataset.k; draw(); });
    $('[data-a="next"]', host).onclick = () => { if (f < flat.length - 1) { f++; draw(); } else { const miss = flat.filter(([a, b]) => ANS[a][b] < 0).length; if (miss && !confirm(`لم تُجبْ عن ${AR(miss)} سؤالًا. أتريدُ الإنهاء؟`)) return; done(); } };
    const pv = $('[data-a="prev"]', host); if (pv) pv.onclick = () => { f--; draw(); };
    tick();
  };
  const tick = () => { const e = $('#nfT', host); if (!e) return; const left = Math.max(0, limit - Math.floor((Date.now() - t0) / 1000)); e.textContent = '⏱️ ' + AR(Math.floor(left / 60)) + ':' + AR(String(left % 60).padStart(2, '0')); if (!left) done(); };
  const done = () => { clearInterval(timer); report(host, sets, QS, ANS, key, () => runExam(host, sets, title, key)); };
  timer = setInterval(tick, 1000); draw(); host.scrollIntoView({ block: 'start', behavior: 'smooth' });
}
function report(host, sets, QS, ANS, key, again) {
  let ok = 0, n = 0; const sk = {};
  QS.forEach((q, s) => q.forEach((Q, i) => { n++; const r = ANS[s][i] === Q[2]; if (r) ok++; const k = Q[4] || 'عامّ'; (sk[k] ||= [0, 0])[1]++; if (r) sk[k][0]++; }));
  const pct = Math.round(ok / n * 100);
  const lvl = pct >= 90 ? ['🏆', 'متقدّم', '#2f8f6a'] : pct >= 70 ? ['🥇', 'متمكّن', '#3a7ae0'] : pct >= 50 ? ['🙂', 'مقاربٌ للتمكّن', '#e0a21a'] : ['💪', 'يحتاجُ إلى دعم', '#c8102e'];
  host.innerHTML = `<div class="card nfres"><div class="big" style="color:${lvl[2]}">${lvl[0]} ${AR(ok)} / ${AR(n)}</div><div class="pct" style="--p:${pct};--c:${lvl[2]}"><b>${AR(pct)}٪</b></div><p><b>المستوى: ${lvl[1]}</b></p>
    <h3>نتيجتُك في كلِّ مهارة</h3>${Object.entries(sk).map(([k, [a, b]]) => `<div class="nfl2"><span>${k}</span><span class="${a === b ? 'ok' : a ? 'mid' : 'no'}">${AR(a)}/${AR(b)}</span></div>`).join('')}
    <h3>مراجعةُ الإجابات</h3>${QS.map((q, s) => q.map((Q, i) => `<details class="nfrev ${ANS[s][i] === Q[2] ? 'ok' : 'no'}"><summary>${ANS[s][i] === Q[2] ? '✓' : '✗'} ${Q[0]}</summary><div><p><b>الإجابةُ الصحيحة:</b> ${Q[1][Q[2]]}${ANS[s][i] >= 0 && ANS[s][i] !== Q[2] ? `<br><b>إجابتُك:</b> ${Q[1][ANS[s][i]]}` : ANS[s][i] < 0 ? '<br><b>لم تُجب.</b>' : ''}</p><p class="meta">${Q[3] || ''}</p></div></details>`).join('')).join('')}
    <div class="row c"><button class="btn" data-a="again">🔁 أعِدِ المحاولة</button></div></div>`;
  $('[data-a="again"]', host).onclick = again;
  if (pct >= 80) star(key ? 4 : 2, 'أحسنتَ في تدريبِ ' + NAME() + '!');
  if (key != null) { const b = store.get('nafesA', {}); b[key] = Math.max(b[key] || 0, pct); store.set('nafesA', b); }
  host.scrollIntoView({ block: 'start', behavior: 'smooth' });
}

/** صفحةُ فهمِ المقروء: نصوصٌ مرتبطةٌ بموضوعاتِ الدروس */
function fahmHub(main) {
  const units = Object.keys(NAFES).map(Number);
  main.innerHTML = `<div class="card nfhead"><h2>📚 فهمُ المقروء — نصوصٌ من موضوعاتِ الدروس</h2>
    <p>نصوصٌ قصيرةٌ تُكمِلُ موضوعاتِ الكتاب، تقرؤها ثم تجيبُ عن أسئلةٍ تقيسُ الفهمَ الحرفيَّ والاستنتاجيَّ والنقديّ.</p>
    <p class="meta">النصوصُ والأسئلةُ تدريبيّةٌ أُعِدَّت لهذا الكتابِ التفاعليّ.</p></div>
    <div class="units nfunits">${units.map(n => `<a class="unit" href="#/fahm/${n}"><span class="un">📚</span><span class="ut">${uTitle(n)}<small>${NAFES[n].map(P => P.title).join(' · ')}</small></span></a>`).join('')}
    <a class="unit test" href="#/fahm/all"><span class="un">⏱️</span><span class="ut">اختبارُ فهمِ المقروء الشامل<small>نصٌّ من كلِّ قسم · تقريرٌ بالمهارات</small></span></a></div>
    <footer>تصميم: أ. فهد الشيخي</footer>`;
}
