import type { CollectionEntry } from 'astro:content';
import { defaultLang, type Lang } from '../i18n/ui';

// HSL Lab (hslab.space) is the main site; the blog is one of its sections, served under /blog/.
export const lab = {
  name: 'HSL Lab',
  url: 'https://hslab.space',
};

// The lab's sections in display order. The lab home list and the header nav read from here, and each section
// owns the tetrahedron face at its index (its number is index + 1). Every section has its own pages under its
// path. Portfolio always stays last, so new sections go above it.
export const labSections = [
  { id: 'projects', name: 'Projects', nameKo: '프로젝트', path: '/projects/' },
  { id: 'stories', name: 'Project Stories', nameKo: '프로젝트 스토리', path: '/stories/' },
  { id: 'column', name: 'Columns', nameKo: '칼럼', path: '/column/' },
  { id: 'blog', name: 'News', nameKo: '뉴스', path: '/blog/' },
  { id: 'portfolio', name: 'Portfolio', nameKo: '포트폴리오', path: '/portfolio/' },
] as const;

// Projects taken private: no listing, no search, no sitemap, and their pages are not built (the page folders are
// prefixed with _). Their components keep reading them from here so they can come back unchanged.
// ai-oracle-benchmark: private since 2026-11-07, while the question design is reworked.
export const hiddenProjects = [
  {
    id: 'ai-oracle-benchmark',
    addedAt: '2026-11-05',
    tagline: 'Does a smarter AI predict the future better? Reality marks it',
    taglineKo: '더 지능적인 AI가 미래도 더 잘 맞힐까? 현실이 채점함',
    name: 'HSLab AI Oracle Benchmark',
    nameKo: 'HSLab AI Oracle Benchmark',
    summary: 'Does a more intelligent AI also predict the real future more accurately? Claude Fable, Claude Opus, GPT Sol and Gemini Argon forecast real stocks, matches and natural events every week, and reality marks them on one score that accounts for question difficulty and statistical uncertainty.',
    summaryKo: '더 지능적인 AI가 실제 미래도 더 정확하게 예측할까? Claude Fable, Claude Opus, GPT Sol, Gemini Argon이 매주 실제 주식·경기·자연현상을 예측하고, 문제 난이도와 통계적 불확실성을 반영한 하나의 점수로 현실이 채점하는 벤치마크.',
    cta: 'See the score',
    ctaKo: '점수 보기',
  },
] as const;

// Lab projects with their own pages under /projects/<id>/. Their development stories live in the stories
// collection (src/content/stories/<lang>/<slug>.md) with a matching `project` field.
// addedAt is when a project went public; the lab home lists the newest ones first.
export const projects = [
  {
    id: 'beat-kma',
    addedAt: '2026-10-16',
    tagline: 'More accurate than the KMA at 97 stations; the service is over, the record stays',
    taglineKo: '전국 97개 관측소에서 기상청보다 정확했던 기록, 서비스는 종료',
    name: 'Can AI beat the KMA?',
    nameKo: 'AI로 한국 기상청 이기기 가능?',
    summary: 'Two-day forecasts for 97 Korean weather stations from a global weather-forecasting backbone model fine-tuned with an added head. They beat the Korea Meteorological Administration on temperature, humidity and wind every day of live service. The service has ended; every past forecast and score stays up.',
    summaryKo: '글로벌 기상예측 백본 모델에 finetuning(head 추가)을 통해 전국 97개 관측소의 2일 예보를 냈고, 실제 운영 기간 내내 기온·습도·풍속에서 기상청보다 정확했던 프로젝트. 서비스는 종료했고 지난 예보와 성적은 계속 볼 수 있음.',
    cta: 'See past forecasts',
    ctaKo: '지난 예보 보기',
  },
  {
    id: 'ai-duel',
    addedAt: '2026-10-18',
    tagline: 'Four AIs paper-trade US stocks against the indexes and each other',
    taglineKo: '네 AI의 미국 주식 모의투자, 지수와 서로를 상대로',
    name: 'Can AI beat the Nasdaq and the S&P 500?',
    nameKo: 'AI가 나스닥, S&P 미국 시장 지수를 이길 수 있을까?',
    summary: 'GPT-6.1 Sol, Claude Opus 5.5, Gemini 4 Argon and Claude Fable 5.1 each run a $20,000 paper portfolio of US stocks from the same starting prompt, rewrite their own strategy every week, and race the S&P 500, the Nasdaq-100 and each other.',
    summaryKo: 'GPT-6.1 Sol, Claude Opus 5.5, Gemini 4 Argon, Claude Fable 5.1이 같은 프롬프트로 각자 2만 달러 미국 주식 모의 포트폴리오를 운용하고, 매주 스스로 전략을 고쳐 가며 S&P 500·나스닥100, 그리고 서로와 겨루는 프로젝트.',
    cta: 'See the scoreboard',
    ctaKo: '현재 순위 보기',
  },
  {
    id: 'ai-mafia',
    addedAt: '2026-10-21',
    tagline: 'Eight AIs hide who they are in a Mafia game, one turn a day',
    taglineKo: '여덟 AI가 정체를 숨기고 하루 한 턴씩 두는 마피아 게임',
    name: 'AI Mafia',
    nameKo: 'AI 마피아 게임',
    summary: 'Eight models from Claude, GPT and Gemini play Mafia under code names A to H, without knowing who the others are. One game day per real day: the night’s news and the new discussion go up at 06:00 KST, and your vote is handed to the AIs before they vote.',
    summaryKo: 'Claude·GPT·Gemini 여덟 모델이 서로 정체를 모른 채 A~H라는 이름으로 마피아 게임을 함. 게임 속 하루는 실제 하루라 매일 아침 6시에 간밤 소식과 새 토론이 올라오고, 방문자 투표가 AI들의 처형 투표 직전에 전달됨.',
    cta: "See this morning's news",
    ctaKo: '오늘 아침 소식 보기',
  },
  {
    id: 'my-voice-tts',
    addedAt: '2026-10-24',
    tagline: 'A TTS in your own voice; only the examples are up for now',
    taglineKo: '내 목소리로 읽어 주는 TTS, 지금은 예시만 공개',
    name: 'TTS in your own voice',
    nameKo: '내 목소리로 만드는 TTS',
    summary: 'A live service that spoke anything you typed in your own voice, using open-source voice cloning (OmniVoice) on a single RTX 3070. There is not enough spare GPU to keep it running, so only the examples stay up.',
    summaryKo: '한 문장만 읽으면 아무 문장이나 내 목소리로 읽어 주던 라이브 서비스. 오픈소스 음성 복제 모델(OmniVoice)을 RTX 3070 한 장에서 돌렸는데, 가용 GPU가 부족해서 지금은 꺼 두고 예시만 남겨 둠.',
    cta: 'Hear the examples',
    ctaKo: '예시 듣기',
  },
  {
    id: 'hslab-island',
    addedAt: '2026-11-05',
    tagline: 'An AI learns to last 30 days by dying and retrying. Try it yourself',
    taglineKo: '죽고 다시 하며 30일 생존을 배우는 AI, 직접 플레이 가능',
    name: 'Can AI survive on a desert island?',
    nameKo: 'AI가 무인도에서 살아남을 수 있을까?',
    summary: 'An AI castaway learns to survive on a 3D desert island from nothing but dying and trying again. The first attempt drowns on day one; thousands of attempts later it makes it to day 30. Watch the video, replay those lives in 3D, or try the same island yourself.',
    summaryKo: '무인도에 떨어진 AI가 죽고 다시 하면서 살아남는 법을 스스로 배움. 첫 시도에선 첫날 바다에 빠져 죽던 애가 수천 번 뒤엔 30일을 버팀. 영상과 3D 리플레이로 보고, 같은 섬에서 직접 살아남아 볼 수도 있음.',
    cta: 'Watch and play',
    ctaKo: '보고 직접 해 보기',
  },
] as const;

