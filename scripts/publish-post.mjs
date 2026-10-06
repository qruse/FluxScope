// Publish one article (both languages) to D1 without a site build.
// Usage: PUBLISH_TOKEN=... node scripts/publish-post.mjs <en.json> <ko.json> [--dry-run | --preview]
// --preview uploads an unlisted, noindexed draft to /preview/<token>/ instead: missing images and editorial problems are warnings
// --pull <slug> downloads the saved working files (both payloads and editorial/reviews/<slug>.md) from D1
// Previews and publishes save those working files to D1 (/api/drafts), so article handoffs never need Git
// 1. Any image that is not already live is uploaded to /api/images and the payload files are rewritten to the /media URL
// 2. Both payloads are validated with the same rules as the API
// 3. The live versions are backed up to the OS temp directory
// 4. Both languages are written in one atomic request, then the live pages and images are checked
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { micromark } from 'micromark';
import { gfm, gfmHtml } from 'micromark-extension-gfm';
import { validateEditorial, validateRendered } from '../shared/editorial.mjs';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const preview = args.includes('--preview');
const files = args.filter((arg) => !arg.startsWith('--'));
const site = (process.env.SITE_URL || 'https://hslab.space').replace(/\/$/, '');
const token = process.env.PUBLISH_TOKEN;
const fail = (message) => { console.error(`✘ ${message}`); process.exit(1); };
if (files.length < 1 || files.length > 2) fail('Pass one or two payload files (en and ko)');
if (!dryRun && !token) fail('Set PUBLISH_TOKEN');

const auth = { Authorization: `Bearer ${token}` };
if (args.includes('--pull')) {
  const slug = args[args.indexOf('--pull') + 1] || '';
  if (!token) fail('Set PUBLISH_TOKEN');
  const response = await fetch(`${site}/api/drafts?slug=${encodeURIComponent(slug)}`, { headers: auth });
  const draft = await response.json().catch(() => ({}));
  if (!response.ok) fail(`Pull failed: ${response.status} ${JSON.stringify(draft)}`);
  for (const post of draft.posts) {
    const file = path.join('editorial/api-posts', `${post.lang}-${slug}.json`);
    fs.writeFileSync(file, `${JSON.stringify(post, null, 2)}\n`);
    console.log(`• ${file}`);
  }
  if (draft.review) { fs.writeFileSync(path.join('editorial/reviews', `${slug}.md`), draft.review); console.log(`• editorial/reviews/${slug}.md`); }
  console.log(`✔ pulled ${slug} (saved ${draft.updatedAt})`);
  process.exit(0);
}
const saveDraft = async () => {
  const review = path.join('editorial/reviews', `${posts[0].slug}.md`);
  const response = await fetch(`${site}/api/drafts?slug=${posts[0].slug}`, {
    method: 'PUT', headers: { ...auth, 'Content-Type': 'application/json' },
    body: JSON.stringify({ posts: files.map((file) => JSON.parse(fs.readFileSync(file, 'utf8'))), review: fs.existsSync(review) ? fs.readFileSync(review, 'utf8') : '' }),
  });
  console.log(response.ok ? '• working files saved to D1 (pull with --pull)' : `! working files not saved: ${response.status}`);
};
const posts = files.map((file) => JSON.parse(fs.readFileSync(file, 'utf8')));
if (new Set(posts.map((p) => p.lang)).size !== posts.length) fail('Payloads must use different languages');
if (new Set(posts.map((p) => p.slug)).size !== 1 || new Set(posts.map((p) => p.category)).size !== 1) fail('Payloads must share slug and category');

const imageRefs = (post) => [post.imageUrl, ...[...post.body.matchAll(/!\[[^\]]*\]\(([^\s)]+)\)/g)].map((m) => m[1])];
if (posts.length === 2 && JSON.stringify(imageRefs(posts[0])) !== JSON.stringify(imageRefs(posts[1]))) fail('Both languages must use the same images in the same order');

const live = async (url) => (await fetch(`${site}${url}`, { method: 'HEAD' })).ok;
const mime = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif' };

// Upload images that are local files or /images/ paths not yet deployed, so no build is needed.
const replacements = new Map();
const missing = new Set();
for (const ref of new Set(imageRefs(posts[0]))) {
  if (!ref || ref.startsWith('https://') || ref.startsWith('/media/')) continue;
  if (ref.startsWith('/images/') && (dryRun || await live(ref))) continue;
  const file = ref.startsWith('/images/') ? path.join('public', ref) : ref;
  if (!fs.existsSync(file)) {
    if (!preview) fail(`Image not found locally or live: ${ref}`);
    console.log(`! preview without ${ref} (not found locally or live)`);
    missing.add(ref);
    continue;
  }
  const size = fs.statSync(file).size;
  if (size > 500 * 1024) fail(`${ref} is ${Math.round(size / 1024)} KiB; the editorial cap is 500 KiB`);
  if (dryRun) { console.log(`• would upload ${file}`); continue; }
  const response = await fetch(`${site}/api/images`, { method: 'POST', headers: { ...auth, 'Content-Type': mime[path.extname(file).toLowerCase()] || 'application/octet-stream' }, body: fs.readFileSync(file) });
  if (!response.ok) fail(`Upload failed for ${ref}: ${response.status} ${await response.text()}`);
  const { url } = await response.json();
  replacements.set(ref, url);
  console.log(`• uploaded ${file} → ${url}`);
}
if (replacements.size) {
  posts.forEach((post, i) => {
    for (const [from, to] of replacements) {
      if (post.imageUrl === from) post.imageUrl = to;
      post.body = post.body.split(`](${from})`).join(`](${to})`);
    }
    fs.writeFileSync(files[i], `${JSON.stringify(post, null, 2)}\n`);
  });
  console.log('• payload files updated with /media URLs');
}

