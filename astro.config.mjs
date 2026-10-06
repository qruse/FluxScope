import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import fs from 'node:fs';
import path from 'node:path';

// Last-modified dates for static articles, keyed by their public path, for the sitemap.
function postUpdatedDates() {
  const dates = new Map();
  const root = 'src/content/posts';
  const dirs = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name) : []);
  for (const lang of dirs(root)) {
    for (const category of dirs(path.join(root, lang))) {
      for (const file of fs.readdirSync(path.join(root, lang, category)).filter((name) => /\.mdx?$/.test(name))) {
        const text = fs.readFileSync(path.join(root, lang, category, file), 'utf8');
        const updated = text.match(/^updatedAt:\s*["']?([^"'\n]+)/m)?.[1];
        if (updated && !/^draft:\s*true/m.test(text)) dates.set(`${lang === 'en' ? '/en' : ''}/${category}/${file.replace(/\.mdx?$/, '')}/`, new Date(updated).toISOString());
      }
    }
  }
  return dates;
}
const updatedDates = postUpdatedDates();

let site = process.env.SITE_URL;
let base = process.env.BASE_PATH || '/';

if (!site) {
  if (process.env.CF_PAGES) {
    throw new Error('Set SITE_URL to the stable production URL in Cloudflare Pages environment variables.');
  } else if (process.env.GITHUB_PAGES && process.env.GITHUB_REPOSITORY) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    site = `https://${owner}.github.io`;
    if (!process.env.CUSTOM_DOMAIN) {
      base = `/${repo}/`;
    }
  } else {
    site = 'https://hslab.space';
  }
}

import { rehypeOptimizeImages } from './src/lib/rehype-optimize-images.mjs';

export default defineConfig({
  site,
  base,
  output: 'static',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  markdown: {
    rehypePlugins: [rehypeOptimizeImages],
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark-dimmed',
      },
      wrap: true,
    },
  },
  integrations: [mdx({ rehypePlugins: [rehypeOptimizeImages] }), sitemap({
    filter: (page) => !/\/search\/$/.test(page),
    i18n: { defaultLocale: 'ko', locales: { ko: 'ko', en: 'en' } },
    serialize(item) {
      const lastmod = updatedDates.get(new URL(item.url).pathname.replace(base.replace(/\/$/, ''), ''));
      return lastmod ? { ...item, lastmod } : item;
    },
  })],
  vite: { plugins: [tailwindcss()] },
});
