---
description: Authoritative writing, styling, and verification rules for FluxScope blog articles
always_on: true
---

# FluxScope Blog Writing Rules

See `AGENTS.md` and `GEMINI.md` at the project root for the full guidelines.

## Quick Summary for Writers:
- **Language**: Always write pairs in Korean (`ko/<category>/<slug>.md`) and English (`en/<category>/<slug>.md`).
- **Tone**:
  - Korean: 개조식(Itemized bullet format) + 음슴체 (`~함`, `~임`, `~봄`, `~필수`, `~안 됨`). Zero fluff.
  - English: Executive tech memo with active verbs and concise bullets.
- **Punctuation**: NO trailing periods (`.`) on bullet points or memo sentences.
- **Structure**:
  1. Top (Fixed): `## 3줄 요약` / `## 3-Line TL;DR` (3 bullet points).
  2. Middle (Dynamic): AI-generated technical breakdown, checklists, tables, code snippets.
  3. Pre-Q&A (Fixed): `## 커뮤니티 반응` / `## Community Reactions` (Summarize real developer discussions/gotchas from forums like Reddit r/MachineLearning, but NEVER use the name 'Reddit' in heading or body; frame neutrally as "실무 엔지니어 커뮤니티" / "Developer Community").
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
  - Frontmatter must include `experienceNote: string` (min 15 chars), rendered in `.experience-callout`.
- **Verification**: `npm run check` executes `check-eeat.mjs` $\to$ `astro check` $\to$ `astro build` $\to$ `pagefind` $\to$ `check-links` $\to$ `check-performance.mjs` (HTML $\le$ 100KB, CSS $\le$ 60KB, Image $\le$ 500KB, CLS attributes). Must pass with 0 errors.
