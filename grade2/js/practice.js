// أزرار الألعاب وأدوات الصف في شريط الكتاب
export function initPractice(LESSONS, opt) {
  const cur = () => { const c = window.__book ? window.__book.cur : 1; return LESSONS.find(x => c >= x.from && c <= x.to) || LESSONS[0]; };
  const gb = document.createElement('button'); gb.className = 'tb'; gb.id = 'btnGames'; gb.title = 'ألعاب الدرس';
  gb.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10v5M4.5 12.5h5"/><circle cx="16" cy="11.5" r="1" fill="currentColor"/><circle cx="18.5" cy="14" r="1" fill="currentColor"/></svg><span class="lbl">ألعاب</span>';
  const anchor = document.getElementById('btnLesson'); anchor ? anchor.after(gb) : document.body.appendChild(gb);
  gb.onclick = () => opt.open(cur(), 'games');
  const tp = document.getElementById('toolsPop');
  if (tp) [['🎡 أدوات الصف (العجلة والاختيار العشوائي)', () => opt.open('tools')], ['🔊 استمع إلى النص', () => opt.open(LESSONS[0], 'read')], ['🎮 ألعاب الدرس', () => gb.click()]].forEach(([t, f]) => { const b = document.createElement('button'); b.textContent = t; tp.prepend(b); b.onclick = () => { tp.classList.remove('open'); f(); }; });
  return { open: () => gb.click(), close: () => {}, isOpen: () => false };
}
