# HSL의 블로그

Astro 정적 사이트와 Cloudflare Worker 게시 API를 함께 사용합니다. 기존 Markdown 글은 빌드 시 포함되고, API로 발행한 글은 D1에서 즉시 읽습니다. 새 글마다 Git 커밋이나 재빌드가 필요하지 않습니다.

## 개발

Node.js 22.19 이상에서 `npm ci`, `npm run check`를 실행합니다. 로컬 API 확인은 `npm run db:local` 후 `npx wrangler dev --var PUBLISH_TOKEN:local-only`로 합니다.

## Cloudflare 초기 설정 (한 번만)

1. Cloudflare D1 데이터베이스 `hsl-blog-posts`의 ID는 `wrangler.jsonc`에 설정되어 있습니다.
2. Worker `fluxscope`의 **Settings → Variables and Secrets**에서 `PUBLISH_TOKEN`을 **Secret**으로 추가합니다. 길고 고유한 문자열을 사용하고 Git에는 넣지 않습니다.
3. **R2 object storage → Overview → Create bucket**에서 `hsl-blog-images` 버킷을 Standard 저장 클래스로 만듭니다. `wrangler.jsonc`의 `IMAGES` 바인딩이 이 버킷에 연결됩니다. 버킷을 공개하거나 별도 R2 API 키를 만들 필요는 없습니다.
4. GitHub `main`에 연결된 Workers Builds에서 빌드 명령 `npm run build`, 배포 명령 `npx wrangler deploy`를 사용합니다. D1 테이블은 Worker의 첫 요청에서 자동으로 생성됩니다. 이후 스키마 변경이 필요할 때는 Cloudflare 인증된 환경에서 `npm run db:remote`를 사용할 수 있습니다.
5. Worker 설정을 한 번 배포하면 이후 API 글과 새 이미지는 빌드 없이 게시됩니다. 공개 주소는 `https://hslblog.com`입니다.

공개 도메인은 `hslblog.com`(Cloudflare Registrar)입니다. `wrangler.jsonc`의 `routes`가 `hslblog.com`과 `www.hslblog.com`을 Worker 커스텀 도메인으로 연결하며 DNS·인증서는 배포 때 자동으로 만들어집니다. 옛 `fluxscope.coolwin200.workers.dev`와 `www` 주소의 페이지 요청은 Worker가 같은 경로의 `https://hslblog.com`으로 301 이동시키고, `/api/*`는 두 주소 모두에서 그대로 동작합니다. 도메인을 바꾸면 `worker/index.js`의 `origin`, `astro.config.mjs`·CI의 `SITE_URL`, `routes`를 함께 바꿔야 합니다.

## 글 게시 API

`POST /api/posts`에 `Authorization: Bearer <PUBLISH_TOKEN>`과 JSON 본문을 전송합니다. 언어별로 한 번씩 게시합니다. `lang`은 `ko` 또는 `en`, `slug`는 영문 소문자·숫자·하이픈, `category`는 `ai`, `mobility`, `it-devices` 중 하나입니다. 기존 AI 하위 분류 주소는 `/ai/`로 이동합니다.

```bash
curl -X POST 'https://hslblog.com/api/posts' \
  -H "Authorization: Bearer $HSL_PUBLISH_TOKEN" \
  -H 'Content-Type: application/json' \
  --data-binary @post.json
```

게시 JSON을 처음부터 임의로 만들지 말고 `editorial/api-posts/`의 검수된 한영 샘플을 구조 참고용으로 읽습니다. 가격·후기·경험은 새 주제의 출처로 다시 확인해야 합니다. 작성·검수 기준은 `AGENTS.md`와 `editorial/QUALITY.md`가 기준입니다.

필수 필드: `lang`, `slug`, `category`, `title`, `description`(50~180자), `body`, `tags`(서로 다른 소문자 kebab-case 5~15개), `imageUrl`, `imageAlt`, `visualTypes`(썸네일부터 이미지 순서대로 `sketch/source/architecture/pipeline/chart`). 총 2~10장의 이미지, 정확히 한 장의 생성 스케치 썸네일과 별도의 본문 이미지, 정확히 세 항목인 요약, 마지막 Q&A가 필요합니다. 인증된 게시 요청도 구조 검사를 통과하지 못하면 `422`와 `details`를 반환합니다. 구조 검사는 사실관계를 보증하지 않으므로 출처 대조는 별도로 수행합니다.

