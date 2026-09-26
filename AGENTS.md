# HSL's Blog Blog Writing & Development Rules (AGENTS.md)

This file contains the authoritative, non-negotiable guidelines for all AI agents writing articles, modifying content, or developing features for **HSL's Blog**. Every AI agent MUST read, understand, and strictly adhere to these rules before drafting or editing posts.

---

## 1. Project & Architecture Principles (프로젝트 기본 원칙 및 블로그 컨셉)

- **Core Concept & Identity (블로그 핵심 컨셉과 정체성)**:
  - **관심 분야 탐색 & 능동적 정리**: 작성자가 평소 관심 있는 기술 분야(AI, 전기차/모빌리티, 플래그십 IT 기기 등)의 최신 뉴스, 연구, 제품 소식을 깊이 파헤치고 찾아보는 과정에서 작성됨.
  - **이중 목적 ("나도 보고, 사람들도 볼 수 있게")**:
    1. **나를 위한 실무 아카이브**: 마케팅 거품을 걷어내고 정밀한 하드웨어 수치, 시스템 내부 구조, 실패 시나리오, 엣지 케이스를 압축 정리하여 작성자 본인이 두고두고 다시 찾아볼 수 있는 실전 기술 노트 역할을 함.
    2. **동료 엔지니어/독자를 위한 고밀도 공유**: 같은 주제에 관심을 가진 다른 개발자와 테크 매니아들도 함께 읽고 뻔한 마케팅 쇼에 속지 않고 진짜 기술적 본질을 얻어갈 수 있도록 공유함.
  - 따라서 단순 기사 번역이나 피상적인 홍보성 소개글은 절대 지양하며, "내가 직접 납득하고 써먹으려고 파고든 진짜 엔지니어의 필드 노트" 수준의 정보 밀도를 유지해야 함.
- **Publishing Architecture**: 기존 글과 사이트 자산은 Astro 정적 빌드로 제공한다. 새 글은 Cloudflare Worker 게시 API와 D1에 저장하여 글마다 Git 커밋이나 재빌드를 하지 않는다. OpenAI API 런타임 호출이나 불필요한 프레임워크는 추가하지 않는다.
- **Language Pairing (다국어 쌍 작성)**: Every article must be published in both Korean and English simultaneously:
  - Korean path: `src/content/posts/ko/<category>/<slug>.md`
  - English path: `src/content/posts/en/<category>/<slug>.md`
- **Category Hierarchy (대분류-중분류 체계)**:
  - **대분류 1. AI**:
    - `agi`: AGI, frontier models, reasoning architectures, prompt engineering, LLM-ops, evaluation.
    - `physical-ai`: Autonomous driving, robotics, humanoid, VLA foundation models, real-world physics.
    - `other-ai`: On-device AI, small language models, edge compute, speech/audio multimodality, smart agriculture, IoT telemetry.
  - **대분류 2. 모빌리티 (`mobility`)**: EV powertrain, 800V architecture, battery thermal management, SDV zonal architecture, regenerative braking, automotive ethernet.
  - **대분류 3. IT기기 (`it-devices`)**: Flagship smartphones (Galaxy, iPhone), AP silicon throttling, vapor chamber cooling, foldable hinges, UTG, mobile LTPO displays.
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

### ③ Community Reactions: 커뮤니티 반응 / Community Reactions (기본 포함)
- **Korean**: `## 커뮤니티 반응`
- **English**: `## Community Reactions`
- 실제 사용 후기나 유의미한 Reddit 토론을 확인해 기본적으로 포함함. 관련 반응을 충분히 찾아도 없을 때만 생략함
- 각 반응이 나온 **원문 게시물이나 댓글에 직접 링크**함. 서로 다른 사람의 말을 하나의 의견처럼 합치지 않고, 경험담을 전체 여론이나 객관적 측정치로 일반화하지 않음
- 다른 제품·세대의 반응을 신제품 후기처럼 옮기거나, 댓글에 없는 사건과 수치를 만들어 넣지 않음
- 위치는 하단 Q&A 바로 앞. 짧은 항목으로 쓰고 링크는 해당 주장 끝에 자연스럽게 붙임

