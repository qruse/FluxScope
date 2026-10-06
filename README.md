# HSL의 블로그

Astro가 사이트 화면을 제공하고 Cloudflare Worker가 D1의 글을 읽습니다. 모든 글은 게시 API로 발행하며, 원고·이미지·검수 기록을 다루는 데 Git 커밋이나 재빌드가 필요하지 않습니다. 코드·템플릿·규칙 변경만 Git으로 관리합니다.

작성 규칙의 단일 기준은 `AGENTS.md`이며 `editorial/QUALITY.md`는 검수표입니다. 작성 전 최신 관련 게시글의 한영 본문을 API에서 확인합니다. Git에 남은 예시·과거 검수 기록은 최신 게시본을 대신하지 않습니다.

## 개발

Node.js 22.19 이상에서 `npm ci`, `npm run check`를 실행합니다. 로컬 API 확인은 `npm run db:local` 후 `npx wrangler dev --var PUBLISH_TOKEN:local-only`로 합니다.

## Cloudflare 초기 설정 (한 번만)

1. Cloudflare D1 데이터베이스 `hsl-blog-posts`의 ID는 `wrangler.jsonc`에 설정되어 있습니다.
2. Worker `fluxscope`의 **Settings → Variables and Secrets**에서 `PUBLISH_TOKEN`을 **Secret**으로 추가합니다. 길고 고유한 문자열을 사용하고 Git에는 넣지 않습니다.
3. **R2 object storage → Overview → Create bucket**에서 `hsl-blog-images` 버킷을 Standard 저장 클래스로 만듭니다. `wrangler.jsonc`의 `IMAGES` 바인딩이 이 버킷에 연결됩니다. 버킷을 공개하거나 별도 R2 API 키를 만들 필요는 없습니다.
4. GitHub `main`에 연결된 Workers Builds에서 빌드 명령 `npm run build`, 배포 명령 `npx wrangler deploy`를 사용합니다. D1 테이블은 Worker의 첫 요청에서 자동으로 생성됩니다. 이후 스키마 변경이 필요할 때는 Cloudflare 인증된 환경에서 `npm run db:remote`를 사용할 수 있습니다.
5. Worker 설정을 한 번 배포하면 이후 API 글과 새 이미지는 빌드 없이 게시됩니다. 공개 주소는 `https://hslblog.com`입니다.

공개 도메인은 `hslblog.com`(Cloudflare Registrar)입니다. `wrangler.jsonc`의 `routes`가 `hslblog.com`과 `www.hslblog.com`을 Worker 커스텀 도메인으로 연결하며 DNS·인증서는 배포 때 자동으로 만들어집니다. 옛 `fluxscope.coolwin200.workers.dev`와 `www` 주소의 페이지 요청은 Worker가 같은 경로의 `https://hslblog.com`으로 301 이동시키고, `/api/*`는 두 주소 모두에서 그대로 동작합니다. 도메인을 바꾸면 `worker/index.js`의 `origin`, `astro.config.mjs`·CI의 `SITE_URL`, `routes`를 함께 바꿔야 합니다.

## 글 작성·미리보기·게시

현재 작성자는 조사부터 한영 집필, 이미지, Reddit 원문 확인, 게시와 검증까지 맡습니다. 특정 모델 간 인계는 필수가 아닙니다. 실제 원본은 D1의 공개 게시본이며 저장된 초안은 별도입니다.

- 최신 목록: `GET /api/posts?lang=en`, `GET /api/posts?lang=ko`
- 게시 본문: `GET /api/posts?lang=<en|ko>&slug=<slug>`
- 저장된 작업 원고와 검수 기록: 인증된 `/api/drafts`; 아래 `--pull`로 가져옵니다
- 공개 주소: `/posts/<slug>/`, `/en/posts/<slug>/`; 예전 분류별 글 주소는 같은 slug의 새 주소로 이동합니다

게시 전에는 최종 한영 제목을 보여주고 사용자 컨펌을 검수 기록에 남깁니다. 제목이 바뀌면 다시 컨펌받고, 초안과 미리보기는 컨펌 전에도 준비할 수 있습니다(`AGENTS.md` §1.1).

`PUBLISH_TOKEN`은 환경변수나 비밀 설정으로 제공하고 명령 기록·로그·Git에 넣지 않습니다. 아래 명령은 저장소 루트에서 실행합니다. 기존 글을 수정하거나 저장된 초안을 이어 쓸 때 먼저 가져옵니다.

```bash
node scripts/publish-post.mjs --pull <slug>
```

