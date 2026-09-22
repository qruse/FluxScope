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
  3. Bottom (Fixed): `## Q&A 또 궁금한 것은?` / `## Q&A (Field Notes)`.
  4. Footer: NO trailing `---` or review date footers at the end.
- **Tags**: 5 to 15 lowercase `kebab-case` tags.
- **Images (2 Types)**:
  - Type 1 (Sourced Research): Official papers/benchmarks with source citation.
  - Type 2 (Directly Generated): NO generic AI art. Must be hand-drawn sketch schematics (XKCD/Excalidraw style), algorithm pipeline schematics, or programmatic code-generated charts via `scripts/visuals/cli.py` or `scripts.visuals.charts`.
- **Verification**: Must pass `npm run check` with 0 errors and 0 broken links.
