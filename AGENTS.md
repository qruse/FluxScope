# FluxScope editorial and development contract

This is the single authoritative project rulebook. Read it completely before editing or publishing. `GEMINI.md` only points here; never maintain a second copy. Explicit current user instructions take precedence. Do not guess away a conflict: preserve unaffected work and identify the exact unresolved point.

## 1. Start here — execute in order

1. Read this file and `editorial/QUALITY.md`
2. Read the relevant reference article listed in `editorial/QUALITY.md`, both languages, and its review record
3. Read the current live article before editing (`GET /api/posts?lang=&slug=`); D1 is the source of truth
4. Write a one-sentence reader question and conclusion, then collect sources **before** drafting
5. Create `editorial/reviews/<slug>.md` using the evidence and review template in `editorial/QUALITY.md`
6. Draft English as the primary edition, verify every material claim, then adapt naturally into Korean with identical facts and qualifications
7. Run the automatic checks, then the manual rubric — a passing build does not certify facts or good prose
8. Publish with `scripts/publish-post.mjs` (no build or merge), verify both live URLs, images, category listings and language switch, then report exactly what is live

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

The defining voice is **cynical AND humorous**, not optional seasoning. Question marketing promises, inconvenient bundles and hidden work; make the reader smile at a specific absurdity. A neutral specification digest fails the voice gate. Use several well-placed dry observations across the article, not a joke after every number. Aim at sales tactics and workflow friction, never at ordinary buyers or unsupported motives. State the useful fact before twisting the knife. **Natural beats clever:** a plain, correct sentence always beats a forced joke, metaphor or twist. If a line needs a second read to land, write it plainly; a section with no joke is fine, a forced one is not.

Korean is primarily short bullets with natural 반말/음슴체. **One point, one short sentence per bullet** — split a second sentence into its own bullet or cut it; keep each bullet readable in one breath. Do not force all sentences into the same ending. English bullets follow the same one-sentence rhythm as natural concise field notes, not literal Korean syntax.

- Titles are headlines, not memo lines. Put the model/product near the start, then a sharp hook: a pointed question, a blunt contrast, a decisive number or a verdict some readers will dispute. The article must pay the hook off with evidence; no bait the body does not answer, no implied test results or defects
- Korean titles do **not** use 음슴체; write them as natural headline phrasing (question, contrast, noun ending). Wrong: `출시 베팅만 벌써 네 번 틀림`; right: `출시 베팅은 벌써 4연패`. Korean descriptions and narrative headings still use natural 음슴체 (e.g. `검수는 내 몫임`, `예산도 커짐`). English titles use punchy headline phrasing, not artificial Korean grammar
- Rebuild a confused draft around ONE reader question before polishing sentences. Every section must advance that question; delete tangents, repeated caveats and jokes that need their own explanation
- Humor follows the concrete fact. Prefer 2–4 restrained observations over an analogy in every bullet; never let sarcasm imply unsupported test results or product defects
- The description gives the actual angle and substance, not “a comprehensive analysis”
- Explain what a number measures and why it changes the decision. A table full of unexplained numbers is not depth
- Keep humor rooted in a verified inconvenience. Do not add invented war stories or pretend to have tested the product
- Avoid stock drama: “판도를 바꾼다”, “혁신의 이면”, “마케팅의 민낯”, “영수증이 말해준다”, “포기하기 어렵다” without stating precisely why
- Do not turn every bullet into `fact — caveat`; mix a clear assertion, a useful table and a short explanation
- No trailing period on memo/bullet lines, including English. Decimal points, domains and punctuation inside a sentence are allowed
- Do not pad to a word count, repeat the conclusion in each section, or add code/architecture just to look technical

Line-by-line cut pass (do it on both languages before publishing; delete every bullet that fails):
- Every bullet carries a new fact, a decision, or a joke about the fact directly above it. If deleting it loses nothing, delete it
- Cut meta lines about the article's own method or honesty ("still better than calling screenshots science", "a reason to investigate, not to skip investigating"); a caveat is stated once, where it applies
- Cut strawman comparisons and abstract punchlines that need a second read ("the paperwork gets creative"). A joke must be understood in one pass without its own explanation
- Humor comes from a concrete number or contrast in the evidence: 60% cheaper tokens vs 7× the output, "none of it was requested", "the calendar moved faster than the Roadster". Aim for 1–2 such lines per section, not a quip after every bullet

