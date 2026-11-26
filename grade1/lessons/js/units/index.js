// سجلُّ وحداتِ كتابِ لغتي — الصفّ الأوّل، الجزء الأوّل (كلُّ وحدةٍ قد تتوزّعُ على أكثرَ من ملفّ)
import * as A from './u0a.js'; import * as B from './u0b.js';
import * as C from './u1a.js'; import * as D from './u1b.js';
import * as E from './u2a.js'; import * as F from './u2b.js';
import * as G from './u3a.js'; import * as H from './u3b.js';
const MODS = [A, B, C, D, E, F, G, H];
const byN = {};
MODS.forEach(m => { const U = m.UNIT; const M = byN[U.n] || (byN[U.n] = { ...U, items: [], p: [...U.p] }); M.items.push(...U.items); M.p = [Math.min(M.p[0], U.p[0]), Math.max(M.p[1], U.p[1])]; if (U.main) Object.assign(M, { t: U.t, c: U.c }); });
export const UNITS_META = Object.keys(byN).map(Number).sort((a, b) => a - b).map(n => byN[n]);
export const ITEMS = {};
MODS.forEach(m => (m.ITEMS || []).forEach(it => { ITEMS[it.id] = { unit: m.UNIT.n, ...it }; }));
export const ALLBOT = [].concat(...MODS.map(m => m.BOT || []));
export const NAFES = {}, FAHM = {};
export const PRE = null, KHAT = null;
