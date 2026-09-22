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

### ③ Pre-Q&A Section (Fixed): 커뮤니티 반응 / Community Reactions
- **Korean**: `## 커뮤니티 반응`
- **English**: `## Community Reactions`
- **Rule**:
  - Summarize authentic developer discussions, skeptical critiques, real-world deployment feedback, or common gotchas (investigating discussions from developer communities such as Reddit r/MachineLearning, r/LocalLLaMA, Hacker News, etc.).
  - **STRICT PROHIBITION (플랫폼 명칭 노출 절대 금지)**: **NEVER** mention the platform name "Reddit" (or other specific platform brand names) anywhere in the heading or the content text ("목차나 정보에 Reddit이라고 하지는 말고"). Instead, neutrally frame observations as "실무 엔지니어 커뮤니티", "현장 개발자 반응", "오픈소스 포럼 시각" or "Practitioner Community", "Developer Discussions", "Field Engineers".
  - Follow 개조식 + 음슴체 (Korean) / Executive memo (English), with zero trailing periods.

### ④ Bottom Section (Fixed): Q&A 또 궁금한 것은? / Q&A (Field Notes)
- **Korean**: `## Q&A 또 궁금한 것은?`
- **English**: `## Q&A (Field Notes)`
- **Rule**: Concise Q&A bullet format addressing real-world edge cases, practical hurdles, or hardware constraints.

### ⑤ No Trailing Footers / Disclaimers (꼬리말 절대 금지):
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

## 5. Image Classification & Visual Assets Policy (이미지 5대 유형 및 시각화 규칙)

All images in articles must strictly belong to one of the **5 approved types**. Meaningless, glossy, generic AI-generated illustrations (3D floating orbs, cyberpunk neon fluff, DALL-E style abstract art) are strictly forbidden ("AI 티나는 일러스트 금지"). Every article does not need to include all 5 types; agents should select the most appropriate visual type(s) based on the technical narrative:

### ① Type 1: Sourced Research Images (가져온 이미지 / 자료 조사 이미지)
- **Definition**: Primary figures, architectural diagrams, model cards, benchmark plots, or system schematics directly extracted from official papers (arXiv), documentation, or authoritative vendor announcements.
- **Mandatory Attribution Format (출처 표기 표준 규격)**:
  - Immediately below the image tag, an italicized source link MUST be placed in this exact format:
    - **Korean**: `*출처: [기관/저자명](공식URL) — 논문 또는 기술 리포트 제목*`
    - **English**: `*Source: [Author/Org](OfficialURL) — Paper or Technical Report Title*`
  - Example: `*출처: [Columbia AI Robotics Lab](https://diffusion-policy.cs.columbia.edu/) — Diffusion Policy Technical Report*`
- **Technical In-text Citations**:
  - All empirical figures, benchmarks, or architectures must have inline markdown links to official primary sources: `...벤치마크 달성 ([arXiv:2303.04137](https://arxiv.org/abs/2303.04137))`

### ② Type 2: AI-Generated Hand-Drawn Sketch (사람이 직접 그린 듯한 스케치 설명 이미지)
- **Definition**: Explanatory visuals generated via image AI designed to look like rough, human hand-drawn sketches (whiteboard marker sketches, notebook pen drawings, Excalidraw / XKCD informal diagrams).
- **Prompting Guideline**: Prompt the image generator with keywords such as *"rough hand-drawn whiteboard sketch on a clean matte white background, ink pen line art, minimalist technical diagram, felt-tip marker annotations, engineer handwritten notes style, zero 3D rendering, zero glossy neon lighting"*.
- **Use Case**: Conceptualizing high-level intuitive metaphors, physical robot manipulation concepts, or user-facing decision workflows without intimidating technical jargon.

### ③ Type 3: AI-Generated PPT-Style System Architecture (PPT 스타일 시스템 전반 설명 도식)
- **Definition**: Professional system architecture diagrams reminiscent of modern tech conference keynote slides or enterprise solution blueprints (clean vector 2D flat design, crisp rectangles, subtle drop shadows, clean modern typography, clear module hierarchy).
- **Prompting Guideline**: Prompt the image generator with keywords such as *"professional technical presentation slide diagram, modern minimalist 2D flat architecture schematic, clean organized component boxes, subtle monochrome and blue accents, high-contrast dark or light tech slide layout, crisp vector diagram, zero photorealism, zero 3D spheres"*.
- **Use Case**: Multi-layered hardware/software stacks, distributed telemetry pipelines, end-to-end SoC and NPU subsystem mapping.

