# FluxScope editorial and development contract

This is the single authoritative project rulebook. Read it completely before editing or publishing. `GEMINI.md` only points here; never maintain a second copy. Explicit current user instructions take precedence. Do not guess away a conflict: preserve unaffected work and identify the exact unresolved point.

## 1. Start here — execute in order

1. Read this file and `editorial/QUALITY.md`
2. Read the relevant reference article listed in `editorial/QUALITY.md`, both languages, and its review record
3. Read the current live article before editing; a D1 article can be newer than Git
4. Write a one-sentence reader question and conclusion, then collect sources **before** drafting
5. Create `editorial/reviews/<slug>.md` using the evidence and review template in `editorial/QUALITY.md`
6. Draft English as the primary edition, verify every material claim, then adapt naturally into Korean with identical facts and qualifications
7. Run the automatic checks, then the manual rubric — a passing build does not certify facts or good prose
8. Publish by the existing storage route, verify both live URLs, images, category listings and language switch, then report exactly what is live

Do not stop after writing advice when asked to edit. Do not report an API response, commit, build, or preview as a verified production deployment.

## 2. Identity and hard requirements

- The repository is FluxScope; the displayed brand remains **HSL의 블로그 / HSL's Blog** unless the user asks to rename it
- Purpose: useful notes by someone curious about AI, cars and devices, for readers deciding what to use, buy or investigate
- Categories are **only** `ai`, `mobility`, `it-devices` — never add AI subcategories
- Publish Korean and English counterparts with the same slug, category, numbers, scope, images and factual confidence
- Preserve existing slugs and original publication dates when editing; advance the update date. Store API timestamps in UTC and display dates in Asia/Seoul consistently
- Preserve the user's actual opinion, even when critical. Distinguish that opinion from measured evidence
- Smallest maintainable change; no unnecessary framework, client chart runtime, or model API at reading time

## 3. Evidence before confidence

Classify material claims in the internal review record:

| Kind | Required evidence | Wording in the article |
| --- | --- | --- |
| Official specification or price | Actual official page/PDF, date, model, market, trim, tax/unit basis | Attribute to the maker; keep qualifications nearby |
| Third-party measurement | Original tester's report, workload, device, settings that are available | Name the test and tester; do not present it as our measurement |
| Our calculation | Verified inputs, formula, rounding and exclusions | Say calculated/illustrative; do not call it a benchmark |
| User experience/opinion | User's actual supplied comment or an existing documented experience note | Keep its scope; do not add tasks, duration, ownership or test results |
| Community anecdote | Read the actual post/comment; record its exact URL and supported paraphrase internally | One person's report or this thread; never “everyone agrees” |
| Editorial proposal | Reasoning connected to verified evidence | “I would try/check…” rather than “proved best” |

- A search snippet, model memory, plausible URL or another AI's assertion is not verification
- When a core source is inaccessible, find an equivalent original source. If still unverifiable, remove/weaken the claim or keep the article unpublished and identify the missing evidence
- An existing post is a style reference, **not** a source for its numbers
- `%` is a relative ratio; `%p` / percentage points is a difference between percentages. Keep denominators and units explicit
- Never multiply measurements from different tests to invent a real-world result
- Use direct primary links beside important factual claims or immediately below their table/chart. Original measurement publishers count as primary sources for their own tests
- Related internal links: add 1–2 only when an already published, same-language post directly helps answer the reader's question; verify URL, explain relevance, no forced cross-category links or self-links

## 4. Voice — cynical and humorous, without bargaining away accuracy

The defining voice is **cynical AND humorous**, not optional seasoning. Question marketing promises, inconvenient bundles and hidden work; make the reader smile at a specific absurdity. A neutral specification digest fails the voice gate. Use several well-placed dry observations across the article, not a joke after every number. Aim at sales tactics and workflow friction, never at ordinary buyers or unsupported motives. State the useful fact before twisting the knife.

Korean is primarily short bullets with natural 반말/음슴체. One point per bullet; normally one or two short sentences. Do not force all sentences into the same ending. English is natural concise field notes, not literal Korean syntax.

- Put the model/product near the start of the title; state a real question or supported judgment
- The description gives the actual angle and substance, not “a comprehensive analysis”
- Explain what a number measures and why it changes the decision. A table full of unexplained numbers is not depth
- Keep humor rooted in a verified inconvenience. Do not add invented war stories or pretend to have tested the product
- Avoid stock drama: “판도를 바꾼다”, “혁신의 이면”, “마케팅의 민낯”, “영수증이 말해준다”, “포기하기 어렵다” without stating precisely why
- Do not turn every bullet into `fact — caveat`; mix a clear assertion, a useful table and a short explanation
- No trailing period on memo/bullet lines, including English. Decimal points, domains and punctuation inside a sentence are allowed
- Do not pad to a word count, repeat the conclusion in each section, or add code/architecture just to look technical

