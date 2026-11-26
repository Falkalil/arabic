// يجمع نصوصَ القراءة والأناشيد مع مفاتيحِ الصوت: node tools/dump_texts.mjs > tools/texts.json
const R = '/home/claude/arabic/grade1/lessons/js/';
const { ITEMS } = await import(R + 'units/index.js');
const D = await import(R + 'data.js');
const out = {};
const put = (key, paras) => paras.forEach((p, k) => { out[key + '-p' + (k + 1)] = p; });

for (const U of Object.values(ITEMS)) for (const [tk, bl] of Object.entries(U.blocks || {})) bl.forEach((b, i) => {
  if (b.type === 'read') put(b.key || U.id + '-' + (b.k || 'r' + tk + i), b.text.paras.map(p => p[1]));
  if (b.type === 'poem') put(b.key || U.id + '-' + (b.k || 'p' + tk + i), b.lines.map(l => [].concat(l).join(' | ')));
});
console.log(JSON.stringify(out, null, 0));