### 관련 이전 글 링크
- 주제상 도움이 되는 **이미 공개된** 이전 글이 있으면 본문 설명 중 1~2개를 자연스럽게 연결하고, 왜 읽을 만한지 한마디 덧붙임
- 같은 언어의 실제 공개 URL을 확인한 뒤 연결함. 보관 중인 미발행 글, 삭제된 주소, 자기 글, 관련 없는 글은 연결하지 않음
- 관련 이전 글이 없다면 링크를 억지로 만들지 않음. 기계적인 '함께 읽기' 목록보다 문맥 속 링크를 우선함

### ④ Bottom Section (Fixed): Q&A 또 궁금한 것은? / Q&A (Field Notes)
- **Korean**: `## Q&A 또 궁금한 것은?`
- **English**: `## Q&A (Field Notes)`
- **Rule**: Concise Q&A bullet format addressing real-world edge cases, practical hurdles, or hardware constraints.

### ⑤ No Trailing Footers / Disclaimers (꼬리말 절대 금지):
- **NEVER** append horizontal rules (`---`) at the very end of the markdown body.
- **NEVER** append review date disclaimers (e.g., `*2026년 9월 기준...*` or `*Last reviewed: ...*`).
- **Reason**: The article header already renders author, publication date, and update date. The article layout automatically appends the tag container (`.article-end`) with its own top border. Adding markdown footers creates an ugly double border and redundant text.

---

## 3. Writing Tone & Voice (쉽고 자연스러운 글)

실제로 관심 있는 주제를 찾아보고 주변 사람에게 설명하듯 씀. 정확한 수치와 한계는 남기되, 읽는 사람이 한 번에 이해할 수 있는 말부터 고름. 웃긴 문장이 저절로 나오면 써도 되지만 모든 항목에 농담이나 냉소를 끼워 넣지 않음.

### Korean (한국어)
- **짧은 개조식 중심**: 한 항목에 한 가지 생각만 담고, 필요한 설명은 쉬운 일상어로 덧붙임. 음슴체를 억지로 반복하지 않고 자연스러운 문장도 허용함. 같은 문장 틀과 결론을 계속 복제하지 않음
- **제목**: 대상과 실제 질문을 쉬운 말로 씀. 검색할 모델·제품 이름은 앞쪽에 두되 콜론, 과장, 억지 반전은 강요하지 않음
- **요약문**: 핵심 수치, 그 수치가 뜻하는 바, 독자가 확인할 일을 짧게 씀. '화려한', '반가운 가격표', '영수증', '함정' 같은 관용적 AI 문구를 습관적으로 쓰지 않음
- **수치는 풀어서 설명**: '안정성 62.8%'라고만 하지 말고 무엇을 반복 측정한 값인지 말함. 단순 계산과 실제 사용 결과를 구분함
- **목소리**: 담백한 반말·음슴체를 자연스럽게 섞되 존댓말 안내문이나 과장된 전문가 페르소나로 바꾸지 않음

### English (영어)
- Use short, natural sentences that sound like a person sharing what they found, not an executive memo
- Put the product or topic near the start of the title, followed by a plain question or useful finding; no mandatory punchline
- Explain the numbers in everyday terms, keep caveats close to claims, and avoid generic introductory fluff

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

