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
- 썸네일은 Claude 몫: `imageUrl`은 `/images/posts/{{category}}/{{slug}}-notebook.webp`, 장면은 {{thumbnail scene and exact English labels}}. `imageAlt`와 리뷰의 Sketch brief는 이 장면 그대로 쓴다
- 커뮤니티 반응 섹션은 쓰지 않는다 (Codex가 쓰고 Claude가 붙임). 레딧 조사도 하지 않는다
- 본문 그림은 형식을 섞는다 (사용자 요청 10/23): 막대 차트는 최대 1장, 나머지는 타임라인·흐름도(`pipeline`), 픽토그램·선 그래프·표 그림, 그리고 `source` 1장 이상(조사 자료의 `## Images`에 적힌 공식 문서·정부 자료·우리 프로젝트 페이지를 직접 캡처해 핵심 부분만 자르고, 강조는 "added by HSL"로 밝힘. 언론사·남의 사진은 쓰지 않음). 차트는 `editorial/helpers/chart_style_reference.py` 색·글꼴을 따르고 글자는 최소(짧은 제목, 2–4단어 라벨, 출처 한 줄). 그린 뒤 직접 열어 확인
- 게시·`--preview`·git은 하지 않는다

# 지난 초안들이 반복한 실수 (하지 않는다)
- 불릿 하나에 두세 문장, 또는 "~했는데, ~이고, ~했음"으로 이어 붙인 긴 한 문장. 불릿 하나엔 사실 하나와 링크 1–2개, 한국어 70자 안팎(링크 제외). 넘으면 두 불릿으로 나눈다 (10/23 사용자 "문장이 길다")
- 비교 단위 섞기(서비스끼리 비교하는데 모델명 라벨 등), 질문과 무관한 제품 자랑
- 표의 다른 줄 숫자 가져오기, 문서가 특정 조건에서만 말한 기능을 일반화하기
- 옵션·플래그 설명 같은 설정 잡담 (코드 예시 안의 옵션은 괜찮음)
- 그림 내용이 실제 과정·역할과 다름
- Q&A를 `###` 제목으로 쓰기 (`- **Q. …?**` + 들여쓴 답)

# 끝내기 전에 (한 번만)
`& "C:\Users\이현상\tools\node-v22.23.3-win-x64\node.exe" scripts/publish-post.mjs editorial/api-posts/en-{{slug}}.json editorial/api-posts/ko-{{slug}}.json --dry-run` 이 `✔ validation passed`가 될 때까지 고치고, 리뷰 기록에 실제로 한 확인과 남은 한계를 적는다.
