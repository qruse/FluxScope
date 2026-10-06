import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import worker from '../worker/index.js';
import { validateEditorial, validateRendered, IMAGE_MINIMUM_CHANGED_AT } from '../shared/editorial.mjs';
const original = JSON.parse(fs.readFileSync(new URL('../editorial/api-posts/ko-gpt-6-sol-luna-opus-5-5-cost-per-success.json', import.meta.url)));
const legacyContext = { existingPublishedAt: original.publishedAt };
const changed = (mutate) => { const p = structuredClone(original); mutate(p); return validateEditorial(p, legacyContext); };
test('reviewed historical reference passes without adding images', () => assert.deepEqual(validateEditorial(original, legacyContext), []));
test('two summary bullets fail even with three bullets elsewhere', () => assert.ok(changed(p => p.body = p.body.replace(/^- .+\n/m, '')).some(e => e.includes('exactly three'))));
test('old AI category and duplicate tags fail', () => {
 const errors = changed(p => { p.category = 'agi'; p.tags[1] = p.tags[0]; });
 assert.ok(errors.some(e => e.includes('category'))); assert.ok(errors.some(e => e.includes('tags')));
});
test('repeated hero cannot satisfy the distinct-body-visual requirement', () => assert.ok(changed(p => p.body = p.body.replace(/(!\[[^\]]*\]\()[^)]+\)/, `$1${p.imageUrl})`)).some(e => e.includes('distinct'))));
test('community reactions may link their original sources', () => {
 assert.deepEqual(changed(p => p.body = p.body.replace('## 커뮤니티 반응', '## 커뮤니티 반응\n\n- 한 사용자의 보고 ([Hacker News](https://news.ycombinator.com/item?id=1))')), []);
});
test('Q&A must remain last and answers cannot be missing', () => {
 assert.ok(changed(p => p.body += '\n## Extra\n').some(e => e.includes('final H2')));
 assert.ok(changed(p => p.body = p.body.replace(/^  - .+$/gm, '')).some(e => e.includes('nested answer')));
});
test('fenced sample headings and bullets are ignored', () => assert.deepEqual(changed(p => p.body = p.body.replace('## 커뮤니티 반응', '```text\n## Fake\n- Example.\n```\n\n## 커뮤니티 반응')), []));
test('periods fail in prose, decimals do not', () => assert.ok(changed(p => p.body = p.body + '\n- Invalid trailing period.\n').some(e => e.includes('period'))));

test('rendered emphasis leakage fails while code samples are allowed', () => {
 assert.equal(validateRendered('<p>**65.2% → 79.4%**로</p>').length, 1);
 assert.equal(validateRendered('<p>5<del>45개, Luna는 350</del>3,000개</p>').length, 1);
 assert.deepEqual(validateRendered('<p>5~45개, Luna는 350~3,000개</p>'), []);
 assert.deepEqual(validateRendered('<p><strong>65.2%에서 79.4%로 상승</strong>했음</p><code>**literal**</code>'), []);
});

test('image cap, ordered types and unique sketch are enforced', () => {
 assert.ok(changed(p => p.visualTypes[1] = 'sketch').some(e => e.includes('exactly one sketch')));
 assert.ok(changed(p => p.visualTypes.pop()).some(e => e.includes('match all images')));
 assert.ok(changed(p => { for(let i=0;i<9;i++){ p.body += `\n![Useful chart ${i}](/images/x${i}.webp)\n`; p.visualTypes.push('chart'); } }).some(e => e.includes('2–10')));
 for (const type of ['source', 'architecture', 'pipeline', 'chart']) assert.deepEqual(changed(p => p.visualTypes[1] = type), []);
});

test('Sourced Reddit reactions are required', () => {
 assert.ok(changed(p => p.body = p.body.replaceAll(/\[레딧[^\]]*\]\([^)]+\)/g, '출처 없음')).some(e => e.includes('original-source')));
 assert.ok(changed(p => p.body = p.body.replaceAll('www.reddit.com', 'example.com')).some(e => e.includes('Reddit')));
});

function withImageCount(count) {
 const p = structuredClone(original);
 p.body = p.body.replace(/!\[[^\]]*\]\([^\s)]+\)/g, '');
 p.visualTypes = ['sketch'];
 for (let i = 1; i < count; i++) {
  p.body = p.body.replace('## 커뮤니티 반응', `![Useful body diagram ${i}](/images/test-${i}.webp)\n\n## 커뮤니티 반응`);
  p.visualTypes.push('architecture');
 }
 return p;
}

