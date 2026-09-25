import fs from 'node:fs';
import path from 'node:path';

const postsDir = path.resolve('src/content/posts');

function getPostFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getPostFiles(fullPath));
    } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
      results.push(fullPath);
    }
  }
  return results;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return { frontmatter: null, body: content };
  const rawYaml = match[1];
  const body = content.slice(match[0].length);

  // Simple YAML parser supporting scalars, arrays, and nested objects
  const data = {};
  const lines = rawYaml.split(/\r?\n/);
  let currentKey = null;
  let inArray = false;
  let inObject = false;

  for (const line of lines) {
    if (line.trim().startsWith('#')) continue;

    // Indented sub-properties under an object like image:
    const subKvMatch = line.match(/^\s{2,}([a-zA-Z0-9_]+):\s*(.*)$/);
    if (inObject && subKvMatch) {
      const subKey = subKvMatch[1];
      const subVal = subKvMatch[2].trim().replace(/^["']|["']$/g, '');
      data[currentKey] = data[currentKey] || {};
      data[currentKey][subKey] = subVal;
      continue;
    }

    const arrayItemMatch = line.match(/^\s*-\s+(.*)$/);
    if (inArray && arrayItemMatch) {
      data[currentKey] = data[currentKey] || [];
      data[currentKey].push(arrayItemMatch[1].trim().replace(/^["']|["']$/g, ''));
      continue;
    }

    const kvMatch = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kvMatch) {
      currentKey = kvMatch[1];
      const val = kvMatch[2].trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        inArray = false;
        inObject = false;
        data[currentKey] = val
          .slice(1, -1)
          .split(',')
          .map((s) => s.trim().replace(/^["']|["']$/g, ''))
          .filter(Boolean);
      } else if (val === '') {
        if (currentKey === 'image') {
          inObject = true;
          inArray = false;
          data[currentKey] = {};
        } else {
          inArray = true;
          inObject = false;
          data[currentKey] = [];
        }
      } else {
        inArray = false;
        inObject = false;
        data[currentKey] = val.replace(/^["']|["']$/g, '');
      }
    }
  }

  return { frontmatter: data, body };
}

const files = getPostFiles(postsDir);
const errors = [];

const PLACEHOLDER_TERMS = ['todo', 'lorem ipsum', '경험 코멘트', '경험 메모', 'placeholder', 'test comment'];

for (const file of files) {
  const relPath = path.relative(process.cwd(), file).replace(/\\/g, '/');
  const isKorean = relPath.includes('/ko/');
  const isEnglish = relPath.includes('/en/');
  const raw = fs.readFileSync(file, 'utf-8');
  const { frontmatter, body } = parseFrontmatter(raw);

  if (!frontmatter) {
    errors.push(`${relPath}: Missing frontmatter block.`);
    continue;
  }

  // 1. E-E-A-T: Experience Note Validation (Optional during test phase, validated if present)
  const exp = frontmatter.experienceNote;
  if (exp !== undefined && exp !== null && exp !== '') {
    if (typeof exp !== 'string' || exp.trim().length < 15) {
      errors.push(
        `${relPath}: [E-E-A-T FAIL] 'experienceNote' must be at least 15 characters if provided.`
      );
    } else {
      const lower = exp.toLowerCase();
      if (PLACEHOLDER_TERMS.some((term) => lower.includes(term))) {
        errors.push(
          `${relPath}: [E-E-A-T FAIL] 'experienceNote' contains placeholder text ("${exp}"). Must be an authentic user field experience comment.`
        );
      }
    }
  }

  // 2. Fixed & Optional Section Headers Validation & Ordering
  if (isKorean) {
    if (!body.includes('## 3줄 요약')) {
      errors.push(`${relPath}: Missing fixed top section '## 3줄 요약'.`);
    }
    if (!body.includes('## Q&A 또 궁금한 것은?')) {
      errors.push(`${relPath}: Missing fixed bottom section '## Q&A 또 궁금한 것은?'.`);
    }
    // Optional dynamic section: '## 커뮤니티 반응' (validated for ordering if present)
    if (body.includes('## 커뮤니티 반응') && body.includes('## Q&A 또 궁금한 것은?')) {
      if (body.indexOf('## 커뮤니티 반응') > body.indexOf('## Q&A 또 궁금한 것은?')) {
        errors.push(`${relPath}: Optional '## 커뮤니티 반응' must appear before '## Q&A 또 궁금한 것은?'.`);
      }
    }
  } else if (isEnglish) {
    if (!body.includes('## 3-Line TL;DR')) {
      errors.push(`${relPath}: Missing fixed top section '## 3-Line TL;DR'.`);
    }
    if (!body.includes('## Q&A (Field Notes)')) {
      errors.push(`${relPath}: Missing fixed bottom section '## Q&A (Field Notes)'.`);
    }
    // Optional dynamic section: '## Community Reactions' (validated for ordering if present)
    if (body.includes('## Community Reactions') && body.includes('## Q&A (Field Notes)')) {
      if (body.indexOf('## Community Reactions') > body.indexOf('## Q&A (Field Notes)')) {
        errors.push(`${relPath}: Optional '## Community Reactions' must appear before '## Q&A (Field Notes)'.`);
      }
    }
  }

  // 3. Tags Count Validation (5 <= tags <= 15)
  const tags = frontmatter.tags;
  if (!Array.isArray(tags) || tags.length < 5 || tags.length > 15) {
    const count = Array.isArray(tags) ? tags.length : 0;
    errors.push(`${relPath}: Tags count must be between 5 and 15 (found ${count}).`);
  }

  // 4. Punctuation: No trailing period on bullet items
  const bodyLines = body.split(/\r?\n/);
  bodyLines.forEach((line, idx) => {
    const trimmed = line.trim();
    if ((trimmed.startsWith('- ') || trimmed.startsWith('* ')) && !trimmed.startsWith('***')) {
      if (trimmed.endsWith('.')) {
        errors.push(`${relPath}:${idx + 1}: Bullet point must not end with a trailing period (found "${trimmed}").`);
      }
    }
  });

  // 5. No Trailing Footer / Disclaimers
  const trimmedBody = body.trim();
  if (trimmedBody.endsWith('---')) {
    errors.push(`${relPath}: Trailing horizontal rule ('---') at end of article is forbidden.`);
  }

  // 6. Static Image Optimization Audit & Count
  const imageSources = [];
  if (frontmatter.image && frontmatter.image.src) {
    imageSources.push(frontmatter.image.src);
  }
  const inlineImgMatches = body.matchAll(/!\[.*?\]\(((\/images\/[^\s)]+))/g);
  for (const match of inlineImgMatches) {
    imageSources.push(match[1]);
  }

  // 6-1. Prohibit Generic Reused Placeholder Thumbnails
  const FORBIDDEN_PLACEHOLDER_IMAGES = [
    '/images/agi.png',
    '/images/other-ai.png',
    '/images/physical-ai.png',
    '/images/regenerative-braking.png',
    '/images/posts/thumbnail.png'
  ];
  if (frontmatter.image && FORBIDDEN_PLACEHOLDER_IMAGES.includes(frontmatter.image.src)) {
    errors.push(
      `${relPath}: [THUMBNAIL RULE FAIL] Generic placeholder image "${frontmatter.image.src}" is forbidden. Must use a representative technical image specific to this article.`
    );
  }

  // 6-2. Minimum 2 Distinct Technical Images per Post
  const uniqueImages = new Set(imageSources);
  if (uniqueImages.size < 2) {
    errors.push(
      `${relPath}: [IMAGE RULE FAIL] Article must contain at least 2 distinct technical images (found ${uniqueImages.size}). Frontmatter thumbnail must be representative and body must contain additional technical visuals.`
    );
  }

  // 6-3. Image File Existence & Size Cap Audit (<= 500KB)
  for (const imgSrc of imageSources) {
    const cleanPath = imgSrc.startsWith('/') ? imgSrc.slice(1) : imgSrc;
    const localImgPath = path.resolve('public', cleanPath);
    if (!fs.existsSync(localImgPath)) {
      errors.push(`${relPath}: Image file does not exist on disk: "${cleanPath}".`);
    } else {
      const stats = fs.statSync(localImgPath);
      const sizeKB = Math.round(stats.size / 1024);
      if (sizeKB > 500) {
        errors.push(
          `${relPath}: Image "${imgSrc}" is oversized (${sizeKB}KB > 500KB cap). Run 'python scripts/optimize_images.py ${localImgPath}' before publishing.`
        );
      }
    }
  }
}

if (errors.length > 0) {
  console.error('\n❌ [E-E-A-T & Blog Quality Check Failed] The following violations must be fixed:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  console.error('\nRun failed. Total errors:', errors.length);
  process.exit(1);
} else {
  console.log(`✅ [E-E-A-T & Quality Check Passed] All ${files.length} articles verified successfully.`);
}
