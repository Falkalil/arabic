// أدواتٌ مشتركة لكتاب لغتي التفاعلي (تخزين، نجوم، تنبيه، أدوات النص العربي)
export const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const AR = n => String(n).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);
export const fmt = AR;
export const pick = a => a[Math.floor(Math.random() * a.length)];
export const shuf = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const store = (() => { const K = 'arabic6-book'; let d = {}; try { d = JSON.parse(localStorage.getItem(K)) || {}; } catch (e) {} return { get: (k, v) => d[k] ?? v, set: (k, v) => { d[k] = v; try { localStorage.setItem(K, JSON.stringify(d)); } catch (e) {} } }; })();
let tt;
export function toast(t) { const e = $('#toast'); if (!e) return; e.textContent = t; e.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => e.classList.remove('show'), 1900); }
export function star(n = 1, why = '') { const s = store.get('stars', 0) + n; store.set('stars', s); const b = $('#stars'); if (b) { b.textContent = '⭐ ' + AR(s); b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); } if (why) toast('⭐ +' + AR(n) + ' ' + why); }
export const ansText = x => String(x);
export const fr = (n, d) => n + '/' + d;
export const NAFES = {}, DOMAINS = {}, CHAPTERS = [];

/* ═════ النص العربي ═════ */
export const HARAKAT = /[ً-ْٰـ]/g;
export const bare = s => String(s).replace(HARAKAT, '').replace(/[«»"'.,،؛:؟!()\[\]\-–]/g, '').trim();
/** توحيدٌ متسامح (للمقارنة العامة) */
export const loose = s => bare(s).replace(/[أإآٱ]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/ؤ|ئ/g, 'ء');
/** سببُ الاختلاف بين كلمتين (للإملاء) */
export function whyDiff(typed, right) {
  const a = bare(typed), b = bare(right);
  if (a === b) return '';
  if (loose(a) === loose(b)) {
    if (/[ةه]$/.test(a) && /[ةه]$/.test(b) && a.slice(0, -1) === b.slice(0, -1)) return b.endsWith('ة') ? 'التاءُ المربوطة (ـة)' : 'الهاءُ في آخرِ الكلمة (ـه)';
    if (a.slice(0, -1) === b.slice(0, -1) && /[ىي]$/.test(a) && /[ىي]$/.test(b)) return 'الألفُ اللّيّنة (ى / ي)';
    return 'الهمزة: انتبهْ لشكلِها ومكانِها';
  }
  if (a.replace(/ت$/, 'ة') === b || a.replace(/ة$/, 'ت') === b) return b.endsWith('ة') ? 'هذه تاءٌ مربوطة (ـة)' : 'هذه تاءٌ مفتوحة (ـت)';
  if ('ال' + a === b || a.replace(/^ال/, '') === b.replace(/^ال/, '')) return '«ال» التعريف';
  if (a.replace(/(.)\1/g, '$1') === b.replace(/(.)\1/g, '$1')) return 'الحرفُ المكرّر';
  return 'راجعْ حروفَ الكلمة';
}
/** صوت قصير */
let AC; export function beep(f = 660, d = .12, type = 'sine', v = .12) { if (store.get('mute', false)) return; try { AC ||= new (window.AudioContext || window.webkitAudioContext)(); const o = AC.createOscillator(), g = AC.createGain(); o.type = type; o.frequency.value = f; g.gain.value = v; g.gain.exponentialRampToValueAtTime(.0001, AC.currentTime + d); o.connect(g); g.connect(AC.destination); o.start(); o.stop(AC.currentTime + d); } catch (e) {} }
export const good = () => { beep(660, .1); setTimeout(() => beep(880, .15), 90); };
export const bad = () => beep(180, .25, 'square', .06);
