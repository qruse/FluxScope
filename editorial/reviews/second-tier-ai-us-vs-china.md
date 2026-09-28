# Review: second-tier-ai-us-vs-china
- Checked date/time and timezone: 2026-09-28, 12:30–13:00 UTC (21:30–22:00 Asia/Seoul)
- Live URLs and storage route (static/API): new D1 article via API, `/posts/second-tier-ai-us-vs-china/` and `/en/posts/second-tier-ai-us-vs-china/`; not yet published (awaiting Codex sketch and community section)
- Reader question: who comes after OpenAI and Anthropic, US big tech (Google, SpaceXAI/Grok, Meta) or the Chinese labs, and are the Chinese models really the value pick?
- Supported conclusion: on Artificial Analysis's independent index the chasing pack sits at 39–48 (Meta Muse Spark 1.3 48, Grok 4.7 and MiMo-V2.6-Pro 46); per index task only Xiaomi ($0.13) and DeepSeek ($0.27) are clearly cheap, while Qwen3.8 Max, GLM-5.3 and Kimi K3 cost more than Opus 5.5 at high effort; Anthropic's Sep 10 report accuses all five Chinese labs in the comparison of distilling Claude, so hosting and data terms matter for sensitive prompts
- Scope: API models as listed by Artificial Analysis Intelligence Index v4.3.2 on 2026-09-28, each at the setting named; official standard list prices in USD per 1M tokens
- User experience: none. User's supplied belief (2026-09-28): "내가 알기로 가성비가 아주 좋다고 알고있는데". Used once as a stated belief ("I had filed Chinese AI under cheap"), not as a test

