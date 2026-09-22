import fs from 'node:fs';
import path from 'node:path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ [Perf Check Failed] dist directory does not exist. Run build first.');
  process.exit(1);
}

// -------------------------------------------------------------
// Performance Budgets
// -------------------------------------------------------------
const BUDGETS = {
  MAX_HTML_SIZE_KB: 100,      // Max individual HTML page size
  MAX_IMAGE_SIZE_KB: 500,     // Max single image file size
  MAX_TOTAL_CSS_KB: 60,       // Max combined CSS bundle size
  MAX_CLIENT_JS_KB: 50,       // Max client JS bundle (excluding pagefind)
  MAX_BASE64_INLINE_BYTES: 1024, // Prevent heavy inlined data URIs
};

function getAllFiles(dir, filterExt) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, filterExt));
    } else if (!filterExt || entry.name.endsWith(filterExt)) {
      results.push(fullPath);
    }
  }
  return results;
}

const htmlFiles = getAllFiles(distDir, '.html');
const cssFiles = getAllFiles(path.join(distDir, '_astro'), '.css');
const jsFiles = getAllFiles(distDir, '.js').filter(
  (f) => !f.replace(/\\/g, '/').includes('/pagefind/')
);
const imageFiles = [
  ...getAllFiles(distDir, '.png'),
  ...getAllFiles(distDir, '.webp'),
  ...getAllFiles(distDir, '.jpg'),
  ...getAllFiles(distDir, '.jpeg'),
  ...getAllFiles(distDir, '.svg'),
];

const errors = [];
let totalHtmlBytes = 0;
let maxHtmlBytes = 0;
let maxHtmlFile = '';

// 1. HTML File Audits
for (const file of htmlFiles) {
  const stats = fs.statSync(file);
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const sizeKB = stats.size / 1024;
  totalHtmlBytes += stats.size;

  if (stats.size > maxHtmlBytes) {
    maxHtmlBytes = stats.size;
    maxHtmlFile = relPath;
  }

  // Budget: HTML size
  if (sizeKB > BUDGETS.MAX_HTML_SIZE_KB) {
    errors.push(
      `HTML file size budget exceeded: /${relPath} (${sizeKB.toFixed(1)}KB > ${BUDGETS.MAX_HTML_SIZE_KB}KB)`
    );
  }

  const content = fs.readFileSync(file, 'utf-8');

  // Inlined Base64 data URI check
  const base64Matches = content.match(/data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g) || [];
  for (const b64 of base64Matches) {
    if (b64.length > BUDGETS.MAX_BASE64_INLINE_BYTES) {
      errors.push(
        `Heavy base64 inlined image in /${relPath} (${(b64.length / 1024).toFixed(1)}KB > 1KB). Must use external static image file.`
      );
      break;
    }
  }

  // Core Web Vitals: <img> tags attribute checks
  const imgMatches = [...content.matchAll(/<img\b([^>]*)>/g)];
  imgMatches.forEach((match, idx) => {
    const attrs = match[1];
    if (!attrs.includes('width=') || !attrs.includes('height=')) {
      errors.push(
        `CLS hazard in /${relPath}: <img> tag #${idx + 1} missing explicit width and/or height attribute (${match[0].slice(0, 80)}...)`
      );
    }
    if (!attrs.includes('alt=')) {
      errors.push(
        `Accessibility hazard in /${relPath}: <img> tag #${idx + 1} missing alt attribute.`
      );
    }
    // Lazy loading check for non-hero images (2nd image onwards)
    if (idx > 0 && !attrs.includes('loading="lazy"')) {
      errors.push(
        `Bandwidth hazard in /${relPath}: Secondary <img> tag #${idx + 1} missing loading="lazy".`
      );
    }
  });
}

// 2. CSS Bundle Audit
let totalCssBytes = 0;
for (const file of cssFiles) {
  const stats = fs.statSync(file);
  totalCssBytes += stats.size;
}
const totalCssKB = totalCssBytes / 1024;
if (totalCssKB > BUDGETS.MAX_TOTAL_CSS_KB) {
  errors.push(
    `CSS budget exceeded: Combined CSS is ${totalCssKB.toFixed(1)}KB (Budget: ${BUDGETS.MAX_TOTAL_CSS_KB}KB)`
  );
}

// 3. Client JS Bundle Audit
for (const file of jsFiles) {
  const stats = fs.statSync(file);
  const sizeKB = stats.size / 1024;
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  if (sizeKB > BUDGETS.MAX_CLIENT_JS_KB) {
    errors.push(
      `Client JS budget exceeded: /${relPath} (${sizeKB.toFixed(1)}KB > ${BUDGETS.MAX_CLIENT_JS_KB}KB)`
    );
  }
}

// 4. Image File Size Audit
for (const file of imageFiles) {
  const stats = fs.statSync(file);
  const sizeKB = stats.size / 1024;
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  if (sizeKB > BUDGETS.MAX_IMAGE_SIZE_KB) {
    errors.push(
      `Image size cap exceeded: /${relPath} (${sizeKB.toFixed(1)}KB > ${BUDGETS.MAX_IMAGE_SIZE_KB}KB cap)`
    );
  }
}

// -------------------------------------------------------------
// Report & Verdict
// -------------------------------------------------------------
const avgHtmlKB = htmlFiles.length > 0 ? totalHtmlBytes / htmlFiles.length / 1024 : 0;
console.log('\n📊 [Performance & Static Optimization Audit Report]');
console.log(`  - Audited HTML Pages:  ${htmlFiles.length} pages`);
console.log(`  - Average HTML Size:   ${avgHtmlKB.toFixed(1)} KB`);
console.log(`  - Max HTML Size:       ${(maxHtmlBytes / 1024).toFixed(1)} KB (/${maxHtmlFile})`);
console.log(`  - Total CSS Payload:   ${totalCssKB.toFixed(1)} KB (Budget: ${BUDGETS.MAX_TOTAL_CSS_KB} KB)`);
console.log(`  - Audited Static Imgs: ${imageFiles.length} images (Hard cap: ${BUDGETS.MAX_IMAGE_SIZE_KB} KB/img)`);

if (errors.length > 0) {
  console.error('\n❌ [Performance Audit FAILED] The following budget violations were detected:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log('✅ [Performance Audit PASSED] All pages and assets strictly conform to performance budgets!\n');
}
