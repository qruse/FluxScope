---
description: Authoritative writing, styling, and verification rules for FluxScope blog articles
always_on: true
---

# FluxScope Blog Writing Rules

See `AGENTS.md` and `GEMINI.md` at the project root for the full guidelines.

- **Core Concept & Editorial Identity (블로그 핵심 컨셉과 정체성)**:
  - **관심 분야 탐구 & 기록**: 작성자가 관심 있는 기술(AI, 모빌리티/EV, 플래그십 IT 기기)의 최신 소식과 이슈를 직접 찾아보고 조사하여 블로그로 정리함.
  - **이중 목적 ("나도 보고, 사람들도 볼 수 있게")**:
    1. **나를 위한 실무 아카이브**: 내가 언제든 다시 찾아볼 수 있는 고밀도 스펙, 시스템 내부 원리, 시행착오 및 실패 포인트 정리.
    2. **독자들을 위한 고밀도 공유**: 다른 엔지니어와 독자들도 마케팅 거품 없이 진짜 실무적 본질을 명확히 파악할 수 있도록 제공.
  - 뻔한 보도자료 요약이나 피상적 소개글 절대 금지. "내가 직접 써먹고 다시 보려고 정리한 필드 노트" 수준의 깊이 유지.
- **Language**: Always write pairs in Korean (`ko/<category>/<slug>.md`) and English (`en/<category>/<slug>.md`).
- **Category Hierarchy (대분류-중분류 체계)**:
  - **대분류 1. AI**: `agi`, `physical-ai`, `other-ai`
  - **대분류 2. 모빌리티**: `mobility`
  - **대분류 3. IT기기**: `it-devices`
- **Tone (냉소적·유머러스한 실무 엔지니어 스타일)**:
  - Korean: 개조식(Itemized bullet format) + 음슴체 (`~함`, `~임`, `~봄`, `~필수`, `~안 됨`, `~행`). 겉만 번지르르한 마케팅/벤치마크 헛소리를 꿰뚫어 보는 쌉싸름한 냉소와 뼈 때리는 블랙 유머 장착. 단, 핵심 수치와 기술 메커니즘은 칼같이 정확하게 제공.
  - English: Wry, cynical executive engineering memo. Punctures Silicon Valley hype with dry deadpan realism and witty field takeaways. Zero fluff, zero academic lecturing.
  - **Titles & Descriptions (제목과 요약문 규격)**: 교과서식/학술 논문투 제목(~의 원리와 실무, ~의 상관관계 분석, ~하는 방법) 절대 금지. 마케팅 환상을 박살 내고 실무 엔지니어의 씁쓸한 현실과 블랙 유머를 제목과 `description`, `3줄 요약`에서부터 직관적으로 드러내야 함. 요약문 끝 마침표(`.`) 절대 금지.
- **Punctuation**: NO trailing periods (`.`) on bullet points or memo sentences.
- **Structure**:
  1. Top (Fixed): `## 3줄 요약` / `## 3-Line TL;DR` (3 bullet points).
  2. Middle (Dynamic): AI-generated technical breakdown, checklists, tables, code snippets.
  3. Pre-Q&A (Optional Dynamic): `## 커뮤니티 반응` / `## Community Reactions` (유동적 목차: 관련 커뮤니티 토론/흥미로운 반응이 있을 때만 Q&A 바로 앞에 선택적으로 삽입하며, 없을 경우 완전 생략. 단, 작성 시 플랫폼명 'Reddit' 언급 절대 금지).
  4. Bottom (Fixed): `## Q&A 또 궁금한 것은?` / `## Q&A (Field Notes)`.
  5. Footer: NO trailing `---` or review date footers at the end.
- **Images (5 Distinct Types & Standards)**:
  - Type 1 (Sourced Research): Sourced from papers/reports with mandatory citation: `*출처: [출처명](URL) — 논문/리포트명*` (EN: `*Source: [Author/Org](URL) — Title*`).
  - Type 2 (AI Hand-Drawn Sketch): Generated via AI prompt for whiteboard/felt-pen rough sketch explanatory drawings (zero glossy AI 3D art).
  - Type 3 (AI PPT System Diagram): Generated via AI prompt for clean 2D vector technical conference slide block architecture schematics.
  - Type 4 (Code-Generated Algorithm Pipeline): Generated via `scripts/visuals/cli.py pipeline` with explicit step badges.
  - Type 5 (Code-Generated Benchmark Chart): Generated via `scripts/visuals/cli.py bar` or `trend` matching site palette.
  - Static & Auto-Resolution: 100% static assets under `public/images/posts/<category>/`. Max width 1600px, payload under 250KB (hard cap 500KB). All 5 types do not need to appear in every article.
- **E-E-A-T & Mandatory Experience Comment**:
  - AI MUST ask the user for a 1–2 sentence firsthand experience comment before drafting. Never draft/publish without it.
  - Frontmatter retains `experienceNote: string` (min 15 chars) as provenance metadata, but it MUST NEVER be rendered as an artificial callout box on the UI.
  - The experience comment must be naturally and deeply woven into the entire article narrative (3-line summary, architecture explanation, gotchas, Q&A) so the text authentically reflects real production field experience.
- **Verification**: `npm run check` executes `check-eeat.mjs` $\to$ `astro check` $\to$ `astro build` $\to$ `pagefind` $\to$ `check-links` $\to$ `check-performance.mjs` (HTML $\le$ 100KB, CSS $\le$ 60KB, Image $\le$ 500KB, CLS attributes). Must pass with 0 errors.
