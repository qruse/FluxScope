# FluxScope editorial and development contract

This is the single authoritative project rulebook. Read it completely before editing or publishing. `CLAUDE.md`, `GEMINI.md` and `.agents/rules/blog-writing-rules.md` only point here; never maintain a second copy. Explicit current user instructions take precedence. Do not guess away a conflict: preserve unaffected work and identify the exact unresolved point.

## Source of truth and latest published baseline

- Current user instructions take precedence, then this rulebook, then the review rubric in `editorial/QUALITY.md`. README is an operational guide; agent entry files are pointers, not competing rules
- Published content and images come from the current D1 response at `/api/posts`, not Git snapshots, old previews, local files or conversation memory
- Before drafting, list current posts with `GET /api/posts?lang=en` and `lang=ko`; select the newest relevant published bilingual article, then read both full payloads with `&slug=<slug>`. Use `publishedAt` for the newest publication and `updatedAt` for its revision
- For an existing article or saved draft, `--pull <slug>` restores working payloads, briefs and review records. Compare these with the live article: `/api/drafts` may contain an unpublished revision and does not silently supersede the published baseline
- Tracked reference payloads and old release/review records preserve examples and evidence, not today's publication state. The three technique references in `editorial/QUALITY.md` supplement the latest published style
- If live access fails, state what could not be verified and continue research or rule/code maintenance from checked sources. Never call a local snapshot the latest published article or overwrite an existing article from it

## 1. Start here — execute in order

1. Read this file and `editorial/QUALITY.md`
2. Read the newest relevant published article in both languages and its available review record; consult the technique references in `editorial/QUALITY.md` as needed
3. Read the current live article before editing (`GET /api/posts?lang=&slug=`); D1 is the source of truth
4. Write a one-sentence reader question and conclusion, then collect sources **before** drafting
5. Create `editorial/reviews/<slug>.md` using the evidence and review template in `editorial/QUALITY.md`
6. Draft English as the primary edition, verify every material claim, then adapt naturally into Korean with identical facts and qualifications
7. Run the automatic checks, then the manual rubric — a passing build does not certify facts or good prose
8. Show the completed draft and final bilingual title pair; obtain and record user title confirmation under section 1.1 before any public write
9. Publish with `scripts/publish-post.mjs` (no build or merge), verify both live URLs, images, category listings and language switch, then report exactly what is live

### 1.1 Mandatory user title confirmation

- **Do not publish an article until the user has explicitly confirmed its final title.** Apply this to new articles and title changes on existing articles; a previously confirmed, unchanged title can retain that confirmation for later body edits
- Finish the research, bilingual draft, visuals and checks before requesting confirmation, so the user is choosing a concrete title for a reviewable article. While waiting, continue authorized preparation, draft saving and unlisted preview work; do not run a public article write
- When proposing a title, offer 3–5 distinct candidates and one recommendation; a specific title supplied by the user may be used directly. Show the final Korean title and its English counterpart before publication; selecting the Korean candidate approves the corresponding English title if that pair was already shown
- A clear selection such as “1번”, “이 제목으로”, or “ㄱㄱ” after the specific final title/pair was shown counts as confirmation. Silence, the author's recommendation, or a generic “write and publish immediately” request made before any title was shown does not
- Publish the confirmed wording exactly. If either title changes afterward, or the article's angle changes so the approved headline no longer fits, show the revised pair and obtain confirmation again; do not replace it with another “better” title unilaterally
- Record the exact approved Korean/English titles, the user's confirming message and date/context in the review. Verify the payload titles against that record immediately before public publication; do not infer missing approval from an old published page
- Without confirmation, report “draft ready; awaiting title confirmation” with the candidates or preview. This gate applies to public article publication, not to requested rule/code maintenance or draft/image preparation
- This is a human workflow gate: structural validation and a successful API request cannot prove that the user approved a title

Do not stop after writing advice when asked to edit. Do not report an API response, commit, build, or preview as a verified production deployment.

## 2. Identity and hard requirements

