# Review: gemini-4-release-date
- Checked date/time and timezone: 2026-09-28, 08:00–08:20 UTC (17:00–17:20 Asia/Seoul)
- Live URLs and storage route (static/API): new D1 article via API, `/posts/gemini-4-release-date/` and `/en/posts/gemini-4-release-date/`; not yet published
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
Codex adds this section and the rows below, per AGENTS §7.

| Published paraphrase | Exact thread/comment URL | Context and limits | Checked on |
| --- | --- | --- | --- |

## Images
| Asset | Purpose/type | Data provenance | Dimensions/bytes | Visually checked |
| --- | --- | --- | --- | --- |
| `gemini-4-release-date-notebook.webp` | sketch thumbnail | Codex, from the brief below | pending | pending |
| `gemini-4-release-odds.webp` | chart: release odds by deadline | Polymarket gamma API, 2026-09-28 08:15 UTC | 1440×810, 31,898 B | Yes: titles, 7 deadlines, 4 expired labels, 2.25/79/94.5%, zero baseline, footnote |
| `gemini-4-price-context.webp` | chart: output price per 1M tokens | Google, Anthropic, OpenAI official pages; rumor hatched and labeled | 1440×810, 44,174 B | Yes: all five $ labels, RUMOR label, zero baseline, footnote |

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
- Automatic check command and actual result: `publish-post.mjs --dry-run` passed both languages with a temporary stand-in thumbnail (removed afterwards; the real sketch is pending); `npm run check` exit 0
- Mobile/desktop visual check and actual result: pending
- Live URLs/listings/images/language switch/search/feed checks: pending
- Remaining limitations: The Information original paywalled; leak has no primary source; community section and sketch pending from Codex
