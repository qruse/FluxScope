# HSL의 블로그

Astro 정적 사이트와 Cloudflare Worker 게시 API를 함께 사용합니다. 기존 Markdown 글은 빌드 시 포함되고, API로 발행한 글은 D1에서 즉시 읽습니다. 새 글마다 Git 커밋이나 재빌드가 필요하지 않습니다.

## 개발

Node.js 22.19 이상에서 `npm ci`, `npm run check`를 실행합니다. 로컬 API 확인은 `npm run db:local` 후 `npx wrangler dev --var PUBLISH_TOKEN:local-only`로 합니다.

## Cloudflare 초기 설정 (한 번만)

1. Cloudflare D1 데이터베이스 `hsl-blog-posts`의 ID는 `wrangler.jsonc`에 설정되어 있습니다.
2. Worker `fluxscope`의 **Settings → Variables and Secrets**에서 `PUBLISH_TOKEN`을 **Secret**으로 추가합니다. 길고 고유한 문자열을 사용하고 Git에는 넣지 않습니다.
3. **R2 object storage → Overview → Create bucket**에서 `hsl-blog-images` 버킷을 Standard 저장 클래스로 만듭니다. `wrangler.jsonc`의 `IMAGES` 바인딩이 이 버킷에 연결됩니다. 버킷을 공개하거나 별도 R2 API 키를 만들 필요는 없습니다.
4. GitHub `main`에 연결된 Workers Builds에서 빌드 명령 `npm run build`, 배포 명령 `npx wrangler deploy`를 사용합니다. D1 테이블은 Worker의 첫 요청에서 자동으로 생성됩니다. 이후 스키마 변경이 필요할 때는 Cloudflare 인증된 환경에서 `npm run db:remote`를 사용할 수 있습니다.
5. Worker 설정을 한 번 배포하면 이후 API 글과 새 이미지는 빌드 없이 게시됩니다. 공개 주소는 `https://fluxscope.coolwin200.workers.dev`입니다.

도메인을 바꾸면 `worker/index.js`의 공개 origin과 `SITE_URL`을 함께 바꿔야 합니다.

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

영어판은 `lang: "en"`과 같은 `slug`로 별도 요청합니다. `publishedAt`(ISO 8601 UTC)을 생략하면 게시 시각이 저장됩니다. 수정할 때는 `If-Match: update` 헤더를 추가하며 원래 발행일은 유지됩니다. 삭제는 인증 헤더와 함께 `DELETE /api/posts?lang=ko&slug=example-post`를 호출합니다. 반환된 `url`에서 글을 확인할 수 있습니다. 공개 조회는 `GET /api/posts?lang=ko`, 검색은 `GET /api/search?lang=ko&q=검색어`입니다. 홈·분류 목록, 검색, RSS, `/dynamic-sitemap.xml`에 새 글이 반영됩니다.

## 이미지 업로드 API

`POST /api/images`에 기존 `PUBLISH_TOKEN`과 이미지 파일을 원본 바이너리로 전송합니다. PNG, JPEG, WebP, GIF, AVIF를 지원하며 최대 5 MB입니다. 브라우저에서 붙여넣은 이미지 `Blob`도 `fetch`의 본문에 그대로 넣을 수 있습니다. SVG와 실행 가능한 파일은 받지 않습니다.

```bash
curl -X POST 'https://fluxscope.coolwin200.workers.dev/api/images' \
  -H "Authorization: Bearer $HSL_PUBLISH_TOKEN" \
  -H 'Content-Type: image/webp' \
  --data-binary @figure.webp
```

응답의 `url`은 `/media/<고유 ID>.webp` 형식입니다. 글의 `imageUrl` 또는 Markdown 본문의 `![설명](/media/<고유 ID>.webp)`에 그대로 사용하면 됩니다. 이미지는 비공개 R2 버킷에 저장되고 이 Worker를 통해 공개 표시됩니다. 잘못 올린 이미지는 인증 헤더를 넣어 `DELETE /media/<고유 ID>.webp`로 삭제할 수 있습니다. 글에서 사용 중인 이미지를 삭제하면 해당 이미지도 사라지므로 먼저 글을 수정하세요.

커뮤니티 반응은 원문을 확인해 짧게 요약하고 해당 Reddit 게시물 링크를 본문에 넣습니다. 관련 이전 글이 공개되어 있으면 자연스럽게 연결합니다. 편집 지침은 `AGENTS.md`를 따릅니다.