test('new articles need at least four distinct images, including the thumbnail', () => {
 for (const count of [2, 3]) assert.ok(validateEditorial(withImageCount(count)).some(e => e.includes('4–10')));
 for (const count of [4, 10]) assert.deepEqual(validateEditorial(withImageCount(count)), []);
 assert.ok(validateEditorial(withImageCount(11)).some(e => e.includes('4–10')));
});

test('only stored publication dates before the change retain the old minimum', () => {
 const p = withImageCount(2);
 assert.deepEqual(validateEditorial(p, legacyContext), []);
 // The historical date carried by the payload is insufficient on its own.
 assert.ok(validateEditorial(p).some(e => e.includes('4–10')));
 for (const date of [IMAGE_MINIMUM_CHANGED_AT, '2026-10-06T00:00:00.000Z', 'invalid', undefined]) {
  assert.ok(validateEditorial(p, { existingPublishedAt: date }).some(e => e.includes('4–10')));
 }
 assert.ok(validateEditorial(withImageCount(1), legacyContext).some(e => e.includes('2–10')));
 assert.ok(validateEditorial(withImageCount(11), legacyContext).some(e => e.includes('2–10')));
});

test('offline historical fixtures remain intact even without a publication date', () => {
 const p = withImageCount(2);
 delete p.publishedAt;
 assert.deepEqual(validateEditorial(p, { legacyImageFixture: true }), []);
 assert.ok(validateEditorial(p).some(e => e.includes('4–10')));
 assert.ok(validateEditorial(withImageCount(1), { legacyImageFixture: true }).some(e => e.includes('2–10')));
 assert.ok(validateEditorial(withImageCount(11), { legacyImageFixture: true }).some(e => e.includes('2–10')));
});

test('duplicating body images cannot reach the new minimum', () => {
 const p = withImageCount(4);
 p.body = p.body.replace('/images/test-3.webp', '/images/test-2.webp');
 assert.ok(validateEditorial(p).some(e => e.includes('distinct')));
});

test('SEO limits: long titles, long alt text and body H1 fail', () => {
 assert.ok(changed(p => p.title = 'x'.repeat(71)).some(e => e.includes('8–70')));
 assert.ok(changed(p => p.imageAlt = 'x'.repeat(151)).some(e => e.includes('5–150')));
 assert.ok(changed(p => p.body = p.body.replace('## 커뮤니티 반응', '# Extra title\n\n## 커뮤니티 반응')).some(e => e.includes('H1')));
});

async function imagePolicyRequest(count, existingPublishedAt) {
 const inserts = [];
 const db = {
  prepare(sql) {
   return { sql, args: [], bind(...args) { this.args = args; return this; }, async run() { return {}; } };
  },
  async batch(statements) {
   return statements.map(statement => {
    if (statement.sql.startsWith('SELECT published_at')) return { results: existingPublishedAt ? [{ published_at: existingPublishedAt }] : [] };
    if (statement.sql.startsWith('INSERT INTO posts')) inserts.push(statement);
    return { results: [] };
   });
  },
 };
 const p = withImageCount(count);
 // Untrusted payload fields must not activate either exception at the API boundary.
 p.publishedAt = original.publishedAt;
 p.legacyImageFixture = true;
 const request = new Request('https://hslblog.com/api/posts', {
  method: 'POST', headers: { Authorization: 'Bearer test-only', 'Content-Type': 'application/json', 'If-Match': 'update' },
  body: JSON.stringify({ posts: [p] }),
 });
 const response = await worker.fetch(request, { DB: db, PUBLISH_TOKEN: 'test-only' });
 return { response, inserts };
}

test('API rejects backdated new two-image articles without a post write', async () => {
 const { response, inserts } = await imagePolicyRequest(2);
 assert.equal(response.status, 422);
 assert.ok((await response.json()).details.some(e => e.includes('4–10')));
 assert.equal(inserts.length, 0);
});

test('API permits legacy two-image edits and preserves the stored publication date', async () => {
 const { response, inserts } = await imagePolicyRequest(2, original.publishedAt);
 assert.equal(response.status, 200);
 assert.equal(inserts.length, 1);
 assert.equal(inserts[0].args[9], original.publishedAt);
});

test('API applies four-image minimum to posts first published after the change', async () => {
 const { response, inserts } = await imagePolicyRequest(2, IMAGE_MINIMUM_CHANGED_AT);
 assert.equal(response.status, 422);
 assert.equal(inserts.length, 0);
});

test('API accepts a new four-image article', async () => {
 const { response, inserts } = await imagePolicyRequest(4);
 assert.equal(response.status, 201);
 assert.equal(inserts.length, 1);
});