// The blog's about page is the author page every BlogPosting points to (author.url); it declares that author.
// The author is only ever "HSL": never the owner's real name, photo or employer.
export const authorProfileJsonLd = (lang: Lang) => {
  const url = `${lab.url}${lang === 'en' ? '/en' : ''}/blog/about/`;
  return {
    '@context': 'https://schema.org', '@type': 'ProfilePage', url, inLanguage: lang,
    mainEntity: {
      '@type': 'Person', name: 'HSL', url, email: 'mailto:coolwin200@gmail.com',
      knowsAbout: ['Artificial intelligence', 'Cars', 'Consumer electronics', 'Weather forecasting'],
    },
  };
};

// Thumbnails come from scripts/visuals/make_list_thumbs.py.
export const projectThumb = (id: string) => `/images/thumbs/projects/${id}.webp`;
export const storyThumb = (slug: string) => `/images/thumbs/stories/${slug}.webp`;
export const projectPath = (id: string, lang: Lang = defaultLang) => withBase(`${lang === 'en' ? '/en' : ''}/projects/${id}/`);
export const storyPath = (slug: string, lang: Lang = defaultLang) => withBase(`${lang === 'en' ? '/en' : ''}/stories/${slug}/`);
export type LabSection = (typeof labSections)[number];

export function labSectionPath(section: LabSection, lang: Lang = defaultLang): string {
  const root = lang === 'en' ? '/en' : '';
  return withBase(`${root}${section.path}`);
}

// The lab home lists the YouTube channel as 05, between the news and the portfolio (user instruction, 2026-11-02),
// so the portfolio numbers one higher than its place in labSections.
export const labSectionNumber = (id: LabSection['id']) => {
  const index = labSections.findIndex((section) => section.id === id);
  return String(index + (id === 'portfolio' ? 2 : 1)).padStart(2, '0');
};
// The tetrahedron has four faces and there are five sections: news and columns share one.
export const labSectionFace = (id: LabSection['id']) => ({ projects: 0, stories: 1, blog: 2, column: 2, portfolio: 3 })[id];
export const youtubeChannel = 'https://www.youtube.com/@hslab-b5b';

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

// A path inside the blog section, e.g. blogPath('/ai/', 'en') -> /en/blog/ai/.
export function blogPath(path: string, lang: Lang = defaultLang): string {
  return withBase(`${lang === 'en' ? '/en' : ''}/blog${path.startsWith('/') ? path : `/${path}`}`);
}

export function getPostSlug(post: Post): string {
  const parts = post.id.split('/');
  const last = parts[parts.length - 1];
  return last ? last.replace(/\.(md|mdx)$/, '') : post.id;
}

export function postPath(post: Post): string {
  return blogPath(`/${post.data.category}/${getPostSlug(post)}/`, post.data.lang);
}

export function categoryPath(category: Category, lang: Lang = defaultLang): string {
  return blogPath(`/${category}/`, lang);
}

export function majorCategoryPath(major: MajorCategory, lang: Lang = defaultLang): string {
  return blogPath(`/${major}/`, lang);
}

export function tagSlug(tag: string): string {
  return tag.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function tagPath(tag: string, lang: Lang = defaultLang): string {
  return blogPath(`/tags/${tagSlug(tag)}/`, lang);
}

export function publishedPosts(posts: Post[], lang?: Lang): Post[] {
  return posts
    .filter((post) => !post.data.draft && (lang ? post.data.lang === lang : true))
    .sort((a, b) => b.data.publishedAt.getTime() - a.data.publishedAt.getTime());
}
