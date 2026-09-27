# Review: gpt-6-sol-luna-opus-5-5-cost-per-success
- Checked date/time and timezone: 2026-09-27, Asia/Seoul
- Live URLs and storage route (static/API): D1/API; `/posts/gpt-6-sol-luna-opus-5-5-cost-per-success/` and `/en/posts/gpt-6-sol-luna-opus-5-5-cost-per-success/`
- Reader question: GPT-6 Sol and Luna halve token prices; what does a finished task actually cost against Opus 5.5, and which work belongs where?
- Supported conclusion: per-token ratios mislead in both directions because output-token use differs (AA: Opus 2x Sol per token but ~5.6x per task; Luna 20x cheaper per token but ~15x per task). Route by what can be checked cheaply and measure cost per accepted task on your own work
- Scope: standard API rates in USD; AA measurements at max reasoning effort on AA Intelligence Index v4.3.2; not subscription limits
- User experience: earlier source record attributes to the user that Sol/Luna felt like excellent value and Opus 5.5's finished output felt strong. Used once, labeled as impression, not measurement
- Revision reason: user rejected the previous GPT-written text; full text rewrite, images unchanged

## Claim ledger
| Claim | Kind | Source URL and location | What was checked | Qualification/calculation |
| --- | --- | --- | --- | --- |
| Sol $2/$0.20/$10; Luna $0.10/$0.01/$0.50 (input/cached/output per 1M) | Official price | https://developers.openai.com/api/docs/pricing — Standard table | Read table rows `gpt-6-sol`, `gpt-6-luna` | Standard, short context. openai.com launch post blocked by bot challenge; official developer pricing page used instead |
| GPT-5.6 Sol $4/$20, Luna $0.20/$1.20 → "roughly half" | Third-party + official | https://artificialanalysis.ai/articles/gpt-6-sol-and-luna-push-the-cost-efficiency-frontier ; https://simonwillison.net/2026/Sep/22/opus-and-sol-and-luna/ | Both list the same predecessor prices | Luna output is a 58% cut, so "roughly half", not "half" |
| Batch/Flex 50%, Fast mode 2x (OpenAI) | Official price | https://developers.openai.com/api/docs/models/gpt-6-sol — Pricing notes | Read notes; same on Luna page | — |
| 1.05M context, 128K max output, >272K input → 2x input/cache and 1.5x output for the full request; default effort medium | Official spec | https://developers.openai.com/api/docs/models/gpt-6-sol and /gpt-6-luna | Read spec and pricing notes on both pages | AA lists Sol at 872k context; article uses OpenAI's figure |
| Sol 270K+20K = $0.74; 300K+20K = $1.50 | Our calculation | Rates above | 0.27×2+0.02×10=0.74; 0.30×4+0.02×15=1.50 | Illustrative, standard processing, no cache |
| 1,050K − 272K = 778K | Our calculation | — | Arithmetic | Used as a joke about the unpriced-looking remainder |
| Opus 5.5 $4/$20; cache reads $0.20; Fast mode $8/$40; cache reads are most of agentic/coding cost | Official price / maker claim | https://www.anthropic.com/claude-opus-5-5/ — "Cost and speed" and pricing table | Read page text | Cache-read share is Anthropic's own statement |
| AA Intelligence Index: Luna 37, Sol 48, Opus 58; cost per task $0.07 / $1.06 / $5.98 (all max) | Third-party measurement | https://artificialanalysis.ai/models/gpt-6-luna , /models/gpt-6-sol , /models/claude-opus-5-5 (summary paragraphs); articles above | Read each model page summary | Max effort, AA's 10-eval suite |
| Output tokens per task: Luna ~51k, Sol ~31k, Opus ~119k | Third-party measurement | AA Sol/Luna article ("31k", "51k"); https://artificialanalysis.ai/articles/claude-opus-5-5 ("~119k") | Read key takeaways | Per Intelligence Index task |
| Ratios 5.6x, ~15x, 3.8x, 1.6x, 20x, 2x | Our calculation | Values above | 5.98/1.06=5.64; 1.06/0.07=15.1; 119/31=3.84; 51/31=1.65 | From AA's rounded values; stated as approximate |
| GDPval-AA regression Sol ~−100 Elo, Luna ~−75; cause: weaker presentation, deliverables omitting rubric elements | Third-party measurement | AA Sol/Luna article, "Mix of improvement and regression" | Read paragraph | Versus GPT-5.6 predecessors |
| AA-Omniscience: Sol hallucination 92%→60%, attempts 83% vs 99%, accuracy 59%→54% | Third-party measurement | AA Sol/Luna article, "Significant reduction in hallucination" | Read paragraph | Max effort |
| Opus 5.5 max hit 128K output limit twice on pelican SVG; $2.56 each, nearly 20 minutes | Third-party anecdote | Simon Willison post, section "Claude Opus 5.5 max over-thinks to the point of breaking" | Read section | Author wording kept: "Those two failures each cost me $2.56 and took nearly 20 minutes" |
| Routing table and ledger | Editorial proposal | Reasoning from the evidence above | — | Labeled as proposal, not a controlled comparison |

