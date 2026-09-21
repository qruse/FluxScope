import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// Set SITE_URL to the stable production domain in Cloudflare Pages.
if (process.env.CF_PAGES && !process.env.SITE_URL) {
  throw new Error('Set SITE_URL to the stable production URL in Cloudflare Pages environment variables.');
}
const site = process.env.SITE_URL || 'http://localhost:4321';
const siteUrl = new URL(site);
if (siteUrl.pathname !== '/' || (process.env.CF_PAGES && siteUrl.protocol !== 'https:')) {
  throw new Error('SITE_URL must be an HTTPS origin without a path, such as https://example.pages.dev');
}

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
