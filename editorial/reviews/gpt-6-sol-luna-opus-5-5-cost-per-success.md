# Review: GPT-6 Luna / Sol / Opus 5.5
- Checked: 2026-09-27, Asia/Seoul
- Route: D1/API; `/posts/gpt-6-sol-luna-opus-5-5-cost-per-success/` and `/en/posts/gpt-6-sol-luna-opus-5-5-cost-per-success/`
- Reader question: where can a cheaper model actually reduce the cost of accepted work?
- Conclusion: start with work whose errors can be checked; compare total cost per accepted task and review minutes
- Experience provenance: prior local source record `gpt-6-cost-sources.md` attributes the original experience note to the user: Sol/Luna felt like excellent value, while Opus 5.5's finished output felt strong. No controlled success rate, specific task duration or task-by-task superiority was supplied. This revision removes the old expansion into claimed personal task-specific testing

## Claim ledger
| Claim | Kind | Original source/location | Checked qualification |
| --- | --- | --- | --- |
| Luna $0.10/$0.50; Sol $2/$10 per 1m input/output tokens | Official rate | https://openai.com/index/introducing-gpt-6-sol-and-luna/ — API pricing table | Standard uncached API; not subscription limits |
| Opus $4/$20 | Official rate | https://www.anthropic.com/claude-opus-5-5/ — pricing | Not Fast mode or cached rates |
| $0.225 / $4.50 / $9 | Calculation | Formula in article | 1m input + 250k output aggregate; no context-window claim; failed calls count in total spend |
| Routing candidates | Editorial proposal | Price plus explicit acceptance checks | Not a controlled comparison or factual claim of model superiority |

## Community evidence
| Paraphrase | Exact source | Context |
| --- | --- | --- |
| Reporting-agent omissions | https://www.reddit.com/r/OpenAI/comments/1wnxg0n/luna_6_is_a_massive_downgrade_over_luna_56_misses/ | Individual maintainer report; no general failure rate |
| Luna 29/30 | https://www.reddit.com/r/PiCodingAgent/comments/1wpcis6/opus_55_vs_gpt6_sol_luna_in_piagent_results_on_my/ | Ten tasks, three runs each, pi-agent and automated verifiers; short scoped coding work; checked original post |

## Images
- Hero `/media/c933da7a-a5f1-4568-bc53-163d39f440f0.webp`: rough conceptual workflow notebook; original local copy viewed; confirm live bytes during release
- Body `/images/posts/agi/gpt-6-api-prices.webp`: code-generated official rate comparison; all six labels match the rate table; legacy path preserved

## Review
- Reader value: each article now answers a specific purchase/workflow question with a concrete next step
- Voice: short Korean notes retained; Avante criticism preserved; no invented hands-on experience added
- Bilingual review: amounts, units, conditional recommendations and limitations compared manually
- Related articles: current catalog has one AI, one phone and one car topic; none directly extends the other article's specific question, so no forced internal link
- Automated checks: `npm run check` passed; 8 editorial regression cases passed, 40 generated pages checked, no broken internal links, image and performance budgets passed
- API integration: authenticated invalid article returned 422 in a local Worker test with an isolated DB stub
- Visual assets: all existing reference sketches and charts viewed; numeric labels checked against the article; no chart regenerated
- Production and browser verification: pending deployment; record the result in `editorial/release-2026-09-27.md`
- Limits: automatic checks cover structure, not factual truth or image meaning; community accounts are anecdotes; full mobile viewport check remains a manual gate

## Final voice/image/currency revision — 2026-09-27 KST
- English master with natural Korean counterpart; cynical, humorous observations grounded in pricing, marketing and verification friction; no invented hands-on experience
- Exactly one generated notebook thumbnail; approved information density preserved, slightly less polished lines/lettering; all image text English
- Images: AI 3 (sketch/chart/pipeline), iPhone 3 (sketch/chart/chart), Avante 4 (sketch/3 charts). All factual plots produced by code, not generation
- API price evidence unchanged: standard uncached USD rates. Pipeline is an editorial operating proposal; it does not claim measured superiority. Review minutes remain separate from dollars
- Final checks: 10 regression tests and full build passed; six bilingual live articles and ten unique images verified; desktop browser checked. 390px browser/real-device inspection not performed (viewport control unavailable in current browser interface)