가져온 초안은 미게시 수정본일 수 있으므로 현재 공개 본문과 대조합니다. 원고 경로는 `editorial/api-posts/{en,ko}-<slug>.json`, 검수 기록은 `editorial/reviews/<slug>.md`입니다. 새 파일은 git-ignored이며 `--preview`와 게시 시 `/api/drafts`에 저장됩니다. 기존 tracked JSON은 예시·회귀 검사 자료로 남아 있을 뿐, 자동으로 D1과 동기화되지 않습니다. `src/content/posts/`에 글을 추가하지 않습니다.

```bash
# 구조 검사: 업로드·게시 없음
node scripts/publish-post.mjs editorial/api-posts/en-<slug>.json editorial/api-posts/ko-<slug>.json --dry-run

# 초안 공유가 필요한 경우: 목록에서 제외된 noindex 미리보기 생성
node scripts/publish-post.mjs editorial/api-posts/en-<slug>.json editorial/api-posts/ko-<slug>.json --preview

# 사용자가 최종 한영 제목을 컨펌한 뒤에만 한영 동시 게시
node scripts/publish-post.mjs editorial/api-posts/en-<slug>.json editorial/api-posts/ko-<slug>.json
```

게시 스크립트는 로컬 이미지를 `/media/`로 업로드하고, 두 언어를 `{ "posts": [en, ko] }` 형태의 단일 요청으로 원자적으로 저장합니다. 기존 본문을 백업하고 원래 발행일을 유지하며 공개 페이지와 이미지도 검사합니다. 최신 썸네일과 다른 오래된 작업본이나 사라진 `/media/` 이미지는 게시를 차단하므로 최신 원고를 다시 가져와 수정합니다.

필수 필드는 `lang`, `slug`, `category`, `title`, `description`, `body`, `tags`, `imageUrl`, `imageAlt`, `visualTypes`입니다. 카테고리는 `ai`, `mobility`, `it-devices`만 사용합니다. 형식·길이·이미지·문체 기준은 `AGENTS.md`, 수동 검수는 `editorial/QUALITY.md`를 따릅니다. 구조 검사 통과가 사실 검증을 대신하지 않습니다.

미리보기는 목록·검색·피드·사이트맵에서 제외되고 30일 후 만료되며 실제 게시 시 삭제됩니다. 공개 페이지는 엣지 캐시 때문에 최대 60초 늦게 갱신될 수 있습니다. 한영 페이지, 이미지, 언어 전환, 홈·분류·검색·피드까지 확인한 뒤 완료로 보고합니다. 검색은 `GET /api/search?lang=ko&q=검색어`, API 글 사이트맵은 `/dynamic-sitemap.xml`입니다.

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
- 정기 재알림: Worker 크론(`wrangler.jsonc`의 `triggers.crons`, 매일 00:17 UTC)이 최근 26시간 안에 `lastmod`가 바뀐 사이트맵 URL과 API 글을 전송합니다
- 수동 전송: `POST /api/indexnow`에 `Authorization: Bearer <PUBLISH_TOKEN>`. 본문 없이 보내면 전체 사이트맵과 API 글을, `{ "urls": [...] }`를 보내면 해당 URL만 전송합니다

## 품질 기준과 검증

- `AGENTS.md`: 단일 작성 규칙 (`CLAUDE.md`, `GEMINI.md`, `.agents/rules/blog-writing-rules.md`는 이 문서만 참조)
- `editorial/QUALITY.md`: 최신 게시본 확인 절차, 기법 참고 글 3개, 실패 예시, 검수표
- `editorial/reviews/`: 글별 사실·계산·커뮤니티 출처와 검수 기록
- `shared/editorial.mjs`: 정적 빌드와 Worker 게시 API의 공통 구조 검사
- `npm run test:editorial`: 정상 원고와 잘못된 입력의 회귀 검사
- `npm run check`: 위 검사와 한영 짝 검사, Astro·검색·링크·성능 검사

글 작업은 게시 스크립트의 `--dry-run`과 수동 검수·라이브 확인으로 검증합니다. 코드·템플릿·규칙을 커밋할 때는 `npm run check`를 실행합니다. 한영 원고는 반드시 묶어서 게시하고, 두 공개 페이지를 모두 확인해야 완료입니다.

영어판을 기준으로 쓰고 한국어판을 함께 유지합니다. 자연스럽고 위트 있는 유머러스한 문체가 기본이며, 본문은 쉬운 말과 짧은 문장으로 쓰고 반복 설명을 줄입니다. 새 글은 썸네일 1장과 본문 이미지 3장 이상으로 총 4–10장을 사용합니다. 기존 게시글에는 새 최소 장수를 소급 적용하지 않습니다. 이미지 내부 문구는 영어로 고정합니다. 가격은 미국 공식 USD 가격을 우선합니다. 미국 공식 가격이 없으면 제품을 대표하는 시장의 공식 가격을 환산하고 시장·세금·환율·기준일을 밝힙니다. 자세한 예외와 검수 절차는 AGENTS.md를 따릅니다.