Sound like a person, not a model (do it on both languages after the cut pass; these are the patterns that made published drafts read as machine-written):
- Write the Korean from the facts, not by translating the English sentences. Then read the Korean alone, without the English beside it, and rewrite any line a Korean reader would stumble on or would not say out loud to a friend
- Korean translationese to rewrite: `~라고 못 박음`, `대놓고`, `~인 셈임`, `~할 판임`, `진짜 얘깃거리는`, `~까지 들고 옴`, `사실상 ~임` used as a punchline, objects acting like people (`서류가 정함`, `싼 모델이 더 먹겠다고 공지함`), mirrored punchlines (`설명은 살아남았고 Terra는 못 살아남음`), and verdicts about sources (`만장일치 퇴장 선언은 아니었음`, `한쪽의 전승으로 끝난 얘기는 아님`)
- Korean structure: no English colon reveals (`사다리였음: 맨 위…`), no comma-spliced verdicts (`아님, 에세이가 말한 건…`), no `X 대 Y` score lists where `X점으로 Y보다 높음` or a table reads better. Vary the endings (`-음/-임/-함/-됨`, noun endings); do not end every bullet in `임`. Quote translated English only when the exact wording matters
- English tells to rewrite: more than one `not X, but Y` / `X, not Y` per article; colon reveals (`My take:`, `The catch:`); bullets opening with `So`; personified abstractions (`the paperwork decides`, `the cheap model politely announces`); `the real story`, `a useful dissent`, `worth noting`, `quietly`; meta tails judging a source (`a sarcastic interpretation`, `so even that thread was not unanimous`)
- Korean calques to replace with everyday words: `끝낸 작업당 비용` / `완료 작업당 비용` → `작업 하나당 비용`, `청구서에선 질 수 있음` → `실제 비용은 더 들 수 있음`, `표시가격` → `정가`. Metaphor punchlines that strain (`다른 건 신청서 통과 여부뿐`, `태양이 별 아래로 내려간 것도 모자라`, `할인가 옆에 조건이 붙어 있으니`, `브레이크를 얼마나 밟을지`) go; state the fact instead
- A joke must work in the language it is written in. If wordplay only works in English (sun/star, Minor/minor), rewrite it for Korean or drop it there
- Logic check: every `so` / `그래서` / `그러니` must follow from the line above. Delete inferences that only sound clever (`only worth limiting if it happens`, `a leak of the price list`) and unsupported feelings (`기다림이 더 길게 느껴짐`)
- Keep a section to about ten bullets. Past that, merge, split into a table, or cut

Section headings (H2):
- A heading is the section's point in natural spoken phrasing: a specific claim with a number, a blunt contrast, or the reader's question (e.g. `토큰은 60% 싼데 청구서는 두 배`, `그래서 뭘 누구한테 시킴?`, `1.9초는 2017년산 숫자임`)
- No translated-sounding or two-clause memo headings (`GPU는 빨라졌고, 내 게임이 알아채는지는 별개임`), no generic labels (`분석`, `결론`, `교체 판단은 지금 폰에서 시작함`)
- Read the headings alone in order: they should tell the story of the article

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
   - **Link each reaction to the original post or comment** at the end of its bullet, e.g. `([Reddit](https://www.reddit.com/r/<sub>/comments/<id>/<slug>/))`. Link only sources actually read; also record the exact URL and checked paraphrase in the review record
   - Use Reddit as a required research source. Each reaction bullet needs a directly opened original-source link; at least one must be a Reddit thread/comment. Prefer comment permalinks when verified; thread links are acceptable. Distinguish individual experience, small tests and speculation; do not call a handful of comments consensus
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


Division of work (Claude cannot generate raster images or open Reddit from its environment). **The handoff channel is the publish script, the image upload API and D1 — never Git.** Pushing an article asset to Git forces a site build for every post, which is exactly what section 9 avoids.