## API wording alignment — 2026-09-27 KST
- Change: retry/billing caveat bullet in the price section aligned across languages. Korean previously stated as certain ("길어지고 … 달라짐") what English qualified with "can"; both now say retries can lengthen context and output, caching and tool use can change the bill. No numbers, sources, images or conclusions changed
- Pre-edit backup: live D1 rows read before writing; body, title and dates matched the previous Git payloads (commit 4336c8f), which serve as the restore copy
- Published via authenticated `POST /api/posts` with `If-Match: update`: en 200 (updated 2026-09-27T03:14:56Z), ko 200 (updated 2026-09-27T03:14:57Z); original publishedAt preserved
- Live checks: both article URLs 200 with the new sentence, published and updated dates shown, language-switch links present, thumbnail and two body images 200 `image/webp`, `/ai/` and `/en/ai/` listings include the post, search finds the new English wording
- Not performed: 390px browser inspection (text-only change)

## Full text rewrite with linked community reactions — 2026-09-27 KST
- Scope: title, description, tags and entire body rewritten from re-checked sources in both languages; slug, category, publishedAt, thumbnail, body images and visualTypes unchanged
- Rule change requested by the user: community reactions now link their original sources in the published section (AGENTS.md §5, README, validator, regression test updated)
- Reader question: do Luna/Sol's low token rates actually lower the cost of accepted work compared with Opus 5.5?
- Conclusion: rates are verified, but cached input, tier fine print and tokens per task decide the bill; measure API cost per accepted task and review minutes separately
- User experience: unchanged, the user's supplied impression only (Sol/Luna good value; Opus 5.5 finished output strong). No success rate or task-specific claim added

### Claim ledger
| Claim | Kind | Source and location | Checked qualification |
| --- | --- | --- | --- |
| Luna $0.10 in / $0.01 cached / $0.50 out; Sol $2 / $0.20 / $10 | Official rate | https://developers.openai.com/api/docs/pricing — Flagship models, Standard, Short context | openai.com announcement returned 403 from this environment; the official pricing page was used instead |
| Long context: Sol $4/$15, Luna $0.20/$0.75; Batch and Flex half of standard | Official rate | Same page, Long context columns and Batch/Flex tables | Long-context threshold for GPT-6 not stated on the page, so none is claimed |
| GPT-5.6 Sol $4/$20, GPT-5.6 Luna $0.20/$1.20 | Official rate | Same page, All models Standard table | Luna output cut (1.20−0.50)/1.20 = 58.3% → "58%" |
| Opus 5.5 $4/$20, cache reads $0.20, Fast mode $8/$40 | Official rate | https://www.anthropic.com/claude-opus-5-5/ — Pricing table and Fast mode paragraph | Not cache-write or batch |
| Cache reads are the majority of agentic/coding costs; 40% cheaper than Opus 5 on typical workloads at default settings | Maker claim | Same Anthropic page, pricing paragraph | Attributed to Anthropic's tests |
| $0.225 / $4.50 / $9.00 | Our calculation | Formula shown in article | 1m input + 250k output aggregate, uncached, standard tier |
| Routing table and five-step procedure | Editorial proposal | Price plus checkability | Labelled as a proposal, not a measured ranking |

### Community evidence (read in full via the Hacker News API on 2026-09-27)
| Published paraphrase | Exact URL | Context and limits |
| --- | --- | --- |
| Luna 6 used more tokens than 5.6 for the same result; savings wiped out | https://news.ycombinator.com/item?id=49856057 | One team's internal cybersecurity evals; no public data |
| 30/36 (GPT-6 Luna) vs 33/36 (GPT-5.6 Luna); suite tuned for 5.6; kept 5.6 | https://news.ycombinator.com/item?id=49814239 | One app's 36 agent+tool scenarios |
| Astra plans, Luna codes, Sol reviews/tests; ~20% more usage-efficient and ~20% faster | https://news.ycombinator.com/item?id=49806361 | Self-reported, one setup in Codex |
| Artificial Analysis index cost-to-run higher than previous Opus | https://news.ycombinator.com/item?id=49805082 | Commenter's reading of a third-party index; attributed as such |
- Previous Reddit reactions were dropped: reddit.com and old.reddit.com now return a login wall/403 to this environment, so they could not be re-read. Search snippets were not used as evidence

### Images
- Unchanged; all three viewed again against the new text: thumbnail (Luna $0.50, Sol $10, Opus 5.5 $20 output; retry/review/checks), rate chart (input/output rates match the table), acceptance pipeline (matches the five-step procedure)

### Checks
- Shared validator and rendered-emphasis check: 0 errors for both payloads; regression tests 10/10
- Live API before the Worker redeploy: en POST returned 422 with only the old community-link rule; nothing was written. Publication waits for the validator change to reach production

### Title/summary voice pass — 2026-09-27 KST
- Korean title, description and 3-line summary rewritten in the same 음슴체 as the body; English title/description/TL;DR matched as short field notes. Facts, numbers and links unchanged; validator 0 errors, tests 10/10
