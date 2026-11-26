// يولّد js/data.js لغلاف الكتاب (الفهرس وربط الصفحات بالدروس) من سجلّ الوحدات
import { writeFileSync } from 'fs';
const R = '/home/claude/arabic/grade4';
const { UNITS_META, ITEMS } = await import(R + '/lessons/js/units/index.js');
const CUSTOM = {};
const L = [], TOC = [];
for (const M of UNITS_META) {
  const its = M.items.map(id => [id, ITEMS[id] || CUSTOM[id]]).filter(x => x[1]);
  TOC.push({ t: M.t, items: its.map(([id, it]) => [it.t, it.p[0], it.kind === 'lesson' ? 'ch' : '']) });
  its.forEach(([id, it]) => L.push({ id, title: it.t, short: it.t, from: it.p[0], to: it.p[1], kind: it.kind === 'test' ? 'test' : 'lesson', ch: M.n, color: M.c }));
}
const js = `// بيانات كتاب لغتي الجميلة التفاعلي — الصف الرابع الابتدائي — الجزء الأول (مولَّد بـ tools/gen_bookdata.mjs)
export const BOOK = { title: 'لغتي الجميلة – الصف الرابع الابتدائي – الجزء الأول', pages: 158, w: 1000, h: 1200 };
export const toPdf = p => p;
export const toPrinted = n => n;
export const MODELS = [];
export const TOC = ${JSON.stringify([{ t: 'المقدّمة والفهرس', items: [['الغلاف', 1], ['المقدّمة', 5], ['رسائل إلى الطالب والمعلم', 6], ['دليل الأسرة', 7], ['المكوّنات الرئيسة', 8], ['الفهرس', 9], ['نصوص الاستظهار', 10]] }, ...TOC], null, 1)};
export const LESSONS = ${JSON.stringify(L, null, 1)};
`;
writeFileSync(R + '/js/data.js', js); console.log(L.length, 'lessons');
