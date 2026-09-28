import { micromark } from 'micromark';
import { validateEditorial, validateRendered } from '../shared/editorial.mjs';
import { gfm, gfmHtml } from 'micromark-extension-gfm';

const categories = new Set(['ai', 'mobility', 'it-devices']);
const legacyAI = new Set(['agi', 'physical-ai', 'other-ai']);
const normalizeCategory = (category) => legacyAI.has(category) ? 'ai' : category;
const categoryNames = {
  ko: { ai: 'AI', mobility: '모빌리티', 'it-devices': 'IT기기' },
  en: { ai: 'AI', mobility: 'Mobility', 'it-devices': 'IT Devices' },
};
const origin = 'https://hslblog.com';
const json = (value, status = 200) => new Response(JSON.stringify(value), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
});
const escape = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const xml = escape;
const pathFor = (post) => `${post.lang === 'en' ? '/en' : ''}/posts/${post.slug}/`;
const urlFor = (post) => `${origin}${pathFor(post)}`;
const rowToSummary = (post) => ({ lang: post.lang, slug: post.slug, category: normalizeCategory(post.category), title: post.title, description: post.description, imageUrl: post.image_url, imageAlt: post.image_alt, tags: JSON.parse(post.tags), publishedAt: post.published_at, updatedAt: post.updated_at, url: pathFor(post) });

function listingCard(post, lang, variant = '') {
  const category = normalizeCategory(post.category);
  const read = lang === 'ko' ? '글 읽기' : 'Read article';
  const image = post.image_url ? `<img class="card-visual" src="${escape(post.image_url)}" alt="${escape(post.image_alt || post.title)}" loading="${variant === 'featured' ? 'eager' : 'lazy'}" decoding="async" />` : '';
  const date = new Date(post.published_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { year: 'numeric', month: lang === 'ko' ? 'long' : 'short', day: 'numeric', timeZone: 'Asia/Seoul' });
  return `<article class="post-card${variant ? ` ${variant}` : ''}"><a class="card-link" href="${escape(pathFor(post))}" aria-label="${escape(`${read}: ${post.title}`)}"><div class="card-media">${image}</div><div class="card-copy"><div class="eyebrow"><span class="category-pip"></span>${escape(categoryNames[lang][category])}<span class="eyebrow-sep">/</span><time datetime="${escape(post.published_at)}">${escape(date)}</time></div><h3>${escape(post.title)}</h3><p>${escape(post.description)}</p><span class="read-link">${read} <span aria-hidden="true">↗</span></span></div></a></article>`;
}

