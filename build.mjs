// Routewise 静态站构建：node build.mjs → dist/
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { SITE_URL, BRAND, GO_LINKS, LANGS, SECTIONS, GSC_VERIFICATION } from './site.config.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const CONTENT = path.join(ROOT, 'content');
const PUBLIC = path.join(ROOT, 'public');

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
const write = (rel, html) => {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};
const iso = (d) => new Date(d).toISOString().slice(0, 10);
const fmtDate = (d, lang) => new Date(d).toLocaleDateString(LANGS[lang].dateLocale, lang === 'zh'
  ? { year: 'numeric', month: 'numeric', day: 'numeric', timeZone: 'UTC' }
  : { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
const imgExists = (src) => src && fs.existsSync(path.join(PUBLIC, src));
const other = (lang) => (lang === 'zh' ? 'en' : 'zh');

// ---------- 内容 ----------
function load(dir, lang, kind) {
  const full = path.join(CONTENT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(full, f), 'utf8'));
    const slug = data.slug || f.replace(/\.md$/, '');
    const L = LANGS[lang];
    const section = data.section || 'guides';
    const url = kind === 'post' ? `${L.prefix}/${section}/${slug}/` : `${L.prefix}/${slug}/`;
    const text = content.replace(/[#>*`\-\[\]\(\)!|:]/g, '');
    const minutes = lang === 'zh' ? Math.max(2, Math.round(text.replace(/\s/g, '').length / 400)) : Math.max(2, Math.round(text.split(/\s+/).length / 220));
    return { ...data, section, slug, lang, kind, url, body: content, minutes, key: data.key || slug, draft: !!data.draft };
  }).filter((p) => !p.draft);
}

const posts = {};
const pages = {};
for (const lang of Object.keys(LANGS)) {
  posts[lang] = load(`posts/${lang}`, lang, 'post').sort((a, b) => new Date(b.date) - new Date(a.date) || a.slug.localeCompare(b.slug));
  pages[lang] = load(`pages/${lang}`, lang, 'page');
}
// 配图唯一性检查：不同主题（key）不能共用同一张图
{
  const byImage = new Map();
  for (const lang of Object.keys(LANGS)) for (const p of posts[lang]) {
    if (!p.image) continue;
    if (!byImage.has(p.image)) byImage.set(p.image, new Set());
    byImage.get(p.image).add(p.key);
  }
  const dup = [...byImage].filter(([, keys]) => keys.size > 1);
  if (dup.length) {
    console.error('配图重复：' + dup.map(([img, keys]) => `${img} ← ${[...keys].join(', ')}`).join('; '));
    process.exit(1);
  }
}
const counterpart = (item) => {
  const pool = item.kind === 'post' ? posts[other(item.lang)] : pages[other(item.lang)];
  return pool.find((p) => p.key === item.key);
};

// ---------- Markdown ----------
function render(md) {
  const headings = [];
  const renderer = new marked.Renderer();
  renderer.heading = function ({ tokens, depth }) {
    const text = this.parser.parseInline(tokens);
    const plain = text.replace(/<[^>]+>/g, '');
    const id = slugify(plain) || `h-${headings.length}`;
    if (depth === 2) headings.push({ id, text: plain });
    return `<h${depth} id="${id}">${text}</h${depth}>`;
  };
  renderer.link = function ({ href, title, tokens }) {
    const text = this.parser.parseInline(tokens);
    const ext = /^https?:/.test(href);
    const go = href.startsWith('/go/');
    const rel = go ? ' rel="sponsored nofollow"' : ext ? ' rel="noopener"' : '';
    const target = ext || go ? ' target="_blank"' : '';
    return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${rel}${target}${go ? ' data-no-transition' : ''}>${text}</a>`;
  };
  renderer.table = function (token) {
    const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('');
    const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('');
    return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
  };
  md = md.replace(/^:::[ \t]*(tip|note|warn)[ \t]*\n([\s\S]*?)\n:::[ \t]*$/gm, (_, type, inner) => `<aside class="callout callout-${type}"><span class="callout-tag">${type.toUpperCase()}</span>\n\n${inner}\n\n</aside>`);
  return { html: marked.parse(md, { renderer, gfm: true }), headings };
}

// ---------- 组件 ----------
const CSS = fs.readFileSync(path.join(ROOT, 'src/style.css'), 'utf8');
const JS = fs.readFileSync(path.join(ROOT, 'src/site.js'), 'utf8');
const ARROW = `<svg class="i-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
const MARK = `<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><path d="M3 16h26M16 3v26" stroke="currentColor" stroke-width="4"/><path class="mark-x" d="M7 7l18 18" stroke-width="3"/></svg>`;
const cat = (lang, c) => LANGS[lang].categories[c] || c;

function media(p, cls = '') {
  const eager = /featured-media|post-media/.test(cls);
  if (imgExists(p.image)) return `<div class="media ${cls}"><img src="${p.image}" alt="" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" width="1600" height="900"></div>`;
  return `<div class="media media-ph ${cls}" aria-hidden="true"><span>${esc(cat(p.lang, p.category))}</span></div>`;
}

function meta(p) {
  return `<div class="meta-row"><span class="tag">${esc(cat(p.lang, p.category))}</span><span class="date"><i>//</i> ${fmtDate(p.date, p.lang)}</span></div>`;
}

function card(p) {
  const L = LANGS[p.lang];
  return `<article class="card reveal" data-cat="${p.category}">
  <a href="${p.url}" class="card-link">
    ${media(p)}
    <div class="card-body">
      ${meta(p)}
      <div class="card-text"><h3>${esc(p.title)}</h3><p>${esc(p.description)}</p></div>
      <div class="card-foot">${ARROW}<span>${L.view.toUpperCase()}</span></div>
    </div>
  </a>
</article>`;
}

function featured(p) {
  const L = LANGS[p.lang];
  return `<article class="featured reveal">
  <a href="${p.url}" class="featured-link">
    <div class="featured-body">
      ${meta(p)}
      <div class="card-text"><h2>${esc(p.title)}</h2><p>${esc(p.description)}</p></div>
      <div class="card-foot">${ARROW}<span>${L.view.toUpperCase()}</span></div>
    </div>
    ${media(p, 'featured-media')}
  </a>
</article>`;
}

function filterTabs(list, lang) {
  const cats = [...new Set(list.map((p) => p.category))];
  if (cats.length < 2) return '';
  return `<div class="filters reveal" role="tablist">
  <button class="filter is-active" data-filter="all" role="tab" aria-selected="true">${LANGS[lang].all}</button>
  ${cats.map((c) => `<button class="filter" data-filter="${c}" role="tab" aria-selected="false">${esc(cat(lang, c))}</button>`).join('')}
</div>`;
}

function sectionLabel(n, total, label) {
  return `<div class="s-label reveal"><span class="s-num">[N.${String(n).padStart(2, '0')}/<i>${String(total).padStart(2, '0')}</i>]</span><span class="s-dash"></span><span class="s-name" data-scramble>&gt; ${label}</span><span class="s-line"></span></div>`;
}

function marquee(lang) {
  const items = LANGS[lang].marquee.map((t) => `<span>${t}</span>`).join('');
  const row = `<div class="marquee-row">${items.repeat(4)}</div>`;
  return `<div class="marquee" aria-hidden="true"><div class="marquee-track">${row}${row}</div></div>`;
}

function cta(lang) {
  const L = LANGS[lang];
  return `<section class="cta-band grid-dark">
  <div class="wrap">
    <div class="cta-box reveal">
      <i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>
      <span class="tag">${L.ctaTag}</span>
      <h2>${esc(L.ctaA)}<br><span class="pixel">[<span class="type" data-words="${L.ctaWords.join(',')}">${L.ctaWords[0]}</span><b class="caret"></b>]</span><br>${esc(L.ctaB)}</h2>
      <a class="btn btn-dark" href="/go/hifast" rel="sponsored nofollow" target="_blank" data-no-transition><i class="sq"></i>${esc(L.ctaButton)}</a>
      <p class="cta-note">${esc(L.ctaNote)} · <a href="${L.prefix}/disclosure/">${L.disclosure}</a></p>
    </div>
  </div>
</section>`;
}

function header(lang, active, altUrl) {
  const L = LANGS[lang];
  const pre = L.prefix;
  const count = (s) => posts[lang].filter((p) => p.section === s).length;
  const item = (key, href, badge) => {
    const on = active === key;
    const label = L.nav[key].toUpperCase();
    return `<a href="${href}" class="nav-item${on ? ' is-active' : ''}"${on ? ' aria-current="page"' : ''}>${on ? `&lt;${label}&gt;` : label}${badge ? `<sup>${badge}</sup>` : ''}</a>`;
  };
  return `<header class="site-header">
  <div class="wrap header-inner">
    <nav class="nav" aria-label="Primary">
      ${item('home', `${pre}/`)}${item('news', `${pre}/news/`, count('news'))}${item('guides', `${pre}/guides/`, count('guides'))}${item('tips', `${pre}/tips/`, count('tips'))}${item('about', `${pre}/about/`)}
    </nav>
    <a class="btn-lang" href="${altUrl}" hreflang="${LANGS[other(lang)].code}">${ARROW}<span>${L.switchLang}</span></a>
  </div>
</header>`;
}

function footer(lang) {
  const L = LANGS[lang];
  const pre = L.prefix;
  const cats = [...new Set(posts[lang].map((p) => p.category))];
  return `${marquee(lang)}
<footer class="site-footer">
  <div class="wrap">
    <div class="footer-grid">
      <div class="footer-main">
        <h3><span class="accent">@</span> ${esc(L.footerTitle)}</h3>
        <p>${esc(L.footerText)}</p>
        <a class="btn btn-dark btn-sm" href="${pre}/rss.xml" data-no-transition><i class="sq"></i>${esc(L.footerRss)}</a>
        <a href="${pre}/" class="wordmark" aria-label="${BRAND}">${MARK}<span>${BRAND}</span></a>
      </div>
      <div class="footer-cols">
        <div class="footer-col">
          <h4>${esc(L.footerPages)}</h4>
          <a href="${pre}/">${esc(L.nav.home)}</a><a href="${pre}/news/">${esc(L.nav.news)}</a><a href="${pre}/guides/">${esc(L.nav.guides)}</a><a href="${pre}/tips/">${esc(L.nav.tips)}</a><a href="${pre}/about/">${esc(L.nav.about)}</a><a href="${pre}/disclosure/">${esc(L.disclosure)}</a>
        </div>
        <div class="footer-col">
          <h4>${esc(L.footerTopics)}</h4>
          ${cats.map((c) => { const s = posts[lang].find((p) => p.category === c).section; return `<a href="${pre}/${s}/#${c}">${esc(cat(lang, c))}</a>`; }).join('')}
        </div>
      </div>
    </div>
  </div>
  <div class="wrap footer-base"><span>© ${new Date().getUTCFullYear()} ${BRAND}</span><span>${esc(L.footerTeam)}</span></div>
</footer>`;
}

function layout({ lang, title, description, url, alt, body, active = '', jsonld = [], ogType = 'website', ogImage, noindex = false }) {
  const L = LANGS[lang];
  const canonical = SITE_URL + url;
  const altUrl = alt ? alt.url : (lang === 'zh' ? '/en/' : '/');
  const hreflang = alt
    ? `<link rel="alternate" hreflang="${L.code}" href="${canonical}"><link rel="alternate" hreflang="${LANGS[alt.lang].code}" href="${SITE_URL + alt.url}"><link rel="alternate" hreflang="x-default" href="${SITE_URL + (lang === 'zh' ? url : alt.url)}">`
    : '';
  return `<!doctype html>
<html lang="${L.code}">
<head>
<meta charset="utf-8">
<script>document.documentElement.classList.add('js');if(matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('reduced')</script>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
<meta name="google-site-verification" content="${GSC_VERIFICATION}">
${hreflang}
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:image" content="${SITE_URL}${ogImage && imgExists(ogImage) ? ogImage : '/og.png'}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#ffffff">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preload" href="/fonts/Geist-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/fonts/GeistMono-Variable.woff2" as="font" type="font/woff2" crossorigin>
<link rel="alternate" type="application/rss+xml" title="${BRAND}" href="${SITE_URL}${L.prefix}/rss.xml">
<style>${CSS}</style>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
<div class="pixel-veil" aria-hidden="true"></div>
${header(lang, active, altUrl)}
<main>${body}</main>
${footer(lang)}
<script>${JS}</script>
</body>
</html>`;
}

// ---------- 生成 ----------
const sitemap = [];
const addSitemap = (url, lastmod, alt) => sitemap.push({ url, lastmod, alt });

for (const lang of Object.keys(LANGS)) {
  const L = LANGS[lang];
  const pre = L.prefix;
  const o = other(lang);
  const all = posts[lang];
  const bySection = (s) => all.filter((p) => p.section === s);

  // 首页
  const news = bySection('news');
  const guides = bySection('guides');
  const tips = bySection('tips');
  const home = `
<section class="hero-top grid-dark">
  <div class="wrap hero-top-inner">
    <a href="${pre}/" class="hero-logo">${MARK}<span>${BRAND}</span><em class="tag tag-dark">v2026.11</em></a>
    <span class="scroll-hint">${L.scroll} ↓</span>
  </div>
</section>
<section class="hero wrap">
  <h1 class="hero-title reveal">${esc(L.heroA)}<br><span class="pixel">[ <span class="type" data-words="${L.heroWords.join(',')}">${L.heroWords[0]}</span><b class="caret"></b> ]</span><br>${esc(L.heroB)}</h1>
  <div class="hero-side reveal">
    <div class="hero-stats"><span><b data-count="${all.length}">${all.length}</b> ${lang === 'zh' ? '篇文章' : 'articles'}</span><i></i><span>${lang === 'zh' ? '每周一更新' : 'New every Monday'}</span></div>
    <p>${esc(L.heroLede)}</p>
    <div class="hero-actions">
      <a class="btn btn-dark" href="${pre}/news/"><i class="sq"></i>${esc(L.readNews)}</a>
      <a class="btn btn-line" href="${pre}/guides/"><svg viewBox="0 0 16 16" class="i-play" aria-hidden="true"><path d="M4 2.5v11l9-5.5z" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>${esc(L.browseGuides)}</a>
    </div>
  </div>
</section>
<section class="wrap reveal"><div class="topics" style="--n:${Object.keys(L.categories).filter((c) => all.some((p) => p.category === c)).length}">
  ${Object.keys(L.categories).filter((c) => all.some((p) => p.category === c)).map((c) => { const s = all.find((p) => p.category === c).section; return `<a class="topic" href="${pre}/${s}/#${c}"><span class="topic-n">${String(all.filter((p) => p.category === c).length).padStart(2, '0')}</span><span>${esc(cat(lang, c))}</span>${ARROW}</a>`; }).join('')}
</div></section>
<section class="wrap section">
  ${sectionLabel(1, tips.length ? 3 : 2, L.sections.news.label)}
  <div class="section-head reveal"><h2 class="slash-title"><i>/</i> ${esc(L.sections.news.heading)} <i>/</i></h2><a class="btn btn-dark" href="${pre}/news/"><i class="sq"></i>${esc(L.all)}</a></div>
  ${news[0] ? featured(news[0]) : ''}
  <div class="cards">${news.slice(1, 4).map(card).join('')}</div>
</section>
<section class="wrap section">
  ${sectionLabel(2, tips.length ? 3 : 2, L.sections.guides.label)}
  <div class="section-head reveal"><h2 class="slash-title"><i>/</i> ${esc(L.sections.guides.heading)} <i>/</i></h2><a class="btn btn-dark" href="${pre}/guides/"><i class="sq"></i>${esc(L.all)}</a></div>
  <div class="cards">${guides.slice(0, 6).map(card).join('')}</div>
</section>
${tips.length ? `<section class="wrap section">
  ${sectionLabel(3, 3, L.sections.tips.label)}
  <div class="section-head reveal"><h2 class="slash-title"><i>/</i> ${esc(L.sections.tips.heading)} <i>/</i></h2><a class="btn btn-dark" href="${pre}/tips/"><i class="sq"></i>${esc(L.all)}</a></div>
  <div class="cards">${tips.slice(0, 3).map(card).join('')}</div>
</section>` : ''}
${cta(lang)}`;
  write(`${pre}/index.html`, layout({
    lang, active: 'home', title: `${BRAND} — ${L.heroA}${L.heroB}`, description: L.description, url: `${pre}/`,
    alt: { lang: o, url: `${LANGS[o].prefix}/` }, body: home,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: SITE_URL + `${pre}/`, inLanguage: L.code, publisher: { '@type': 'Organization', name: `${BRAND} Team` } }],
  }));
  addSitemap(`${pre}/`, all[0]?.date, { lang: o, url: `${LANGS[o].prefix}/` });

  // 版块列表页
  for (const s of SECTIONS) {
    const list = bySection(s);
    if (!list.length) continue;
    const S = L.sections[s];
    const body = `
<section class="page-hero grid-light">
  <div class="wrap"><h1 class="reveal">${esc(S.title)}</h1><p class="page-intro reveal">${esc(S.intro)}</p></div>
</section>
<section class="wrap section section-tight">
  ${featured(list[0])}
  ${filterTabs(list, lang)}
  <div class="cards" data-filterable>${list.slice(1).map(card).join('')}</div>
</section>
${cta(lang)}`;
    write(`${pre}/${s}/index.html`, layout({
      lang, active: s, title: `${S.title} · ${BRAND}`, description: S.intro, url: `${pre}/${s}/`,
      alt: { lang: o, url: `${LANGS[o].prefix}/${s}/` }, body,
      jsonld: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: S.title, url: SITE_URL + `${pre}/${s}/`, inLanguage: L.code }],
    }));
    addSitemap(`${pre}/${s}/`, list[0].date, { lang: o, url: `${LANGS[o].prefix}/${s}/` });
  }

  // 文章
  for (const p of all) {
    const { html, headings } = render(p.body);
    const alt = counterpart(p);
    const sameSection = all.filter((x) => x !== p && x.section === p.section);
    const related = sameSection.filter((x) => x.category === p.category).concat(sameSection.filter((x) => x.category !== p.category)).concat(all.filter((x) => x !== p && x.section !== p.section)).slice(0, 3);
    const newest = all.find((x) => x !== p);
    const toc = headings.length > 2 ? `<nav class="toc"><p class="side-label">${L.toc}</p><ol>${headings.map((h, i) => `<li><a href="#${h.id}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(h.text)}</a></li>`).join('')}</ol></nav>` : '';
    const side = `${toc}${newest ? `<div class="side-newest"><p class="side-label">${L.newest}</p><a href="${newest.url}" class="mini">${media(newest)}${meta(newest)}<h4>${esc(newest.title)}</h4></a></div>` : ''}`;
    const faq = Array.isArray(p.faq) && p.faq.length ? `<section class="faq"><h2 id="faq">${L.faq}</h2>${p.faq.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary><span class="faq-n">${String(i + 1).padStart(2, '0')}</span>${esc(f.q)}<i></i></summary><div>${marked.parse(f.a)}</div></details>`).join('')}</section>` : '';
    const sources = Array.isArray(p.sources) && p.sources.length ? `<section class="sources"><p class="side-label">${L.sources}</p><ol>${p.sources.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener" data-no-transition>${esc(s.title)}${ARROW}</a></li>`).join('')}</ol></section>` : '';
    const disclosure = p.affiliate ? `<p class="disclosure">${L.disclosureNote} <a href="${L.prefix}/disclosure/">${L.disclosureMore}</a></p>` : '';
    const body = `
<article class="post">
  <header class="wrap post-head">
    <a class="back" href="${pre}/${p.section}/" aria-label="${L.back}"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6"/></svg></a>
    <div class="post-meta reveal"><span class="tag">${esc(cat(lang, p.category))}</span><span class="date"><i>//</i> ${fmtDate(p.date, lang)}</span><span class="date"><i>//</i> ${p.minutes} ${L.minRead}</span></div>
    <h1 class="reveal">${esc(p.title)}</h1>
    <p class="post-lede reveal">${esc(p.description)}</p>
  </header>
  <div class="wrap">${media(p, 'post-media reveal')}</div>
  <div class="post-grid-wrap"><div class="wrap post-grid">
    <aside class="post-side">${side}</aside>
    <div class="post-body"><div class="prose">${disclosure}${html}</div>${sources}${faq}</div>
  </div></div>
</article>
<section class="wrap section">
  <div class="section-head reveal"><h2 class="slash-title"><i>/</i> ${esc(L.related)} <i>/</i></h2></div>
  <div class="cards">${related.map(card).join('')}</div>
</section>
${cta(lang)}`;
    const jsonld = [
      { '@context': 'https://schema.org', '@type': p.section === 'news' ? 'NewsArticle' : 'Article', headline: p.title, description: p.description, datePublished: iso(p.date), dateModified: iso(p.updated || p.date), inLanguage: L.code, mainEntityOfPage: SITE_URL + p.url, ...(imgExists(p.image) ? { image: SITE_URL + p.image } : {}), author: { '@type': 'Organization', name: `${BRAND} Team`, url: SITE_URL + `${pre}/about/` }, publisher: { '@type': 'Organization', name: BRAND, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: BRAND, item: SITE_URL + `${pre}/` },
        { '@type': 'ListItem', position: 2, name: L.sections[p.section].title, item: SITE_URL + `${pre}/${p.section}/` },
        { '@type': 'ListItem', position: 3, name: p.title, item: SITE_URL + p.url },
      ] },
    ];
    if (Array.isArray(p.faq) && p.faq.length) jsonld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    write(`${p.url}index.html`, layout({ lang, active: p.section, title: `${p.title} · ${BRAND}`, description: p.description, url: p.url, alt, body, jsonld, ogType: 'article', ogImage: p.image }));
    addSitemap(p.url, p.updated || p.date, alt);
  }

  // 固定页
  for (const p of pages[lang]) {
    const { html } = render(p.body);
    const alt = counterpart(p);
    write(`${p.url}index.html`, layout({ lang, active: p.slug === 'about' ? 'about' : '', title: `${p.title} · ${BRAND}`, description: p.description, url: p.url, alt,
      body: `<section class="page-hero grid-light"><div class="wrap"><h1 class="reveal">${esc(p.title)}</h1><p class="page-intro reveal">${esc(p.description)}</p></div></section><div class="post-grid-wrap"><div class="wrap post-grid"><aside class="post-side"><p class="side-label">${BRAND}</p></aside><div class="post-body"><div class="prose">${html}</div></div></div></div>${cta(lang)}` }));
    addSitemap(p.url, p.updated || p.date, alt);
  }

  // RSS
  write(`${pre}/rss.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${BRAND}</title><link>${SITE_URL}${pre}/</link><description>${esc(L.description)}</description><language>${L.code}</language>
${all.map((p) => `<item><title>${esc(p.title)}</title><link>${SITE_URL}${p.url}</link><guid>${SITE_URL}${p.url}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><category>${esc(cat(lang, p.category))}</category><description>${esc(p.description)}</description></item>`).join('\n')}
</channel></rss>`);
}

