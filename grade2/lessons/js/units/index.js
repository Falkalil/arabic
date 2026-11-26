// سجلُّ وحداتِ كتابِ لغتي — الصفّ الثالث، الجزء الأوّل
import * as U0 from './u0.js';
import * as U1 from './u1.js';
import * as U2 from './u2.js';
import * as U3 from './u3.js';
import * as U4 from './u4.js';
const MODS = [U0, U1, U2, U3, U4];
export const UNITS_META = MODS.map(m => m.UNIT);
export const ITEMS = {};
MODS.forEach(m => (m.ITEMS || []).forEach(it => { ITEMS[it.id] = { unit: m.UNIT.n, ...it }; }));
export const ALLBOT = [].concat(...MODS.map(m => m.BOT || []));
export const NAFES = {}, FAHM = {};
MODS.forEach(m => { if (m.NAFES && m.NAFES.length) NAFES[m.UNIT.n] = m.NAFES; if (m.FAHM && m.FAHM.length) FAHM[m.UNIT.n] = m.FAHM; });
export const PRE = null, KHAT = null;