async function listingPage(request, env, lang) {
  const asset = await env.ASSETS.fetch(request);
  if (request.method !== 'GET' || !asset.ok || !env.DB) return asset;
  let results;
  try {
    ({ results } = await env.DB.prepare('SELECT lang, slug, category, title, description, image_url, image_alt, published_at FROM posts WHERE lang = ? ORDER BY published_at DESC LIMIT 100').bind(lang).all());
  } catch (error) {
    console.error('Could not load dynamic listings', error);
    return asset;
  }
  if (!results.length) return asset;
  const byCategory = new Map([...categories].map((category) => [category, results.filter((post) => normalizeCategory(post.category) === category)]));
  const rewritten = new HTMLRewriter()
    .on('[data-dynamic-category]', {
      element(element) {
        const posts = byCategory.get(element.getAttribute('data-dynamic-category')) || [];
        if (!posts.length) return;
        const wrapper = element.getAttribute('class')?.includes('horizontal-scroll-track') ? 'scroll-item' : '';
        element.prepend(posts.map((post) => wrapper ? `<div class="${wrapper}">${listingCard(post, lang)}</div>` : listingCard(post, lang)).join(''), { html: true });
      },
    })
    .on('[data-dynamic-lead]', {
      element(element) {
        // Lead slots hold the latest static post per category; a newer D1 post replaces it.
        const [post] = byCategory.get(element.getAttribute('data-dynamic-lead')) || [];
        const staticDate = Date.parse(element.getAttribute('data-published') || '');
        if (!post || Date.parse(post.published_at) <= staticDate) return;
        element.setInnerContent(listingCard(post, lang, element.getAttribute('data-lead-variant') || ''), { html: true });
      },
    })
    .on('[data-dynamic-count]', {
      element(element) {
        const staticCount = Number(element.getAttribute('data-static-count')) || 0;
        element.setInnerContent(String(staticCount + (byCategory.get(element.getAttribute('data-dynamic-count'))?.length || 0)));
      },
    })
    .on('[data-dynamic-empty]', {
      element(element) {
        if (byCategory.get(element.getAttribute('data-dynamic-empty'))?.length) element.remove();
      },
    }).transform(asset);
  const headers = new Headers(rewritten.headers);
  headers.set('Cache-Control', 'no-store');
  headers.delete('Content-Length');
  headers.delete('ETag');
  headers.delete('Last-Modified');
  return new Response(rewritten.body, { status: rewritten.status, statusText: rewritten.statusText, headers });
}
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
    )`).run().then(() => db.prepare('CREATE INDEX IF NOT EXISTS posts_published ON posts(lang, published_at DESC)').run())
      .then(() => db.batch(commentSchema.map((sql) => db.prepare(sql)))).catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }
  return schemaReady;
}

const commentSchema = [
  `CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    parent_id INTEGER REFERENCES comments(id),
    nickname TEXT NOT NULL,
    mention TEXT,
    body TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    deleted INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  )`,
  'CREATE INDEX IF NOT EXISTS comments_page ON comments(page, id)',
  'CREATE INDEX IF NOT EXISTS comments_ip ON comments(ip_hash, created_at)',
  `CREATE TABLE IF NOT EXISTS page_views (
    day TEXT NOT NULL,
    page TEXT NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (day, page)
  )`,
];

// Guest comments: nickname + password per comment, one reply level, @mention of the replied-to nickname.
const commentPage = /^\/(en\/)?(?:(posts)|ai|mobility|it-devices)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/$/;
const reservedNicknames = /^(?:hsl|admin|administrator|관리자|운영자)$/i;
const commentError = (code, status) => json({ error: code }, status);
const toBase64 = (buffer) => btoa(String.fromCharCode(...new Uint8Array(buffer)));
const fromBase64 = (value) => Uint8Array.from(atob(value), (c) => c.charCodeAt(0));

async function hashPassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  return toBase64(await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: 100000 }, key, 256));
}

function sameString(a, b) {
  let mismatch = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) mismatch |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return mismatch === 0;
}

async function readJson(request, limit) {
  if (Number(request.headers.get('Content-Length')) > limit) return null;
  try {
    const text = await request.text();
    return text.length > limit ? null : JSON.parse(text);
  } catch { return null; }
}

async function commentPageExists(env, request, page) {
  const match = page.match(commentPage);
  if (!match) return false;
  if (match[2]) return Boolean(await env.DB.prepare('SELECT 1 FROM posts WHERE lang = ? AND slug = ?').bind(match[1] ? 'en' : 'ko', match[3]).first());
  const asset = await env.ASSETS.fetch(new Request(new URL(page, request.url)));
  return asset.ok;
}

const rowToComment = (row) => ({
  id: row.id, parentId: row.parent_id, createdAt: row.created_at, deleted: Boolean(row.deleted),
  nickname: row.deleted ? '' : row.nickname, mention: row.deleted ? null : row.mention, body: row.deleted ? '' : row.body,
});

async function comments(request, env, url) {
  if (request.method === 'GET') {
    const page = url.searchParams.get('page') || '';
    if (!commentPage.test(page)) return commentError('invalid_page', 400);
    const { results } = await env.DB.prepare('SELECT id, parent_id, nickname, mention, body, deleted, created_at FROM comments WHERE page = ? ORDER BY id LIMIT 1000').bind(page).all();
    return json({ comments: results.map(rowToComment) });
  }
  const admin = authorized(request, env.PUBLISH_TOKEN);
  const payload = await readJson(request, 8000);
  if (!payload || typeof payload !== 'object') return commentError('invalid_request', 400);
  if (request.method === 'POST') {
    if (payload.website) return commentError('invalid_request', 400);
    const page = String(payload.page || '');
    const nickname = String(payload.nickname || '').normalize('NFC').trim().replace(/\s+/g, ' ');
    const password = String(payload.password || '');
    const body = String(payload.body || '').normalize('NFC').replace(/\r\n?/g, '\n').replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, '').replace(/\n{3,}/g, '\n\n').trim();
    if (!commentPage.test(page)) return commentError('invalid_page', 400);
    if ([...nickname].length < 2 || [...nickname].length > 20 || /[\u0000-\u001f\u007f<>@]/.test(nickname)) return commentError('invalid_nickname', 400);
    if (!admin && reservedNicknames.test(nickname)) return commentError('reserved_nickname', 400);
    if (password.length < 4 || password.length > 64) return commentError('invalid_password', 400);
    if (!body || [...body].length > 1000) return commentError('invalid_body', 400);
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ipHash = toBase64(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`fluxscope-comments:${ip}`))).slice(0, 24);
    const now = Date.now();
    const recent = await env.DB.prepare('SELECT SUM(created_at > ?) AS minute, COUNT(*) AS day FROM comments WHERE ip_hash = ? AND created_at > ?')
      .bind(new Date(now - 60000).toISOString(), ipHash, new Date(now - 86400000).toISOString()).first();
    if (!admin && ((recent?.minute || 0) >= 3 || (recent?.day || 0) >= 30)) return commentError('rate_limited', 429);
    let parentId = null;
    let mention = null;
    if (payload.parentId != null) {
      parentId = Number(payload.parentId);
      const parent = await env.DB.prepare('SELECT id, parent_id, nickname, deleted, page FROM comments WHERE id = ?').bind(parentId).first();
      if (!parent || parent.page !== page || parent.parent_id !== null) return commentError('invalid_parent', 400);
      const replyToId = payload.replyToId == null ? parentId : Number(payload.replyToId);
      if (replyToId === parentId) {
        if (parent.deleted) return commentError('invalid_parent', 400);
        mention = parent.nickname;
      } else {
        const target = await env.DB.prepare('SELECT nickname, parent_id, deleted FROM comments WHERE id = ?').bind(replyToId).first();
        if (!target || target.parent_id !== parentId || target.deleted) return commentError('invalid_parent', 400);
        mention = target.nickname;
      }
    }
    if (!(await commentPageExists(env, request, page))) return commentError('page_not_found', 404);
    await env.DB.prepare("UPDATE comments SET ip_hash = '' WHERE ip_hash != '' AND created_at < ?").bind(new Date(now - 30 * 86400000).toISOString()).run();
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const createdAt = new Date(now).toISOString();
    const result = await env.DB.prepare('INSERT INTO comments (page, parent_id, nickname, mention, body, password_hash, password_salt, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
      .bind(page, parentId, nickname, mention, body, await hashPassword(password, salt), toBase64(salt), ipHash, createdAt).run();
    return json({ comment: rowToComment({ id: result.meta.last_row_id, parent_id: parentId, nickname, mention, body, deleted: 0, created_at: createdAt }) }, 201);
  }
  if (request.method === 'DELETE') {
    const id = Number(payload.id);
    const row = Number.isInteger(id) ? await env.DB.prepare('SELECT id, parent_id, nickname, password_hash, password_salt, deleted FROM comments WHERE id = ?').bind(id).first() : null;
    if (!row || row.deleted) return commentError('not_found', 404);
    if (!admin) {
      // Deletion needs both the nickname and the password used when posting.
      const nickname = String(payload.nickname || '').normalize('NFC').trim().replace(/\s+/g, ' ');
      const password = String(payload.password || '');
      const passwordOk = password && password.length <= 64 && sameString(await hashPassword(password, fromBase64(row.password_salt)), row.password_hash);
      if (!passwordOk || nickname !== row.nickname) return commentError('wrong_credentials', 403);
    }
    const replies = row.parent_id === null ? await env.DB.prepare('SELECT COUNT(*) AS n FROM comments WHERE parent_id = ?').bind(id).first() : { n: 0 };
    if (replies.n) await env.DB.prepare("UPDATE comments SET deleted = 1, body = '', mention = NULL WHERE id = ?").bind(id).run();
    else await env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(id).run();
    if (row.parent_id !== null) {
      // A removed root stays only as a placeholder while it still has replies.
      await env.DB.prepare('DELETE FROM comments WHERE id = ? AND deleted = 1 AND NOT EXISTS (SELECT 1 FROM comments WHERE parent_id = ?)').bind(row.parent_id, row.parent_id).run();
    }
    return json({ deleted: true });
  }
  return commentError('method_not_allowed', 405);
}

// Cookie-free visit counts: page path and daily total only, no IP or device data.
const countedPage = /^\/(?:en\/)?(?:(?:ai|mobility|it-devices|posts|about|privacy)\/(?:[a-z0-9]+(?:-[a-z0-9]+)*\/)?)?$/;
const botAgent = /bot|crawl|spider|slurp|headless|lighthouse|preview|monitor|curl|wget|python|java\//i;

async function views(request, env, url) {
  if (request.method === 'POST') {
    const page = String((await readJson(request, 500))?.page || '');
    if (!countedPage.test(page) || botAgent.test(request.headers.get('User-Agent') || '')) return new Response(null, { status: 204 });
    if (/\/(?:posts|ai|mobility|it-devices)\/[a-z0-9-]+\/$/.test(page) && !(await commentPageExists(env, request, page))) return new Response(null, { status: 204 });
    const day = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
    await env.DB.prepare('INSERT INTO page_views (day, page, views) VALUES (?, ?, 1) ON CONFLICT(day, page) DO UPDATE SET views = views + 1').bind(day, page).run();
    return new Response(null, { status: 204 });
  }
  if (request.method === 'GET') {
    if (!authorized(request, env.PUBLISH_TOKEN)) return json({ error: 'Unauthorized' }, 401);
    const days = Math.min(Math.max(Number(url.searchParams.get('days')) || 30, 1), 365);
    const since = new Date(Date.now() - (days - 1) * 86400000).toLocaleDateString('en-CA', { timeZone: 'Asia/Seoul' });
    const [pages, daily] = await Promise.all([
      env.DB.prepare('SELECT page, SUM(views) AS views FROM page_views WHERE day >= ? GROUP BY page ORDER BY views DESC LIMIT 100').bind(since).all(),
      env.DB.prepare('SELECT day, SUM(views) AS views FROM page_views WHERE day >= ? GROUP BY day ORDER BY day').bind(since).all(),
    ]);
    return json({ since, pages: pages.results, daily: daily.results });
  }
  return json({ error: 'Method not allowed' }, 405);
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

// Ownership verification files from search consoles (Naver Search Advisor, Google, Bing).
const verificationFiles = {
  '/naver49434ef5de4a3b4c10115bc34e752ef6.html': 'naver-site-verification: naver49434ef5de4a3b4c10115bc34e752ef6.html',
};

// IndexNow: tell Naver, Bing and other participating engines about new or changed URLs.
const indexNowKey = 'ec644d7e01fcc3492c6211c1805fd628';
const indexNowEndpoints = ['https://api.indexnow.org/indexnow', 'https://www.bing.com/indexnow', 'https://searchadvisor.naver.com/indexnow'];

async function submitIndexNow(urls) {
  const urlList = [...new Set(urls)].filter((u) => u.startsWith(`${origin}/`)).slice(0, 10000);
  if (!urlList.length) return [];
  const body = JSON.stringify({ host: new URL(origin).host, key: indexNowKey, keyLocation: `${origin}/${indexNowKey}.txt`, urlList });
  return Promise.all(indexNowEndpoints.map((endpoint) => fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' }, body })
    .then((response) => ({ endpoint, status: response.status }))
    .catch((error) => ({ endpoint, error: String(error) }))));
}

async function sitemapUrls(env, sinceMs) {
  const sitemap = await env.ASSETS.fetch(new Request(`${origin}/sitemap-0.xml`)).then((response) => (response.ok ? response.text() : '')).catch(() => '');
  const urls = [...sitemap.matchAll(/<url><loc>([^<]+)<\/loc>(?:<lastmod>([^<]+)<\/lastmod>)?/g)]
    .filter(([, , lastmod]) => sinceMs == null || (lastmod && Date.parse(lastmod) >= sinceMs)).map(([, loc]) => loc);
  const { results } = sinceMs == null
    ? await env.DB.prepare('SELECT lang, slug FROM posts').all()
    : await env.DB.prepare('SELECT lang, slug FROM posts WHERE updated_at >= ?').bind(new Date(sinceMs).toISOString()).all();
  return [...urls, ...results.map(urlFor)];
}

async function submitRecentlyChanged(env) {
  if (env.DB) await ensureSchema(env.DB);
  const results = await submitIndexNow(await sitemapUrls(env, Date.now() - 26 * 3600000));
  console.log('IndexNow daily submission', JSON.stringify(results));
}

async function api(request, env, url, ctx) {
  if (url.pathname === '/api/images') return images(request, env, url);
  if (!env.DB) return json({ error: 'Database binding is unavailable' }, 503);
  if (url.pathname === '/api/comments') return comments(request, env, url);
  if (url.pathname === '/api/views') return views(request, env, url);
  if (url.pathname === '/api/indexnow' && request.method === 'POST') {
    if (!authorized(request, env.PUBLISH_TOKEN)) return json({ error: 'Unauthorized' }, 401);
    const payload = await readJson(request, 100000);
    const urls = Array.isArray(payload?.urls) && payload.urls.length ? payload.urls.map(String) : await sitemapUrls(env, null);
    return json({ submitted: urls.length, results: await submitIndexNow(urls) });
  }
  if (url.pathname === '/api/posts' && request.method === 'GET') {
    const lang = url.searchParams.get('lang') || 'ko';
    if (!['ko', 'en'].includes(lang)) return json({ error: 'Invalid language' }, 400);
    const slug = url.searchParams.get('slug');
    if (slug !== null) {
      const row = await env.DB.prepare('SELECT * FROM posts WHERE lang = ? AND slug = ?').bind(lang, slug).first();
      if (!row) return json({ error: 'Not found' }, 404);
      return json({ ...rowToSummary(row), body: row.body });
    }
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
    if (Number(request.headers.get('Content-Length')) > 300000) return json({ error: 'Payload too large' }, 413);
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
        if (bytes > 300000) { await reader.cancel(); return json({ error: 'Payload too large' }, 413); }
        chunks.push(value);
      }
      const body = new Uint8Array(bytes);
      let offset = 0;
      for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
      payload = JSON.parse(new TextDecoder().decode(body));
    } catch { return json({ error: 'Invalid JSON' }, 400); }
    // A bundle { posts: [ko, en] } is validated in full and written in one D1 batch, so both languages publish together or not at all.
    const bundle = Array.isArray(payload?.posts);
    const payloads = bundle ? payload.posts : [payload];
    if (!payloads.length || payloads.length > 2) return json({ error: 'A bundle holds one or two language versions' }, 400);
    const posts = payloads.map(parsePost);
    if (posts.some((post) => !post)) return json({ error: 'Invalid post. Required: lang, slug, category, title, description, body.' }, 400);
    if (bundle && (new Set(posts.map((post) => post.lang)).size !== posts.length || new Set(posts.map((post) => post.slug)).size !== 1 || new Set(posts.map((post) => post.category)).size !== 1)) {
      return json({ error: 'Bundle versions must share slug and category and use different languages' }, 400);
    }
    const details = posts.flatMap((post) => [...validateEditorial(post), ...validateRendered(micromark(post.body, { extensions: [gfm()], htmlExtensions: [gfmHtml()] }))].map((error) => (bundle ? `${post.lang}: ${error}` : error)));
    if (details.length) return json({ error: 'Editorial validation failed', details }, 422);
    const existing = await env.DB.batch(posts.map((post) => env.DB.prepare('SELECT published_at FROM posts WHERE lang = ? AND slug = ?').bind(post.lang, post.slug)));
    const current = existing.map((result) => result.results[0]);
    if (current.some(Boolean) && request.headers.get('If-Match') !== 'update') return json({ error: 'Post exists. Set If-Match: update to replace it.' }, 409);
    const updatedAt = new Date().toISOString();
    posts.forEach((post, i) => { if (current[i]) post.publishedAt = current[i].published_at; post.updatedAt = updatedAt; });
    await env.DB.batch(posts.map((post) => env.DB.prepare(`INSERT INTO posts (lang, slug, category, title, description, body, image_url, image_alt, tags, published_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(lang, slug) DO UPDATE SET category=excluded.category, title=excluded.title, description=excluded.description, body=excluded.body, image_url=excluded.image_url, image_alt=excluded.image_alt, tags=excluded.tags, updated_at=excluded.updated_at`)
      .bind(post.lang, post.slug, post.category, post.title, post.description, post.body, post.imageUrl || null, post.imageAlt || null, JSON.stringify(post.tags), post.publishedAt, post.updatedAt)));
    ctx?.waitUntil(submitIndexNow(posts.map(urlFor)));
    const written = posts.map((post) => ({ lang: post.lang, url: pathFor(post), publishedAt: post.publishedAt, updatedAt: post.updatedAt }));
    return json(bundle ? { posts: written } : written[0], current.every(Boolean) ? 200 : 201);
  }
  if (url.pathname === '/api/posts' && request.method === 'DELETE') {
    if (!authorized(request, env.PUBLISH_TOKEN)) return json({ error: 'Unauthorized' }, 401);
    const lang = url.searchParams.get('lang');
    const slug = url.searchParams.get('slug');
    if (!['ko', 'en'].includes(lang) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '')) return json({ error: 'Invalid language or slug' }, 400);
    const result = await env.DB.prepare('DELETE FROM posts WHERE lang = ? AND slug = ?').bind(lang, slug).run();
    if (result.meta.changes > 0) ctx?.waitUntil(submitIndexNow([urlFor({ lang, slug })]));
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

let imageDimensions;
async function loadImageDimensions(env, request) {
  if (!imageDimensions) {
    imageDimensions = env.ASSETS.fetch(new Request(new URL('/image-dimensions.json', request.url)))
      .then((response) => (response.ok ? response.json() : {})).catch(() => ({}));
  }
  return imageDimensions;
}
const sizeAttributes = (dimensions, src) => (dimensions[src] ? ` width="${dimensions[src][0]}" height="${dimensions[src][1]}"` : '');

// Width and height from the first bytes of a PNG, JPEG or WebP file.
function headerSize(bytes) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ascii = (start, text) => [...text].every((c, i) => bytes[start + i] === c.charCodeAt(0));
  if (bytes.length > 24 && ascii(1, 'PNG')) return [v.getUint32(16), v.getUint32(20)];
  if (bytes.length > 30 && ascii(0, 'RIFF') && ascii(8, 'WEBP')) {
    if (ascii(12, 'VP8X')) return [1 + (bytes[24] | bytes[25] << 8 | bytes[26] << 16), 1 + (bytes[27] | bytes[28] << 8 | bytes[29] << 16)];
    if (ascii(12, 'VP8 ')) return [v.getUint16(26, true) & 0x3fff, v.getUint16(28, true) & 0x3fff];
    if (ascii(12, 'VP8L')) { const b = v.getUint32(21, true); return [(b & 0x3fff) + 1, ((b >> 14) & 0x3fff) + 1]; }
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    for (let i = 2; i + 9 < bytes.length;) {
      if (bytes[i] !== 0xff) { i++; continue; }
      const marker = bytes[i + 1];
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) return [v.getUint16(i + 7), v.getUint16(i + 5)];
      i += 2 + v.getUint16(i + 2);
    }
  }
  return null;
}
const mediaSizes = new Map();
// Adds sizes for /media/ images (uploaded through the API after the last build) to the static manifest.
async function withMediaSizes(env, dimensions, sources) {
  const missing = [...new Set(sources)].filter((src) => src?.startsWith('/media/') && !dimensions[src]);
  if (!missing.length || !env.IMAGES) return dimensions;
  const result = { ...dimensions };
  await Promise.all(missing.map(async (src) => {
    if (!mediaSizes.has(src)) {
      mediaSizes.set(src, env.IMAGES.get(`images/${src.slice('/media/'.length)}`, { range: { offset: 0, length: 65536 } })
        .then(async (object) => (object ? headerSize(new Uint8Array(await object.arrayBuffer())) : null)).catch(() => null));
    }
    const size = await mediaSizes.get(src);
    if (size) result[src] = size;
  }));
  return result;
}

class RemoveElement {
  element(element) { element.remove(); }
}

async function notFound(env, request) {
  const page = await env.ASSETS.fetch(new Request(new URL('/404-not-found/', request.url)));
  return new Response(page.body, { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

async function article(post, env, request) {
  const lang = post.lang;
  const title = `${post.title} | ${lang === 'ko' ? 'HSL의 블로그' : "HSL's Blog"}`;
  const canonical = urlFor(post);
  const alternate = `${origin}${lang === 'ko' ? '/en' : ''}/posts/${post.slug}/`;
  const image = post.image_url ? (post.image_url.startsWith('/') ? `${origin}${post.image_url}` : post.image_url) : `${origin}/images/og-default.png`;
  const imageAlt = post.image_alt || post.title;
  const bodyImages = [...post.body.matchAll(/!\[[^\]]*\]\(([^\s)]+)\)/g)].map((m) => m[1]);
  const dimensions = await withMediaSizes(env, await loadImageDimensions(env, request), [post.image_url, ...bodyImages]);
  const imageSize = post.image_url ? dimensions[post.image_url] : [1200, 630];
  const koUrl = lang === 'ko' ? canonical : alternate;
  const date = new Date(post.published_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric' });
  const updatedDate = new Date(post.updated_at).toLocaleDateString(lang === 'ko' ? 'ko-KR' : 'en-US', { timeZone: 'Asia/Seoul', year: 'numeric', month: 'long', day: 'numeric' });
  const category = normalizeCategory(post.category);
  const categoryName = categoryNames[lang][category];
  const home = lang === 'ko' ? '/' : '/en/';
  const tags = JSON.parse(post.tags);
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, inLanguage: lang,
      description: post.description, mainEntityOfPage: canonical,
      image: imageSize ? { '@type': 'ImageObject', url: image, width: imageSize[0], height: imageSize[1] } : image,
      datePublished: post.published_at, dateModified: post.updated_at,
      author: { '@type': 'Person', name: 'HSL', url: `${origin}${lang === 'ko' ? '/about/' : '/en/about/'}` },
      publisher: { '@type': 'Organization', name: lang === 'ko' ? 'HSL의 블로그' : "HSL's Blog", url: `${origin}${home}`, logo: { '@type': 'ImageObject', url: `${origin}/images/logo.png`, width: 512, height: 512 } },
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
  const html = `<article><header class="article-header article-shell"><nav class="breadcrumbs" aria-label="Breadcrumb"><a href="${home}">${lang === 'ko' ? '홈' : 'Home'}</a><span>/</span><a href="${home}${escape(category)}/">${escape(categoryName)}</a><span>/</span><span aria-current="page">${lang === 'ko' ? '글' : 'Article'}</span></nav><h1>${escape(post.title)}</h1><p class="article-dek">${escape(post.description)}</p><div class="article-meta"><span>${lang === 'ko' ? '작성자' : 'By'}: <strong>HSL</strong></span><span>${lang === 'ko' ? '발행일' : 'Published'}: <time datetime="${escape(post.published_at)}">${escape(date)}</time></span><span>${lang === 'ko' ? '수정일' : 'Updated'}: <time datetime="${escape(post.updated_at)}">${escape(updatedDate)}</time></span></div></header>${post.image_url ? `<div class="article-shell"><img class="article-visual" src="${escape(post.image_url)}" alt="${escape(imageAlt)}"${sizeAttributes(dimensions, post.image_url)} loading="eager" fetchpriority="high" decoding="async" /></div>` : ''}<div class="article-body article-shell">${micromark(post.body, { extensions: [gfm()], htmlExtensions: [gfmHtml()] }).replace(/<img src="([^"]+)"/g, (tag, src) => `<img src="${src}"${sizeAttributes(dimensions, src.replace(/&amp;/g, '&'))} loading="lazy" decoding="async"`)}</div><div class="article-end article-shell"><div class="tag-list">${tags.map((tag) => `<span>#${escape(tag)}</span>`).join('')}</div></div></article><section class="comments article-shell" id="comments" data-comments data-lang="${lang}" data-page="${escape(pathFor(post))}"></section><script src="/comments.js" defer></script>`;
  const shell = await env.ASSETS.fetch(new Request(new URL(lang === 'ko' ? '/about/' : '/en/about/', request.url)));
  if (!shell.ok) return new Response('Template unavailable', { status: 503 });
  const alternateLang = lang === 'ko' ? 'en' : 'ko';
  const rewriter = new HTMLRewriter().on('html', new SetLanguage(lang)).on('head', new AppendHead(head)).on('main#content', new ReplaceMain(html)).on('title', new ReplaceText(title))
    .on('meta[name="description"]', new SetAttribute('content', post.description))
    .on('link[rel="canonical"]', new SetAttribute('href', canonical))
    .on(`link[hreflang="${lang}"]`, new SetAttribute('href', canonical))
    .on(`link[hreflang="${alternateLang}"]`, new SetAttribute('href', alternate))
    .on('link[hreflang="x-default"]', new SetAttribute('href', koUrl))
    .on('meta[property="og:locale"]', new SetAttribute('content', lang === 'ko' ? 'ko_KR' : 'en_US'))
    .on('meta[property="og:locale:alternate"]', new SetAttribute('content', lang === 'ko' ? 'en_US' : 'ko_KR'))
    .on('meta[property="og:image:width"]', imageSize ? new SetAttribute('content', String(imageSize[0])) : new RemoveElement())
    .on('meta[property="og:image:height"]', imageSize ? new SetAttribute('content', String(imageSize[1])) : new RemoveElement())
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

// The static sitemap lists home and category pages; their lastmod is the newest D1 post they show.
async function staticSitemap(request, env) {
  const response = await env.ASSETS.fetch(request);
  if (!response.ok) return response;
  const { results } = await env.DB.prepare('SELECT lang, category, updated_at FROM posts').all();
  const newest = new Map();
  const bump = (key, date) => { if (!newest.has(key) || newest.get(key) < date) newest.set(key, date); };
  for (const post of results) {
    const home = post.lang === 'ko' ? '/' : '/en/';
    bump(home, post.updated_at);
    bump(`${home}${normalizeCategory(post.category)}/`, post.updated_at);
  }
  const body = (await response.text()).replace(/<url><loc>([^<]+)<\/loc>(?!<lastmod>)/g, (entry, loc) => {
    const date = newest.get(new URL(loc).pathname);
    return date ? `${entry}<lastmod>${xml(date)}</lastmod>` : entry;
  });
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}

async function dynamicSitemap(env) {
  const { results } = await env.DB.prepare('SELECT lang, slug, updated_at FROM posts ORDER BY updated_at DESC').all();
  const langsBySlug = new Map();
  for (const post of results) langsBySlug.set(post.slug, [...(langsBySlug.get(post.slug) || []), post.lang]);
  const alternates = (slug) => {
    const langs = langsBySlug.get(slug);
    if (langs.length < 2) return '';
    return [...langs.map((lang) => `<xhtml:link rel="alternate" hreflang="${lang}" href="${xml(urlFor({ lang, slug }))}"/>`), `<xhtml:link rel="alternate" hreflang="x-default" href="${xml(urlFor({ lang: 'ko', slug }))}"/>`].join('');
  };
  const entries = results.map((post) => `<url><loc>${xml(urlFor(post))}</loc><lastmod>${xml(post.updated_at)}</lastmod>${alternates(post.slug)}</url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}</urlset>`, { headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}

// One feed per language (/rss.xml Korean, /en/rss.xml English) so Naver and readers get a single-language channel.
async function rssFeed(env, lang) {
  const { results } = await env.DB.prepare('SELECT lang, slug, category, title, description, published_at, updated_at FROM posts WHERE lang = ? ORDER BY published_at DESC LIMIT 50').bind(lang).all();
  const home = `${origin}${lang === 'ko' ? '/' : '/en/'}`;
  const self = `${home}rss.xml`;
  const name = lang === 'ko' ? 'HSL의 블로그' : "HSL's Blog";
  const description = lang === 'ko' ? 'AI 모델, 자동차, IT 기기의 가격·성능·마케팅 주장을 원문으로 따져보는 HSL의 기록' : 'HSL checks prices, benchmarks and marketing claims for AI models, cars and devices against the original sources';
  const built = results.reduce((latest, post) => (post.updated_at > latest ? post.updated_at : latest), results[0]?.updated_at || new Date().toISOString());
  const items = results.map((post) => `<item><title>${xml(post.title)}</title><link>${xml(urlFor(post))}</link><guid isPermaLink="true">${xml(urlFor(post))}</guid><description>${xml(post.description)}</description><category>${xml(categoryNames[lang][normalizeCategory(post.category)])}</category><pubDate>${new Date(post.published_at).toUTCString()}</pubDate></item>`).join('');
  const feed = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>${xml(name)}</title><link>${xml(home)}</link><description>${xml(description)}</description><language>${lang}</language><lastBuildDate>${new Date(built).toUTCString()}</lastBuildDate><atom:link href="${xml(self)}" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
  return new Response(feed, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
}

// Mirrors public/_headers for responses the Worker builds itself.
const securityHeaders = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; worker-src 'self' blob:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests",
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

function withSecurityHeaders(response) {
  if (response.status === 101) return response;
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(securityHeaders)) if (!headers.has(name)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

export default {
  async fetch(request, env, ctx) {
    return withSecurityHeaders(await handle(request, env, ctx));
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(submitRecentlyChanged(env));
  },
};

async function handle(request, env, ctx) {
    const url = new URL(request.url);
    // One canonical host: the old workers.dev address and www redirect permanently; the API stays reachable on both.
    const wrongHost = url.hostname.endsWith('.workers.dev') || url.hostname === `www.${new URL(origin).hostname}`;
    const insecure = url.protocol === 'http:' && url.hostname === new URL(origin).hostname;
    if ((wrongHost || insecure) && !url.pathname.startsWith('/api/') && (request.method === 'GET' || request.method === 'HEAD')) {
      return Response.redirect(`${origin}${url.pathname}${url.search}`, 301);
    }
    try {
      if (env.DB) await ensureSchema(env.DB);
      if (url.pathname.startsWith('/media/')) return images(request, env, url);
      if (url.pathname.startsWith('/api/')) return api(request, env, url, ctx);
      if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
      if (!env.DB) return env.ASSETS.fetch(request);
      if (url.pathname === '/dynamic-sitemap.xml') return dynamicSitemap(env);
      if (url.pathname === '/sitemap-0.xml') return staticSitemap(request, env);
      if (url.pathname === '/rss.xml' || url.pathname === '/en/rss.xml') return rssFeed(env, url.pathname === '/rss.xml' ? 'ko' : 'en');
      // Search engine ownership files are served verbatim; the asset handler would redirect *.html to an extensionless URL.
      if (Object.hasOwn(verificationFiles, url.pathname)) return new Response(verificationFiles[url.pathname], { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      if (url.pathname === '/robots.txt') {
        const original = await (await env.ASSETS.fetch(request)).text();
        return new Response(`${original.trim()}\nSitemap: ${origin}/dynamic-sitemap.xml\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
      }
      // One URL per page: every extensionless path without a trailing slash redirects permanently (the asset handler would answer 307 or 200).
      if (!url.pathname.endsWith('/') && !/\.[a-z0-9]+$/i.test(url.pathname)) return Response.redirect(`${origin}${url.pathname}/${url.search}`, 301);
      const oldGptPost = url.pathname.match(/^\/(en\/)?agi\/gpt-6-sol-luna-opus-5-5-cost-performance\/?$/);
      if (oldGptPost) return Response.redirect(`${origin}/${oldGptPost[1] || ''}posts/gpt-6-sol-luna-opus-5-5-cost-per-success/`, 301);
      const oldAiCategory = url.pathname.match(/^\/(en\/)?(?:agi|physical-ai|other-ai)(?:\/.*)?$/);
      if (oldAiCategory) return Response.redirect(`${origin}/${oldAiCategory[1] || ''}ai/`, 301);
      const listingRoute = url.pathname.match(/^\/(en\/)?(?:(ai|mobility|it-devices)\/?)?$/);
      if (listingRoute) return listingPage(request, env, listingRoute[1] ? 'en' : 'ko');
      const match = url.pathname.match(/^\/(en\/)?posts\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
      if (!match) {
        // Articles that moved from the static build to D1 keep their old category URL as a permanent redirect.
        const legacy = url.pathname.match(/^\/(en\/)?(?:ai|mobility|it-devices)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/);
        if (legacy) {
          const moved = await env.DB.prepare('SELECT lang, slug FROM posts WHERE lang = ? AND slug = ?').bind(legacy[1] ? 'en' : 'ko', legacy[2]).first();
          if (moved) return Response.redirect(`${origin}${pathFor(moved)}`, 301);
        }
        return env.ASSETS.fetch(request);
      }
      const post = await env.DB.prepare('SELECT * FROM posts WHERE lang = ? AND slug = ?').bind(match[1] ? 'en' : 'ko', match[2]).first();
      return post ? article(post, env, request) : notFound(env, request);
    } catch (error) {
      console.error(error);
      return json({ error: 'Server error' }, 500);
    }
}
