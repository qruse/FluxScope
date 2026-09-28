# Astra vs Opus 5.5 rewrite

- Checked: 2026-09-28, Asia/Seoul
- Route: existing D1 bilingual article; preserve gpt-6-sol-luna-opus-5-5-cost-per-success and original publishedAt
- Reader question: why has my preferred choice shifted from Astra's Fable challenge to Opus 5.5 for value and finished output?
- Conclusion: user prefers Opus on both; lower standard token rates and maker-reported FrontierCode results support trying it first, not universal superiority
- User comment: Astra initially threatened Fable, then Opus 5.5 won on value and output; no controlled personal test or time saving supplied
- Before editing: both live pages read in full; match current Git payloads, last updated September 27 09:12 UTC; original payloads are rollback copies in Git

## Claim ledger
| Claim | Kind | Opened original source | Scope |
| --- | --- | --- | --- |
| Astra challenged Fable | User opinion + maker evidence | https://openai.com/index/gpt-6-astra/ AutomationBench table | 41.4% Astra vs 31.4% Fable 5.1; task-specific, not universal |
| Astra $10 input/$50 output | Official rate | https://developers.openai.com/api/docs/pricing Standard short context | USD per 1m; other tiers excluded |
| Opus $4/$20 | Official rate | https://www.anthropic.com/claude-opus-5-5 Pricing | Standard API, not Fast or subscription |
| 60% lower rates; $22.50 vs $9 | Calculation | Inputs above | 1m fresh input + 250k output across requests, excluding tools/cache; no task-cost claim |
| FrontierCode default 54.6 vs Astra top 53.3 at ~1/5 cost | Maker-reported evaluation | Anthropic launch Coding section | Different effort settings, not own independent test; table max54.4 must not be conflated with default54.6 |
| AutomationBench Astra41.4 vs Opus40.0 | Maker-compiled Zapier test | Anthropic launch table and footnote2 | No fallback for Opus; does not support blanket win |
| Sunward Astra attribution | Creator report | https://github.com/yjrocks712/Sunward-by-GPT-6-Astra/blob/main/README.md and THIRD_PARTY_NOTICES.md | Interactive Codex/Unity project; not independent model verification |
| Tidewater Opus attribution | Creator report | https://github.com/dgreenheck/tidewater repository description and README | Evolving WebGPU game; existing third-party assets included, no one-shot claim |

## Community evidence
| Paraphrase | Source | Limits |
| --- | --- | --- |
| Opus productive, Astra/Fable stronger on async-runtime architecture | https://www.reddit.com/r/codex/comments/1wpveoe/astra_vs_opus_55_my_impressions_on_hard_project/ | Original author comment read; individual report |
| Opus fixed a bot while Astra consumed much quota without fixing | Same thread, s_a_m_12344 comment | Individual anecdote; no actual API bill provided; omit percentage/time claims |

## Images plan
- One new generated rough notebook thumbnail: Astra Fable challenger → Opus lower rates / preferred finished work, expressly opinion and public evidence
- Sunward original docs/images/driving.png screenshot; third-party notices explicitly apply MIT to screenshots and procedural assets. Credit Sunward contributors; full MIT included
- Tidewater docs/screenshot.jpg screenshot in project documentation; MIT code/associated documentation, assets separately credited in CREDITS (CC0/ MIT/OFL/Apache). No game binaries, fonts or audio redistributed. Full MIT and credits included
- Both screenshots resized/encoded to WebP only, no synthesized replacement or visual retouching. Different projects/prompts/assets/time; showcases, not matched benchmark
- Visual inspection: actual car/driving HUD and pier/ocean/fishing rod. English-only labels; in-game CR is fictional game score, not a monetary price label

## Review
- No relevant internal article: only phone and car posts, no forced link
- English master then Korean adaptation; remaining checks recorded after execution
- Bilingual review: matching prices, 60% arithmetic, 54.6/53.3 FrontierCode attribution and limitations, 41.4/40.0 counterexample; user preference retained without invented hands-on tasks
- Voice: three factual dry observations per edition; screenshots visibly inspected, no generated model output substituted
- Uploaded optimized assets: hero 1500x1000 159706 bytes; Sunward 1600x900 105360 bytes; Tidewater 1600x792 128408 bytes. Media URLs recorded in the paired payloads
- Regression fixtures repaired: old model wording and image path caused two tests to mutate nothing after rewrite; now select structural bullet/image, preserving assertions. The fenced-heading test also now inserts its fixture reliably
- API structure passed; one Korean emphasis delimiter issue caught and corrected before publication
- Full npm run check passed: 12 regression cases, bilingual editorial validation, Astro zero errors/warnings, 43-page build/internal links and performance budgets. Stale generated dist CSS initially doubled the audit total; moving the old generated build aside produced a clean 36.0KB CSS audit without changing any budget
- 390px visual verification unavailable: current cloud-browser API has no viewport control. Existing responsive template unchanged; desktop production inspection to follow. This limitation is not a claimed mobile pass

## Production release
- Source commit b9537c452d428240c49dcd0af6d29874919c217a; GitHub integrity check succeeded; Cloudflare deployed the license resource (200, exact notice content)
- Authenticated existing-post updates succeeded: en updatedAt 2026-09-28T05:36:00.915Z; ko 2026-09-28T05:36:08.059Z. Original publishedAt preserved in both; URLs unchanged
- Both live pages HTTP200 with matching title, all three new image URLs, Sunward/Tidewater prose, source notices, language-switch links and updated schema dates
- All three live images returned 200 image/webp and loaded at the expected dimensions. Desktop screenshots inspected for hero, body text and both real project examples; no page-wide overflow at 1363px viewport
- Clicked EN language switch and confirmed matching English headline, summary and dates
- Home and AI category in both languages, both API search results and RSS contain the new title. Dynamic sitemap includes the existing slug; license text is public at /licenses/astra-opus-examples.txt
- Mobile visual limitation remains as recorded above; not a full cross-device test
