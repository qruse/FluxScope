// Shared by the static build and authenticated API writes. Facts still require review.
export function validateEditorial(post) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  add(['ko', 'en'].includes(post.lang), 'lang must be ko or en');
  add(['ai', 'mobility', 'it-devices'].includes(post.category), 'category must be ai, mobility or it-devices');
  add(typeof post.title === 'string' && post.title.trim().length >= 8, 'title must contain at least 8 characters');
  add(typeof post.description === 'string' && post.description.trim().length >= 50 && post.description.length <= 180, 'description must contain 50–180 characters');
  add(Array.isArray(post.tags) && post.tags.length >= 5 && post.tags.length <= 15 && new Set(post.tags).size === post.tags.length && post.tags.every(t => typeof t === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t)), 'use 5–15 distinct lowercase kebab-case tags');
  const imageUrl = post.imageUrl || post.image?.src;
  const imageAlt = post.imageAlt || post.image?.alt;
  add(typeof imageUrl === 'string' && /^\/(?:images|media)\/.+\.(?:webp|png|jpe?g|avif|gif)$/.test(imageUrl), 'provide a local /images/ or /media/ thumbnail URL');
  add(typeof imageAlt === 'string' && imageAlt.trim().length >= 5, 'provide descriptive thumbnail alt text');
  const body = typeof post.body === 'string' ? post.body : '';
  // Ignore fenced code when checking prose, headings and image occurrences.
  let fence = null;
  const prose = body.split(/\r?\n/).filter(line => {
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (marker) {
      if (!fence) fence = marker[1];
      else if (marker[1][0] === fence[0] && marker[1].length >= fence.length) fence = null;
      return false;
    }
    return !fence;
  }).join('\n');
  add(!fence, 'close the fenced code block');
  const headings = [...prose.matchAll(/^## (.+)$/gm)];
  const summary = post.lang === 'ko' ? '3줄 요약' : '3-Line TL;DR';
  const community = post.lang === 'ko' ? '커뮤니티 반응' : 'Community Reactions';
  const qa = post.lang === 'ko' ? 'Q&A 또 궁금한 것은?' : 'Q&A (Field Notes)';
  add(headings[0]?.[1] === summary && prose.trimStart().startsWith(`## ${summary}\n`), `start the body with ## ${summary}`);
  add(headings.filter(h => h[1] === summary).length === 1, 'include exactly one summary heading');
  add(headings.at(-1)?.[1] === qa && headings.filter(h => h[1] === qa).length === 1, `the final H2 must be ## ${qa}`);
  const firstSection = prose.slice((headings[0]?.index ?? 0) + (headings[0]?.[0].length ?? 0), headings[1]?.index ?? prose.length);
  add((firstSection.match(/^[-*] /gm) || []).length === 3 && !/^[ \t]+[-*] /m.test(firstSection), 'summary must contain exactly three top-level bullets and no nested bullets');
  const ci = headings.findIndex(h => h[1] === community);
  if (ci >= 0) {
    add(ci === headings.length - 2 && headings.filter(h => h[1] === community).length === 1, 'community must occur once, immediately before Q&A');
    const section = prose.slice(headings[ci].index + headings[ci][0].length, headings[ci + 1]?.index ?? prose.length);
    add(!/https?:\/\/|\[[^\]]+\]\s*(?:\(|\[)|<a\b/i.test(section), 'keep community URLs/links in the internal source record, not the published section');
  }
  const qi = headings.find(h => h[1] === qa);
  const qbody = qi ? prose.slice(qi.index + qi[0].length) : '';
  const questions = qbody.split(/(?=^[-*] \*\*Q[.:])/m).filter(s => /^[-*] \*\*Q[.:]/.test(s));
  add(questions.length >= 3 && questions.length <= 5 && questions.every(q => /^[ \t]{2,}[-*] \S/m.test(q)), 'Q&A requires 3–5 bold Q. / Q: bullets, each with a nested answer');
  add(!/^\s*[-*] .+\.(?:\*\*)?\s*$/m.test(prose), 'bullet lines must not end with a period');
  add(!/(?:^|\n)\s*(?:---|\*\*\*|___)\s*$/.test(prose), 'do not end with a horizontal rule');
  const bodyImages = [...prose.matchAll(/!\[([^\]]*)\]\(([^\s)]+)\)/g)];
  add(bodyImages.some(m => m[2] !== imageUrl), 'include a distinct useful body image in addition to the sketch thumbnail');
  add(!bodyImages.some(m => m[2] === imageUrl), 'do not repeat the thumbnail in the body');
  add(bodyImages.every(m => m[1].trim().length >= 5), 'body images need descriptive alt text');
  return errors;
}
