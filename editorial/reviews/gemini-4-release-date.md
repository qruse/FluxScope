# Review: gemini-4-release-date
- Checked date/time and timezone: 2026-09-28, 08:00–08:20 UTC (17:00–17:20 Asia/Seoul)
- Live URLs and storage route (static/API): new D1 article via API, `/posts/gemini-4-release-date/` and `/en/posts/gemini-4-release-date/`; published 2026-09-28T11:08:46.783Z by Codex with `publish-post.mjs`
- Reader question: when is Gemini 4 actually coming out, and are the rumored performance and price worth waiting for when Antigravity is the tool it arrives in?
- Supported conclusion: no official date; Google says post-training and "much earlier" than year-end; Polymarket prices 79% by Oct 31; leaked scores and price are unsourced; keep a working Claude Code/Codex setup and test Gemini 4 by API once a model page exists
- Scope: Gemini 4 (unreleased); official comparisons are standard API list prices (Gemini 3.8 Flash, Claude Opus 5.5, GPT-6 Astra short context), USD per 1M tokens
- User experience: user's own words (2026-09-28): "루머로는 성능 가격 매우 훌륭하던데.. 문제는 antigravity가 claude code나 codex 대비 매우 사용성이 떨어지는것도 문제". Used once as an impression of usability; no tasks, durations or measurements added

## Claim ledger
| Claim | Kind | Source URL and location | What was checked | Qualification/calculation |
| --- | --- | --- | --- | --- |
| Gemini 4 pre-training "most ambitious" run | Official statement | https://blog.google/company-news/inside-google/message-ceo/alphabet-earnings-q2-2026/ (July 22, 2026) | Exact quote: "We have started our most ambitious pre-training run yet, for Gemini 4" | Earnings remarks date July 22 |
| Antigravity > 2.4M weekly active users | Official statement | Same Q2 remarks | Exact quote "more than 2.4 million weekly active users" | Google's own figure |
| Post-training; "as soon as possible"; "much earlier" than year-end; internal testing with Gemini 4 powering Antigravity | Reported statement | https://9to5google.com/2026/09/24/google-says-gemini-4-release-is-coming-as-soon-as-possible/ (Ben Schoon, Sep 24) citing The Information AI Agenda Live | Quotes read on the 9to5Google page; The Information original is paywalled (headline and author Laura Bratton visible only) | Attributed to 9to5Google with The Information linked as origin |
| Gemini 3.5 Pro teased in summer, never released | Reported | Same 9to5Google article | Read | Attributed to report |
| "About three months" | Calculation | Sep 24 → Dec 31 = 98 days | Recomputed | Illustrative |
| Polymarket: Jun 30/Jul 31/Aug 31/Sep 15 resolved No; Sep 30 2.25%, Oct 31 79%, Nov 30 94.5%; public release only | Market data | https://polymarket.com/event/gemini-4pt0-released-by-june-30-2026 via gamma-api.polymarket.com/events?slug=gemini-4pt0-released-by-june-30-2026 at 2026-09-28 08:15 UTC | Closed markets outcomePrices ["0","1"]; open Yes prices; rules text requires public access, excludes closed beta/private | Bettor prices, not a Google date. Rules text oddly says "Gemini 4.0 Flash" in the first line but defines Gemini 4.0 broadly as the Gemini 3 successor; article says "public Gemini 4 release" |
| Arena sighting Sep 17 under "gemini-3.8-flash"; scores 88% DeepSWE v1.1, 95.3% Terminal-bench 2.1, 86.8% OSWorld-2.0; $2.25/$11.25; 10M input, cross-session memory | Rumor | https://techbriefly.com/2026/09/21/gemini-4-pro-benchmarks-beat-gpt-6-astra-claude/ ; https://finance.biggo.com/news/66df2f89-c067-43d7-b888-94deb071f472 | Both read; neither names a leaker nor links screenshots; Google confirmed nothing | Labeled rumor everywhere, including chart hatch and label |
| Gemini 3.8 Flash released Sep 2; $0.75/$3.75 intro to Dec 31, 2026; $1.50/$7.50 from Jan 1, 2027; "might use more tokens"; available in Antigravity | Official | https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/ | Read | 15 days = Sep 2 → Sep 17 |
| Opus 5.5 $4/$20 | Official | https://www.anthropic.com/claude-opus-5-5 pricing | Rechecked Sep 28 | Standard, not fast mode |
| GPT-6 Astra $10/$50 | Official | https://developers.openai.com/api/docs/pricing | Rechecked Sep 28 | Standard short context |
| 44% below Opus, 77.5% below Astra, 1.5× Flash standard | Calculation | 2.25/4 = 0.5625 and 11.25/20 = 0.5625; 2.25/10 = 0.225; 2.25/1.50 = 1.5 and 11.25/7.50 = 1.5 | Recomputed | Only if the rumor price holds |
| Antigravity plans May 19: Flash and Pro share one limit drawn at API pricing; $20 Pro / $100 Ultra 5× / $200 Ultra 20× | Official | https://antigravity.google/blog/changes-to-antigravity-plans | Read | "Pricier flagship would likely drain faster" is editorial inference from the stated rule |
| Users hit limits within an hour; limits tripled twice in a week; users said still below previous levels | Reported | https://9to5google.com/2026/05/21/google-has-tripled-gemini-usage-limits-for-antigravity-twice/ | Read | Attributed to 9to5Google |

