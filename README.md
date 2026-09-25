# HSL의 블로그

Astro 정적 사이트와 Cloudflare Worker 게시 API를 함께 사용합니다. 기존 Markdown 글은 빌드 시 포함되고, API로 발행한 글은 D1에서 즉시 읽습니다. 새 글마다 Git 커밋이나 재빌드가 필요하지 않습니다.

## 개발

Node.js 22.19 이상에서 `npm ci`, `npm run check`를 실행합니다. 로컬 API 확인은 `npm run db:local` 후 `npx wrangler dev --var PUBLISH_TOKEN:local-only`로 합니다.

## Cloudflare 초기 설정 (한 번만)

1. Cloudflare 대시보드 **Storage & databases → D1**에서 `hsl-blog-posts`를 생성합니다. 표시된 Database ID를 `wrangler.jsonc`의 `database_id`에 넣습니다.
2. Worker `fluxscope`의 **Settings → Variables and Secrets**에서 `PUBLISH_TOKEN`을 **Secret**으로 추가합니다. 길고 고유한 문자열을 사용하고 Git에는 넣지 않습니다.
3. GitHub `main`에 연결된 Workers Builds에서 빌드 명령 `npm run build`, 배포 명령 `npx wrangler deploy`를 사용합니다. 첫 배포 전에 Cloudflare 인증된 환경에서 `npm run db:remote`로 스키마를 적용합니다.
4. Worker 설정을 한 번 배포하면 이후 API 글은 빌드 없이 게시됩니다. 공개 주소는 `https://fluxscope.coolwin200.workers.dev`입니다.

Database ID가 예시 문자열인 상태로 운영 배포하지 마세요. 도메인을 바꾸면 `worker/index.js`의 공개 origin과 `SITE_URL`을 함께 바꿔야 합니다.

## 글 게시 API

`POST /api/posts`에 `Authorization: Bearer <PUBLISH_TOKEN>`과 JSON 본문을 전송합니다. 언어별로 한 번씩 게시합니다. `lang`은 `ko` 또는 `en`, `slug`는 영문 소문자·숫자·하이픈, `category`는 `agi`, `physical-ai`, `other-ai`, `mobility`, `it-devices` 중 하나입니다.

```bash
curl -X POST 'https://fluxscope.coolwin200.workers.dev/api/posts' \
  -H "Authorization: Bearer $HSL_PUBLISH_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary @post.json
```

`post.json` 예시:

```json
{
  "lang": "ko",
  "slug": "example-post",
  "category": "agi",
  "title": "예시 제목",
  "description": "검색 결과와 카드에 표시할 한 줄 요약",
  "body": "## 본문\n\n마크다운으로 작성합니다.",
  "tags": ["AI", "기술"],
  "imageUrl": "/images/og-default.png",
  "imageAlt": "대표 이미지 설명"
}
```

영어판은 `lang: "en"`과 같은 `slug`로 별도 요청합니다. `publishedAt`(ISO 8601 UTC)을 생략하면 게시 시각이 저장됩니다. 수정할 때는 `If-Match: update` 헤더를 추가하며 원래 발행일은 유지됩니다. 삭제는 인증 헤더와 함께 `DELETE /api/posts?lang=ko&slug=example-post`를 호출합니다. 반환된 `url`에서 글을 확인할 수 있습니다. 공개 조회는 `GET /api/posts?lang=ko`, 검색은 `GET /api/search?lang=ko&q=검색어`입니다. 홈·분류 목록, 검색, RSS, `/dynamic-sitemap.xml`에 새 글이 반영됩니다. 이미지 업로드 API는 없으므로 공개 HTTPS 이미지 URL이나 이미 배포된 `/images/` 경로를 사용합니다.

커뮤니티 반응은 실제 내용을 확인해 요약하고 본문에는 링크를 넣지 않습니다. 근거 URL은 내부 작업 기록에 남깁니다. 편집 지침은 `AGENTS.md`를 따릅니다.
