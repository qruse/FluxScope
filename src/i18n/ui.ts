export const languages = {
  ko: '한국어',
  en: 'English',
} as const;

export type Lang = keyof typeof languages;

export const defaultLang: Lang = 'ko';

export const ui = {
  ko: {
    'lab.title': 'HSL Lab',
    'lab.description': 'HSL이 궁금한 것을 찾아보고 만들고 기록하는 개인 연구실. 첫 프로젝트는 AI·자동차·IT 기기를 원문으로 따져보는 블로그.',
    'lab.motto': '궁금한 것을 찾아보고, 만들고, 기록하는 곳.',
    'nav.blog': '블로그',
    'nav.projects': '프로젝트',
    'nav.portfolio': '포트폴리오',
    'site.title': 'HSL의 블로그',
    'site.description': 'AI 모델, 자동차, IT 기기의 가격·성능·마케팅 주장을 원문으로 따져보고, 쓸지 살지 판단을 돕는 HSL의 기록.',
    'nav.home': '홈',
    'nav.ai': 'AI',
    'nav.mobility': '모빌리티',
    'nav.it_devices': 'IT기기',
    'nav.about': '소개',
    'nav.search': '검색',
    'hero.kicker': '독립 기술 블로그 · 001호',
    'hero.title': '변화의 본질을,\n정확하게.',
    'hero.intro': '관심 있는 기술의 최신 소식을 파헤쳐 정리합니다. 내가 언제든 다시 찾아보고, 독자도 함께 유용한 인사이트를 얻을 수 있도록 마케팅 거품 없이 전달합니다.',
    'hero.action': '최신 글 살펴보기',
    'hero.tagline': '근거 중심 · 독자 우선',
    'latest.kicker': '추천 아티클',
    'latest.title': '최신 글',
    'latest.rss': 'RSS 구독',
    'search.title': '검색',
    'search.description': 'HSL의 블로그에서 글을 검색하세요.',
    'search.kicker': '기사 검색',
    'search.heading': '검색.',
    'search.intro': '아카이브를 검색합니다. 브라우저 내에서 즉시 색인 및 검색이 실행됩니다.',
    'search.placeholder': '“평가”, “AGI”, “워크플로우” 검색...',
    'search.initial': '검색어를 입력하면 실시간으로 결과가 표시됩니다.',
    'search.searching': '검색 중…',
    'search.empty': '검색 결과가 없습니다.',
    'search.found': '개의 결과가 검색되었습니다.',
    'about.title': '소개',
    'about.kicker': '블로그 소개 및 정책',
    'about.heading': '유용함을 먼저,\n언제나 정확하게.',
    'about.intro': 'AI, 자동차, IT 기기 등 궁금한 것을 찾아보고 기록하는 개인 블로그입니다.',
    'footer.motto': '내가 궁금해서 만든 사이트.',
    'footer.about': '소개 및 편집 정책',
    'footer.rss': 'RSS 피드',
    'footer.privacy': '개인정보처리방침',
    'footer.contact': '문의',
    'footer.search': '검색',
    'article.published': '발행일',
    'article.updated': '수정일',
    'article.by': '작성자',
  },
  en: {
    'lab.title': 'HSL Lab',
    'lab.description': "HSL's personal lab for looking into, building and writing up whatever is interesting. The first project is a blog that checks AI, car and device claims against the original sources.",
    'lab.motto': 'Looking into things, building things, writing them down.',
    'nav.blog': 'Blog',
    'nav.projects': 'Projects',
    'nav.portfolio': 'Portfolio',
    'site.title': "HSL's Blog",
    'site.description': 'HSL checks prices, benchmarks and marketing claims for AI models, cars and devices against the original sources, so you can decide what to use or buy.',
    'nav.home': 'Home',
    'nav.ai': 'AI',
    'nav.mobility': 'Mobility',
    'nav.it_devices': 'IT Devices',
    'nav.about': 'About',
    'nav.search': 'Search',
    'hero.kicker': 'Independent technology notes · Issue 001',
    'hero.title': 'Change,\nin focus.',
    'hero.intro': 'Investigating tech breakthroughs across AI, mobility, and IT hardware. Field notes documented for personal reference and shared with practitioners cutting through marketing noise.',
    'hero.action': 'Explore latest stories',
    'hero.tagline': 'Research-led · Reader-first',
    'latest.kicker': 'The reading list',
    'latest.title': 'Latest articles',
    'latest.rss': 'Subscribe via RSS',
    'search.title': 'Search',
    'search.description': "Search articles on HSL's Blog.",
    'search.kicker': 'Find a story',
    'search.heading': 'Search.',
    'search.intro': 'Search the article archive. The index is stored with the site and runs in your browser.',
    'search.placeholder': 'Try “risk”, “evaluation”, or “workflow”',
    'search.initial': 'Start typing to search articles.',
    'search.searching': 'Searching…',
    'search.empty': 'No results found.',
    'search.found': 'results found.',
    'about.title': 'About',
    'about.kicker': 'About this publication',
    'about.heading': 'Useful first.\nAccurate always.',
    'about.intro': 'A personal blog about AI, cars, devices, and whatever catches my interest.',
    'footer.motto': 'Built out of curiosity, documented for reference.',
    'footer.about': 'About & editorial policy',
    'footer.rss': 'RSS feed',
    'footer.privacy': 'Privacy',
    'footer.contact': 'Contact',
    'footer.search': 'Search',
    'article.published': 'Published',
    'article.updated': 'Updated',
    'article.by': 'By',
  },
} as const;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function formatDate(date: Date, lang: Lang = 'ko'): string {
  if (lang === 'ko') {
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }).format(date);
  }
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}