## Claim ledger
| Claim | Kind | Source URL and location | What was checked | Qualification/calculation |
| --- | --- | --- | --- | --- |
| Index scores and cost per task for all charted models (Opus 5.5 max 58/$5.98, high 54/$1.82; Astra max 53/$3.26; Sol max 48/$1.06; Muse Spark 1.3 max 48/$1.60, xhigh 45/$1.37; Grok 4.7 high 46/$2.73; MiMo-V2.6-Pro 46/$0.13; Qwen3.8 Max (0902) 45/$5.41; GLM-5.3 max 45/$2.01; Kimi K3 max 44/$2.00; Gemini 3.8 Flash high 41/$1.24; DeepSeek V4.1 Flash max 39/$0.27; V4 Pro 0813 max 36/$0.67; Gemini 3.1 Pro Preview 30; Llama 4 Maverick 10) | Third-party measurement | https://artificialanalysis.ai/leaderboards/models | Read three times via page fetch with consistent values; Sol and Opus high rows re-quoted with context and speed columns | Not our measurement; setting named beside each model |
| Index v4.3.2 = 10 evaluations incl. GDPval-AA, Terminal-Bench 4.0, HLE | Third-party methodology | https://artificialanalysis.ai/methodology/intelligence-benchmarking | Read | — |
| Cost per task definition | Third-party methodology | https://artificialanalysis.ai/evaluations/artificial-analysis-intelligence-index?eval-cost=intelligence-vs-cost-per-task | Quote: "Weighted average cost (USD) per Artificial Analysis Intelligence Index task, segmented by token type" | Includes reasoning and cache per methodology |
| MiMo-V2.6-Pro is AA's top open-weights model | Third-party | AA models page ("top open weights model"), VentureBeat | Read | — |
| 1/14, 1.5×, 2×, 92%, 8 and 9–10 points | Calculation | 1.82/0.13 = 14.0; 2.73/1.82 = 1.50; 5.41/2.73 = 1.98; (1.25−0.10)/1.25 = 92%; 54−46 = 8; 54−45 = 9, 54−44 = 10 | Recomputed | "Token use" is inference from equal rate cards |
| Opus 5.5 $4/$20 | Official | https://platform.claude.com/docs/en/about-claude/models/overview | Read Sep 28 | — |
| GPT-6 Sol $2/$10 | Official | https://developers.openai.com/api/docs/pricing | Read Sep 28 | Standard short context |
| Muse Spark 1.3 $1.25/$4.25; Contributor $0.10/$0.20, "used to improve our products" | Official | https://dev.meta.ai/models/muse-spark/ | Read | — |
| Muse Spark 1.3 released Sep 2; max available; open-weights release promised without date | Official | https://research.meta.ai/blog/introducing-muse-spark-1-3 | Read | VentureBeat earlier said max was partner preview; Meta blog now says available |
| Newest meta-llama model on Hugging Face from April 2025 | Observation | huggingface.co/api/models?author=meta-llama | Checked | Not stated in article beyond "old open model" |
| Grok 4.7 Sep 21; "half the price of comparable models"; $2/$6 | Official | https://x.ai/news/grok-4-7 ; https://docs.x.ai/developers/pricing | Read | <200K prompt tier |
| xAI merged into SpaceX, renamed SpaceXAI | Reported | https://en.wikipedia.org/wiki/SpaceXAI ; CNBC 2026-02-03 | Read search results | Background only |
| Gemini 3.8 Flash $0.75/$3.75 to Dec 31, $1.50/$7.50 from Jan 1; 3.1 Pro preview newest Pro | Official | https://ai.google.dev/gemini-api/docs/pricing ; https://ai.google.dev/gemini-api/docs/models | Read | — |
| MiMo-V2.6-Pro $0.435/$0.87; MIT | Official endpoint / HF | https://openrouter.ai/api/v1/models/xiaomi/mimo-v2.6-pro/endpoints (provider "Xiaomi"); HF tags license:mit | Checked | Xiaomi pricing page is JS-only; OpenRouter shows Xiaomi's own endpoint |
| Qwen3.8 Max $2/$6 international (Singapore) | Official | https://www.alibabacloud.com/help/en/model-studio/qwen3-8-max | Read | Beijing region lower; article says international |
| Qwen3.8 Max weights not public; smaller Qwen3.8 open | Observation | HF API search author=Qwen | Checked | — |
| GLM-5.3 $1.40/$4.40; weights on HF with own license | Official / HF | https://docs.z.ai/guides/overview/pricing ; HF zai-org/GLM-5.3 license "glm-5.3" | Read | — |
| Kimi K3 $3/$15; Kimi K3 License; third-party hosts from $1/$9 | Official / HF / marketplace | https://platform.kimi.ai/docs/pricing/chat ; HF moonshotai/Kimi-K3 ; OpenRouter endpoints API | Read | Lowest listed providers InferenceNet and Wafer |
| DeepSeek V4.1 Flash $0.15/$0.60 off-peak, double peak; peak 01–04 and 06–10 UTC weekdays | Official | https://api-docs.deepseek.com/quick_start/pricing | Read | KST = UTC+9 |
| DeepSeek says V4.1 Flash beats V4 Pro | Reported | https://siliconangle.com/2026/09/10/deepseek-releases-v4-1-flash-says-it-outperforms-flagship-v4-pro/ | Headline read | AA scores confirm independently |
| Anthropic report Sep 10: seven labs, counts per lab, Moonshot/DeepSeek relayed users' requests, DeepSeek/Xiaomi/Moonshot fed user conversations incl. names, emails, company data | Primary report (allegation) | https://www-cdn.anthropic.com/e50be2e51e7695dc4b1366a37a245a597377d3b5/Anthropic-Detecting-and-countering-091026.pdf pp. 145–153 | PDF text extracted and read | Attributed as Anthropic's findings |
| No public response from named labs | Search | TechCrunch Sep 10, TNW Sep 22 | Read | "I found no public response" |
| CAC summoned seven, probing DeepSeek and Moonshot, no penalty | Reported | https://thenextweb.com/news/china-cac-probe-deepseek-moonshot-anthropic-data (from The Information) | Read | Attributed |
| Dario Amodei essay calls for crackdown on distillation | Primary | https://darioamodei.com/post/we-must-pace-the-frontier | Verified in the Sonnet 5.5 review earlier today | — |