## 5. Required article shape

1. First H2: `## 3줄 요약` / `## 3-Line TL;DR`
   - Exactly three top-level bullets, no nested summary list
   - Answer the reader question, state the most important evidence/limit, explain the practical implication
2. Topic-specific middle
   - Evidence → explanation → decision, normally 2–4 sections; more only when each adds useful substance
   - At least one useful comparison table or concrete decision/check procedure
   - Each major section must add information rather than rephrase the summary
3. `## 커뮤니티 반응` / `## Community Reactions`
   - Immediately before Q&A; normally 2–4 concise reactions
   - Include when meaningful verified reactions exist; differing views when the sources actually contain them, never invent artificial balance
   - **No links in this section**. Store exact source URLs and checked paraphrases in the internal review record
   - Omit only after a genuine search finds no usable reactions; record queries, date and reason internally
4. Final H2: `## Q&A 또 궁금한 것은?` / `## Q&A (Field Notes)`
   - 3–5 real reader questions, each followed by a concise nested answer
   - Address mistakes, limits or choices; do not merely repeat three summary bullets as questions
5. End after the final answer. No trailing separator, review-date footer, generic disclaimer, or extra conclusion

## 6. Experience must remain honest

- Reuse an already supplied relevant experience/opinion; do not ask for the same comment again
- For a new personal review without experience, ask once for the relevant comment. Continue source research and a factual draft while awaiting it
- If experience is unavailable, use a clearly scoped analysis of published material; never manufacture a hands-on review
- `experienceNote` is optional internal metadata, not a requirement to invent experience. If present, it must reflect a real supplied comment
- Weave the experience where relevant, usually once or twice. Do not copy it into the summary, every section, community reactions and Q&A
- A preference about finished output does not establish measured success rates, task-specific superiority, or hours saved

## 7. Images

Hard contract: **2–10 distinct images total per article, including exactly one generated sketch thumbnail**. Both language editions share the same assets. **All visible image text is English; all monetary labels use USD**. Alt text and surrounding explanations may follow the article language.

Before drafting, plan visuals using the five supported types. Select actively according to the information gap; do not force all five into every post.

| `visualTypes` value | Use when | Production method / rejection condition |
| --- | --- | --- |
| `source` | The reader needs to see an actual product, UI, or primary document | Obtain an authorized/reusable primary image or own screenshot; source credit and link below; never generate a fake screenshot |
| `sketch` | Explain the article's central tension at a glance | Image generation, exactly once as thumbnail; rough notebook style |
| `architecture` | Components or relationships need explaining | Clear presentation-style diagram rendered with code/vector tools; verified labels and connections |
| `pipeline` | Order, acceptance, retry or escalation is the point | Code-rendered process diagram; label decisions and stopping rules |
| `chart` | Quantities or comparisons change the reader's decision | Code-rendered chart from verified data; units, zero-baseline where appropriate, date and scope |

The thumbnail must contain the product/model AND 2–4 core facts or a meaningful relationship. Product name plus decorative doodles is insufficient. Short fact callouts are permitted; precise plotted charts belong in code. Label hypothetical/converted information clearly. Plan each body's visual job in the review record; remove redundant decoration.

Declare `visualTypes` in static frontmatter and API payloads, ordered **thumbnail first, then inline body images in reading order**. Length must match the image count; first and only sketch must be index 0. Use inline Markdown images with distinct URLs; raw HTML/reference-style images are rejected to keep validation unambiguous. These types are source/preflight metadata; they are not displayed publicly or persisted in D1.


