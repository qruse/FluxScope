# Review: gpt-6-astra-minor-naming
- Checked date/time and timezone: 2026-09-28, 08:40–09:00 UTC (17:40–18:00 Asia/Seoul)
- Live URLs and storage route (static/API): new D1 article via API, `/posts/gpt-6-astra-minor-naming/` and `/en/posts/gpt-6-astra-minor-naming/`; published 2026-09-28T11:10:31.118Z by Codex with `publish-post.mjs`
- Reader question: what is GPT-6 Astra Minor, does OpenAI's GPT-6 naming make sense, and does Opus 5.5 force OpenAI to ship something like GPT-6.1?
- Supported conclusion: Astra Minor is an unconfirmed Azure registry name with no specs, absent from the same file on Sep 28; Sol moved from GPT-5.6 flagship to GPT-6 middle tier and inherited Terra's "balance intelligence and cost" line; Opus 5.5 wins 3 of 5 percentage rows plus GDPval on Anthropic's table at 40% of Astra's price; no GPT-6.1 report found; DevDay Sep 29 names no model
- Scope: OpenAI and Anthropic standard short-context API list prices, USD per 1M tokens, as of 2026-09-28
- User opinion: user's own words (2026-09-28): "Astra Minor 소식도 정리해봐 아니 그냥 sol terra luna로 유지하지 네이밍 센스 수준.. ㅋㅋ 그리고 opus 5.5보면 openai는 빨리 6.1 시리즈 출시해야할듯". Used once each as "My take" (naming) and "My view" (6.1); no measurements added

## Claim ledger
| Claim | Kind | Source URL and location | What was checked | Qualification/calculation |
| --- | --- | --- | --- | --- |
| Sep 22 locdd.com post; Azure playground config listed `gpt-6-sol`, `gpt-6-luna`, `gpt-6-astra-minor`; no confirmation; no specs exist | Reported | https://www.orcarouter.ai/blog/gpt-6-astra-minor-leak | Read; article cites https://ai.azure.com/modelcache/widgets/PlaygroundConfig.json | The locdd post itself was not opened |
| Azure file on Sep 28 lists gpt-6-astra, gpt-6-sol, gpt-6-luna, no astra-minor | Our check | https://ai.azure.com/modelcache/widgets/PlaygroundConfig.json fetched 2026-09-28 ~08:45 UTC (HTTP 200, 33,665 B) | grep for `gpt-6[a-z0-9.-]*`: astra ×5, luna ×5, sol ×5 | Absence does not prove cancellation; three possibilities stated |
| GPT-6 catalog: Astra "Our most capable model…"; guidance "choose GPT-6 Sol to balance intelligence and cost"; no Minor/mini entry | Official | https://developers.openai.com/api/docs/models | Read | — |
| GPT-5.6 Sol "Flagship model for complex professional work", $4/$20 | Official | https://developers.openai.com/api/docs/models/gpt-5.6-sol | Read | — |
| GPT-5.6 Terra "designed for workloads that balance intelligence and cost", $2/$12 | Official | https://developers.openai.com/api/docs/models/gpt-5.6-terra | Read | — |
| Prices: Astra $10/$50, GPT-6 Sol $2/$10, GPT-6 Luna $0.10/$0.50, GPT-5.6 Luna $0.20/$1.20 | Official | https://developers.openai.com/api/docs/pricing ; model pages | Read 2026-09-28 | Standard short context; Astra >272K input costs more. Some third-party posts quote older GPT-5.6 prices ($5/$30 etc.); current official page used |
| Astra Sep 3 (limited preview; stable Sep 4); Sol and Luna Sep 22 | Reported | https://en.wikipedia.org/wiki/GPT-6_Astra ; TechCrunch Sep 3 headline in search | Read Wikipedia summary | openai.com pages return 403 to this environment |
| Sonnet 5 $2/$10 | Official | https://platform.claude.com/docs/en/about-claude/models/overview | Read | — |
| Opus 5.5 vs Astra: HLE 67.7/57.2; Terminal-Bench 4.0 66.4/57.9; FrontierCode 54.4/53.3; AutomationBench 40.0/41.4; Terminal-Bench-Science 58.7/64.6; GDPval-AA 1846/1542; Opus $4/$20 | Vendor-reported | https://www.anthropic.com/claude-opus-5-5 (raw HTML parsed) | All rows checked; CursorBench/OSWorld/Chartography have no Astra value | Gaps in points recomputed; 5× = 10/2 and 50/10; 2.5× = 10/4 and 50/20; 40% = 4/10 |
| Same-prompt test: Opus bill larger on 1 of 2 rounds | Third-party (our earlier article) | https://moelueker.com/blog/claude-opus-5-5-vs-gpt-6-astra via internal article | Existing verified article | Internal link only |
| No GPT-6.1 report | Search | WebSearch "OpenAI GPT-6.1 release rumor" 2026-09-28 | No relevant result | Stated as "I found no credible report" |
| DevDay Tue Sep 29, Fort Mason SF, 10 a.m. keynote Sam Altman; "A closer look at what OpenAI teams are building"; no model named | Official | https://devday.openai.com/ | Read | — |
| Sonnet 5.5 and Haiku 5.5 "in the coming weeks" | Official | https://www.anthropic.com/claude-opus-5-5 | Read | Price parity with GPT-6 Sol is conditional |