## Community evidence
| Published paraphrase | Exact thread/comment URL | Context and limits | Checked on |
| --- | --- | --- | --- |
| Nov4Saki in r/GoogleGeminiAI dismissed the leaked benchmark figures as recycled speculation, rather than treating an Arena sighting as proof | https://www.reddit.com/r/GoogleGeminiAI/comments/1wqze2k/comment/pc8qqmy/ | Opened and paraphrased by Codex; Reddit returns 403 to Claude's environment, so Claude checked only that the live bullet and link match this row | 2026-09-28 (Codex) |
| In an earlier Antigravity discussion, sdexca said Claude Code offered steadier tooling and better limits for their work, a personal report from before these Gemini 4 leaks | https://www.reddit.com/r/google_antigravity/comments/1t59ng9/is_there_any_reason_to_still_use_antigravity/ | Opened and paraphrased by Codex; Reddit returns 403 to Claude's environment, so Claude checked only that the live bullet and link match this row | 2026-09-28 (Codex) |
| Another participant in that older thread, pjerky, reported good results building web apps with Antigravity, so even that discussion was not a unanimous verdict | https://www.reddit.com/r/google_antigravity/comments/1t59ng9/is_there_any_reason_to_still_use_antigravity/ | Opened and paraphrased by Codex; Reddit returns 403 to Claude's environment, so Claude checked only that the live bullet and link match this row | 2026-09-28 (Codex) |

## Images
| Asset | Purpose/type | Data provenance | Dimensions/bytes | Visually checked |
| --- | --- | --- | --- | --- |
| `gemini-4-release-date-notebook.webp` → `/media/c156996f-7d63-4360-99ba-4d7080955207.webp` | sketch thumbnail | Codex, from the brief below; uploaded through `/api/images`, no Git file | 1536×1024, 116,686 B | Yes: title, SOON calendar with red "?", three callouts, brain -> shield -> laptop; text matches the brief |
| `gemini-4-release-odds.webp` → `/media/b0a13f71-35f7-46de-8eba-9491af1aac23.webp` (Git copy removed; byte-identical) | chart: release odds by deadline | Polymarket gamma API, 2026-09-28 08:15 UTC | 1440×810, 31,898 B | Yes: titles, 7 deadlines, 4 expired labels, 2.25/79/94.5%, zero baseline, footnote |
| `gemini-4-price-context.webp` → `/media/5e9013f8-3e97-43fa-843b-c85e41b43c51.webp` (Git copy removed; byte-identical) | chart: output price per 1M tokens | Google, Anthropic, OpenAI official pages; rumor hatched and labeled | 1440×810, 44,174 B | Yes: all five $ labels, RUMOR label, zero baseline, footnote |