## Community evidence
| Published paraphrase | Exact thread/comment URL | Context and limits | Checked on |
| --- | --- | --- | --- |
Pending: Codex adds the section from the Reddit brief below

## Images
| Asset | Purpose/type | Data provenance | Dimensions/bytes | Visually checked |
| --- | --- | --- | --- | --- |
| `second-tier-ai-us-vs-china-notebook.webp` | sketch thumbnail | Pending Codex, from the brief below | — | — |
| `/media/db3af5f7-a852-4c0b-9885-92fea18266bb.webp` | chart: index by model, grouped by OpenAI/Anthropic, US second tier, China | AA leaderboard 2026-09-28 | 1440×810, 42,436 B | Yes: 11 bars, values, legend, zero baseline, source line |
| `/media/44ebf994-5064-406a-94b1-1088f046dc78.webp` | chart: index vs cost per task (log x) | AA leaderboard 2026-09-28 | 1440×810, 49,562 B | Yes: 12 points incl. Opus high, $ labels, no label collisions after fix |

Palette validated with the dataviz validator (#2a78d6, #eb6834, #1baf7a on #f5f4f0): all checks pass; contrast warning mitigated by direct value labels.

## Sketch brief
```
Product: SECOND TIER AI: US vs CHINA
Hero doodle: a simple two-step podium, empty, with a small price tag hanging off the lower step
Callouts (2–4, exact text): "Muse Spark 1.3: 48" | "MiMo-V2.6-Pro: 46 for $0.13/task" | "Qwen3.8 Max: $5.41/task" | "Opus 5.5: 58"
Bottom mini-flow (optional, ≤3 icons + arrows): none
Red accent on: the price tag
Output: public/images/posts/ai/second-tier-ai-us-vs-china-notebook.webp (local file only; uploaded by publish-post.mjs)
```

## Reddit brief
- Reader question: are Chinese models (MiMo-V2.6-Pro, DeepSeek V4.1 Flash, Qwen3.8 Max, GLM-5.3, Kimi K3) really the value pick against Grok 4.7, Muse Spark 1.3 and Gemini 3.8 Flash, and do people care about Anthropic's distillation report?
- Queries: "MiMo-V2.6-Pro" cost OR price; "Qwen3.8 Max" expensive OR tokens; "Anthropic distillation report" Chinese labs; "Muse Spark 1.3" contributor
- Subreddits: r/LocalLLaMA, r/singularity, r/ClaudeAI, r/OpenAI

## Review
- Reader value/evidence/reasoning/voice: one question (who is next and is China cheap); answer via independent index plus per-task cost; allegation kept attributed and balanced with Anthropic's competitor role
- Line-by-line cut pass (AGENTS §4): removed a "not X, but Y" excess (kept one), colon reveals, `~인 셈임`, `사실상`, `X 대 Y` score list. Headings alone: 2군 1등이 OpenAI 중간 모델과 동점 → 중국 AI, 싼 건 다섯 곳 중 두 곳뿐 → Grok은 단가 반값인데 과제당은 1.5배 → Anthropic 보고서에 중국 5곳이 전부 나옴 → 그래서 누구한테 뭘 시킴?
- Korean-English parity: same numbers, tables, links and caveats; Korean written from facts
- Related article search and selected link: Gemini 4 release date (Google's next model) and the Astra vs Opus same-prompt test (how to measure cost per finished task)
- Automatic check command and actual result: `publish-post.mjs --dry-run` validation passed; `npm run check` recorded at commit
- Mobile/desktop visual check and actual result: pending publication
- Live URLs/listings/images/language switch/search/feed checks: pending publication
- Remaining limitations: AA page read through a fetch tool, values consistent across three reads; Xiaomi price from Xiaomi's OpenRouter endpoint because its own page renders client-side
