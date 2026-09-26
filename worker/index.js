import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

const categories = new Set(['ai', 'mobility', 'it-devices']);
const legacyAI = new Set(['agi', 'physical-ai', 'other-ai']);
const normalizeCategory = (category) => legacyAI.has(category) ? 'ai' : category;
const categoryNames = {
  ko: { ai: 'AI', mobility: '모빌리티', 'it-devices': 'IT기기' },
  en: { ai: 'AI', mobility: 'Mobility', 'it-devices': 'IT Devices' },
};
const origin = 'https://fluxscope.coolwin200.workers.dev';
const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const xml = escape;
const pathFor = (post) => `${post.lang === 'en' ? '/en' : ''}/posts/${post.slug}/`;
const urlFor = (post) => `${origin}${pathFor(post)}`;
const rowToSummary = (post) => ({ lang: post.lang, slug: post.slug, category: normalizeCategory(post.category), title: post.title, description: post.description, imageUrl: post.image_url, imageAlt: post.image_alt, tags: JSON.parse(post.tags), publishedAt: post.published_at, updatedAt: post.updated_at, url: pathFor(post) });
const responseHeaders = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60' };
const imageTypes = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif', 'image/avif': 'avif' };
const imageLimit = 5 * 1024 * 1024;
let schemaReady;

