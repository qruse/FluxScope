import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string().min(8),
    seoTitle: z.string().min(8).optional(),
    description: z.string().min(50).max(180),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
    category: z.enum(['ai', 'mobility', 'it-devices']),
    tags: z.array(z.string().min(2)).min(5).max(15),
    author: z.string().min(2),
    visualTypes: z.array(z.enum(['source', 'sketch', 'architecture', 'pipeline', 'chart'])).min(2).max(10),
    image: z.object({
      src: z.string().startsWith('/'),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      alt: z.string().min(5),
    }),
    draft: z.boolean(),
    lang: z.enum(['ko', 'en']).default('en'),
    experienceNote: z.string().min(15).max(300).optional(),
  }).refine((post) => post.updatedAt >= post.publishedAt, {
    message: 'updatedAt must be on or after publishedAt',
    path: ['updatedAt'],
  }),
});

// Portfolio write-ups (development stories of lab projects). Static Markdown, one file per language under
// src/content/portfolio/<lang>/<slug>.md; unlike blog articles they are part of the lab site, not D1.
const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string().min(8),
    description: z.string().min(30).max(200),
    publishedAt: z.coerce.date(),
    lang: z.enum(['ko', 'en']),
    project: z.string(),
    part: z.number().int().positive(),
  }),
});

export const collections = { posts, portfolio };
