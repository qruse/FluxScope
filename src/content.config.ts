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
    category: z.enum(['agi', 'physical-ai', 'other-ai']),
    tags: z.array(z.string().min(2)).min(1),
    author: z.string().min(2),
    image: z.object({
      src: z.string().startsWith('/'),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      alt: z.string().min(5),
    }),
    draft: z.boolean(),
    lang: z.enum(['ko', 'en']).default('en'),
  }).refine((post) => post.updatedAt >= post.publishedAt, {
    message: 'updatedAt must be on or after publishedAt',
    path: ['updatedAt'],
  }),
});

export const collections = { posts };