function ensureSchema(db) {
  if (!schemaReady) {
    schemaReady = db.prepare(`CREATE TABLE IF NOT EXISTS posts (
      lang TEXT NOT NULL CHECK (lang IN ('ko', 'en')),
      slug TEXT NOT NULL,
      category TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      body TEXT NOT NULL,
      image_url TEXT,
      image_alt TEXT,
      tags TEXT NOT NULL DEFAULT '[]',
      published_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      PRIMARY KEY (lang, slug)
    )`).run().then(() => db.prepare('CREATE INDEX IF NOT EXISTS posts_published ON posts(lang, published_at DESC)').run()).catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

function validText(value, max) { return typeof value === 'string' && value.trim().length > 0 && value.length <= max; }
function parsePost(payload) {
  if (!payload || typeof payload !== 'object' || !['ko', 'en'].includes(payload.lang) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug ?? '') || payload.slug.length > 100 || !categories.has(payload.category)) return null;
  if (!validText(payload.title, 180) || !validText(payload.description, 400) || !validText(payload.body, 100000)) return null;
  if (payload.imageUrl && (typeof payload.imageUrl !== 'string' || payload.imageUrl.length > 1000 || !(/^\/(?:images|media)\/[a-zA-Z0-9/_-]+\.(?:png|jpe?g|webp|gif|avif)$/.test(payload.imageUrl) || /^https:\/\/[^\s]+$/.test(payload.imageUrl)))) return null;
  if (payload.imageAlt && !validText(payload.imageAlt, 300)) return null;
  if (payload.tags && (!Array.isArray(payload.tags) || payload.tags.length > 15 || payload.tags.some((tag) => !validText(tag, 40)))) return null;
  const publishedAt = payload.publishedAt || new Date().toISOString();
  if (!Number.isFinite(Date.parse(publishedAt)) || new Date(publishedAt).toISOString() !== publishedAt) return null;
  return { ...payload, publishedAt, updatedAt: new Date().toISOString(), tags: payload.tags || [] };
}

function authorized(request, secret) {
  if (!secret || !request.headers.get('Authorization')?.startsWith('Bearer ')) return false;
  const received = request.headers.get('Authorization').slice(7);
  const expected = new TextEncoder().encode(secret);
  const actual = new TextEncoder().encode(received);
  let mismatch = expected.length ^ actual.length;
  for (let i = 0; i < Math.max(expected.length, actual.length); i++) mismatch |= (expected[i] || 0) ^ (actual[i] || 0);
  return mismatch === 0;
}

function imageMatchesType(bytes, type) {
  const signature = Array.from(bytes.slice(0, 12));
  const starts = (...values) => values.every((value, i) => signature[i] === value);
  const ascii = (start, value) => value.split('').every((char, i) => signature[start + i] === char.charCodeAt(0));
  if (type === 'image/png') return starts(137, 80, 78, 71, 13, 10, 26, 10);
  if (type === 'image/jpeg') return starts(255, 216, 255);
  if (type === 'image/gif') return ascii(0, 'GIF87a') || ascii(0, 'GIF89a');
  if (type === 'image/webp') return ascii(0, 'RIFF') && ascii(8, 'WEBP');
  if (type === 'image/avif') return ascii(4, 'ftyp') && (ascii(8, 'avif') || ascii(8, 'avis'));
  return false;
}

async function images(request, env, url) {
  if (!env.IMAGES) return json({ error: 'Image storage is unavailable' }, 503);
  if (url.pathname === '/api/images' && request.method === 'POST') {
    if (!authorized(request, env.PUBLISH_TOKEN)) return json({ error: 'Unauthorized' }, 401);
    const type = request.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase();
    if (!imageTypes[type]) return json({ error: 'Use PNG, JPEG, WebP, GIF, or AVIF' }, 415);
    if (Number(request.headers.get('Content-Length')) > imageLimit) return json({ error: 'Image exceeds 5 MB' }, 413);
    if (!request.body) return json({ error: 'Image is empty' }, 400);
    const reader = request.body.getReader();
    const chunks = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > imageLimit) { await reader.cancel(); return json({ error: 'Image exceeds 5 MB' }, 413); }
      chunks.push(value);
    }
    if (!size) return json({ error: 'Image is empty' }, 400);
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    if (!imageMatchesType(bytes, type)) return json({ error: 'Image content does not match Content-Type' }, 415);
    const filename = `${crypto.randomUUID()}.${imageTypes[type]}`;
    await env.IMAGES.put(`images/${filename}`, bytes, { httpMetadata: { contentType: type } });
    const path = `/media/${filename}`;
    return json({ url: path, absoluteUrl: `${origin}${path}` }, 201);
  }
  const match = url.pathname.match(/^\/media\/([a-f0-9-]{36}\.(?:png|jpg|webp|gif|avif))$/);
  if (!match) return json({ error: 'Not found' }, 404);
  if (request.method === 'DELETE') {
    if (!authorized(request, env.PUBLISH_TOKEN)) return json({ error: 'Unauthorized' }, 401);
    await env.IMAGES.delete(`images/${match[1]}`);
    return json({ deleted: true });
  }
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
  const object = request.method === 'HEAD' ? await env.IMAGES.head(`images/${match[1]}`) : await env.IMAGES.get(`images/${match[1]}`);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers({
    'Content-Type': object.httpMetadata?.contentType || 'application/octet-stream',
    'Content-Length': String(object.size),
    'Cache-Control': 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  });
  if (object.httpEtag) headers.set('ETag', object.httpEtag);
  return new Response(request.method === 'HEAD' ? null : object.body, { headers });
}

