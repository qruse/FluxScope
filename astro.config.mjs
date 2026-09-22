import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
    site = 'http://localhost:4321';
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
  integrations: [mdx({ rehypePlugins: [rehypeOptimizeImages] }), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