1. **Claude — draft.** Writes the article (without the community section), body visuals, both payloads and `editorial/reviews/<slug>.md` with a `## Sketch brief` (product/model, 2–4 exact facts or the relationship, every English word/number to appear, USD labels, 3:2 at 1536×1024) and a `## Reddit brief` (reader question, 2–3 search queries, subreddits). Uploads each finished body image with `curl -sS -X POST https://hslblog.com/api/images -H "Authorization: Bearer $PUBLISH_TOKEN" -H 'Content-Type: image/webp' --data-binary @<file>` and puts the returned `/media/` URL in both payloads, so no image goes into Git. Runs `--dry-run`, commits only the two payloads and the review record to its working branch, pushes that branch (a branch push does not build; only `main` deploys), and tells the user the branch name and slug(s). The payload's `imageUrl` names the sketch's future local path `/images/posts/<category>/<slug>-notebook.webp`; that file does not exist yet
2. **Codex — sketch.** Checks out that branch, generates the sketch from the brief with the prompt below, and saves it locally at exactly that path. **Do not commit or push it**
3. **Codex — community.** Opens the Reddit originals and inserts `## 커뮤니티 반응` / `## Community Reactions` immediately before the Q&A heading in both payloads: 2–4 bullets, same reactions in the same order in both languages, one sentence each, link at the end. Apart from these bullets, do not edit article text, title, description, tags, alt text or `visualTypes`
4. **Codex — publish.** Runs `PUBLISH_TOKEN=… node scripts/publish-post.mjs editorial/api-posts/en-<slug>.json editorial/api-posts/ko-<slug>.json --dry-run`, then the same command without `--dry-run`. The script uploads the local sketch (and any body image not yet live) through `POST /api/images`, rewrites both payloads to `/media/<uuid>.webp` and writes D1. No build, PR or merge
5. **Codex — report**, in one message: the slugs published; each sketch's `/media/` URL, pixel size and bytes; and for every community bullet the exact Reddit URL and what the original post or comment actually says. Codex does not need to commit anything
6. **Claude — verify and record.** Reads each live sketch from its `/media/` URL and checks every word and number against the brief. On any error, requests a new sketch; the fix is republished with the same command and the replaced upload removed with `DELETE /media/<uuid>.webp`. Runs the section 11 live checks. Copies the live bodies and `/media/` URLs back into the local payloads, fills the review record's Community evidence, Images and live-check rows, and commits them to its branch as history

Sketch brief format (Claude fills it; values only, no prose):

```
Product: <exact product/model name, as it should be lettered>
Hero doodle: <one object: the product itself or a simple stand-in>
Callouts (2–4, exact text): "<callout 1>" | "<callout 2>" | "<callout 3>"
Bottom mini-flow (optional, ≤3 icons + arrows): <icon> -> <icon> -> <icon>
Red accent on: <one thing to shade/mark in red>
Output: public/images/posts/<category>/<slug>-notebook.webp (local file only; uploaded by publish-post.mjs)
```

Codex sketch prompt — paste as is, replacing only the `{…}` fields from the brief. Reference look: `public/images/posts/mobility/tesla-roadster-reveal-notebook.webp`

```
A casual phone photo, taken from straight above in soft daylight, of one page of cheap cream grid notebook paper (faint grey 5 mm grid, paper fills the whole frame, no desk, no props, no hands).
Everything is drawn freehand with a blue ballpoint pen, with one red pen used only for shading {red accent}.
Top center: the title "{Product}" in large, slightly uneven hand-lettered capitals, underlined twice with a wobbly line.
Center: one quick crude sketch of {hero doodle}, loose hatching, a few retraced lines, slightly lopsided, clearly a notebook doodle rather than a technical drawing.
Below it, one row of short hand-lettered notes, each underlined once, spaced apart: {callout 1} | {callout 2} | {callout 3}
Bottom center (small): {mini-flow as simple doodle icons joined by hand-drawn arrows}
All text is English, spelled exactly as given, with no other words, numbers, labels or watermarks anywhere (a maker badge drawn on the product itself is fine). Every word and number must be clearly legible.
Plenty of empty grid space; slightly uneven baselines; imperfect but neat handwriting.
Avoid: polished infographic cards, symmetric panels, printed fonts, calligraphy, 3D, glossy rendering, stickers, color fills beyond the red accent, blur or heavy grunge.
Landscape 3:2, 1536x1024.
```

- Generate 2–4 candidates, keep the one whose text matches the brief character for character; regenerate rather than hand-fixing text. Currency always `$`
- Convert with Pillow: `Image.open(src).convert('RGB').resize((1536,1024)).save(out,'WEBP',quality=82,method=6)`; lower quality until ≤250 KiB target (500 KiB cap)
- Never commit the `.webp`; `publish-post.mjs` uploads it to `/media/`. Report the `/media/` URL, pixel size and file size (handoff step 5)

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
- New article images are uploaded to `/media/` by `scripts/publish-post.mjs`; reference a local file path in the payload and the script rewrites it. Existing `/images/` assets may stay to avoid broken links
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

