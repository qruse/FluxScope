import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

const categories = new Set(['agi', 'physical-ai', 'other-ai', 'mobility', 'it-devices']);
const origin = 'https://fluxscope.coolwin200.workers.dev';
const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const xml = escape;
const pathFor = (post) => `${post.lang === 'en' ? '/en' : ''}/posts/${post.slug}/`;
const urlFor = (post) => `${origin}${pathFor(post)}`;
const rowToSummary = (post) => ({ lang: post.lang, slug: post.slug, category: post.category, title: post.title, description: post.description, imageUrl: post.image_url, imageAlt: post.image_alt, tags: JSON.parse(post.tags), publishedAt: post.published_at, updatedAt: post.updated_at, url: pathFor(post) });
const responseHeaders = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'public, max-age=60' };

function validText(value, max) { return typeof value === 'string' && value.trim().length > 0 && value.length <= max; }
function parsePost(payload) {
  if (!payload || typeof payload !== 'object' || !['ko', 'en'].includes(payload.lang) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(payload.slug ?? '') || payload.slug.length > 100 || !categories.has(payload.category)) return null;
  if (!validText(payload.title, 180) || !validText(payload.description, 400) || !validText(payload.body, 100000)) return null;
  const community = payload.body.match(/^## (?:커뮤니티 반응|Community Reactions)\s*\n([\s\S]*?)(?=^## |$(?![\s\S]))/m)?.[1];
  if (community && /https?:\/\/|\]\(/i.test(community)) return null;
  if (payload.imageUrl && (typeof payload.imageUrl !== 'string' || payload.imageUrl.length > 1000 || !(payload.imageUrl.startsWith('/images/') || /^https:\/\/[^\s]+$/.test(payload.imageUrl)))) return null;
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

async function api(request, env, url) {
  if (!env.DB) return json({ error: 'Database binding is unavailable' }, 503);
  if (url.pathname === '/api/posts' && request.method === 'GET') {
    const lang = url.searchParams.get('lang') || 'ko';
    if (!['ko', 'en'].includes(lang)) return json({ error: 'Invalid language' }, 400);
    const category = url.searchParams.get('category');
    if (category && !categories.has(category)) return json({ error: 'Invalid category' }, 400);
    const sql = `SELECT * FROM posts WHERE lang = ?${category ? ' AND category = ?' : ''} ORDER BY published_at DESC LIMIT 100`;
    const { results } = await env.DB.prepare(sql).bind(...(category ? [lang, category] : [lang])).all();
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

async function article(post, env, request) {
  const lang = post.lang;
  const title = `${post.title} | ${lang === 'ko' ? 'HSL의 블로그' : "HSL's Blog"}`;
  const canonical = urlFor(post);
  const alternate = `${origin}${lang === 'ko' ? '/en' : ''}/posts/${post.slug}/`;
  const image = post.image_url ? (post.image_url.startsWith('/') ? `${origin}${post.image_url}` : post.image_url) : `${origin}/images/og-default.png`;
  const date = new Date(post.published_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { timeZone: 'UTC', year: 'numeric', month: 'long', day: 'numeric' });
  const categoryName = post.category.replaceAll('-', ' ');
  const home = lang === 'ko' ? '/' : '/en/';
  const html = `<article><header class="article-header article-shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${home}">${lang === 'ko' ? '홈' : 'Home'}</a><span>/</span><a href="${home}${escape(post.category)}/">${escape(categoryName)}</a><span>/</span><span aria-current="page">${lang === 'ko' ? '글' : 'Article'}</span></nav><h1>${escape(post.title)}</h1><p class="article-dek">${escape(post.description)}</p><div class="article-meta"><span>${lang === 'ko' ? '작성자' : 'By'}: <strong>HSL</strong></span><span><time datetime="${escape(post.published_at)}">${escape(date)}</time></span></div></header>${post.image_url ? `<div class="article-shell"><img class="article-visual" src="${escape(post.image_url)}" alt="${escape(post.image_alt || post.title)}" loading="eager" /></div>` : ''}<div class="article-body article-shell">${micromark(post.body, { extensions: [gfm()], htmlExtensions: [gfmHtml()] })}</div><div class="article-end article-shell"><div class="tag-list">${JSON.parse(post.tags).map((tag) => `<span>#${escape(tag)}</span>`).join('')}</div></div></article>`;
  const shell = await env.ASSETS.fetch(new Request(new URL(lang === 'ko' ? '/about/' : '/en/about/', request.url)));
  if (!shell.ok) return new Response('Template unavailable', { status: 503 });
  const alternateLang = lang === 'ko' ? 'en' : 'ko';
  const rewriter = new HTMLRewriter().on('html', new SetLanguage(lang)).on('main#content', new ReplaceMain(html)).on('title', new ReplaceText(title))
    .on('meta[name="description"]', new SetAttribute('content', post.description))
    .on('link[rel="canonical"]', new SetAttribute('href', canonical))
    .on(`link[hreflang="${lang}"]`, new SetAttribute('href', canonical))
    .on(`link[hreflang="${alternateLang}"]`, new SetAttribute('href', alternate))
    .on('meta[property="og:type"]', new SetArticle())
    .on('meta[property="og:title"]', new SetAttribute('content', title))
    .on('meta[property="og:description"]', new SetAttribute('content', post.description))
    .on('meta[property="og:url"]', new SetAttribute('content', canonical))
    .on('meta[property="og:image"]', new SetAttribute('content', image))
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
      if (url.pathname.startsWith('/api/')) return api(request, env, url);
      if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
      if (!env.DB) return env.ASSETS.fetch(request);
      if (url.pathname === '/dynamic-sitemap.xml') return dynamicSitemap(env);
      if (url.pathname === '/rss.xml') return rssFeed(env, request);
      if (url.pathname === '/robots.txt') {
        const original = await (await env.ASSETS.fetch(request)).text();
        return new Response(`${original.trim()}\nSitemap: ${origin}/dynamic-sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
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