// 404
write('404.html', layout({ lang: 'zh', title: `${LANGS.zh.notFound} · ${BRAND}`, description: LANGS.zh.notFoundBody, url: '/404.html', noindex: true,
  body: `<section class="page-hero grid-light notfound"><div class="wrap"><p class="pixel big404">404</p><h1>${LANGS.zh.notFound}</h1><p class="page-intro">${LANGS.zh.notFoundBody}</p><div class="hero-actions"><a class="btn btn-dark" href="/"><i class="sq"></i>${LANGS.zh.backHome}</a><a class="btn btn-line" href="/en/">${LANGS.en.backHome}</a></div></div></section>` }));

write('_redirects', Object.entries(GO_LINKS).map(([k, v]) => `/go/${k} ${v} 302`).join('\n') + '\n');
write('_headers', `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/fonts/*\n  Cache-Control: public, max-age=31536000, immutable\n/images/*\n  Cache-Control: public, max-age=86400\n/go/*\n  X-Robots-Tag: noindex\n`);
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap.map((s) => `<url><loc>${SITE_URL}${s.url}</loc>${s.lastmod ? `<lastmod>${iso(s.lastmod)}</lastmod>` : ''}${s.alt ? `<xhtml:link rel="alternate" hreflang="${LANGS[s.alt.lang].code}" href="${SITE_URL}${s.alt.url}"/>` : ''}</url>`).join('\n')}
</urlset>`);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /go/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);

if (fs.existsSync(PUBLIC)) fs.cpSync(PUBLIC, DIST, { recursive: true });
console.log(`Built ${posts.zh.length} zh + ${posts.en.length} en posts, ${sitemap.length} URLs → dist/`);
