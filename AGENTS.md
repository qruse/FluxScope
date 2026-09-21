# Agent instructions for Signal & Field

- Work in English for repository files and article drafts. The site is an Astro + TypeScript static blog; do not add a backend, database, CMS, OpenAI API integration, or extra framework without a concrete requirement.
- Keep the smallest maintainable change. Use `src/content/posts/<category>/<english-slug>.md` or `.mdx` for articles. Valid categories: `ai`, `cars`, `smartfarm`.
- Before writing a factual article, inspect current primary sources. Prefer official announcements, documentation, model cards, research papers, public data, and firsthand observations. Link sources near the claims they support. Note uncertainty and practical limits. Never invent test results, quotes, dates, or citations.
- Use a direct answer or summary near the start, clear headings, useful data or comparison where available, a short FAQ when it answers likely reader questions, sources, and a review date. Avoid keyword stuffing and promotional filler.
- Fill every required frontmatter field. Use accurate `publishedAt` and `updatedAt` dates, descriptive image alt text, and image dimensions. Keep `draft: true` until content has been reviewed for accuracy and image rights.
- Do not automatically publish a draft from a scheduled task unless the task explicitly authorizes publication. A scheduled task may research, draft, and run checks without an external AI API.
- Run `npm run check` for code or content changes. On Windows in restricted environments, set `ASTRO_TELEMETRY_DISABLED=1` for the command if Astro cannot write its telemetry settings.