async function api(request, env, url) {
  if (url.pathname === '/api/images') return images(request, env, url);
  if (!env.DB) return json({ error: 'Database binding is unavailable' }, 503);
  if (url.pathname === '/api/posts' && request.method === 'GET') {
    const lang = url.searchParams.get('lang') || 'ko';
    if (!['ko', 'en'].includes(lang)) return json({ error: 'Invalid language' }, 400);
    const category = url.searchParams.get('category');
    if (category && !categories.has(category)) return json({ error: 'Invalid category' }, 400);
    const filter = category === 'ai' ? " AND category IN ('ai', 'agi', 'physical-ai', 'other-ai')" : category ? ' AND category = ?' : '';
    const sql = `SELECT * FROM posts WHERE lang = ?${filter} ORDER BY published_at DESC LIMIT 100`;
    const { results } = await env.DB.prepare(sql).bind(...(category && category !== 'ai' ? [lang, category] : [lang])).all();
    return json({ posts: results.map(rowToSummary) });
  }
  if (url.pathname === '/api/search' && request.method === 'GET') {
    const lang = url.searchParams.get('lang') || 'ko';
    const q = (url.searchParams.get('q') || '').trim();
    if (!['ko', 'en'].includes(lang) || q.length > 100) return json({ error: 'Invalid query' }, 400);
    if (!q) return json({ posts: [] });
    const pattern = `%${q.replace(/[\\%_]/g, '\\$&')}%`;
    const { results } = await env.DB.prepare("SELECT * FROM posts WHERE lang = ? AND (title LIKE ? ESCAPE '\\' OR description LIKE ? ESCAPE '\\' OR body LIKE ? ESCAPE '\\') ORDER BY published_at DESC LIMIT 30").bind(lang, pattern, pattern, pattern).all();
    return json({ posts: results.map(rowToSummary) });
  }
  if (url.pathname === '/api/posts' && request.method === 'POST') {
    if (!authorized(request, env.PUBLISH_TOKEN)) return json({ error: 'Unauthorized' }, 401);
    if (Number(request.headers.get('Content-Length')) > 150000) return json({ error: 'Payload too large' }, 413);
    let payload;
    try {
      const reader = request.body?.getReader();
      if (!reader) return json({ error: 'Invalid JSON' }, 400);
      const chunks = [];
      let bytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        bytes += value.byteLength;
        if (bytes > 150000) { await reader.cancel(); return json({ error: 'Payload too large' }, 413); }
        chunks.push(value);
      }
      const body = new Uint8Array(bytes);
      let offset = 0;
      for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
      payload = JSON.parse(new TextDecoder().decode(body));
    } catch { return json({ error: 'Invalid JSON' }, 400); }
    const post = parsePost(payload);
    if (!post) return json({ error: 'Invalid post. Required: lang, slug, category, title, description, body.' }, 400);
    const current = await env.DB.prepare('SELECT published_at FROM posts WHERE lang = ? AND slug = ?').bind(post.lang, post.slug).first();
    if (current && request.headers.get('If-Match') !== 'update') return json({ error: 'Post exists. Set If-Match: update to replace it.' }, 409);
    if (current) post.publishedAt = current.published_at;
    await env.DB.prepare(`INSERT INTO posts (lang, slug, category, title, description, body, image_url, image_alt, tags, published_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(lang, slug) DO UPDATE SET category=excluded.category, title=excluded.title, description=excluded.description, body=excluded.body, image_url=excluded.image_url, image_alt=excluded.image_alt, tags=excluded.tags, updated_at=excluded.updated_at`)
      .bind(post.lang, post.slug, post.category, post.title, post.description, post.body, post.imageUrl || null, post.imageAlt || null, JSON.stringify(post.tags), post.publishedAt, post.updatedAt).run();
    return json({ url: pathFor(post), publishedAt: post.publishedAt, updatedAt: post.updatedAt }, current ? 200 : 201);
  }
  if (url.pathname === '/api/posts' && request.method === 'DELETE') {
    if (!authorized(request, env.PUBLISH_TOKEN)) return json({ error: 'Unauthorized' }, 401);
    const lang = url.searchParams.get('lang');
    const slug = url.searchParams.get('slug');
    if (!['ko', 'en'].includes(lang) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) return json({ error: 'Invalid language or slug' }, 400);
    const result = await env.DB.prepare('DELETE FROM posts WHERE lang = ? AND slug = ?').bind(lang, slug).run();
    return json({ deleted: result.meta.changes > 0 });
  }
  return json({ error: 'Not found' }, 404);
}