Every article lives in D1 and is published through the API. Publishing an article never needs a site build, a PR or a merge.

- Publish or update with one command: `PUBLISH_TOKEN=… node scripts/publish-post.mjs editorial/api-posts/en-<slug>.json editorial/api-posts/ko-<slug>.json`
  - It uploads any image that is a local file or a not-yet-deployed `/images/` path to `/media/` and rewrites both payloads
  - It validates both languages with the API's own rules, backs up the live version to the OS temp directory and keeps the original `publishedAt`
  - It writes both languages in one atomic request (`POST /api/posts` with `{ "posts": [en, ko] }`), then checks both live pages and every image
  - Run it with `--dry-run` first; it validates without uploading or writing
- Read the current live article before editing with `GET /api/posts?lang=<ko|en>&slug=<slug>`; D1 is the source of truth
- `editorial/api-posts/*.json` holds the working payloads. Commit them for history when convenient, but publication never waits for Git
- Article URLs are `/posts/<slug>/` and `/en/posts/<slug>/`. Old static category URLs (`/<category>/<slug>/`) redirect 301 to the D1 post with the same slug
- `src/content/posts/` stays empty. Do not add articles there: a static copy of a D1 article creates duplicate listings, and the quality check rejects it
- Git, PRs and builds are only for code, templates, rules and static site assets
- Credentials stay in ignored local configuration or secrets; never include them in Git, examples, logs or review notes
- Tags: 5–15 distinct lowercase English kebab-case keywords
- Required payload fields: `lang`, `slug`, `category`, `title`, `description` (50–180 characters), `body`, `tags`, `imageUrl`, `imageAlt`, `visualTypes`; `publishedAt` is kept automatically on update
- The API has no draft mode; never publish unfinished work. Keep drafts as local payload files and use `--dry-run`

## 10. SEO

Technical SEO lives in the templates and Worker, not in article text. Do not hand-add canonical, hreflang, robots, Open Graph or JSON-LD tags to a post; change the template instead so every page stays consistent.

Template-owned (keep working when editing layouts or the Worker):
- One canonical URL per page; `hreflang` ko/en pairs plus `x-default` pointing to the Korean version of the same page
- `robots` meta: `index, follow, max-image-preview:large` for content; `noindex, follow` for search, 404 and other utility pages, which also stay out of the sitemaps
- Open Graph/Twitter tags with real image dimensions and `og:locale`; `BlogPosting` + `BreadcrumbList` JSON-LD with `inLanguage`, image size and author/publisher URLs; the publisher and the home `WebSite` carry the 512 px `/images/logo.png`. Decorative heading dots are CSS, not text
- RSS per language: `/rss.xml` (Korean) and `/en/rss.xml` (English), built by the Worker from D1
- Never redirect by browser language or IP: crawlers render with en-US, so an automatic redirect hides the Korean pages. Only a language the visitor chose may be remembered
- One URL per page: every extensionless path without a trailing slash redirects 301 to the canonical form
- Sitemaps: `/sitemap-index.xml` (static pages with hreflang; the Worker adds `lastmod` to home and category pages from the newest D1 post) and `/dynamic-sitemap.xml` (API posts), both listed in `robots.txt`
- Search engines: Google Search Console, Naver Search Advisor and Bing Webmaster Tools. Ownership files are served by the Worker from `verificationFiles` in `worker/index.js`. Every API publish and a daily cron ping IndexNow (Naver, Bing); Google relies on the sitemaps
- The LCP hero image loads eagerly with `fetchpriority="high"`; body images carry width/height and load lazily; unknown URLs return the bilingual 404 page with status 404

Author checklist (validated where marked):
- Title: model/product first, a real question or judgment, **≤ 70 characters** (validated), unique across the site. No clickbait that the article does not answer
- Description: 50–180 characters (validated), states the actual answer or angle; it becomes the search snippet
- Slug: lowercase English kebab-case, short, the same for both languages, and **never changed after publication**
- Headings: the template renders the only H1; the body starts at H2 (validated: no `# ` headings) and does not skip levels
- Images: descriptive alt text of 5–150 characters (validated), describing what the image shows, no keyword lists; descriptive file names
- Links: primary sources beside claims; 1–2 relevant internal links only when they genuinely help (section 3)
- No keyword stuffing, hidden text, duplicate or near-duplicate pages, or thin pages created for search traffic
- A substantive edit advances `updatedAt`, which feeds `lastmod`; cosmetic fixes need not

## 11. Verification and completion

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
