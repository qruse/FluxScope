import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateEditorial } from '../shared/editorial.mjs';
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
test('fenced sample headings and bullets are ignored', () => assert.deepEqual(changed(p => p.body = p.body.replace('## 토큰값', '```text\n## Fake\n- Example.\n```\n\n## 토큰값')), []));
test('periods fail in prose, decimals do not', () => assert.ok(changed(p => p.body = p.body.replace('판단할 수 있음\n', '판단할 수 있음.\n')).some(e => e.includes('period'))));