- The repository is FluxScope; the displayed brand remains **HSL의 블로그 / HSL's Blog** unless the user asks to rename it
- Purpose: useful notes by someone curious about AI, cars and devices, for readers deciding what to use, buy or investigate
- **This is an international blog.** Write for a global reader first: pick topics, markets, prices, sources and examples that matter across major markets (US, EU/UK, China, Japan, Korea). Korea-only facts (Korean prices, laws, insurers, dealers, subsidies) enter only as one clearly labeled market example or when the topic itself is Korean; never frame a global question around the Korean market alone. The Korean edition is a translation of that global article, not a Korea-specific version
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
- Before drafting a follow-up, comparison or rumor update, search the live post catalog for the same models/topic and read relevant prior articles, including the author's earlier experience and predictions. Connect that history in the body with 1–2 same-language links and explain what has changed or what question remains; do not leave useful previous coverage only in an automatic related-post box. When the user names a prior mention, locate the actual passage and record its live URL and meaning in the review. Treat past rumors as dated claims and recheck current specifications from primary sources

## 4. Voice — witty and humorous, without bargaining away accuracy

The defining voice is **witty and humorous**. Make the reader smile at a concrete, supported situation. Use several well-placed observations across the article, not a joke after every number. Keep criticism proportional to verified claims and the user's actual experience, never ordinary buyers or unsupported motives. State the useful fact before the joke. **Natural beats clever:** a plain, correct sentence always beats a forced joke, metaphor or twist. If a line needs a second read to land, write it plainly; a section with no joke is fine, a forced one is not.

Korean is primarily short bullets with natural 반말/음슴체. **One point, one short sentence per bullet** — split a second sentence into its own bullet or cut it; keep each bullet readable in one breath. Do not force all sentences into the same ending. English bullets follow the same one-sentence rhythm as natural concise field notes, not literal Korean syntax.

### Plain language and brevity

- **Make the body easy to understand on the first read.** Prefer familiar words and short, direct sentences in both languages; clarity takes priority over a clever phrase
- Explain an unfamiliar term briefly when it first matters. Say what a benchmark measures and why the result affects the reader's choice; do not stack technical names, settings and caveats into one bullet
- Put the useful answer first, then only the evidence needed to understand it. Let tables and charts carry detailed comparisons instead of repeating every number in the surrounding text
- State each limitation once beside the relevant claim. Keep the conditions that change the decision, including test scope, temporary prices, projected costs and uncertain availability; brevity must not make a qualified claim sound certain
- Cut repeated conclusions, background that does not affect the choice, long source captions and explanations of our writing process. Keep direct source links and essential attribution
- Preserve natural wit where it reads easily; remove a joke or metaphor that needs an explanation. Use no fixed length target that encourages padding or deletion of necessary facts
- Read each edition alone after shortening: a reader should be able to explain the main point without decoding jargon or rereading a sentence. For an existing text-only edit, preserve the confirmed title, images, URL and original publication date

