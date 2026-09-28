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

## Rewrite 2 — same-prompt outputs (2026-09-28, Claude)
- User request: keep title, rewrite body in one-sentence bullets, replace unrelated project screenshots with outputs from the same prompt; add user's felt impression that Opus 5.5 is roomier to use (impression only, no measured limit)
- Removed: Sunward/Tidewater screenshots and the OpenAI AutomationBench Astra-vs-Fable number (openai.com returned 403 to this session; could not reopen)

| Claim | Kind | Opened source | Scope |
| --- | --- | --- | --- |
| Same prompt twice, no fixes, empty folders, Astra in Codex, Opus in Claude Code | Third-party test | https://moelueker.com/blog/claude-opus-5-5-vs-gpt-6-astra (Sep 25, 2026), full text read | One tester, one build per model per round; prompt not published |
| Runner: Opus features, 2,405 vs 358 lines; 256K vs 36K output; $15.25/62 min vs $7.09/24 min | Third-party measurement | Same | Build turn only, list API rates, follow-ups excluded |
| Island: Opus $5.40/~30 min vs Astra $6.88/27 min; features; Astra plainer than Sol but more tree/house types | Third-party measurement/observation | Same | Same |
| Totals $20.65 vs $13.97; tester uses Astra for back end | Third-party | Same | Individual workflow |
| $10/$50 Astra, $4/$20 Opus, 60% lower | Official rate + calculation | OpenAI pricing page, Anthropic Opus 5.5 page (WebFetch, 2026-09-28) | Standard API, Astra short context |
| FrontierCode 54.6% default medium vs Astra 53.3% at ~1/5 cost; AutomationBench Astra 41.4 vs Opus 40.0 | Maker-reported | Anthropic Opus 5.5 page quote | Maker claim, settings differ |

- Images: thumbnail unchanged (still accurate: lower token rates, my pick for finished work); island lineup from Moe Lueker's article with source line (user instructed news-style use with attribution); cost chart code-rendered by `scripts/visuals/astra_opus_same_prompt.py` from the figures above, 1440×810, 40 KB, visually checked
- Community: kept the two r/codex items verified by Codex earlier today; Reddit returned 403 to this session, so not re-opened by Claude
- Checks: shared validator passed both payloads; `npm run check` passed
