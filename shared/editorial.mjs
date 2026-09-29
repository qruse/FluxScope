// Shared by the static build and authenticated API writes. Facts still require review.
export function validateEditorial(post) {
  const errors = [];
  const add = (condition, message) => { if (!condition) errors.push(message); };
  add(['ko', 'en'].includes(post.lang), 'lang must be ko or en');
  add(['ai', 'mobility', 'it-devices'].includes(post.category), 'category must be ai, mobility or it-devices');
  add(typeof post.title === 'string' && post.title.trim().length >= 8 && [...post.title.trim()].length <= 70, 'title must contain 8–70 characters');
  add(typeof post.description === 'string' && post.description.trim().length >= 50 && post.description.length <= 180, 'description must contain 50–180 characters');
  add(Array.isArray(post.tags) && post.tags.length >= 5 && post.tags.length <= 15 && new Set(post.tags).size === post.tags.length && post.tags.every(t => typeof t === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(t)), 'use 5–15 distinct lowercase kebab-case tags');
  const imageUrl = post.imageUrl || post.image?.src;
  const imageAlt = post.imageAlt || post.image?.alt;
  add(typeof imageUrl === 'string' && /^\/(?:images|media)\/.+\.(?:webp|png|jpe?g|avif|gif)$/.test(imageUrl), 'provide a local /images/ or /media/ thumbnail URL');
  add(typeof imageAlt === 'string' && imageAlt.trim().length >= 5 && [...imageAlt.trim()].length <= 150, 'thumbnail alt text must be 5–150 characters');
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
    const reactions = section.split(/\r?\n/).filter(line => /^[-*] /.test(line));
    add(reactions.length >= 2 && reactions.length <= 4 && reactions.every(line => /\[[^\]]+\]\(https:\/\/[^\s)]+\)/.test(line)), 'community requires 2–4 reaction bullets, each with an original-source HTTPS link');
    add(/https:\/\/(?:www\.)?reddit\.com\/r\/[^/\s]+\/comments\//.test(section), 'community must include a Reddit thread or comment source');
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
  add(bodyImages.every(m => m[1].trim().length >= 5 && [...m[1].trim()].length <= 150), 'body image alt text must be 5–150 characters');
  add(!/^# /m.test(prose), 'the template renders the H1; start body headings at ##');
  const urls = [imageUrl, ...bodyImages.map(m => m[2])];
  add(urls.length >= 2 && urls.length <= 10, 'use 2–10 images including the thumbnail');
  add(new Set(urls).size === urls.length, 'all image URLs must be distinct');
  const types = post.visualTypes;
  add(Array.isArray(types) && types.length === urls.length && types.every(t => ['source', 'sketch', 'architecture', 'pipeline', 'chart'].includes(t)), 'visualTypes must match all images in order using the five supported types');
  add(Array.isArray(types) && types[0] === 'sketch' && types.filter(t => t === 'sketch').length === 1, 'use exactly one sketch, as the thumbnail');
  add(!/<img\b|!\[[^\]]*\](?!\()/i.test(prose), 'use inline Markdown images, not HTML or reference-style images');
  return errors;
}

export function validateRendered(html) {
  const prose = html.replace(/<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/<[^>]*>/g, '');
  const errors = /\*\*[^\n]*\*\*/.test(prose) ? ['unrendered ** emphasis markers remain; rewrite punctuation next to the closing marker'] : [];
  // Two single tildes in one paragraph ("5~45 ... 350~3,000") render as strikethrough between them.
  if (/<del>/i.test(html)) errors.push('unintended strikethrough: a pair of ~ characters was rendered as <del>; write ranges with an en dash (5–45) or escape the tilde as \\~');
  return errors;
}