- Exactly **one rough paper-notebook sketch per topic**, always the thumbnail (`image.src` for static, `imageUrl` for API)
- Use the same sketch for both languages. Never repeat it in the body
- Preserve the approved information density; lower polish only slightly (roughly 10–15%): uneven baselines, wobbly shapes and occasional retraced lines. Keep every key word and number legible. Never blur, heavily distress or remove facts to imitate amateur work
- Look: an ordinary phone photograph of cheap grid paper, two or three crude pen doodles, uneven lines, short legible words and plenty of empty space
- Avoid polished card layouts, symmetric infographic panels, studio props, beautiful calligraphy, glossy 3D art and generic AI decoration
- The sketch explains a concept, not unverified product internals or measurements. Add a nearby qualification if it could be mistaken for a real device drawing or test
- Within the total cap of 10, include at least **one additional distinct useful body visual**: original sourced figure, deterministic diagram or data chart
- Exact metrics, labels and architecture must use code/vector/chart tools, not image generation. Generate raster art only for the sketch or illustration that benefits from it
- Read each image visually. Verify title, units, series, labels and meaning against the text. Reusing a wrong chart is a factual error
- Width 800–1600 px recommended, hard maximum 1600 px; target <250 KiB, hard cap 500 KiB per image
- Static images go in `public/images/posts/<category>/`; API images normally upload through `/api/images` to `/media/`; reference samples may reuse deployed static assets. Existing legacy asset paths may remain to avoid broken links
- Supply descriptive alt text; static frontmatter dimensions must match the actual file
- For an externally sourced figure, place `*출처: [기관](URL) — 자료명*` / `*Source: [Organization](URL) — title*` immediately below it
- An API's 5 MB upload ceiling is a transport limit, **not** editorial permission for a 5 MB image

## 8. Currency and publication

- English is the master edition; Korean is fully supported, with identical evidence and qualifications
- Prices lead with **USD ($)** in both editions. **Use the official US price first**, matched to model, storage/trim, date, tax basis and purchase conditions
- Only if no official US price is available, convert the verified Korean launch price to USD. Add a small nearby note: “Korean launch price converted; approximate USD; FX rate and date.” Never present that fallback as US MSRP
- Use one frozen, linked FX rate per article; retain original amounts in the internal evidence record. Convert totals from unrounded source amounts, then round. State material exclusions. No repeated conversion boilerplate in every bullet
- Never attach Korean trim/option costs to a US configuration. If US pricing exists but a Korean-specific option has no equivalent, identify the Korean-market scope and conversion explicitly
- API token prices already quoted in USD need no FX conversion. Discounts, trade-ins and financing are not the official cash starting price

## 9. Storage and publication

- Existing static articles: `src/content/posts/{ko,en}/<category>/<slug>.md`; changes go through Git and the connected Cloudflare build
- Existing D1/API articles: modify via authenticated `POST /api/posts` with `If-Match: update`; do not duplicate them under `src/content/posts`
- `editorial/api-posts/*.json` stores versioned reference payloads outside the static content tree. It does **not** automatically synchronize or publish D1
- New ordinary API posts do not require rebuilding the website. Keep local source/evidence; only the chosen reference samples require Git-versioned payloads
- Never write a static article to D1 just to avoid waiting for the build; it would create duplicate listings and ambiguous ownership
- Credentials stay in ignored local configuration or secrets; never include them in Git, examples, logs or review notes
- Keep both language payloads ready and validated before publishing either. Current API writes one language at a time; if the second fails, retry it or restore the first from its pre-edit backup. Do not claim atomic bilingual publication
- Tags: 5–15 distinct lowercase English kebab-case keywords
- Required static fields: `title`, `description` (50–180 characters), `category`, `lang`, `publishedAt`, `updatedAt`, `author`, `image` with src/alt/width/height, `draft`, `tags`, `visualTypes`
- Required API fields: `lang`, `slug`, `category`, `title`, `description` (50–180 characters), `body`, `tags`, `imageUrl`, `imageAlt`, `visualTypes`; preserve `publishedAt` on update
- New static drafts stay `draft: true` until reviewed. API has no draft mode; never POST unfinished work

## 10. Verification and completion

Run `npm run check` before committing. It runs the editorial regression tests, shared article checks (including API reference payloads), Astro type checking, static build, Pagefind indexing, internal link checks and performance budgets.

The API applies the same structural validator to authenticated post writes and returns actionable `422` details for editorial violations. The validator cannot verify sources, humor, conceptual image quality, translations or factual truth — the manual rubric remains mandatory.

Manual release checks:
- All core claims traced to evidence; math recomputed; factual/opinion boundaries clear
- Korean/English numbers, units, alternatives and caveats agree
- At 390px and desktop width: readable headings, tables and images; no page-wide overflow
- Both live article URLs, thumbnail/body images, language switch, home/category listing and relevant search/feed entries work
- Existing URL and publication date preserved; update date visible
- Record checks actually performed and any limitations in the review record

If a check fails, fix the article or real validation bug. Do not disable a gate, exclude a troublesome reference, invent evidence, or label unfinished work as published merely to finish the task.
