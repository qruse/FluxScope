# FluxScope Blog Writing & Development Rules (GEMINI.md)

This file mirrors `AGENTS.md` and contains the authoritative, non-negotiable guidelines for all AI agents writing articles, modifying content, or developing features for **FluxScope**. Every AI agent MUST read, understand, and strictly adhere to these rules before drafting or editing posts.

---

## 1. Project & Architecture Principles (프로젝트 기본 원칙)

- **Static Architecture**: FluxScope is an Astro + TypeScript static site. Never add a backend, database, CMS, OpenAI API runtime call, or unnecessary external frameworks.
- **Language Pairing (다국어 쌍 작성)**: Every article must be published in both Korean and English simultaneously:
  - Korean path: `src/content/posts/ko/<category>/<slug>.md`
  - English path: `src/content/posts/en/<category>/<slug>.md`
- **Strict Categories (카테고리 3종)**:
  - `agi`: AGI, frontier models, reasoning architectures, prompt engineering, LLM-ops, evaluation.
  - `physical-ai`: Autonomous driving, robotics, humanoid, VLA foundation models, EV powertrain, real-world physics.
  - `other-ai`: On-device AI, small language models, edge compute, speech/audio multimodality, smart agriculture, IoT telemetry.
- **Minimal Maintainable Diffs**: Make the smallest, cleanest maintainable change.

---

## 2. Article Structure Standard (고정 및 동적 레이아웃)

Every post must adhere to this exact structural hierarchy:

### ① Top Section (Fixed): 3줄 요약 / 3-Line TL;DR
- **Korean**: `## 3줄 요약`
- **English**: `## 3-Line TL;DR`
- **Rule**: Exactly 3 punchy bullet points capturing core insight, technical mechanism, and practical implication.

### ② Middle Section (Dynamic / AI-Generated):
- Dynamically structured according to the topic.
- Use high-density technical artifacts:
  - Core architecture breakdown / operational mechanisms
  - Step-by-step checklists or implementation workflows
  - Clean code snippets or configuration files
  - Metrics comparison tables (latency, memory, throughput, accuracy)
  - Mermaid diagrams where architecture visualization adds clarity

### ③ Bottom Section (Fixed): Q&A 또 궁금한 것은? / Q&A (Field Notes)
- **Korean**: `## Q&A 또 궁금한 것은?`
- **English**: `## Q&A (Field Notes)`
- **Rule**: Concise Q&A bullet format addressing real-world edge cases, practical hurdles, or hardware constraints.

### ④ No Trailing Footers / Disclaimers (꼬리말 절대 금지):
- **NEVER** append horizontal rules (`---`) at the very end of the markdown body.
- **NEVER** append review date disclaimers (e.g., `*2026년 9월 기준...*` or `*Last reviewed: ...*`).
- **Reason**: The article header already renders author, publication date, and update date. The article layout automatically appends the tag container (`.article-end`) with its own top border. Adding markdown footers creates an ugly double border and redundant text.

---

## 3. Writing Tone & Voice (문체 및 어조)

### Korean (한국어):
- **개조식(Itemized Bullet Format) 필수**: 줄글 서술, 장황한 도입부, 만연체, 일기/칼럼식 말투 절대 금지.
- **음슴체 종결**: 모든 문장/항목은 `~함`, `~임`, `~봄`, `~필수`, `~안 됨` 등의 음슴체 및 명사형으로 간결하게 종결.
- **경어체/존댓말 금지**: `~합니다`, `~입니다`, `~바랍니다`, `~알아보겠습니다` 등 일체 사용 금지.
- **호흡 극도로 짧게**: 문장 길이를 최소화하고 핵심 정보와 수치 위주로 압축.

### English (영어):
- **Executive Field-Note Memo Style**: Fast, punchy, active-verb technical memo.
- Match the brisk tempo of the Korean 음슴체 version.
- Zero conversational fluff, zero generic AI introductory filler ("In this post, we will explore...").

---

## 4. Punctuation Rule: No Trailing Periods (마침표 금지)