### ④ Type 4: Code-Generated Algorithm Pipeline (코드로 생성한 알고리즘 설명 도식)
- **Definition**: Programmatic, stage-by-stage block flows with explicit input/output badges, state transitions, and decision nodes generated deterministically via code.
- **Generation Toolkit**: Generated using `scripts/visuals/cli.py pipeline` or Python matplotlib/PIL:
  ```bash
  python scripts/visuals/cli.py pipeline --steps "Sensors:Raw frames:INPUT;Perception:Occupancy grid:STAGE 1;Planning:MCTS:STAGE 2;Control:CAN bus:ACTUATION" --title "E2E Decision Loop" --output public/images/posts/<category>/<slug>-pipeline.png
  ```
- **Use Case**: Sequential mathematical algorithms, data processing pipelines, closed-loop feedback controllers.

### ⑤ Type 5: Code-Generated Benchmark & Metric Charts (코드로 생성한 그래프 이미지 도식)
- **Definition**: Precision data visualizations showing quantitative empirical benchmarks, inference latency, memory scaling curves, or throughput comparisons.
- **Generation Toolkit**: Generated using `scripts/visuals/cli.py bar` or `scripts/visuals/cli.py trend` matching FluxScope's color palette:
  ```bash
  python scripts/visuals/cli.py bar --labels "FP16,INT8,FP4" --values "184,105,62" --unit "ms" --title "Inference Latency" --output public/images/posts/<category>/<slug>-latency.png
  python scripts/visuals/cli.py trend --x "1k,2k,4k,8k" --series "Unoptimized:1.8,3.6,7.2,14.4;Cached:0.3,0.3,0.4,0.6" --title "KV Cache Footprint" --output public/images/posts/<category>/<slug>-scaling.png
  ```
- **Use Case**: Quantitative ablation studies, VRAM scaling laws, token throughput vs. batch size.

### ⑥ Static Preservation & Auto-Resolution Scaling Policy (정적 유지 및 자동 해상도 최적화)
- **100% Static Files**: All graphics must be saved as static image assets under `public/images/posts/<category>/`. Never add client-side dynamic chart rendering scripts or live runtime APIs.
- **Resolution Cap (800px ~ 1600px)**:
  - Article content column width is ~760px–860px (max 1200px for hero containers).
  - Maximum image width is strictly capped at **1600px** (sharp 2x Retina display without 4K payload bloat).
  - Minimum width recommended is **800px** to avoid pixelation on high-DPI screens.
- **Auto-Optimization Requirement**:
  - Whenever importing external screenshots or raw figures, agents MUST run the image optimizer to auto-resample (Lanczos) and compress:
  ```bash
  python scripts/optimize_images.py public/images/posts/<category>/<image-file> --webp
  ```
  - **Payload Target**: Each image must be under **250KB** (hard cap: 500KB). Images exceeding 500KB will trigger an immediate CI error in `scripts/check-eeat.mjs`.

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

### ① 경험 (Experience) — [필수 수취 및 본문 유기적 융합 규칙]
- **글 작성 전 사용자 질문 필수**: AI 에이전트는 글을 임의로 작성하거나 발행하기 전에, **반드시 사용자에게 해당 주제와 관련된 1~2줄의 직접 경험 코멘트(실제 사용 후기, 벤치마크 시행착오, 현장 장애 사례, 실무 노하우)를 요청하고 전달받아야 함.**
- **인위적 섹션 노출 금지 (UI 박스 렌더링 차단)**: 사용자의 경험 코멘트를 '실무자 경험 메모' 같은 인위적인 콜아웃 박스 형태로 독자에게 노출하는 행위 엄격 금지.
- **본문 전반 자연스러운 융합 (Natural Narrative Integration)**:
  - 전달받은 경험 메모는 독자 눈에 별도 박스로 보이지 않도록 하되, **글 전반(3줄 요약, 핵심 메커니즘 설명, 실무 체크리스트, 커뮤니티 반응, Q&A)에 유기적으로 깊이 녹여내어** 작성해야 함.
  - 전체 글이 교과서적 이론 나열이 아니라, "실제 프로덕션을 직접 굴려보고 장애를 겪어본 현장 엔지니어의 살아있는 목소리"로 자연스럽게 읽히도록 구성함.
  - 프런트매터 `experienceNote`는 내부 이력 보존 및 품질 검증용 메타데이터로 유지되나, 프론트엔드 UI에는 직접 노출되지 않음.

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
  6. `node scripts/check-performance.mjs`: 웹 성능 예산 및 최적화 감사 (HTML <= 100KB, CSS <= 60KB, 이미지 <= 500KB, CLS 방지 width/height 속성 강제, Base64 인라인 차단)
- In Windows restricted environments, set `ASTRO_TELEMETRY_DISABLED=1` if telemetry prompts fail.
- All checks must pass with **0 errors and 0 broken links** before committing.
