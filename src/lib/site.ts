import type { CollectionEntry } from 'astro:content';

export const site = {
  name: 'Signal & Field',
  description: 'Clear, sourced notes on artificial intelligence, cars, and smart farming.',
  author: 'Signal & Field',
  language: 'en',
};

export const categories = {
  ai: { name: 'AI', description: 'Tools, research, and careful analysis of what AI can actually do.', accent: 'violet' },
  cars: { name: 'Cars', description: 'The technology and decisions shaping modern mobility.', accent: 'orange' },
  smartfarm: { name: 'Smart Farm', description: 'Practical data and technology for more informed growing.', accent: 'green' },
} as const;

export type Category = keyof typeof categories;
export type Post = CollectionEntry<'posts'>;

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function postPath(post: Post): string {
  return withBase(`/${post.id}/`);
}

export function categoryPath(category: Category): string {
  return withBase(`/${category}/`);
}

export function tagSlug(tag: string): string {
  return tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function tagPath(tag: string): string {
  return withBase(`/tags/${tagSlug(tag)}/`);
}

export function publishedPosts(posts: Post[]): Post[] {
  return posts.filter((post) => !post.data.draft).sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

export function dateLabel(date: Date): string {
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' }).format(date);
}
