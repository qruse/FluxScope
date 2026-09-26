import type { CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from '../i18n/ui';

export const site = {
  name: "HSL's Blog",
  description: 'AI, 자동차, IT 기기 등 궁금한 것을 찾아보고 기록하는 개인 블로그.',
  author: 'HSL',
};

export const categories = {
  ai: {
    name: 'AI',
    nameKo: 'AI',
    description: 'Models, robotics, on-device AI, and practical applications.',
    descriptionKo: 'AI 모델부터 로봇, 온디바이스 AI와 실제 활용까지 다룹니다.',
    accent: 'green',
    majorCategory: 'ai',
  },
  mobility: {
    name: 'Mobility',
    nameKo: '모빌리티',
    description: 'Electric vehicles, autonomous tech, SDV architecture, and battery powertrains.',
    descriptionKo: '전기차 파워트레인, 자율주행 센서, SDV 조널 아키텍처 및 모빌리티 하드웨어.',
    accent: 'blue',
    majorCategory: 'mobility',
  },
  'it-devices': {
    name: 'IT Devices',
    nameKo: 'IT기기',
    description: 'Smartphones, foldables, AP silicon, displays, and consumer tech hardware.',
    descriptionKo: '플래그십 스마트폰, 폴더블 힌지, 3nm AP 실리콘, 디스플레이 및 소비자 전자기기 하드웨어.',
    accent: 'teal',
    majorCategory: 'it-devices',
  },
} as const;

export const majorCategories = {
  ai: {
    slug: 'ai',
    name: 'AI',
    nameKo: 'AI',
  },
  mobility: {
    slug: 'mobility',
    name: 'Mobility',
    nameKo: '모빌리티',
  },
  'it-devices': {
    slug: 'it-devices',
    name: 'IT Devices',
    nameKo: 'IT기기',
  },
} as const;

export type MajorCategory = keyof typeof majorCategories;
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

export function majorCategoryPath(major: MajorCategory, lang: Lang = defaultLang): string {
  return withBase(lang === 'en' ? `/en/${major}/` : `/${major}/`);
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
