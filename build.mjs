// Routewise 静态站构建：node build.mjs → dist/
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { SITE_URL, BRAND, GO_LINKS, LANGS } from './site.config.mjs';

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const DIST = path.join(ROOT, 'dist');
const CONTENT = path.join(ROOT, 'content');

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const slugify = (s) => s.toLowerCase().trim().replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '');
const write = (rel, html) => {
  const file = path.join(DIST, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};
const fmtDate = (d, lang) => new Date(d).toLocaleDateString(lang === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
const iso = (d) => new Date(d).toISOString().slice(0, 10);

// ---------- 读取内容 ----------
function load(dir, lang, kind) {
  const full = path.join(CONTENT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full).filter((f) => f.endsWith('.md')).map((f) => {
    const { data, content } = matter(fs.readFileSync(path.join(full, f), 'utf8'));
    const slug = data.slug || f.replace(/\.md$/, '');
    const L = LANGS[lang];
    const url = kind === 'post' ? `${L.prefix}/guides/${slug}/` : `${L.prefix}/${slug}/`;
    const text = content.replace(/[#>*`\-\[\]\(\)!|]/g, '');
    const minutes = lang === 'zh' ? Math.max(2, Math.round(text.replace(/\s/g, '').length / 450)) : Math.max(2, Math.round(text.split(/\s+/).length / 220));
    return { ...data, slug, lang, kind, url, body: content, minutes, key: data.key || slug, draft: !!data.draft };
  }).filter((p) => !p.draft);
}

const posts = {};
const pages = {};
for (const lang of Object.keys(LANGS)) {
  posts[lang] = load(`posts/${lang}`, lang, 'post').sort((a, b) => new Date(b.date) - new Date(a.date));
  pages[lang] = load(`pages/${lang}`, lang, 'page');
}
const counterpart = (item) => {
  const other = item.lang === 'zh' ? 'en' : 'zh';
  const pool = item.kind === 'post' ? posts[other] : pages[other];
  return pool.find((p) => p.key === item.key);
};

// ---------- Markdown 渲染 ----------
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
    return `<a href="${esc(href)}"${title ? ` title="${esc(title)}"` : ''}${rel}${target}>${text}</a>`;
  };
  renderer.table = function (token) {
    const head = token.header.map((c) => `<th>${this.parser.parseInline(c.tokens)}</th>`).join('');
    const rows = token.rows.map((r) => `<tr>${r.map((c) => `<td>${this.parser.parseInline(c.tokens)}</td>`).join('')}</tr>`).join('');
    return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${rows}</tbody></table></div>`;
  };
  // ::: tip / ::: note 区块
  md = md.replace(/^:::[ \t]*(tip|note|warn)[ \t]*\n([\s\S]*?)\n:::[ \t]*$/gm, (_, type, inner) => `<aside class="callout callout-${type}">\n\n${inner}\n\n</aside>`);
  const html = marked.parse(md, { renderer, gfm: true });
  return { html, headings };
}

// ---------- 模板 ----------
const CSS = fs.readFileSync(path.join(ROOT, 'src/style.css'), 'utf8');
const LOGO = `<svg class="logo-mark" viewBox="0 0 28 28" aria-hidden="true"><circle cx="6" cy="22" r="3.2"/><circle cx="22" cy="6" r="3.2"/><path d="M6 22 C 6 12, 22 16, 22 6" fill="none" stroke-width="2.2" stroke-linecap="round"/></svg>`;

function layout({ lang, title, description, url, alt, body, jsonld = [], ogType = 'website', noindex = false }) {
  const L = LANGS[lang];
  const canonical = SITE_URL + url;
  const hreflang = alt
    ? `<link rel="alternate" hreflang="${L.code}" href="${canonical}"><link rel="alternate" hreflang="${LANGS[alt.lang].code}" href="${SITE_URL + alt.url}"><link rel="alternate" hreflang="x-default" href="${SITE_URL + (lang === 'zh' ? url : alt.url)}">`
    : '';
  const switchHref = alt ? alt.url : (lang === 'zh' ? '/en/' : '/');
  const pre = L.prefix;
  return `<!doctype html>
<html lang="${L.code}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${canonical}">
${hreflang}
${noindex ? '<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="${ogType}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:site_name" content="${BRAND}">
<meta property="og:image" content="${SITE_URL}/og.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#F4F1EA" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#111311" media="(prefers-color-scheme: dark)">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="alternate" type="application/rss+xml" title="${BRAND}" href="${SITE_URL}${pre}/rss.xml">
<style>${CSS}</style>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="logo" href="${pre}/" aria-label="${BRAND}">${LOGO}<span>${BRAND}</span></a>
    <nav class="nav">
      <a href="${pre}/guides/">${L.nav.guides}</a>
      <a href="${pre}/about/">${L.nav.about}</a>
      <a class="lang" href="${switchHref}" hreflang="${lang === 'zh' ? 'en' : 'zh-CN'}">${L.switchLang}</a>
    </nav>
  </div>
</header>
<main>${body}</main>
<footer class="site-footer">
  <div class="wrap footer-inner">
    <div>
      <a class="logo" href="${pre}/">${LOGO}<span>${BRAND}</span></a>
      <p class="muted">${L.footerAbout}</p>
    </div>
    <nav class="footer-nav">
      <a href="${pre}/guides/">${L.nav.guides}</a>
      <a href="${pre}/about/">${L.nav.about}</a>
      <a href="${pre}/disclosure/">${L.nav.disclosure}</a>
      <a href="${pre}/rss.xml">RSS</a>
    </nav>
  </div>
  <div class="wrap footer-base muted">© ${new Date().getUTCFullYear()} ${BRAND} · ${L.footerTeam}</div>
</footer>
</body>
</html>`;
}

const catLabel = (lang, c) => LANGS[lang].categories[c] || c;

function card(p, i) {
  const L = LANGS[p.lang];
  return `<li class="card">
  <a href="${p.url}">
    <span class="card-index">${String(i + 1).padStart(2, '0')}</span>
    <div class="card-main">
      <span class="eyebrow">${esc(catLabel(p.lang, p.category))}</span>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.description)}</p>
    </div>
    <span class="card-meta">${p.minutes} ${L.minRead}<svg viewBox="0 0 24 24" class="arrow" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
  </a>
</li>`;
}

// ---------- 页面生成 ----------
const sitemap = [];
const addSitemap = (url, lastmod, alt) => sitemap.push({ url, lastmod, alt });

for (const lang of Object.keys(LANGS)) {
  const L = LANGS[lang];
  const pre = L.prefix;
  const list = posts[lang];
  const other = lang === 'zh' ? 'en' : 'zh';

  // 首页
  const cats = [...new Set(list.map((p) => p.category))];
  const home = `
<section class="hero">
  <div class="wrap">
    <svg class="hero-route" viewBox="0 0 1200 260" preserveAspectRatio="none" aria-hidden="true"><path d="M-20 220 C 220 220, 300 60, 520 70 S 820 210, 1000 120 S 1180 30, 1240 40"/><circle cx="520" cy="70" r="5"/><circle cx="1000" cy="120" r="5"/></svg>
    <p class="eyebrow">${BRAND}</p>
    <h1>${esc(L.tagline)}</h1>
    <p class="lede">${esc(L.description)}</p>
    <div class="chips">${cats.map((c) => `<a class="chip" href="${pre}/guides/#${c}">${esc(catLabel(lang, c))}</a>`).join('')}</div>
  </div>
</section>
<section class="wrap section">
  <div class="section-head"><h2>${L.latest}</h2><a href="${pre}/guides/" class="link-arrow">${L.allGuides} →</a></div>
  <ol class="cards">${list.slice(0, 8).map(card).join('')}</ol>
</section>`;
  write(`${pre}/index.html`, layout({
    lang, title: `${BRAND} — ${L.tagline}`, description: L.description, url: `${pre}/`,
    alt: { lang: other, url: `${LANGS[other].prefix}/` }, body: home,
    jsonld: [{ '@context': 'https://schema.org', '@type': 'WebSite', name: BRAND, url: SITE_URL + `${pre}/`, inLanguage: L.code, publisher: { '@type': 'Organization', name: `${BRAND} Team` } }],
  }));
  addSitemap(`${pre}/`, list[0]?.updated || list[0]?.date, { lang: other, url: `${LANGS[other].prefix}/` });

  // 全部指南
  const groups = cats.map((c) => `<section class="group" id="${c}"><h2>${esc(catLabel(lang, c))}</h2><ol class="cards">${list.filter((p) => p.category === c).map(card).join('')}</ol></section>`).join('');
  write(`${pre}/guides/index.html`, layout({
    lang, title: `${L.allGuides} · ${BRAND}`, description: L.description, url: `${pre}/guides/`,
    alt: { lang: other, url: `${LANGS[other].prefix}/guides/` },
    body: `<section class="wrap page-head"><p class="eyebrow">${BRAND}</p><h1>${L.allGuides}</h1></section><div class="wrap section">${groups}</div>`,
  }));
  addSitemap(`${pre}/guides/`, list[0]?.updated || list[0]?.date, { lang: other, url: `${LANGS[other].prefix}/guides/` });

  // 文章
  for (const p of list) {
    const { html, headings } = render(p.body);
    const alt = counterpart(p);
    const related = list.filter((x) => x !== p && x.category === p.category).concat(list.filter((x) => x !== p && x.category !== p.category)).slice(0, 3);
    const toc = headings.length > 2 ? `<nav class="toc"><p class="eyebrow">${L.toc}</p><ol>${headings.map((h) => `<li><a href="#${h.id}">${esc(h.text)}</a></li>`).join('')}</ol></nav>` : '';
    const faq = Array.isArray(p.faq) && p.faq.length ? `<section class="faq"><h2 id="faq">${L.faq}</h2>${p.faq.map((f) => `<details><summary>${esc(f.q)}</summary><div>${marked.parse(f.a)}</div></details>`).join('')}</section>` : '';
    const disclosure = p.affiliate ? `<p class="disclosure">${L.disclosureNote} <a href="${pre}/disclosure/">${L.disclosureMore}</a></p>` : '';
    const body = `
<article class="article">
  <header class="wrap article-head">
    <a class="eyebrow" href="${pre}/guides/#${p.category}">${esc(catLabel(lang, p.category))}</a>
    <h1>${esc(p.title)}</h1>
    <p class="lede">${esc(p.description)}</p>
    <p class="meta muted"><span>${BRAND} Team</span><span>${L.updated} <time datetime="${iso(p.updated || p.date)}">${fmtDate(p.updated || p.date, lang)}</time></span><span>${p.minutes} ${L.minRead}</span></p>
  </header>
  <div class="wrap article-grid">
    <aside class="article-side">${toc}</aside>
    <div class="prose">${disclosure}${html}${faq}</div>
  </div>
</article>
<section class="wrap section related"><div class="section-head"><h2>${L.related}</h2></div><ol class="cards">${related.map(card).join('')}</ol></section>`;
    const jsonld = [
      { '@context': 'https://schema.org', '@type': 'Article', headline: p.title, description: p.description, datePublished: iso(p.date), dateModified: iso(p.updated || p.date), inLanguage: L.code, mainEntityOfPage: SITE_URL + p.url, author: { '@type': 'Organization', name: `${BRAND} Team`, url: SITE_URL + `${pre}/about/` }, publisher: { '@type': 'Organization', name: BRAND, logo: { '@type': 'ImageObject', url: `${SITE_URL}/favicon.svg` } } },
      { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: BRAND, item: SITE_URL + `${pre}/` },
        { '@type': 'ListItem', position: 2, name: catLabel(lang, p.category), item: SITE_URL + `${pre}/guides/` },
        { '@type': 'ListItem', position: 3, name: p.title, item: SITE_URL + p.url },
      ] },
    ];
    if (Array.isArray(p.faq) && p.faq.length) jsonld.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: p.faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) });
    write(`${p.url}index.html`, layout({ lang, title: `${p.title} · ${BRAND}`, description: p.description, url: p.url, alt, body, jsonld, ogType: 'article' }));
    addSitemap(p.url, p.updated || p.date, alt);
  }

  // 独立页面
  for (const p of pages[lang]) {
    const { html } = render(p.body);
    const alt = counterpart(p);
    write(`${p.url}index.html`, layout({ lang, title: `${p.title} · ${BRAND}`, description: p.description, url: p.url, alt,
      body: `<section class="wrap page-head"><p class="eyebrow">${BRAND}</p><h1>${esc(p.title)}</h1></section><div class="wrap"><div class="prose prose-page">${html}</div></div>` }));
    addSitemap(p.url, p.updated || p.date, alt);
  }

  // RSS
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel><title>${BRAND}</title><link>${SITE_URL}${pre}/</link><description>${esc(L.description)}</description><language>${L.code}</language>
${list.map((p) => `<item><title>${esc(p.title)}</title><link>${SITE_URL}${p.url}</link><guid>${SITE_URL}${p.url}</guid><pubDate>${new Date(p.date).toUTCString()}</pubDate><description>${esc(p.description)}</description></item>`).join('\n')}
</channel></rss>`;
  write(`${pre}/rss.xml`, rss);
}

// 404
write('404.html', layout({ lang: 'zh', title: `${LANGS.zh.notFound} · ${BRAND}`, description: LANGS.zh.notFoundBody, url: '/404.html', noindex: true,
  body: `<section class="wrap page-head notfound"><p class="eyebrow">404</p><h1>${LANGS.zh.notFound}</h1><p class="lede">${LANGS.zh.notFoundBody}</p><p><a class="button" href="/">${LANGS.zh.backHome}</a> <a class="button ghost" href="/en/">${LANGS.en.backHome}</a></p></section>` }));

// sitemap
const sm = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${sitemap.map((s) => `<url><loc>${SITE_URL}${s.url}</loc>${s.lastmod ? `<lastmod>${iso(s.lastmod)}</lastmod>` : ''}${s.alt ? `<xhtml:link rel="alternate" hreflang="${LANGS[s.alt.lang].code}" href="${SITE_URL}${s.alt.url}"/>` : ''}</url>`).join('\n')}
</urlset>`;
write('sitemap.xml', sm);
write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /go/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
write('_redirects', Object.entries(GO_LINKS).map(([k, v]) => `/go/${k} ${v} 302`).join('\n') + '\n');
write('_headers', `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n/go/*\n  X-Robots-Tag: noindex\n`);

// 静态资源
const pub = path.join(ROOT, 'public');
if (fs.existsSync(pub)) fs.cpSync(pub, DIST, { recursive: true });

console.log(`Built ${posts.zh.length} zh + ${posts.en.length} en posts, ${sitemap.length} URLs → dist/`);