- Titles are headlines, not memo lines. Put the model/product near the start, then a sharp hook: a pointed question, a blunt contrast, a decisive number or a verdict some readers will dispute. The article must pay the hook off with evidence; no bait the body does not answer, no implied test results or defects
- **Natural, witty humor is especially important in the title.** Give the headline a natural, immediately understandable witty twist tied to the article's concrete situation; avoid bland product summaries such as "the AI bot I have been waiting for". For an article about a persistent assistant, "OpenAI Dots, 이제 AI도 출근은 해야지" is an appropriate expectation-led hook, not a claim of tested performance. Do not make the author sound lazy or imply that the product has already completed work the author has not tested. Offer 3–5 distinct headline candidates when proposing a title, with one recommendation; use a specific user-supplied title directly when requested. Obtain confirmation under section 1.1, and never force wordplay or sacrifice factual accuracy
- Korean titles do **not** use 음슴체; write them as natural headline phrasing (question, contrast, noun ending). Wrong: `출시 베팅만 벌써 네 번 틀림`; right: `출시 베팅은 벌써 4연패`. Korean descriptions and narrative headings still use natural 음슴체 (e.g. `검수는 내 몫임`, `예산도 커짐`). English titles use punchy headline phrasing, not artificial Korean grammar
- Rebuild a confused draft around ONE reader question before polishing sentences. Every section must advance that question; delete tangents, repeated caveats and jokes that need their own explanation
- Humor follows the concrete fact. Prefer 2–4 restrained observations over an analogy in every bullet; never let a joke imply unsupported test results or product defects
- Keep the humor free of profanity, insults and degrading slang; aim criticism at verified claims, sales tactics and workflow friction
- The description gives the actual angle and substance, not “a comprehensive analysis”
- Explain what a number measures and why it changes the decision. A table full of unexplained numbers is not depth
- Keep humor rooted in a verified inconvenience. Do not add invented war stories or pretend to have tested the product
- Avoid stock drama: “판도를 바꾼다”, “혁신의 이면”, “마케팅의 민낯”, “영수증이 말해준다”, “포기하기 어렵다” without stating precisely why
- Do not turn every bullet into `fact — caveat`; mix a clear assertion, a useful table and a short explanation
- No trailing period on memo/bullet lines, including English. Decimal points, domains and punctuation inside a sentence are allowed
- Write numeric ranges with an en dash (`5–45`) or escape the tilde (`\~`); two `~` in one paragraph render as strikethrough between them (the validator rejects `<del>`)
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
| `sketch` | Capture the article's thesis or central tension in one witty metaphor or scene | Image generation, exactly once as thumbnail; rough human-drawn notebook style |
| `architecture` | Components or relationships need explaining | Clear presentation-style diagram rendered with code/vector tools; verified labels and connections |
| `pipeline` | Order, acceptance, retry or escalation is the point | Code-rendered process diagram; label decisions and stopping rules |
| `chart` | Quantities or comparisons change the reader's decision | Code-rendered chart from verified data; units, zero-baseline where appropriate, date and scope |

The thumbnail is a conceptual editorial sketch: encapsulate the article's thesis or central tension in one witty, immediately understandable visual metaphor or scene. Make the product/topic recognizable through the scene, a simple stand-in or minimal text when needed. Favor an idea that lands at a glance over an informational sketch-note, specification summary or a row of numbers and labels. A product name with unrelated decorative doodles is insufficient; the visual idea must be specific to the article. Text is optional: use only the few short English words needed to make the idea work, with no mandatory title, fact-callout count or mini-flow. Do not force a joke or imply unverified product behavior, internals or results. Put detailed facts, comparisons and exact plotted data in body visuals made with code/vector tools; label hypothetical/converted information clearly there. Plan each body's visual job in the review record; remove redundant decoration.

Declare `visualTypes` in API payloads, ordered **thumbnail first, then inline body images in reading order**. Length must match the image count; first and only sketch must be index 0. Use inline Markdown images with distinct URLs; raw HTML/reference-style images are rejected to keep validation unambiguous. These types are preflight metadata retained in saved working payloads (`/api/drafts`), not displayed publicly or stored in the published post row.


End-to-end ownership: **Codex now handles research, writing, visuals, community research, publication and verification.** A Claude-to-Codex handoff is optional when the user requests one; no model is permanently restricted to adding a sketch or community bullets. Honor the scope of an explicitly requested handoff. **Writing, handing off and publishing an article never touches Git, a PR or a build.** D1 stores working payloads and review records (`/api/drafts`), R2 stores images (`/media/`), and Git is for code, templates and rules (section 9).

1. **Read and research.** Resolve the live baseline above. For an existing article or saved draft, run `node scripts/publish-post.mjs --pull <slug>` with `PUBLISH_TOKEN` set securely. Collect primary sources and open Reddit originals
2. **Draft both languages.** Write both payloads and `editorial/reviews/<slug>.md`, including a `## Sketch brief` with the thesis, visual metaphor/scene and any exact English text (or `none`), and a `## Reddit brief` with the reader question, queries and subreddits. Add matching community reactions immediately before Q&A and record the exact source URLs
3. **Create and inspect visuals.** Produce body visuals and the single sketch below. Save the sketch at `public/images/posts/<category>/<slug>-notebook.webp`, referenced by `imageUrl` as `/images/posts/<category>/<slug>-notebook.webp`. Check that the visual idea matches the thesis and any words or numbers match the brief before publication
4. **Review and title confirmation.** Apply the bilingual rubric and run `node scripts/publish-post.mjs editorial/api-posts/en-<slug>.json editorial/api-posts/ko-<slug>.json --dry-run`. Use `--preview` when a reviewable draft or handoff is needed; it saves working files and creates unlisted preview URLs, not a publication
5. **Publish and verify.** After the user has confirmed the final bilingual title pair under section 1.1, run the paired command without `--dry-run`. It uploads images, writes both languages atomically, saves working files and removes the preview. Perform section 11 live checks yourself; no second agent is required to finish them
6. **Record and report.** Record actual source, image and live checks in the review. To save review-only changes after publication, use authenticated `PUT /api/drafts?slug=<slug>` with both current working payloads and the review; do not recreate a preview or republish unchanged article text merely to save notes. Report both live URLs and remaining limitations. Keep detailed image dimensions/bytes and community evidence in the review; include them in the response when requested for a handoff

