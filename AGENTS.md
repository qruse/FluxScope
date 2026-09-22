# FluxScope Blog Writing & Development Rules (AGENTS.md)

This file contains the authoritative, non-negotiable guidelines for all AI agents writing articles, modifying content, or developing features for **FluxScope**. Every AI agent MUST read, understand, and strictly adhere to these rules before drafting or editing posts.

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
image:
  src: "/images/posts/thumbnail.png"
  alt: "Descriptive alt text for accessibility"
  width: 1200
  height: 630
draft: true # Keep true until factual and visual review is complete
---
```

---

## 8. Fact-Checking & Technical Integrity (팩트 검증 및 정확성)

- **Primary Sources First**: Ground all technical claims in official documentation, research papers (arXiv), model cards, official benchmarks, or source code.
- **Inline Citations**: Place markdown links close to the facts or claims they substantiate.
- **No Hallucinations**: Never fabricate benchmark scores, release dates, model parameter counts, or fake quotes. Explicitly acknowledge uncertainties and real-world hardware limits.

---

## 9. Verification & Build Integrity (검증 절차)

- Run `npm run check` after modifying any article, schema, or code.
- This command automatically executes:
  1. `astro check` (TypeScript and Astro type validation)
  2. `astro build` (Full static site compilation)
  3. `pagefind --site dist` (Multilingual search indexing)
  4. `node scripts/check-links.mjs` (Comprehensive internal link validation across all generated HTML pages)
- In Windows restricted environments, set `ASTRO_TELEMETRY_DISABLED=1` if telemetry prompts fail.
- All checks must pass with **0 errors and 0 broken links** before committing.