- **CRITICAL**: Never put a trailing period (`.`) at the end of bullet points or memo sentences in both Korean and English.
- **Examples**:
  - ❌ Bad: `- 오프라인 환경에서도 120ms 이하 응답 보장.`
  - ⭕ Good: `- 오프라인 환경에서도 120ms 이하 응답 보장`
  - ❌ Bad: `- Sub-100ms latency on edge NPU.`
  - ⭕ Good: `- Sub-100ms latency on edge NPU`

---

## 5. Image Classification & Visual Assets Policy (이미지 2대 유형 및 시각화 규칙)

All images in articles must strictly belong to one of two categories. Meaningless, glossy, generic AI-generated illustrations (3D floating orbs, cyberpunk neon fluff, DALL-E style art) are strictly forbidden ("AI 티나는 일러스트 금지").

### ① Type 1: Sourced Research Images (자료 조사 이미지)
- **Definition**: Primary figures, architectural diagrams, model cards, benchmark plots, or system schematics directly extracted from official papers (arXiv), documentation, or authoritative vendor announcements.
- **Rules**:
  - Must provide clear source attribution in the caption or immediately following bullet point (e.g., `*출처: DeepSeek-V3 Technical Report*`).
  - Optimize format (WebP or PNG) under `public/images/posts/<category>/`.
  - Always specify descriptive `alt`, `width`, and `height`.

### ② Type 2: Programmatic & Sketch Visuals (직접 생성 도식·그래프 이미지)
- **Definition**: Explanatory visuals created specifically for the post to illustrate architectures, algorithmic flows, or performance comparisons.
- **Allowed Forms**:
  - **Hand-drawn Sketch Schematics (사람이 그린 듯한 스케치 도식)**: Excalidraw/XKCD rough sketch style block diagrams and pipeline flows.
  - **Algorithm & Pipeline Schematics (알고리즘 도식화)**: Clear stage-by-stage block flows with input/output badges.
  - **Programmatic Code-Generated Charts (직접 코딩으로 만든 그래프)**: Precision benchmark comparisons, latency/throughput curves, scaling laws.
- **Modular Generation Toolkit (`scripts/visuals/`)**:
  - To eliminate graph creation time, agents must use the pre-configured visual generator CLI or Python module (`scripts.visuals.charts`) matching FluxScope's exact color palette:
  ```bash
  # 1. Bar comparison chart (latency, throughput, memory)
  python scripts/visuals/cli.py bar --labels "FP16,INT8,FP4" --values "184,105,62" --unit "ms" --title "Inference Latency" --output public/images/posts/<category>/<slug>-latency.png

  # 2. Trend & scaling curve (context scaling, loss curves)
  python scripts/visuals/cli.py trend --x "1k,2k,4k,8k" --series "Unoptimized:1.8,3.6,7.2,14.4;Cached:0.3,0.3,0.4,0.6" --title "KV Cache Footprint" --output public/images/posts/<category>/<slug>-scaling.png

  # 3. Hand-drawn sketch pipeline (algorithm dataflow, system architecture)
  python scripts/visuals/cli.py pipeline --steps "Sensors:Raw frames:INPUT;Perception:Occupancy grid:STAGE 1;Planning:MCTS:STAGE 2;Control:CAN bus:ACTUATION" --title "E2E Decision Loop" --output public/images/posts/<category>/<slug>-pipeline.png
  ```
  - Or import `from scripts.visuals.charts import plot_bar_comparison, plot_line_trend, plot_sketch_pipeline` for customized charts.

---

## 6. Tags Policy (태그 규칙)

- **Count Rule**: Each article must have between **5 and 15 tags** (`5 <= tags.length <= 15`).
- **Format**: All lowercase, `kebab-case` English (e.g., `reasoning`, `test-time-compute`, `kv-cache`, `on-device`, `vla`).
- **Quality**: Practical, searchable engineering and research keywords. Avoid overly generic single characters or meaningless labels.

---