## Community evidence
| Published paraphrase | Exact thread/comment URL | Context and limits | Checked on |
| --- | --- | --- | --- |
| In the Astra Minor leak thread, one r/codex user asked how it would differ from Sol and got the answer “minor difference” | https://www.reddit.com/r/codex/comments/1wndst2/comment/pbe2zn1/ | Opened and paraphrased by Codex; Reddit returns 403 to Claude's environment, so Claude checked only that the live bullet and link match this row | 2026-09-28 (Codex) |
| One API user in a separate r/codex thread found Astra more expensive than Opus 5.5 for document and code reviews, without publishing a matched cost log | https://www.reddit.com/r/codex/comments/1wq866g/comment/pc1xki3/ | Opened and paraphrased by Codex; Reddit returns 403 to Claude's environment, so Claude checked only that the live bullet and link match this row | 2026-09-28 (Codex) |
| Another reviewer used Astra Low alongside Opus 5.5 High and said Astra still caught tricky cases, a useful dissent from declaring one winner for every task | https://www.reddit.com/r/codex/comments/1wq866g/comment/pc1zp4q/ | Opened and paraphrased by Codex; Reddit returns 403 to Claude's environment, so Claude checked only that the live bullet and link match this row | 2026-09-28 (Codex) |

## Images
| Asset | Purpose/type | Data provenance | Dimensions/bytes | Visually checked |
| --- | --- | --- | --- | --- |
| `gpt-6-astra-minor-naming-notebook.webp` → `/media/437a4ca1-6ad6-44d1-a040-9540b1a7d09f.webp` | sketch thumbnail | Codex, from the brief below; uploaded through `/api/images`, no Git file | 1536×1024, 80,218 B | Yes: title, star with red "?", sun with down arrow, four callouts, sun -> crossed earth -> moon; text matches the brief |
| `gpt-6-astra-minor-naming-ladder.webp` → `/media/42b71b78-0d28-4a6b-be36-434ec5f53f78.webp` (Git copy removed; byte-identical) | architecture: GPT-5.6 vs GPT-6 tier ladder | OpenAI models and pricing pages | 1440×810, 49,784 B | Yes: 7 boxes, all $ prices, quotes, Sol demoted arrow, dashed Astra Minor slot, footnote |
| `gpt-6-astra-minor-opus-vs-astra.webp` → `/media/b41487cc-fe42-4196-b22e-03ae8b24e81b.webp` (Git copy removed; byte-identical) | chart: Opus 5.5 vs Astra, 5 rows | Opus 5.5 page table | 1440×810, 47,862 B | Yes: 10 values, 5 gaps recomputed, $ prices, zero baseline, GDPval note |