### ② Type 2: AI-Generated Hand-Drawn Notebook Notes (실제 엔지니어 손글씨 노트 필기 스케치)
- **Definition**: Explanatory visuals generated via image AI designed to look like an authentic, tangible photograph of real-world handwritten notes and sketches inside an engineer's physical paper notebook. **(화이트보드 형식 배제, 실제 엔지니어링 종이 노트 필기 스타일로 단일 표준화)**
- **Authentic Human Hand-drawn Feel (자연스러운 사람 손맛 연출)**:
  - 자 대고 그린 듯 너무 기계적으로 반듯하거나 컴퓨터 폰트처럼 매끄러운 디지털 그래픽 절대 금지 ("사람이 그린거같지가 않고 너무 깔끔하면 안 됨").
  - 실제 엔지니어가 모눈종이(Grid paper)나 방안지 스프링 노트에 볼펜, 젤펜, 형광펜(Highlighter)으로 직접 손으로 끄적이며 정리한 듯한 자연스러운 선, 필압의 굵기 변화, 살짝 비뚤어진 화살표와 박스, 진짜 사람의 손글씨(Handwriting) 질감을 생생하게 살림.
  - 따뜻한 나무 책상 위에 펼쳐진 실제 스케치 노트와 곁에 놓인 펜을 탑다운(Top-down) 또는 자연스러운 각도로 촬영한 아날로그 현장감 연출.
- **Simplicity & Legibility (초간결 3단계 구조 — 3초 이해 규칙)**:
  - 손맛을 살리되 지저분하거나 수식·설명문이 빼곡하여 어지러워지는 복잡도 철저 금지 ("이미지가 너무 복잡해선 안 됨").
  - 3~4단계 이내의 굵직한 핵심 블록, 명확한 손그림 화살표, 큼직하고 읽기 쉬운 손글씨 키워드 위주로 구성하여 모바일 화면에서도 3초 만에 핵심 시스템 메커니즘을 바로 이해할 수 있어야 함.
- **Prompting Guideline**: Prompt the image generator with keywords such as:
  - *"A realistic photograph taken from above of an open spiral engineering grid notebook on a wooden desk with a black gel pen beside it. A human engineer has hand-drawn a simple, intuitive 3-stage sketch explaining [Topic] using a black pen and subtle red and blue highlighter accents. Organic human hand-drawn lines, natural slight hand tremors and imperfect sketches, authentic legible human handwriting, large keywords, simple arrows: [Stage 1] -> [Stage 2] -> [Stage 3]. Very simple and clean 3-step diagram, easy to understand in 3 seconds, realistic paper texture, soft natural room lighting, zero digital graphics, zero complex equations."*
- **Use Case**: Conceptualizing high-level intuitive mechanisms, model workflows, hardware physical loops, or architectural decision flows.

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
- **Generation Toolkit**: Generated using `scripts/visuals/cli.py bar` or `scripts/visuals/cli.py trend` matching HSL's Blog's color palette:
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
  - **Payload Target**: Each image must be under **250KB** (hard cap: 500KB). Images exceeding 500KB will trigger an immediate CI error in `scripts/check-eeat.mjs`.

### ⑦ Image Count & Representative Thumbnail Policy (최소 2장 이상 및 대표 이미지 썸네일 규격)
- **최소 수량 원칙 (Minimum 2 Images Rule)**: 모든 아티클은 반드시 **최소 2장 이상의 기술 시각 자료(Technical Visuals)**를 포함해야 함 (`images.length >= 2`).
- **대표 썸네일 선정 의무 (Representative Thumbnail Selection)**:
  - 아티클에 포함된 이미지 중 해당 글의 핵심 기술 주제나 시스템 메커니즘을 가장 직관적이고 적절하게 대변하는 대표 도식(시스템 아키텍처 다이어그램, 알고리즘 파이프라인, 핵심 벤치마크 차트 등)을 **반드시 프런트매터 썸네일(`image.src`)로 지정**해야 함.
  - 무성의한 범용 플레이스홀더 이미지(예: `/images/other-ai.png`, `/images/regenerative-braking.png` 등)를 여러 글에서 중복 재사용하는 행위는 엄격히 금지함.
  - 썸네일로 지정된 대표 이미지 외에도 본문 전반에 최소 1장 이상의 상세 도식/차트/스케치를 추가 배치하여 독자의 기술적 이해도를 극대화해야 함.

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
author: "HSL"
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

HSL's Blog의 모든 아티클은 구글 E-E-A-T(Experience, Expertise, Authoritativeness, Trustworthiness) 4대 품질 요소를 엄격히 반영해야 함:

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
