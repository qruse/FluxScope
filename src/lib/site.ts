import type { CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from '../i18n/ui';

export const site = {
  name: 'FluxScope',
  description: 'AI와 변화하는 기술의 본질을 짚어내는 독립 기술 블로그.',
  author: 'FluxScope',
};

export const categories = {
  ai: {
    name: 'AI',
    nameKo: '인공지능',
    description: 'Tools, research, and careful analysis of what AI can actually do.',
    descriptionKo: '인공지능 도구, 연구 동향, 그리고 AI가 실제로 할 수 있는 것에 대한 깊이 있는 분석.',
    accent: 'violet',
  },
  cars: {
    name: 'Cars',
    nameKo: '모빌리티',
    description: 'The technology and decisions shaping modern mobility.',
    descriptionKo: '미래 모빌리티와 전기차 기술 동향.',
    accent: 'orange',
  },
  smartfarm: {
    name: 'Smart Farm',
    nameKo: '스마트팜',
    description: 'Practical data and technology for more informed growing.',
    descriptionKo: '스마트 농업 및 데이터 기반 농업 기술.',
    accent: 'green',
  },
} as const;

export type Category = keyof typeof categories;
export type Post = CollectionEntry<'posts'>;

export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
}

export function getPostSlug(post: Post): string {
  const parts = post.id.split('/');
  const last = parts[parts.length - 1];
  return last ? last.replace(/\.(md|mdx)$/, '') : post.id;
}

export function postPath(post: Post): string {
  const slug = getPostSlug(post);
  const isEn = post.data.lang === 'en';
  return withBase(isEn ? `/en/${post.data.category}/${slug}/` : `/${post.data.category}/${slug}/`);
}

export function categoryPath(category: Category, lang: Lang = defaultLang): string {
  return withBase(lang === 'en' ? `/en/${category}/` : `/${category}/`);
}

export function tagSlug(tag: string): string {
  return tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function tagPath(tag: string, lang: Lang = defaultLang): string {
  return withBase(lang === 'en' ? `/en/tags/${tagSlug(tag)}/` : `/tags/${tagSlug(tag)}/`);
}

export function publishedPosts(posts: Post[], lang?: Lang): Post[] {
  return posts
    .filter((post) => !post.data.draft && (lang ? post.data.lang === lang : true))
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}