class ReplaceMain {
  constructor(html) { this.html = html; }
  element(element) { element.setInnerContent(this.html, { html: true }); }
}
class ReplaceText {
  constructor(value) { this.value = value; }
  element(element) { element.setInnerContent(this.value); }
}
class SetAttribute {
  constructor(name, value) { this.name = name; this.value = value; }
  element(element) { element.setAttribute(this.name, this.value); }
}
class SetLanguage {
  constructor(lang) { this.lang = lang; }
  element(element) { element.setAttribute('lang', this.lang); }
}
class SetArticle {
  element(element) { element.setAttribute('content', 'article'); }
}
class AppendHead {
  constructor(html) { this.html = html; }
  element(element) { element.append(this.html, { html: true }); }
}

async function article(post, env, request) {
  const lang = post.lang;
  const title = `${post.title} | ${lang === 'ko' ? 'HSL의 블로그' : "HSL's Blog"}`;
  const canonical = urlFor(post);
  const alternate = `${origin}${lang === 'ko' ? '/en' : ''}/posts/${post.slug}/`;
  const image = post.image_url ? (post.image_url.startsWith('/') ? `${origin}${post.image_url}` : post.image_url) : `${origin}/images/og-default.png`;
  const imageAlt = post.image_alt || post.title;
  const date = new Date(post.published_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
  const updatedDate = new Date(post.updated_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
  const category = normalizeCategory(post.category);
  const categoryName = categoryNames[lang][category];
  const home = lang === 'ko' ? '/' : '/en/';
  const tags = JSON.parse(post.tags);
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'Article', headline: post.title,
      description: post.description, mainEntityOfPage: canonical, image,
      datePublished: post.published_at, dateModified: post.updated_at,
      author: { '@type': 'Person', name: 'HSL' },
      publisher: { '@type': 'Organization', name: "HSL's Blog" },
      articleSection: categoryName, keywords: tags.join(', '),
    },
    {
      '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: lang === 'ko' ? '홈' : 'Home', item: `${origin}${home}` },
        { '@type': 'ListItem', position: 2, name: categoryName, item: `${origin}${home}${category}/` },
        { '@type': 'ListItem', position: 3, name: post.title, item: canonical },
      ],
    },
  ];
  const head = `<meta property="article:published_time" content="${escape(post.published_at)}"><meta property="article:modified_time" content="${escape(post.updated_at)}"><script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`;
  const html = `<article><header class="article-header article-shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${home}">${lang === 'ko' ? '홈' : 'Home'}</a><span>/</span><a href="${home}${escape(category)}/">${escape(categoryName)}</a><span>/</span><span aria-current="page">${lang === 'ko' ? '글' : 'Article'}</span></nav><h1>${escape(post.title)}</h1><p class="article-dek">${escape(post.description)}</p><div class="article-meta"><span>${lang === 'ko' ? '작성자' : 'By'}: <strong>HSL</strong></span><span>${lang === 'ko' ? '발행일' : 'Published'}: <time datetime="${escape(post.published_at)}">${escape(date)}</time></span><span>${lang === 'ko' ? '수정일' : 'Updated'}: <time datetime="${escape(post.updated_at)}">${escape(updatedDate)}</time></span></div></header>${post.image_url ? `<div class="article-shell"><img class="article-visual" src="${escape(post.image_url)}" alt="${escape(imageAlt)}" loading="eager" /></div>` : ''}<div class="article-body article-shell">${micromark(post.body, { extensions: [gfm()], htmlExtensions: [gfmHtml()] })}</div><div class="article-end article-shell"><div class="tag-list">${tags.map((tag) => `<span>#${escape(tag)}</span>`).join('')}</div></div></article>`;
  const shell = await env.ASSETS.fetch(new Request(new URL(lang === 'ko' ? '/about/' : '/en/about/', request.url)));
  if (!shell.ok) return new Response('Template unavailable', { status: 503 });
  const alternateLang = lang === 'ko' ? 'en' : 'ko';
  const rewriter = new HTMLRewriter().on('html', new SetLanguage(lang)).on('head', new AppendHead(head)).on('main#content', new ReplaceMain(html)).on('title', new ReplaceText(title))
    .on('meta[name="description"]', new SetAttribute('content', post.description))
    .on('link[rel="canonical"]', new SetAttribute('href', canonical))
    .on(`link[hreflang="${lang}"]`, new SetAttribute('href', canonical))
    .on(`link[hreflang="${alternateLang}"]`, new SetAttribute('href', alternate))
    .on('meta[property="og:type"]', new SetArticle())
    .on('meta[property="og:title"]', new SetAttribute('content', title))
    .on('meta[property="og:description"]', new SetAttribute('content', post.description))
    .on('meta[property="og:url"]', new SetAttribute('content', canonical))
    .on('meta[property="og:image"]', new SetAttribute('content', image))
    .on('meta[property="og:image:alt"]', new SetAttribute('content', imageAlt))
    .on('meta[name="twitter:title"]', new SetAttribute('content', title))
    .on('meta[name="twitter:description"]', new SetAttribute('content', post.description))
    .on('meta[name="twitter:image"]', new SetAttribute('content', image))
    .on(`.lang-switcher a[hreflang="${lang}"]`, new SetAttribute('href', pathFor(post)))
    .on(`.lang-switcher a[hreflang="${alternateLang}"]`, new SetAttribute('href', alternate.replace(origin, '')));
  return rewriter.transform(new Response(shell.body, { headers: responseHeaders }));
}

