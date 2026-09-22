import type { CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from '../i18n/ui';

export const site = {
  name: 'FluxScope',
  description: 'AI와 변화하는 기술의 본질을 짚어내는 독립 기술 블로그.',
  author: 'FluxScope',
};

export const categories = {
  agi: {
    name: 'AGI',
    nameKo: 'AGI',
    description: 'Artificial General Intelligence, reasoning models, and frontier capabilities.',
    descriptionKo: '범용 인공지능(AGI), 고도화된 추론 모델 및 프론티어 AI 연구 동향.',
    accent: 'violet',
    majorCategory: 'ai',
  },
  'physical-ai': {
    name: 'Physical AI',
    nameKo: '피지컬 AI',
    description: 'Embodied AI, robotics, autonomous mobility, and physical interaction.',
    descriptionKo: '로보틱스, 자율주행, 임베디드 및 물리적 세계와 상호작용하는 체화된 인공지능.',
    accent: 'orange',
    majorCategory: 'ai',
  },
  'other-ai': {
    name: 'Other AI',
    nameKo: '기타 AI',
    description: 'Vision, audio, multimodal models, and specialized AI architectures.',
    descriptionKo: '컴퓨터 비전, 음성, 멀티모달 및 다양한 특화 인공지능 기술 동향.',
    accent: 'green',
    majorCategory: 'ai',
  },
  mobility: {
    name: 'Mobility',
    nameKo: '자동차(모빌리티)',
    description: 'Electric vehicles, autonomous tech, SDV architecture, and battery powertrains.',
    descriptionKo: '전기차 파워트레인, 자율주행 센서, SDV 조널 아키텍처 및 모빌리티 하드웨어.',
    accent: 'blue',
    majorCategory: 'mobility',
  },
  'it-devices': {
    name: 'IT Devices',
    nameKo: 'IT 제품',
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
    subcategories: ['agi', 'physical-ai', 'other-ai'] as const,
  },
  mobility: {
    slug: 'mobility',
    name: 'Mobility',
    nameKo: '자동차(모빌리티)',
    subcategories: ['mobility'] as const,
  },
  'it-devices': {
    slug: 'it-devices',
    name: 'IT Devices',
    nameKo: 'IT 제품',
    subcategories: ['it-devices'] as const,
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

