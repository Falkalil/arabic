// القراءةُ النموذجيّة: ملفّ صوتيّ مسجَّل إن وُجد (audio/<key>.mp3 + .vtt)، وإلا صوتُ الجهاز العربيّ (آليّ)
import { store, toast } from './kit.js';
import { AUDIO } from './data.js';

const synth = window.speechSynthesis;
let voice = null, cur = null, timer = null, audio = null, token = 0;
function pickVoice() {
  if (!synth) return null; const V = synth.getVoices().filter(v => /^ar/i.test(v.lang));
  return V.find(v => /SA/i.test(v.lang) && /Hamed|Zariyah|Google|Natural|Neural/i.test(v.name)) || V.find(v => /SA/i.test(v.lang)) || V.find(v => /Google|Natural|Neural/i.test(v.name)) || V[0] || null;
}
if (synth) { voice = pickVoice(); synth.onvoiceschanged = () => { voice = pickVoice(); }; }
export const hasVoice = () => !!(voice || (voice = pickVoice()));
export const rate = () => store.get('rate', .85);
export const setRate = r => store.set('rate', r);

/** نصٌّ منطوق: إظهار الصلاة على النبي، وتصحيح «الْا» لهمزة الوصل */
export const spoken = s => String(s).replace(/\[\[([^|\]]+)\|[^\]]+\]\]/g, '$1').replace(/[{}«»"]/g, '').replace(/ﷺ/g, 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ').replace(/الْا/g, 'الِا').replace(/ـ/g, '');

export function stop() {
  token++; clearInterval(timer); timer = null;
  if (synth) try { synth.cancel(); } catch (e) {}
  if (audio) { try { audio.pause(); } catch (e) {} audio = null; }
  if (cur && cur.onend) { const f = cur.onend; cur = null; f(true); } cur = null;
}

let IDX; const AUD = {}; // ذاكرة توفّر الملفات المسجّلة
async function recorded(key) {
  if (!key) return null; if (IDX === undefined) { IDX = null; try { const r = await fetch('../audio/index.json'); if (r.ok) IDX = new Set(await r.json()); } catch (e) {} }
  if (!AUDIO.includes(key) && !(IDX && IDX.has(key))) return null; if (key in AUD) return AUD[key];
  AUD[key] = null;
  try { const r = await fetch(`../audio/${key}.vtt`); if (r.ok) { const t = await r.text(); const cues = [...t.matchAll(/(\d+):(\d+):([\d.]+)\s*-->/g)].map(m => +m[1] * 3600 + +m[2] * 60 + +m[3]); if (cues.length) AUD[key] = { src: `../audio/${key}.mp3`, cues }; } } catch (e) {}
  return AUD[key];
}

/**
 * يقرأ كلماتٍ (مصفوفة نصوص) ويستدعي onword(i) عند كلّ كلمة، وonend(stopped) في النهاية.
 */
export async function say(words, { onword = () => {}, onend = () => {}, key = null, silent = false } = {}) {
  stop(); const my = ++token; cur = { onend };
  const finish = st => { if (my !== token) return; clearInterval(timer); timer = null; const f = cur && cur.onend; cur = null; f && f(!!st); };
  const rec = silent ? null : await recorded(key);
  if (my !== token) return;
  if (rec) {
    audio = new Audio(rec.src); audio.playbackRate = Math.min(1.2, Math.max(.6, rate() / .85));
    let last = -1; audio.ontimeupdate = () => { const t = audio.currentTime; let i = rec.cues.findIndex((c, k) => t >= c && (k === rec.cues.length - 1 || t < rec.cues[k + 1])); if (i !== last && i >= 0 && i < words.length) { last = i; onword(i); } };
    audio.onended = () => finish(false); audio.onerror = () => { AUD[key] = null; say(words, { onword, onend, silent }); };
    audio.play().catch(() => finish(true)); return;
  }
  // تقديرُ زمنِ كلِّ كلمة (للتظليل عند غياب أحداثِ الحدود)
  const est = w => (260 + w.replace(/[ً-ْ]/g, '').length * 70) / (rate() / .85);
  let i = 0, gotBoundary = false;
  const tick = () => { if (i >= words.length) { clearInterval(timer); timer = null; return; } onword(i); const d = est(words[i]); i++; clearInterval(timer); timer = setTimeout(tick, d); };
  if (silent || !synth || !hasVoice()) {
    if (!silent && !hasVoice()) toast('لا يوجدُ صوتٌ عربيٌّ على هذا الجهاز — سيُظلَّلُ النصُّ لتقرأه بنفسك');
    let k = 0; const step = () => { if (my !== token) return; if (k >= words.length) return finish(false); onword(k); timer = setTimeout(step, est(words[k]) * (silent ? 1.25 : 1)); k++; }; step(); return;
  }
  const sp = words.map(spoken); let text = '', starts = [];
  sp.forEach(w => { starts.push(text.length); text += w + ' '; });
  const u = new SpeechSynthesisUtterance(text.trim()); u.lang = voice.lang || 'ar-SA'; u.voice = voice; u.rate = rate();
  u.onboundary = e => { if (e.name && e.name !== 'word') return; gotBoundary = true; clearTimeout(timer); let k = 0; while (k + 1 < starts.length && starts[k + 1] <= e.charIndex) k++; onword(k); };
  u.onstart = () => { setTimeout(() => { if (!gotBoundary && my === token) tick(); }, 650); };
  u.onend = () => finish(false); u.onerror = () => finish(true);
  synth.speak(u);
}
export const sayText = (s, o) => say(spoken(s).split(/\s+/).filter(Boolean), o);
export const speaking = () => !!cur;
