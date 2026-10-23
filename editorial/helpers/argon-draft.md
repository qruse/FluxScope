<!-- Antigravity draft brief (AGENTS §7, stage 2). Fill {{…}}, save as <workdir>/argon.md, run run_helpers.py <workdir> draft.
     Keep it short: rules live in AGENTS.md; list here only what the article needs and mistakes drafts actually repeated. -->
너는 HSL 블로그 글 한 편을 검수 없이 미리보기에 올릴 수 있는 상태까지 혼자 끝낸다. 작업 폴더는 블로그 저장소다.

먼저 `AGENTS.md`와 `editorial/QUALITY.md`를 끝까지 읽고 그대로 따른다. 최신 게시 글 한 편(`https://hslab.space/api/posts?lang=ko` 맨 위, `&slug=`로 ko·en)으로 문체와 구조를 맞춘다.

# 글
- slug `{{slug}}`, category `{{category}}`
- 제목: {{사용자 제목 그대로 / 후보 3–5개는 리뷰 기록에}} · 영어 제목은 같은 뜻, 70자 이하
- 독자 질문: {{question}}
- 결론: {{conclusion}}
- 글쓴이 경험 (이 밖의 경험·숫자는 지어내지 않음): {{experience or 없음}}
- 조사 자료: `{{workdir}}/research-claude.md`, `research-argon.md`, `research-codex.md`를 먼저 다 읽고 합친다. 셋이 엇갈리면 1차 출처를 직접 열어 확인한다. 새 조사는 빈 곳만
- 조사할 것: {{items}}
- 조심할 것: {{topic traps, or 생략}}

# 맡을 일
- 만들 파일: `editorial/api-posts/{en,ko}-{{slug}}.json`, `editorial/reviews/{{slug}}.md`, 본문 그림 3장(`public/images/posts/{{category}}/{{slug}}-<name>.webp`, 그린 코드는 `{{workdir}}/make_charts.py`). 이 밖의 파일은 건드리지 않는다
- 썸네일은 Claude 몫: `imageUrl`은 `/images/posts/{{category}}/{{slug}}-notebook.webp`
- 커뮤니티 반응 섹션은 쓰지 않는다 (Codex가 쓰고 Claude가 붙임). 레딧 조사도 하지 않는다
- 그림은 `editorial/helpers/chart_style_reference.py` 스타일, 글자는 최소(짧은 제목, 상자엔 2–4단어 라벨, 출처 한 줄). 그린 뒤 직접 열어 확인
- 게시·`--preview`·git은 하지 않는다

# 지난 초안들이 반복한 실수 (하지 않는다)
- 불릿 하나에 두세 문장. 한 줄로 안 읽히면 자르거나 나눈다
- 비교 단위 섞기(서비스끼리 비교하는데 모델명 라벨 등), 질문과 무관한 제품 자랑
- 표의 다른 줄 숫자 가져오기, 문서가 특정 조건에서만 말한 기능을 일반화하기
- 옵션·플래그 설명 같은 설정 잡담 (코드 예시 안의 옵션은 괜찮음)
- 그림 내용이 실제 과정·역할과 다름
- Q&A를 `###` 제목으로 쓰기 (`- **Q. …?**` + 들여쓴 답)

# 끝내기 전에 (한 번만)
`& "C:\Users\이현상\tools\node-v22.23.3-win-x64\node.exe" scripts/publish-post.mjs editorial/api-posts/en-{{slug}}.json editorial/api-posts/ko-{{slug}}.json --dry-run` 이 `✔ validation passed`가 될 때까지 고치고, 리뷰 기록에 실제로 한 확인과 남은 한계를 적는다.