샘플 JSON은 Git에서 검수·보존하는 원고이며 D1과 자동 동기화되지 않습니다. 원고를 수정한 뒤 아래 API로 실제 게시하고 공개 URL에서 확인해야 합니다. 정적 글은 기존 Markdown을 수정하여 Git 배포하며, 같은 글을 API에 중복 생성하지 않습니다.

영어판은 `lang: "en"`과 같은 `slug`로 별도 요청합니다. `publishedAt`(ISO 8601 UTC)을 생략하면 게시 시각이 저장됩니다. 수정할 때는 `If-Match: update` 헤더를 추가하며 원래 발행일은 유지됩니다. 삭제는 인증 헤더와 함께 `DELETE /api/posts?lang=ko&slug=example-post`를 호출합니다. 반환된 `url`에서 글을 확인할 수 있습니다. 공개 조회는 `GET /api/posts?lang=ko`, 검색은 `GET /api/search?lang=ko&q=검색어`입니다. Worker가 홈의 각 주제 구역과 분류 전체보기에 D1 글을 서버에서 넣으므로 새 글마다 재빌드할 필요가 없습니다. 검색, RSS, `/dynamic-sitemap.xml`에도 새 글이 반영됩니다.

## 이미지 업로드 API

`POST /api/images`에 기존 `PUBLISH_TOKEN`과 이미지 파일을 원본 바이너리로 전송합니다. PNG, JPEG, WebP, GIF, AVIF를 지원하며 최대 5 MB입니다. 브라우저에서 붙여넣은 이미지 `Blob`도 `fetch`의 본문에 그대로 넣을 수 있습니다. SVG와 실행 가능한 파일은 받지 않습니다.

```bash
curl -X POST 'https://hslblog.com/api/images' \
  -H "Authorization: Bearer $HSL_PUBLISH_TOKEN" \
  -H 'Content-Type: image/webp' \
  --data-binary @figure.webp
```

응답의 `url`은 `/media/<고유 ID>.webp` 형식입니다. 글의 `imageUrl` 또는 Markdown 본문의 `![설명](/media/<고유 ID>.webp)`에 그대로 사용하면 됩니다. 이미지는 비공개 R2 버킷에 저장되고 이 Worker를 통해 공개 표시됩니다. 잘못 올린 이미지는 인증 헤더를 넣어 `DELETE /media/<고유 ID>.webp`로 삭제할 수 있습니다. 글에서 사용 중인 이미지를 삭제하면 해당 이미지도 사라지므로 먼저 글을 수정하세요.

커뮤니티 반응은 실제 원문을 확인해 요약하고, 각 항목 끝에 해당 게시물·댓글 원문 링크를 답니다. 원문 URL과 확인 내용은 `editorial/reviews/<slug>.md`에도 기록합니다. 관련 이전 글은 독자에게 직접 도움이 되는 경우에만 같은 언어의 공개 URL로 자연스럽게 연결합니다.

## 댓글

모든 글 하단에 회원가입 없는 댓글창이 붙습니다. 작성자는 댓글마다 닉네임(2~20자)과 비밀번호(4~64자)를 입력하고, 비밀번호는 PBKDF2 해시로만 D1 `comments` 테이블에 저장됩니다. 답글은 한 단계까지 들여 쓰며, 답글을 달면 대상 댓글의 닉네임이 `@닉네임`으로 자동 태그됩니다. 태그는 서버가 원 댓글에서 가져오므로 위조할 수 없습니다.

- 조회: `GET /api/comments?page=/it-devices/<slug>/` (글 페이지 경로 기준, 한·영 별도)
- 작성: `POST /api/comments` — `page`, `nickname`, `password`, `body`(1~1,000자), 답글이면 `parentId`(원 댓글)와 `replyToId`(답하는 댓글)
- 삭제: `DELETE /api/comments` — `{ "id": 1, "nickname": "...", "password": "..." }`. 작성 때와 같은 닉네임과 비밀번호가 모두 맞아야 합니다. 운영자는 `Authorization: Bearer <PUBLISH_TOKEN>`으로 비밀번호 없이 삭제할 수 있고, `HSL` 같은 운영자 닉네임도 이 토큰으로만 쓸 수 있습니다
- 답글이 달린 댓글을 지우면 "삭제된 댓글"로 남고, 답글이 모두 지워지면 함께 정리됩니다
- 같은 IP에서 1분 3개, 하루 30개까지 작성할 수 있고, 봇만 채우는 숨은 입력칸이 있으면 거부합니다. 테이블은 Worker 첫 요청 때 자동 생성되며 `migrations/0002_comments.sql`과 같습니다

