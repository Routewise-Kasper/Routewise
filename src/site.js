(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rand = (a, b) => a + Math.random() * (b - a);

  /* ---------- pixel veil page transition ---------- */
  const veil = document.querySelector('.pixel-veil');
  let cells = [];
  function buildVeil() {
    const size = innerWidth < 720 ? 72 : 120;
    const cols = Math.ceil(innerWidth / size), rows = Math.ceil(innerHeight / size);
    veil.style.gridTemplateColumns = `repeat(${cols},1fr)`;
    veil.style.gridTemplateRows = `repeat(${rows},1fr)`;
    veil.innerHTML = '<i></i>'.repeat(cols * rows);
    cells = [...veil.children];
  }
  function animateVeil(show, done) {
    veil.classList.remove('is-idle');
    let max = 0;
    cells.forEach((c) => {
      const d = rand(0, 420);
      max = Math.max(max, d);
      c.style.opacity = show ? 0 : 1;
      setTimeout(() => { c.style.opacity = show ? 1 : 0; }, d);
    });
    setTimeout(() => { if (!show) veil.classList.add('is-idle'); done && done(); }, max + 60);
  }
  if (veil && !reduced) {
    buildVeil();
    requestAnimationFrame(() => animateVeil(false));
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('data-no-transition')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.hash)) return;
      e.preventDefault();
      buildVeil();
      animateVeil(true, () => { location.href = url.href; });
    });
    addEventListener('pageshow', (e) => { if (e.persisted) { buildVeil(); animateVeil(false); } });
  } else if (veil) veil.classList.add('is-idle');

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      en.target.classList.add('is-in');
      en.target.querySelectorAll('[data-scramble]').forEach(scramble);
      io.unobserve(en.target);
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 3) * 70}ms`;
    io.observe(el);
  });

  /* ---------- text scramble ---------- */
  const glyphs = '!<>-_\\/[]{}=+*^?#01';
  function scramble(el) {
    if (reduced || el.dataset.done) return;
    el.dataset.done = 1;
    const final = el.textContent;
    let frame = 0;
    const total = 22;
    const tick = () => {
      el.textContent = [...final].map((ch, i) => (ch === ' ' || frame / total > i / final.length + 0.15 ? ch : glyphs[(Math.random() * glyphs.length) | 0])).join('');
      if (++frame <= total) requestAnimationFrame(tick); else el.textContent = final;
    };
    tick();
  }

  /* ---------- typewriter words ---------- */
  document.querySelectorAll('.type[data-words]').forEach((el) => {
    const words = el.dataset.words.split(',');
    if (reduced || words.length < 2) return;
    let w = 0, i = words[0].length, deleting = true;
    const step = () => {
      const word = words[w];
      if (deleting) {
        i--;
        el.textContent = word.slice(0, i);
        if (i === 0) { deleting = false; w = (w + 1) % words.length; return setTimeout(step, 260); }
        return setTimeout(step, 55);
      }
      const next = words[w];
      i++;
      el.textContent = next.slice(0, i);
      if (i === next.length) { deleting = true; return setTimeout(step, 2200); }
      setTimeout(step, 95);
    };
    setTimeout(step, 2400);
  });

  /* ---------- count up ---------- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const n = +el.dataset.count;
    if (reduced || !n) return;
    const t0 = performance.now();
    const run = (t) => {
      const p = Math.min(1, (t - t0) / 1100);
      el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(run);
    };
    requestAnimationFrame(run);
  });

  /* ---------- category filters ---------- */
  const filters = document.querySelector('.filters');
  const grid = document.querySelector('[data-filterable]');
  if (filters && grid) {
    const apply = (key) => {
      filters.querySelectorAll('.filter').forEach((b) => {
        const on = b.dataset.filter === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on);
      });
      grid.querySelectorAll('.card').forEach((c, i) => {
        const show = key === 'all' || c.dataset.cat === key;
        c.classList.toggle('is-hidden', !show);
        c.classList.remove('is-pop');
        if (show) { c.classList.add('is-in'); void c.offsetWidth; c.style.animationDelay = `${i * 40}ms`; c.classList.add('is-pop'); }
      });
    };
    filters.addEventListener('click', (e) => {
      const b = e.target.closest('.filter');
      if (!b) return;
      apply(b.dataset.filter);
      history.replaceState(null, '', b.dataset.filter === 'all' ? location.pathname : `#${b.dataset.filter}`);
    });
    const h = location.hash.slice(1);
    if (h && filters.querySelector(`[data-filter="${h}"]`)) {
      apply(h);
      setTimeout(() => filters.scrollIntoView({ behavior: 'smooth', block: 'start' }), 500);
    }
  }

  /* ---------- toc highlight ---------- */
  const tocLinks = [...document.querySelectorAll('.toc a')];
  if (tocLinks.length) {
    const map = new Map(tocLinks.map((a) => [a.getAttribute('href').slice(1), a]));
    const tio = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          tocLinks.forEach((a) => a.classList.remove('is-current'));
          map.get(en.target.id)?.classList.add('is-current');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    map.forEach((_, id) => { const h = document.getElementById(id); if (h) tio.observe(h); });
  }
})();