Sketch brief format (the current author fills it; concise values):

```
Topic: <product/model or subject; not automatically visible text>
Thesis: <the article's supported point in one sentence>
Visual idea: <one witty, readily understood metaphor or scene that encapsulates the thesis>
Scene: <the simple objects/characters, action and composition that make the idea clear>
Visible text (optional, exact English): <only essential short words/labels, or none>
Red accent on: <one thing to shade/mark in red>
Output: public/images/posts/<category>/<slug>-notebook.webp (local file only; uploaded by publish-post.mjs)
```

Sketch prompt — paste as is, replacing only the `{…}` fields from the brief. Use the current live thumbnails for Grok 5 (`grok-5-terafab-space-data-centers`) and second-tier AI (`second-tier-ai-us-vs-china`) only as paper/pen style references; resolve their current `imageUrl` through `/api/posts` rather than reusing an old upload URL. Do not copy their information density or callout layout. Keep the noticeably rough, imperfect human-drawn look (user feedback, 2026-09-29), with the conceptual, witty visual direction below (user feedback, 2026-09-30)

```
A casual phone photo, taken from straight above in soft daylight, of one page of cheap cream grid notebook paper (faint grey 5 mm grid, paper fills the whole frame, no desk, no props, no hands).
Everything is drawn freehand with a blue ballpoint pen, with one red pen used only for shading {red accent}.
Create one witty conceptual sketch about {Topic}, expressing this supported point: {Thesis}.
Visual idea: {Visual idea}. Scene and composition: {Scene}.
Let the scene carry the idea through a clear visual metaphor or small human observation; it should make sense at a glance without a list of facts. Keep the humor natural and specific to the topic, with no invented product claims or test results.
Draw it like a person's quick crude doodle, made in under a minute: wobbly lines that overshoot corners, slightly wrong perspective, scribbled uneven hatching, a few retraced lines, uneven stroke pressure, clearly a notebook sketch rather than a technical drawing.
Optional visible text: {Visible text}. If none, add no text. Otherwise use only these exact English words, small and sparse, in hurried but legible handwriting with uneven letter sizes and drifting baselines. Do not invent extra titles, fact-callout rows, specification labels, numbers, flowcharts or watermarks beyond the brief.
Leave plenty of empty grid space around the simple scene. One coherent visual idea matters more than information density.
Avoid: informational sketch-note layouts, spec sheets, polished infographic cards, symmetric panels, printed fonts, calligraphy, ruler-straight lines, uniform stroke weight, perfect perspective, even hatching, 3D, glossy rendering, stickers, color fills beyond the red accent, blur or heavy grunge.
Landscape 3:2, 1536x1024.
```

- Generate 2–4 candidates; choose the one whose visual idea best captures the thesis with natural wit and a rough human-drawn feel. Any visible text must match the brief character for character; regenerate rather than hand-fixing text. Currency always `$`
- Convert with Pillow: `Image.open(src).convert('RGB').resize((1536,1024)).save(out,'WEBP',quality=82,method=6)`; lower quality until ≤250 KiB target (500 KiB cap)
- Never commit the `.webp`; `publish-post.mjs` uploads it to `/media/`. Record the final `/media/` URL, pixel size and file size in the review