## Sketch brief
```
Product: GEMINI 4
Hero doodle: a wall calendar page with "SOON" written on it and a big question mark
Callouts (2–4, exact text): "Post-training (Sep 24)" | "Rumor: $2.25 in / $11.25 out" | "Bets: 79% by Oct 31"
Bottom mini-flow (optional, ≤3 icons + arrows): brain -> shield -> laptop
Red accent on: the question mark on the calendar
Output: public/images/posts/ai/gemini-4-release-date-notebook.webp
```
- Size 1536×1024 (3:2), all text English, currency `$`
- Alt text (en): Notebook sketch of Gemini 4 with post-training status, a rumored $2.25 input price and Polymarket October odds

## Reddit brief
- Reader question: when will Gemini 4 ship, do the leaked scores and price look credible, and how does Antigravity compare with Claude Code and Codex in daily use?
- Queries: "Gemini 4 release" ; "gemini-3.8-flash arena Gemini 4 leak" ; "Antigravity vs Claude Code" / "Antigravity rate limit"
- Subreddits: r/Bard, r/GoogleGeminiAI, r/singularity, r/LocalLLaMA, r/ClaudeAI, r/codex
- Want: at least one reaction on the leak's credibility and one on Antigravity usability versus Claude Code/Codex; do not overlap the user's own opinion

## Review
- Reader value/evidence/reasoning/voice: one question (when, and is it worth waiting); rumor kept separate from official facts in text, table and chart; user opinion scoped once
- Line-by-line cut pass (AGENTS §4): done on both languages; headings alone: "Much earlier" still leaves three months → bettors lost four deadlines → the leak wore a used name → rumored price between Flash and Opus → a better model does not fix Antigravity
- Korean-English parity: same numbers, dates, links and qualifications
- Related article search and selected link: the Astra vs Opus 5.5 same-prompt article (same language each) directly supports "per-token price vs cost per task"
- Automatic check command and actual result: `publish-post.mjs --dry-run` passed both languages with a temporary stand-in thumbnail (removed afterwards); `npm run check` exit 0
- Mobile/desktop visual check and actual result: 2026-09-28, Chromium at 390 px and 1280 px, ko and en: no page-wide overflow, 3/3 images loaded
- Live URLs/listings/images/language switch/search/feed checks: 2026-09-28: both URLs 200 with ko/en/x-default hreflang; language switch links both editions; thumbnail and body `/media/` images 200 `image/webp`; listed on `/`, `/en/`, `/ai/`, `/en/ai/`, both RSS feeds and `/dynamic-sitemap.xml`; live body equals the draft plus the community section; local payloads synced to live
- Remaining limitations: The Information original paywalled; leak has no primary source
- Language revision (2026-09-28 12:21 UTC, republished with `publish-post.mjs`): both languages rewritten against AGENTS §4 "Sound like a person, not a model" (Korean translationese, colon reveals, personified punchlines, source-judging tails, overlong sections). Facts, numbers, links, images and alt text unchanged; live body equals the local payload; `publishedAt` preserved; titles changed: en "Gemini 4 Release Date: Bettors Have Already Missed Four Deadlines", ko "Gemini 4 언제 나오나? '곧 출시' 베팅은 벌써 4연패" (old ko title used 음슴체)

Naturalness pass (2026-09-28 12:25 UTC): replaced forced jokes, metaphors and Korean calques with plain phrasing (e.g. "작업 하나당 비용", "정가", "실제 비용"); facts, numbers, links and images unchanged; titles/descriptions revised where listed in the payloads; republished, live bodies equal local payloads, publishedAt preserved

- Search-title and internal-link update (2026-09-29, user request "톤은 유지하고 앞부분에 검색어 넣기", "관련 글끼리 내부 링크"): ko title: "Gemini 4 언제 나오나? 출시 예측은 벌써 네 번 빗나갔다" -> "Gemini 4 출시일 언제? 출시 예측은 벌써 네 번 빗나갔다". Slug, publishedAt, description, images unchanged
