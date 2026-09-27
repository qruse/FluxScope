import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateEditorial, validateRendered } from '../shared/editorial.mjs';
const original = JSON.parse(fs.readFileSync(new URL('../editorial/api-posts/ko-gpt-6-sol-luna-opus-5-5-cost-per-success.json', import.meta.url)));
const changed = (mutate) => { const p = structuredClone(original); mutate(p); return validateEditorial(p); };
test('reviewed reference passes', () => assert.deepEqual(validateEditorial(original), []));
test('two summary bullets fail even with three bullets elsewhere', () => assert.ok(changed(p => p.body = p.body.replace(/^- GPT-6.*\n/m, '')).some(e => e.includes('exactly three'))));
test('old AI category and duplicate tags fail', () => {
 const errors = changed(p => { p.category = 'agi'; p.tags[1] = p.tags[0]; });
 assert.ok(errors.some(e => e.includes('category'))); assert.ok(errors.some(e => e.includes('tags')));
});
test('repeated hero cannot satisfy the distinct-body-visual requirement', () => assert.ok(changed(p => p.body = p.body.replace('/images/posts/agi/gpt-6-api-prices.webp', p.imageUrl)).some(e => e.includes('distinct'))));
test('community inline and reference links fail', () => {
 for (const link of ['[source](https://reddit.com/x)', '[source][r]']) assert.ok(changed(p => p.body = p.body.replace('## 커뮤니티 반응', `## 커뮤니티 반응\n\n- ${link}`)).some(e => e.includes('URLs/links')));
});
test('Q&A must remain last and answers cannot be missing', () => {
 assert.ok(changed(p => p.body += '\n## Extra\n').some(e => e.includes('final H2')));
 assert.ok(changed(p => p.body = p.body.replace(/^  - .+$/gm, '')).some(e => e.includes('nested answer')));
});
test('fenced sample headings and bullets are ignored', () => assert.deepEqual(changed(p => p.body = p.body.replace('## 가격표는', '```text\n## Fake\n- Example.\n```\n\n## 가격표는')), []));
test('periods fail in prose, decimals do not', () => assert.ok(changed(p => p.body = p.body + '\n- Invalid trailing period.\n').some(e => e.includes('period'))));

test('rendered emphasis leakage fails while code samples are allowed', () => {
 assert.equal(validateRendered('<p>**65.2% → 79.4%**로</p>').length, 1);
 assert.deepEqual(validateRendered('<p><strong>65.2%에서 79.4%로 상승</strong>했음</p><code>**literal**</code>'), []);
});

test('image cap, ordered types and unique sketch are enforced', () => {
 assert.ok(changed(p => p.visualTypes[1] = 'sketch').some(e => e.includes('exactly one sketch')));
 assert.ok(changed(p => p.visualTypes.pop()).some(e => e.includes('match all images')));
 assert.ok(changed(p => { for(let i=0;i<9;i++){ p.body += `\n![Useful chart ${i}](/images/x${i}.webp)\n`; p.visualTypes.push('chart'); } }).some(e => e.includes('2–10')));
 for (const type of ['source', 'architecture', 'pipeline', 'chart']) assert.deepEqual(changed(p => p.visualTypes[1] = type), []);
});