- Exactly **one rough paper-notebook sketch per topic**, always the thumbnail (`imageUrl`)
- Use the same sketch for both languages. Never repeat it in the body
- Prioritize a clever visual idea over information density. Preserve the deliberately rough human-drawn character: wobbly overshooting lines, imperfect perspective, scribbled hatching, retraced lines and uneven pressure; any lettering is hurried but legible. Roughness comes from the drawing, never blur or heavy distress
- Look: an ordinary phone photograph of cheap grid paper, a simple scene made from crude pen doodles, uneven lines, sparse optional words and plenty of empty space
- Avoid polished card layouts, symmetric infographic panels, studio props, beautiful calligraphy, glossy 3D art and generic AI decoration
- The sketch explains a concept, not unverified product internals or measurements. Add a nearby qualification if it could be mistaken for a real device drawing or test
- Within the total cap of 10, include at least **one additional distinct useful body visual**: original sourced figure, deterministic diagram or data chart
- Exact metrics, labels and architecture must use code/vector/chart tools, not image generation. Generate raster art only for the sketch or illustration that benefits from it
- Read each image visually. Verify title, units, series, labels and meaning against the text. Reusing a wrong chart is a factual error
- Width 800–1600 px recommended, hard maximum 1600 px; target <250 KiB, hard cap 500 KiB per image
- New article images are uploaded to `/media/` by `scripts/publish-post.mjs`; reference a local file path in the payload and the script rewrites it. Existing `/images/` assets may stay to avoid broken links
- Supply descriptive alt text; dimensions recorded in the review must match the actual file
- For an externally sourced figure, place `*출처: [기관](URL) — 자료명*` / `*Source: [Organization](URL) — title*` immediately below it
- An API's 5 MB upload ceiling is a transport limit, **not** editorial permission for a 5 MB image

## 8. Currency and publication