## 방문 통계, 개인정보, 보안 헤더

- 방문 통계: 모든 페이지가 로드 후 `POST /api/views`로 경로만 보냅니다. 쿠키·IP·기기 정보 없이 D1 `page_views`에 날짜(서울 기준)별 조회 수만 쌓고, 봇·없는 글·유틸리티 경로는 세지 않습니다. 조회는 `GET /api/views?days=30`에 `Authorization: Bearer <PUBLISH_TOKEN>`을 붙입니다
- 개인정보처리방침: `/privacy/`, `/en/privacy/`. 댓글·통계의 수집 항목이나 보관 기간을 바꾸면 이 페이지와 시행일도 함께 고칩니다. 댓글 IP 해시는 30일 뒤 자동으로 지웁니다
- 보안 헤더: 정적 파일은 `public/_headers`, Worker 응답은 `worker/index.js`의 `securityHeaders`가 같은 값을 붙입니다. 외부 스크립트·폰트·iframe을 추가하려면 두 곳의 CSP를 함께 넓혀야 합니다
- 없는 주소는 `src/pages/404.astro`를 404 상태로 보여줍니다(설정 파일의 `not_found_handling`)

## IndexNow

글이 바뀌면 네이버·Bing 등 IndexNow 참여 검색엔진에 바로 알립니다. 키 파일은 `public/<키>.txt`, 같은 키가 `worker/index.js`의 `indexNowKey`에 있습니다(공개 값). 키를 바꾸면 두 곳을 함께 바꿉니다.

- API 글: 게시·수정·삭제 직후 해당 URL을 `api.indexnow.org`, `www.bing.com/indexnow`, `searchadvisor.naver.com/indexnow`에 전송합니다(한 곳이 요청 제한으로 거절해도 전달되도록)
- 정적 글: Worker 크론(`wrangler.jsonc`의 `triggers.crons`, 매일 00:17 UTC)이 최근 26시간 안에 `lastmod`가 바뀐 사이트맵 URL과 API 글을 전송합니다
- 수동 전송: `POST /api/indexnow`에 `Authorization: Bearer <PUBLISH_TOKEN>`. 본문 없이 보내면 전체 사이트맵과 API 글을, `{ "urls": [...] }`를 보내면 해당 URL만 전송합니다

## 품질 기준과 검증

- `AGENTS.md`: 단일 작성 규칙 (`GEMINI.md`는 이 문서만 참조)
- `editorial/QUALITY.md`: 기준 글 3개, 실패 예시, 검수표, 다음 작성자용 프롬프트
- `editorial/reviews/`: 글별 사실·계산·커뮤니티 출처와 검수 기록
- `shared/editorial.mjs`: 정적 빌드와 Worker 게시 API의 공통 구조 검사
- `npm run test:editorial`: 정상 원고와 잘못된 입력의 회귀 검사
- `npm run check`: 위 검사와 한영 짝 검사, Astro·검색·링크·성능 검사

API는 언어별로 별도 요청합니다. 두 원고를 모두 검수한 뒤 게시하고, 두 번째 언어에 실패하면 재시도하거나 첫 번째를 원래 원고로 복구합니다. 두 언어가 모두 확인되기 전에는 발행 완료로 보고하지 않습니다.

영어판을 기준으로 쓰고 한국어판을 함께 유지합니다. 냉소적이면서 유머러스한 문체가 기본이며, 이미지 내부 문구는 영어로 고정합니다. 가격은 미국 공식 USD 가격을 우선합니다. 없을 때만 한국 출시가를 달러로 환산하고 작은 주석에 기준을 남깁니다. 자세한 예외와 검수 절차는 AGENTS.md를 따릅니다.