## Community evidence
| Published paraphrase | Exact thread/comment URL | Context and limits | Checked on |
| --- | --- | --- | --- |
| Early tests preferred Opus 5.5 medium over Sol max at similar price; reply says compare Opus medium vs Sol high | https://news.ycombinator.com/item?id=49806512 (reply by cbg0 underneath) | Self-described "very very early tests" | 2026-09-27 via HN Algolia API item 49805509 |
| Automatic transmission analogy; reply prefers choosing the car over a router | https://news.ycombinator.com/item?id=49806160 (reply by willy_k) | Opinion | 2026-09-27 |
| Luna got a button wrong because it searched the tester's machine and reused earlier builds of the same design made with other models | https://news.ycombinator.com/item?id=49806791 | One image-to-HTML test | 2026-09-27 |
| Skepticism that prices will last; cost arguments invalid because the vendor sets prices | https://news.ycombinator.com/item?id=49805678 ; https://news.ycombinator.com/item?id=49806049 | Opinion | 2026-09-27 |

Previous revision cited two Reddit threads. Reddit blocked automated access from this environment (403), so they could not be re-read and were dropped from the published text rather than carried over unchecked.

## Images
| Asset | Purpose/type | Data provenance | Dimensions/bytes | Visually checked |
| --- | --- | --- | --- | --- |
| `/images/posts/ai/gpt-6-cost-notes-v2.webp` | sketch thumbnail | Output rates $0.50/$10/$20 match OpenAI/Anthropic pages | 133,596 B | Yes, unchanged; labels match text |
| `/images/posts/agi/gpt-6-api-prices.webp` | chart | Standard input/output rates; excludes cache, tools, retries | 27,982 B | Yes, unchanged; six values match the rate table |
| `/images/posts/ai/acceptance-pipeline.webp` | pipeline | Editorial proposal; formula matches the text | 33,714 B | Yes, unchanged |

## Review
- Reader value/evidence/reasoning/voice: new angle is per-task cost vs per-token price, backed by one third-party source measuring all three models on the same basis; official pricing traps (272K threshold, cache parity) added; opinion kept separate
- Korean-English parity: numbers, sources, caveats and Q&A compared line by line
- Related article search and selected link, or reason no link helps: catalog has no other AI post; no internal link
- Automatic check command and actual result: `npm run check` passed (10 editorial tests, quality check, build, links, performance); both payloads also pass `validateEditorial` + `validateRendered`
- Mobile/desktop visual check and actual result: pending publication
- Live URLs/listings/images/language switch/search/feed checks: pending publication
- Remaining limitations: AA measures max effort on its own suite, not the reader's workload; community items are individual comments
