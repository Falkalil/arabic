// يتحقق من سلامة بيانات الوحدات: node tools/check_units.mjs
import { pathToFileURL } from 'url';
const base = '/home/claude/arabic/grade4/lessons/js/units/';
let errs = 0; const E = (...a) => { errs++; console.log('✗', ...a); };
const bare = s => String(s).replace(/[ً-ْٰـ]/g, '').replace(/[«»"'.,،؛:؟!()\[\]\-–]/g, '').trim();
for (const n of process.argv.slice(2).length ? process.argv.slice(2) : [1, 2, 3, 4, 5, 6]) {
  const m = await import(pathToFileURL(base + `u${n}.js`).href + '?' + Date.now());
  const U = m.UNIT; if (!U || U.n !== +n) E(`u${n}: UNIT.n`);
  const ids = new Set((m.ITEMS || []).map(i => i.id));
  for (const id of U.items) if (!ids.has(id)) E(`u${n}: items has unknown ${id}`);
  let nb = 0, nq = 0;
  for (const it of m.ITEMS || []) {
    const P = `u${n}/${it.id}`;
    for (const f of ['id', 'kind', 'badge', 't', 's', 'p', 'tabs']) if (it[f] == null) E(P, 'missing', f);
    for (const [k] of it.tabs) if (!['games', 'nafes'].includes(k) && !(it.blocks || {})[k]) E(P, 'tab without blocks', k);
    for (const [k, bl] of Object.entries(it.blocks || {})) bl.forEach((b, i) => { nb++; const Q = `${P}/${k}[${i}] ${b.type}`;
      if (b.page != null && (b.page < 1 || b.page > 158)) E(Q, 'page');
      switch (b.type) {
        case 'mcq': b.items.forEach(([q, o, a], j) => { nq++; if (!(a >= 0 && a < o.length)) E(Q, j, 'answer index'); if (new Set(o).size !== o.length) E(Q, j, 'dup opts'); }); break;
        case 'tf': b.items.forEach(([q, v], j) => { nq++; if (typeof v !== 'boolean') E(Q, j, 'tf bool'); }); break;
        case 'match': if (b.left.length !== b.right.length) E(Q, 'match len'); nq += b.left.length; break;
        case 'sort': b.items.forEach(([w, x], j) => { nq++; if (!(x >= 0 && x < b.bins.length)) E(Q, j, 'bin'); }); break;
        case 'blank': b.items.forEach(([x, y, a, o], j) => { nq++; const opts = o || b.bank; if (!opts || !opts.some(z => bare(z) === bare(a))) E(Q, j, 'answer not in options'); }); break;
        case 'order': b.items.forEach(([w, ok], j) => { nq++; const s = bare(w.join(' ')).split(/\s+/).sort().join(' '); for (const o of [].concat(ok)) if (bare(o).split(/\s+/).sort().join(' ') !== s) E(Q, j, 'order words mismatch'); }); break;
        case 'read': if (!b.text || !b.text.paras || !b.text.paras.length) E(Q, 'paras'); else b.text.paras.forEach((x, j) => { if (!Array.isArray(x) || x.length < 2) E(Q, j, 'para shape'); if (b.text.spk && !b.text.spk[x[0]] && x[0] !== 'n') E(Q, j, 'speaker', x[0]); }); break;
        case 'poem': if (!b.lines || !b.lines.length) E(Q, 'lines'); break;
        case 'seq': case 'dict': case 'cards': case 'check': if (!b.items || !b.items.length) E(Q, 'items'); break;
        case 'parts': (b.items||[]).forEach(([w,a],j)=>{nq++; if(w.length!==a.length) E(Q,j,'parts len'); if(a.some(x=>x>=b.cats.length)) E(Q,j,'parts cat');}); break;
        case 'open': case 'text': case 'khat': case 'write': case 'page': break;
        default: E(Q, 'unknown type');
      }
    });
  }
  for (const [nm, L] of [['nafes', m.NAFES || []], ['fahm', m.FAHM || []]]) L.forEach((P, i) => { if (!P.title || !P.paras || !P.paras.length) E(`u${n} ${nm} ${i}`, 'passage'); });
  (m.FAHM || []).forEach((P, i) => P.qs.forEach(([q, o, a, e, sk], j) => { nq++; if (o.length !== 4) E(`u${n} fahm ${i}.${j}`, '4 options'); if (!(a >= 0 && a < 4)) E(`u${n} fahm ${i}.${j}`, 'answer'); if (!sk) E(`u${n} fahm ${i}.${j}`, 'skill'); }));
  (m.NAFES || []).forEach((P, i) => P.qs.forEach(([q, o, a, e, sk], j) => { nq++; if (o.length !== 4) E(`u${n} nafes ${i}.${j}`, '4 options'); if (!(a >= 0 && a < 4)) E(`u${n} nafes ${i}.${j}`, 'answer'); if (!sk) E(`u${n} nafes ${i}.${j}`, 'skill'); }));
  const dist = [0, 0, 0, 0]; (m.NAFES || []).forEach(P => P.qs.forEach(q => dist[q[2]]++));
  console.log(`u${n}: ${(m.ITEMS || []).length} items, ${nb} blocks, ${nq} questions, nafes ${(m.NAFES || []).length} texts, fahm ${(m.FAHM || []).length} texts, answer spread ${dist.join('/')}`);
}
console.log(errs ? `${errs} errors` : 'OK'); process.exit(errs ? 1 : 0);