- English is the master edition; Korean is fully supported, with identical evidence and qualifications
- Prices lead with **USD ($)** in both editions. **Use the official US price first**, matched to model, storage/trim, date, tax basis and purchase conditions
- Only if no official US price is available, convert the verified official price from the market that best represents the product for a global reader (usually the maker's main export market such as the EU/UK, otherwise its home market; Korea only when it is that market or the topic is Korean). Add a small nearby note: “<market> price converted; approximate USD; tax basis, FX rate and date.” Never present that fallback as US MSRP, and when comparing products use the same market and tax basis for all of them
- Use one frozen, linked FX rate per article; retain original amounts in the internal evidence record. Convert totals from unrounded source amounts, then round. State material exclusions. No repeated conversion boilerplate in every bullet
- Never attach one market's trim/option costs to another market's configuration. If US pricing exists but a market-specific option has no equivalent, identify that market's scope and conversion explicitly
- API token prices already quoted in USD need no FX conversion. Discounts, trade-ins and financing are not the official cash starting price

## 9. Storage and publication

Every article lives in D1 and is published through the API. Publishing an article never needs a site build, a PR or a merge.

- Publish or update with one command: `PUBLISH_TOKEN=… node scripts/publish-post.mjs editorial/api-posts/en-<slug>.json editorial/api-posts/ko-<slug>.json`
  - It uploads any image that is a local file or a not-yet-deployed `/images/` path to `/media/` and rewrites both payloads
  - It validates both languages with the API's own rules, backs up the live version to the OS temp directory and keeps the original `publishedAt`
  - It writes both languages in one atomic request (`POST /api/posts` with `{ "posts": [en, ko] }`), then checks both live pages and every image
  - Run it with `--dry-run` first; it validates without uploading or writing
  - It refuses to publish when a `/media/` image is not live or when the working copy's thumbnail differs from the live article (a stale copy); run `--pull <slug>` first and reapply the edit. Never republish a local file that was pulled before someone else's republish
- Read the current live article before editing with `GET /api/posts?lang=<ko|en>&slug=<slug>`; D1 is the source of truth
- `editorial/api-posts/*.json` and `editorial/reviews/*.md` are local working copies. New files are git-ignored and saved to D1 by every `--preview` and publish; `--pull <slug>` restores them. Existing tracked examples remain historical/regression fixtures; do not commit article edits merely because an old example is tracked
- Article URLs are `/posts/<slug>/` and `/en/posts/<slug>/`. Old static category URLs (`/<category>/<slug>/`) redirect 301 to the D1 post with the same slug
- `src/content/posts/` stays empty. Do not add articles there: a static copy of a D1 article creates duplicate listings, and the quality check rejects it
- Git, PRs and builds are only for code, templates, rules and static site assets. Never commit, push, open a PR or build to write, hand off or publish an article
- Credentials stay in ignored local configuration or secrets; never include them in Git, examples, logs or review notes
- Tags: 5–15 distinct lowercase English kebab-case keywords
- Required payload fields: `lang`, `slug`, `category`, `title`, `description` (50–180 characters), `body`, `tags`, `imageUrl`, `imageAlt`, `visualTypes`; `publishedAt` is kept automatically on update
- Never publish before the final title is confirmed under section 1.1, or publish unfinished work. To show a draft, add `--preview`: it uploads both languages to an unlisted `/preview/<token>/` and `/en/preview/<token>/` page (noindex, no comments, absent from listings, feeds, sitemaps and search) and prints the URLs
  - A missing thumbnail or editorial problem is only a warning in preview mode; the real publish still enforces every rule
  - Re-running `--preview` replaces that slug's preview under a new token; publishing the slug deletes it; previews expire after 30 days; `DELETE /api/previews?slug=<slug>` removes one early
  - A preview is not a publication: never report it as live

## 10. SEO

Technical SEO lives in the templates and Worker, not in article text. Do not hand-add canonical, hreflang, robots, Open Graph or JSON-LD tags to a post; change the template instead so every page stays consistent.

Template-owned (keep working when editing layouts or the Worker):
- One canonical URL per page; `hreflang` ko/en pairs plus `x-default` pointing to the English version of the same page (global readers are the primary audience)
- `robots` meta: `index, follow, max-image-preview:large` for content; `noindex, follow` for search, 404 and other utility pages, which also stay out of the sitemaps
- Open Graph/Twitter tags with real image dimensions and `og:locale`; `BlogPosting` + `BreadcrumbList` JSON-LD with `inLanguage`, image size and author/publisher URLs; the publisher and the home `WebSite` carry the 512 px `/images/logo.png`. Decorative heading dots are CSS, not text
- RSS per language: `/rss.xml` (Korean) and `/en/rss.xml` (English), built by the Worker from D1
- Never redirect by browser language or IP: crawlers render with en-US, so an automatic redirect hides the Korean pages. Only a language the visitor chose may be remembered
- One URL per page: every extensionless path without a trailing slash redirects 301 to the canonical form
- Sitemaps: `/sitemap-index.xml` (static pages with hreflang; the Worker adds `lastmod` to home and category pages from the newest D1 post) and `/dynamic-sitemap.xml` (API posts), both listed in `robots.txt`
- `/ads.txt` is served by the Worker only when the `ADSENSE_PUBLISHER_ID` variable (`pub-…`) is set; otherwise it returns 404
- Search engines: Google Search Console, Naver Search Advisor and Bing Webmaster Tools. Ownership files are served by the Worker from `verificationFiles` in `worker/index.js`. Every API publish and a daily cron ping IndexNow (Naver, Bing); Google relies on the sitemaps
- The Worker keeps public pages (home, category, article, RSS, dynamic sitemap) in the edge cache for 60 seconds, ignoring the query string; a new publish can take up to a minute to show for visitors; cache hits are sent with `max-age=0, must-revalidate` because the zone Browser Cache TTL (4 h) would otherwise be applied to browsers. A request with `Cache-Control: no-cache` (hard refresh, `publish-post.mjs` live checks) bypasses it; previews, `/api/` and `/media/` are never cached here
- Visit counts (`/api/views`) skip bots, automation and preview pages; the owner opts a browser out by opening any page with `?nocount=1` once (`?nocount=0` re-enables counting)
- The LCP hero image loads eagerly with `fetchpriority="high"`; body images carry width/height and load lazily; unknown URLs return the bilingual 404 page with status 404

Author checklist (validated where marked):
- Title: final bilingual wording confirmed and recorded under section 1.1; model/product first, a real question or judgment, **≤ 70 characters** (validated), unique across the site. No clickbait that the article does not answer
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
