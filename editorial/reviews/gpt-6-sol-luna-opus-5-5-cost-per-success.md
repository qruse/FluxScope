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
