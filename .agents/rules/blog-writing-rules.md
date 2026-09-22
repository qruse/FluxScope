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
- **E-E-A-T & Mandatory Experience Comment**:
  - AI MUST ask the user for a 1–2 sentence firsthand experience comment before drafting. Never draft/publish without it.
  - Frontmatter must include `experienceNote: string` (min 15 chars), rendered in `.experience-callout`.
- **Verification**: `npm run check` automatically executes `node scripts/check-eeat.mjs` first, failing if experience notes or layout rules are violated. Must pass with 0 errors and 0 broken links.