## 7. Frontmatter Schema Requirements (프런트매터 규격)

Every post must fill out all required frontmatter properties accurately:

```yaml
---
title: "게시글 제목 (개조식 핵심 요약형)"
description: "게시글 핵심 요약 1~2문장"
category: "agi" # 'agi' | 'physical-ai' | 'other-ai'
publishedAt: "2026-09-22"
updatedAt: "2026-09-22"
tags:
  - keyword-one
  - keyword-two
  - keyword-three
  - keyword-four
  - keyword-five
author: "FluxScope"
image:
  src: "/images/posts/thumbnail.png"
  alt: "Descriptive alt text for accessibility"
  width: 1200
  height: 630
draft: true # Keep true until factual and visual review is complete
experienceNote: "1~2줄의 실제 현장 경험 코멘트 (글 작성 전 사용자에게 반드시 직접 받아야 함)"
---
```

---

## 8. E-E-A-T Standard & Mandatory User Experience Protocol (E-E-A-T 품질 원칙 및 사용자 경험 수취 의무)

FluxScope의 모든 아티클은 구글 E-E-A-T(Experience, Expertise, Authoritativeness, Trustworthiness) 4대 품질 요소를 엄격히 반영해야 함:

### ① 경험 (Experience) — [절대적 필수 수취 규칙]
- **글 작성 전 사용자 질문 필수**: AI 에이전트는 글을 임의로 작성하거나 발행하기 전에, **반드시 사용자에게 해당 주제와 관련된 1~2줄의 직접 경험 코멘트(실제 사용 후기, 벤치마크 시행착오, 현장 장애 사례, 실무 노하우)를 요청하고 전달받아야 함.**
- **임의 작성 절대 금지**: 사용자의 경험 코멘트를 받지 않은 상태에서 글을 단독으로 작성하거나 `draft: false`로 배포하는 행위 엄격 금지.
- **표기 및 노출**: 받은 코멘트는 프런트매터 `experienceNote`에 등록하며, 아티클 상단 전용 콜아웃(`.experience-callout`)에 실무자 현장 메모로 공식 렌더링됨.

### ② 전문성 (Expertise)
- 단순한 개요나 사전적 설명 금지.
- 구체적인 시스템 내부 구조, 정밀 수치(지연시간 ms, VRAM GB, Throughput tokens/sec), 실제 코드 스니펫, 실무 체크리스트 중심의 고밀도 기술 콘텐츠 제공.

### ③ 권위성 (Authoritativeness)
- 공신력 있는 1차 출처(arXiv 논문, 벤더 공식 테크니컬 리포트, 오픈소스 공식 문서) 인라인 링크 및 인용 명시.

### ④ 신뢰성 (Trustworthiness) — [삼각형의 중심축]
- 벤치마크 점수, 릴리즈 일자, 파라미터 수치 등의 날조(Hallucination) 절대 금지.
- `## Q&A 또 궁금한 것은?` 섹션을 통해 기술의 물리적 한계점, 실패 시나리오, 엣지 케이스를 솔직하고 투명하게 공개.

---

## 9. Verification & Build Integrity (검증 절차 및 자동화 테스트)

- 수정/작성 후 반드시 `npm run check`를 실행하여 검증:
  1. `node scripts/check-eeat.mjs`: E-E-A-T `experienceNote` 필수 여부, 더미 텍스트 여부, 고정 섹션 명칭, 태그 수(5~15개), 마침표 금지 자동 검증 (실패 시 즉시 빌드 차단)
  2. `astro check`: TypeScript 및 Astro 컴포넌트 타입 검증
  3. `astro build`: 전체 정적 사이트 컴파일
  4. `pagefind --site dist`: 다국어 검색 인덱싱
  5. `node scripts/check-links.mjs`: 생성된 모든 HTML 페이지 간 내부 링크 무결성 전수 검사
- In Windows restricted environments, set `ASTRO_TELEMETRY_DISABLED=1` if telemetry prompts fail.
- All checks must pass with **0 errors and 0 broken links** before committing.
