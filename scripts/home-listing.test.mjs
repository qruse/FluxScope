import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../worker/index.js', import.meta.url));
const bundled = await build({ entryPoints: [source], bundle: true, write: false, format: 'esm', platform: 'neutral', target: 'es2022' });
const blogTemplate = '<html><body><div data-dynamic-lead="ai"></div><div data-dynamic-lead="mobility"></div><div data-dynamic-lead="it-devices"></div><section data-dynamic-latest hidden><ol data-dynamic-latest-list></ol></section></body></html>';
const labTemplate = '<html><body><section data-dynamic-latest hidden><ol data-dynamic-latest-list data-limit="5"></ol></section></body></html>';

async function withWorker(posts, lang, run) {
 const mf = new Miniflare(convertV4MiniflareOptions({
  modules: true, script: bundled.outputFiles[0].text, compatibilityDate: '2026-09-25',
  d1Databases: ['DB'], cf: false,
  serviceBindings: { ASSETS: async (request) => new Response(/\/blog\//.test(new URL(request.url).pathname) ? blogTemplate : labTemplate, { headers: { 'Content-Type': 'text/html' } }) },
 }));
 try {
  // First request initializes the real Worker schema in an isolated local D1 database.
  await mf.dispatchFetch('https://hslab.space/api/posts?lang=ko');
  const db = await mf.getD1Database('DB');
  for (const p of posts) await db.prepare('INSERT INTO posts (lang,slug,category,title,description,body,tags,published_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)')
   .bind(lang,p.slug,p.category,p.title,'A sufficiently detailed description for the test','', '[]', p.date,p.date).run();
  return await run(mf);
 } finally { await mf.dispose(); }
}
const homeWith = (posts, lang='ko', path=`/${lang==='en'?'en/':''}blog/`) => withWorker(posts, lang, async mf => (await mf.dispatchFetch(`https://hslab.space${path}`, {headers:{'Cache-Control':'no-cache'}})).text());
const latestSlugs = html => Array.from((html.match(/<ol[^>]*data-dynamic-latest-list[^>]*>([\s\S]*?)<\/ol>/)?.[1] || '').matchAll(/href="(?:\/en)?\/blog\/posts\/([^/]+)\//g), m => m[1]);
const posts = [
 {slug:'iphone-new',category:'it-devices',title:'New iPhone',date:'2026-10-05T13:17:19.347Z'},
 {slug:'buick-new',category:'mobility',title:'New Buick',date:'2026-10-05T12:30:02.861Z'},
 {slug:'ai-new',category:'ai',title:'Newest AI',date:'2026-10-04T23:49:37.359Z'},
];
for (const lang of ['ko','en']) test(`${lang} latest list includes category leads in publication order`, async () => {
 const html = await homeWith([...posts].reverse(),lang);
 assert.deepEqual(latestSlugs(html),posts.map(p=>p.slug));
 assert.equal(/<section[^>]*data-dynamic-latest[^>]*\bhidden\b/.test(html),false);
 for(const post of posts) assert.ok(html.includes(post.title));
});
test('latest list includes the ten newest posts without dropping lead articles', async () => {
 const rows=Array.from({length:12},(_,i)=>({slug:`post-${i}`,category:['ai','mobility','it-devices'][i%3],title:`Article ${i}`,date:new Date(Date.UTC(2026,9,1+i)).toISOString()}));
 assert.deepEqual(latestSlugs(await homeWith(rows)),rows.slice(-10).reverse().map(p=>p.slug));
});
test('a homepage with no articles keeps its latest section hidden', async () => {
 const html=await homeWith([]);
 assert.deepEqual(latestSlugs(html),[]);
 assert.ok(/<section[^>]*data-dynamic-latest[^>]*\bhidden\b/.test(html));
});

test('lab home lists the five newest blog posts', async () => {
 const rows=Array.from({length:7},(_,i)=>({slug:`post-${i}`,category:'ai',title:`Article ${i}`,date:new Date(Date.UTC(2026,9,1+i)).toISOString()}));
 assert.deepEqual(latestSlugs(await homeWith(rows,'ko','/')),rows.slice(-5).reverse().map(p=>p.slug));
});
test('old blog URLs redirect permanently to the /blog/ section of hslab.space', async () => {
 const cases = [
  ['https://hslblog.com/', 'https://hslab.space/blog/'],
  ['https://www.hslblog.com/en/', 'https://hslab.space/en/blog/'],
  ['https://hslblog.com/posts/some-post/?x=1', 'https://hslab.space/blog/posts/some-post/?x=1'],
  ['https://hslblog.com/en/ai', 'https://hslab.space/en/blog/ai/'],
  ['https://hslblog.com/rss.xml', 'https://hslab.space/blog/rss.xml'],
  ['https://hslblog.com/privacy/', 'https://hslab.space/privacy/'],
  ['https://hslab.space/en/posts/some-post/', 'https://hslab.space/en/blog/posts/some-post/'],
  ['https://hslab.space/agi/', 'https://hslab.space/blog/ai/'],
  ['https://www.hslab.space/blog/', 'https://hslab.space/blog/'],
 ];
 await withWorker([], 'ko', async mf => {
  for (const [from, to] of cases) {
   const response = await mf.dispatchFetch(from, { redirect: 'manual', headers: { 'Cache-Control': 'no-cache' } });
   assert.equal(response.status, 301, from);
   assert.equal(response.headers.get('Location'), to, from);
  }
  // The lab home itself is not an old blog URL, and the API keeps answering on the old domain.
  assert.equal((await mf.dispatchFetch('https://hslab.space/', { headers: { 'Cache-Control': 'no-cache' } })).status, 200);
  assert.equal((await mf.dispatchFetch('https://hslblog.com/api/posts?lang=ko')).status, 200);
 });
});