async function dynamicSitemap(env) {
  const { results } = await env.DB.prepare('SELECT lang, slug, updated_at FROM posts ORDER BY updated_at DESC').all();
  const entries = results.map((post) => `<url><loc>${xml(urlFor(post))}</loc><lastmod>${xml(post.updated_at.slice(0, 10))}</lastmod></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}

async function rssFeed(env, request) {
  const staticFeed = await env.ASSETS.fetch(request);
  const feed = await staticFeed.text();
  const { results } = await env.DB.prepare('SELECT lang, slug, title, description, published_at FROM posts ORDER BY published_at DESC LIMIT 50').all();
  const items = results.map((post) => `<item><title>${xml(post.title)}</title><link>${xml(urlFor(post))}</link><guid>${xml(urlFor(post))}</guid><description>${xml(post.description)}</description><pubDate>${new Date(post.published_at).toUTCString()}</pubDate></item>`).join('');
  return new Response(feed.replace('</channel>', `${items}</channel>`), { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      if (env.DB) await ensureSchema(env.DB);
      if (url.pathname.startsWith('/media/')) return images(request, env, url);
      if (url.pathname.startsWith('/api/')) return api(request, env, url);
      if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
      if (!env.DB) return env.ASSETS.fetch(request);
      if (url.pathname === '/dynamic-sitemap.xml') return dynamicSitemap(env);
      if (url.pathname === '/rss.xml') return rssFeed(env, request);
      if (url.pathname === '/robots.txt') {
        const original = await (await env.ASSETS.fetch(request)).text();
        return new Response(`${original.trim()}\nSitemap: ${origin}/dynamic-sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
      const oldGptPost = url.pathname.match(/^\/(en\/)?agi\/gpt-6-sol-luna-opus-5-5-cost-performance\/?$/);
      if (oldGptPost) return Response.redirect(`${origin}/${oldGptPost[1] || ''}posts/gpt-6-sol-luna-opus-5-5-cost-per-success/`, 301);
      const oldAiCategory = url.pathname.match(/^\/(en\/)?(?:agi|physical-ai|other-ai)(?:\/.*)?$/);
      if (oldAiCategory) return Response.redirect(`${origin}/${oldAiCategory[1] || ''}ai/`, 301);
      const match = url.pathname.match(/^\/(en\/)?posts\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
      if (!match) return env.ASSETS.fetch(request);
      const post = await env.DB.prepare('SELECT * FROM posts WHERE lang = ? AND slug = ?').bind(match[1] ? 'en' : 'ko', match[2]).first();
      return post ? article(post, env, request) : new Response('Not found', { status: 404 });
    } catch (error) {
      console.error(error);
      return json({ error: 'Server error' }, 500);
    }
  },
};
