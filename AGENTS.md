# Agent instructions for FluxScope

- Work in English and Korean for article drafts. The site is an Astro + TypeScript static blog; do not add a backend, database, CMS, OpenAI API integration, or extra framework without a concrete requirement.
- Keep the smallest maintainable change. Use `src/content/posts/ko/<category>/<slug>.md` for Korean posts and `src/content/posts/en/<category>/<slug>.md` for English posts. Valid categories: `agi`, `physical-ai`, `other-ai`.
- **Article Structure Standard (Fixed Sections)**:
  - **Top (Fixed)**: `## 3줄 요약` (English: `## 3-Line TL;DR`) with 3 concise bullet points.
  - **Middle (Dynamic / AI-generated)**: Intermediate headings and content generated dynamically based on the subject (e.g., core mechanisms, step-by-step checklists, architectural diagrams, code snippets, metric comparison tables).
  - **Bottom (Fixed)**: `## Q&A 또 궁금한 것은?` (English: `## Q&A (Field Notes)`) answering practical questions in concise Q&A bullet format.
- **Writing Tone & Punctuation**:
  - **Korean**: 개조식(Itemized bullet format) + 음슴체 (`~함`, `~임`, `~봄`, `~필수`, `~안 됨`). Fast, punchy, zero conversational fluff.
  - **No Trailing Periods**: Never put a trailing period (`.`) at the end of bullet points or memo sentences.
  - **English**: Corresponding executive field-note memo style with active verbs and bullet points (also omitting trailing periods on bullets).
- Before writing a factual article, inspect current primary sources. Prefer official announcements, documentation, model cards, research papers, public data, and firsthand observations. Link sources near the claims they support. Note uncertainty and practical limits. Never invent test results, quotes, dates, or citations.
- Fill every required frontmatter field. Use accurate `publishedAt` and `updatedAt` dates, descriptive image alt text, and image dimensions. Keep `draft: true` until content has been reviewed for accuracy and image rights.
- Do not automatically publish a draft from a scheduled task unless the task explicitly authorizes publication. A scheduled task may research, draft, and run checks without an external AI API.
- Run `npm run check` for code or content changes. On Windows in restricted environments, set `ASTRO_TELEMETRY_DISABLED=1` for the command if Astro cannot write its telemetry settings.