## Sketch brief
```
Product: GPT-6 ASTRA MINOR
Hero doodle: a small star with a question mark inside, sitting above a sun that has a down arrow next to it
Callouts (2–4, exact text): "Sol: flagship -> middle" | "Terra: gone" | "Astra: $10 in / $50 out" | "Minor: no price, no date"
Bottom mini-flow (optional, ≤3 icons + arrows): sun -> earth (crossed out) -> moon
Red accent on: the question mark inside the star
Output: public/images/posts/ai/gpt-6-astra-minor-naming-notebook.webp
```
- Size 1536×1024 (3:2), all text English, currency `$`
- Alt text (en): Notebook sketch of GPT-6 Astra Minor with a demoted Sol, a missing Terra and the $10 / $50 Astra price

## Reddit brief
- Reader question: is GPT-6 Astra Minor real, what do people think of OpenAI's Astra/Sol/Luna naming, and is Opus 5.5 pushing OpenAI toward a GPT-6.1?
- Queries: "Astra Minor" ; "GPT-6 naming Sol Luna Terra" ; "Opus 5.5 vs Astra" / "GPT-6.1"
- Subreddits: r/OpenAI, r/ChatGPT, r/singularity, r/codex, r/ClaudeAI
- Want: one reaction on the naming, one on Astra vs Opus 5.5 value or an OpenAI response; do not repeat the r/codex thread already used in the Astra vs Opus 5.5 article

## Review
- Reader value/evidence/reasoning/voice: one question (what is Astra Minor, and does the lineup hold up); leak, our Azure check, official catalog and vendor benchmarks kept separate; user opinions scoped as "My take" / "My view"
- Line-by-line cut pass (AGENTS §4): done on both languages; headings alone: Astra Minor is one line in an Azure file → Sol went from flagship to the middle seat → Opus 5.5 took Astra's lead within three weeks → DevDay on Sep 29 with no 6.1 on the list
- Korean-English parity: same numbers, dates, links and qualifications
- Related article: Astra vs Opus 5.5 same-prompt article (same language each) for cost per task
- Automatic check command and actual result: `publish-post.mjs --dry-run` passed both languages with a temporary stand-in thumbnail (removed afterwards); `npm run check` exit 0
- Mobile/desktop visual check and actual result: 2026-09-28, Chromium at 390 px and 1280 px, ko and en: no page-wide overflow, 3/3 images loaded
- Live URLs/listings/images/language switch/search/feed checks: 2026-09-28: both URLs 200 with ko/en/x-default hreflang; language switch links both editions; thumbnail and body `/media/` images 200 `image/webp`; listed on `/`, `/en/`, `/ai/`, `/en/ai/`, both RSS feeds and `/dynamic-sitemap.xml`; live body equals the draft plus the community section; local payloads synced to live
- Remaining limitations: openai.com announcement pages blocked (403), so release dates rely on Wikipedia/TechCrunch; locdd post not opened; time-sensitive: published before DevDay (Sep 29); recheck the 6.1 section after the keynote and update through the API if OpenAI names a model
- Language revision (2026-09-28 12:21 UTC, republished with `publish-post.mjs`): both languages rewritten against AGENTS §4 "Sound like a person, not a model" (Korean translationese, colon reveals, personified punchlines, source-judging tails, overlong sections). Facts, numbers, links, images and alt text unchanged; live body equals the local payload; `publishedAt` preserved; titles changed: en "GPT-6 Astra Minor: Sol Got Demoted, and Now Astra Gets a Mini", ko "GPT-6 Astra Minor, 플래그십이던 Sol은 강등되고 이젠 마이너까지?"

Naturalness pass (2026-09-28 12:25 UTC): replaced forced jokes, metaphors and Korean calques with plain phrasing (e.g. "작업 하나당 비용", "정가", "실제 비용"); facts, numbers, links and images unchanged; titles/descriptions revised where listed in the payloads; republished, live bodies equal local payloads, publishedAt preserved
