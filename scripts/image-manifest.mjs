// Writes dist/image-dimensions.json so the Worker can add width/height to images in API-published posts.
import fs from 'node:fs';
import path from 'node:path';
import { getDimensions } from '../src/lib/rehype-optimize-images.mjs';

const root = 'public/images';
const manifest = {};
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (/\.(?:png|jpe?g|webp)$/i.test(entry.name)) {
      const size = getDimensions(file);
      if (size?.width && size?.height) manifest[`/${path.relative('public', file).split(path.sep).join('/')}`] = [size.width, size.height];
    }
  }
};
walk(root);
fs.writeFileSync('dist/image-dimensions.json', JSON.stringify(manifest));
console.log(`Image dimensions recorded for ${Object.keys(manifest).length} files.`);