// A payload's own publishedAt cannot exempt a new article from the four-image minimum.
const imageContexts = await Promise.all(posts.map(async (post) => {
  if (imageRefs(post).length >= 4) return {};
  const response = await fetch(`${site}/api/posts?lang=${post.lang}&slug=${post.slug}`, { headers: { 'Cache-Control': 'no-cache' } });
  if (response.status === 404) return {};
  if (!response.ok) fail(`Cannot verify existing image policy (${post.lang}: ${response.status})`);
  const current = await response.json();
  return { existingPublishedAt: current.publishedAt };
}));
const errors = posts.flatMap((post, i) => [...validateEditorial(post, imageContexts[i]), ...validateRendered(micromark(post.body, { extensions: [gfm()], htmlExtensions: [gfmHtml()] }))].map((e) => `${post.lang}: ${e}`));
if (preview) {
  for (const post of posts) if (missing.has(post.imageUrl)) delete post.imageUrl;
  await saveDraft();
  if (errors.length) console.log(`! not publishable yet:\n  ${errors.join('\n  ')}`);
  const response = await fetch(`${site}/api/previews`, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' }, body: JSON.stringify({ posts }) });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) fail(`Preview failed: ${response.status} ${JSON.stringify(result)}`);
  console.log(`✔ preview (unlisted, noindex) ${result.posts.map((p) => `${p.lang} ${site}${p.url}`).join(', ')}`);
  process.exit(0);
}
if (errors.length) fail(`Validation failed:\n  ${errors.join('\n  ')}`);
// A stale working copy can point at an image that was replaced and deleted; refuse before anything is written.
for (const ref of new Set(imageRefs(posts[0]))) {
  if (ref?.startsWith('/media/') && !(await live(ref))) fail(`Image is not live: ${ref}. The working copy may be stale: run --pull ${posts[0].slug} and reapply your edit`);
}
console.log('✔ validation passed');
if (dryRun) process.exit(0);

const slug = posts[0].slug;
const backups = [];
for (const post of posts) {
  const response = await fetch(`${site}/api/posts?lang=${post.lang}&slug=${slug}`);
  if (response.ok) backups.push(await response.json());
}
if (backups.length) {
  const file = path.join(os.tmpdir(), `fluxscope-backup-${slug}-${Date.now()}.json`);
  fs.writeFileSync(file, JSON.stringify(backups, null, 2));
  console.log(`• backup of live version: ${file}`);
  // Keep the original publication date on updates.
  for (const post of posts) {
    const old = backups.find((b) => b.lang === post.lang);
    if (old) post.publishedAt = old.publishedAt;
  }
  // The thumbnail only changes through a fresh upload; a different existing /media/ URL means the working copy is older than the live article.
  const uploaded = new Set(replacements.values());
  const stale = posts.filter((post) => { const old = backups.find((b) => b.lang === post.lang); return old && old.imageUrl !== post.imageUrl && !uploaded.has(post.imageUrl); });
  if (stale.length) fail(`The live thumbnail differs from the working copy (${stale.map((p) => p.lang).join(', ')}). Run --pull ${slug} to get the latest version, reapply your edit, then publish again`);
}

const response = await fetch(`${site}/api/posts`, {
  method: 'POST',
  headers: { ...auth, 'Content-Type': 'application/json', ...(backups.length ? { 'If-Match': 'update' } : {}) },
  body: JSON.stringify({ posts }),
});
const result = await response.json().catch(() => ({}));
if (!response.ok) fail(`Publish failed: ${response.status} ${JSON.stringify(result)}`);
await saveDraft();
console.log(`✔ published ${result.posts.map((p) => `${p.lang} ${p.url}`).join(', ')} at ${result.posts[0].updatedAt}`);

let broken = 0;
for (const post of posts) {
  const url = result.posts.find((p) => p.lang === post.lang).url;
  const page = await fetch(`${site}${url}`, { headers: { 'Cache-Control': 'no-cache' } });
  const html = await page.text();
  const titled = html.includes(post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;'));
  console.log(`${page.ok && titled ? '✔' : '✘'} ${url} ${page.status}${titled ? '' : ' (title not found)'}`);
  if (!page.ok || !titled) broken++;
}
for (const ref of new Set(imageRefs(posts[0]))) {
  const ok = ref.startsWith('https://') || await live(ref);
  if (!ok) { console.log(`✘ image ${ref}`); broken++; }
}
if (broken) fail(`${broken} live check(s) failed; restore with the backup above if needed`);
console.log('✔ live pages and images verified');
