# Review: grok-5-terafab-space-data-centers
- Checked date/time and timezone: 2026-09-28, Asia/Seoul
- Live URLs and storage route (static/API): new D1 article via API, `/posts/grok-5-terafab-space-data-centers/` and `/en/posts/grok-5-terafab-space-data-centers/`; not yet published (awaiting Codex sketch, community section and publish)
- Reader question: can Musk's Grok 5, Terafab and space data center plans catch OpenAI and Anthropic?
- Supported conclusion: not on a near-term calendar; Grok 5 missed its "Q1 sometime" promise and sits behind Grok 4.8 and 4.9; Terafab construction runs Dec 2026 to end of 2028 and orbital compute starts "as early as 2028", with SpaceX's own filing citing untested or non-existent technology; meanwhile SpaceX rents Colossus capacity to Anthropic ($1.25B/month) and Google ($920M/month) through 2029; the user's view (leaders compound with unreleased models, so latecomers should adopt frontier AI now, even a rival's) is kept as opinion and paired with OpenAI's research report and Google's internal Claude rollout
- Scope: SpaceX/xAI public filings to Aug 2026, Musk statements Nov 2025 and Sep 2026, Artificial Analysis index v4.3.2 as read Sep 28, 2026
- User experience: user's own words (2026-09-28): "Grok5 일론머스크의 원대한 꿈은 이루어질수 있을까? 테라펩과 우주 데이터센터.. 내 의견을 말하자면 자원과 데이터도 중요하지만 이미 선도중인 openai와 anthrophic이 너무 강력함. 이미 그들은 공개하지 않은 모델들로 작업 효율과 효과성이 극대화되고 있음. 이제라도 빨리 프론티어급의 지능을 달성해야하며 필요하다면 경쟁자의 AI시스템이라도 하루빨리 도입을 해야되는 수준. 구글내부에서도 클로드 사용을 허용했다는 뉴스를 봤음. 기타 한국 등 AI 기술을 따라가려는 국가들도 포기하지않고 개발해야 살아남을 수 있을것". Used as opinion in TL;DR bullet 3, the OpenAI/Anthropic section opener, the decision table and the Korea Q&A; no hands-on claims

## Claim ledger
| Claim | Kind | Source URL and location | What was checked | Qualification/calculation |
| --- | --- | --- | --- | --- |
| Grok 5 "smartest AI in the world by a significant margin on every metric... in Q1 sometime"; 6T parameters; ~10% AGI chance (Nov 14, 2025) | Official statement (spoken) | https://singjupost.com/fireside-chat-elon-musk-at-ron-barons-32nd-baron-investment-conference-transcript/ ; event page https://www.baroncapitalgroup.com/conference-2025/ron-baron-elon-musk-discuss-the-future | Transcript read; event date from Baron page/video listing | Third-party transcript of a public video |
| Grok 4.7 "roughly on par with Opus 5.0, not 5.1"; 4.8 2.5T finishing training; 4.9 "probably Astra/Fable class"; Grok 5 "maybe better than anything. We shall see." (Sep 14, 2026) | Official statement (X post) | https://x.com/elonmusk/status/2099458047408013751 ; compiled in https://teslanorth.com/2026/09/14/elon-grok-roadmap-through-grok-5/ | Post text via search result and TeslaNorth; no Grok 5 date in posts | X not directly fetchable; wording matched in two places |
| Grok-5 "currently being trained at COLOSSUS II"; Colossus + Colossus II ≈ 1.0 GW; Terafab = "one terawatt of compute hardware each year"; framework terms "not yet determined"; "no assurance... within the expected timeframes, or at all"; chips "significantly more than are currently available to us"; significant portion from third parties; orbital satellites "as early as 2028"; "potentially numbering up to one million satellites"; "unproven technologies, or technologies that do not exist"; "have not been tested"; "not be easily repaired or upgraded"; "permanent capacity loss" | Official filing | SpaceX 424B4 prospectus, June 12, 2026: https://www.sec.gov/Archives/edgar/data/1181412/000162828026042639/spaceexplorationtechnologi.htm | Full text downloaded from EDGAR and searched for each quote | 1 TW / 1.0 GW = 1,000 (our calculation, power basis) |
| Anthropic Cloud Services Agreements, May 2026, ~325,000 NVIDIA GPUs across Colossus and Colossus II, $1.25B/month through May 2029, ramp May–June at reduced fee, 90-day termination after first three months; "sufficient capacity" for own models | Official filing | Same prospectus | Read | — |
| Google Cloud Service Agreement June 5, 2026, ~110,000 GPUs, $920M/month Oct 2026–Jun 2029, ramp through September, 90-day termination after Dec 31, 2026 | Official filing | https://www.sec.gov/Archives/edgar/data/1181412/000162828026041150/spacexagreementfwp.htm | Read | $1.25B + $0.92B = $2.17B/month; ×12 = $26.04B/year (our calculation) |
| Google called the deal short-term for Gemini Enterprise demand | Reporting | https://techcrunch.com/2026/06/05/google-will-pay-spacex-920m-per-month-for-compute/ | Read via fetch | TechCrunch's fetch summary miscomputed the total; total not used |
| AI segment 2025 revenue $3,201M; Q2 2026 revenue $2,561M; AI infrastructure revenue +$1,600M "as we began to offer cloud services to customers"; H1 2026 revenue $3,379M, loss from operations $(3,726)M, capex $23,551M | Official filing | SpaceX 10-Q for Q2 2026: https://www.sec.gov/Archives/edgar/data/1181412/000162828026052535/spcx-20260630.htm (segment note, MD&A); 2025 figure from prospectus | Downloaded and searched | 23,551 / 3,379 = 6.97 ≈ 7× (our calculation) |
| Cursor merger closed Aug 14, 2026, implied equity value $60.0B in Class A stock; compute agreement "to improve existing models, including Grok" | Official filing | 8-K https://www.sec.gov/Archives/edgar/data/1181412/000162828026056945/spcx-20260814.htm ; 10-Q Note 20 | Read | — |
| Terafab initial $16.8B in Grimes County, Texas | Reporting of company announcement | https://techcrunch.com/2026/08/06/tesla-and-spacex-will-invest-16-8b-to-start-building-terafab-chip-factory-in-texas/ | Read via fetch | — |
| Construction Dec 1, 2026, completion by end of 2028 (TDLR filing) | Reporting of government filing | Austin American-Statesman, Sep 1, 2026, syndicated at https://finance.yahoo.com/technology/ai/articles/tesla-advances-austin-chip-facility-100000579.html | Read via fetch (Statesman direct was 403) | — |
| 40 kW 32-GPU rack needs ~80 m² radiator; GPU-year in space at least an order of magnitude more than terrestrial; Starship at optimistic $44/kg | Third-party analysis (ABI Research) | https://spectrum.ieee.org/orbital-data-centers-heat (Jun 11, 2026) | Read via fetch, sentences quoted | "Order of magnitude" written as "at least 10 times" |
| Grok 4.7 46 ($2.73/task), Opus 5.5 max 58, Opus 5.5 high 54 ($1.82/task), GPT-6 Astra max 53; Grok 4.7 $2/$6 | Third-party measurement / official price | https://artificialanalysis.ai/leaderboards/models ; https://docs.x.ai/developers/pricing | Same-day readings recorded in `editorial/reviews/second-tier-ai-us-vs-china.md` | Not our measurement |
| OpenAI: median researcher >$600/day inference at API prices, p90 >$7,000/day (mid-Aug); 3.1 agent-workdays per human workday; "automated research intern" reached; automated AI researcher by March 2028; Astra-class RL runs July 20–Aug 6 in research environments | Official report | https://openai.com/index/research-acceleration-view-inside-openai/ | Full text read through a reader service (site blocks direct fetch) | Astra preview Sep 3 per `editorial/reviews/gpt-6-astra-minor-naming.md`; "six weeks" = Jul 20 → Sep 3 |
| Mythos 5.1 only via trusted access programs for US organizations; same model as Fable 5.1 | Official | https://www.anthropic.com/claude-fable-and-mythos-5-1 | Recorded in `editorial/reviews/claude-sonnet-5-5-pacing-mythos.md` | — |
| Google opened Claude Opus 5 to engineers in Antigravity on per-user quotas (Sep 15); statement "Gemini remains our primary and foundational model for internal development" | Reporting with company statement | https://dataconomy.com/2026/09/15/google-opens-anthropic-claude-access-for-engineers/ | Read via fetch | Original outlet not named by Dataconomy |
| Korea sovereign AI project: Upstage, SK Telecom, LG AI Research advanced; Motif eliminated (Aug 2026) | Reporting of government announcement | https://en.sedaily.com/technology/2026/08/18/upstage-skt-lg-ai-research-advance-in-koreas-sovereign-ai | Read via fetch | — |

## Community evidence
| Published paraphrase | Exact thread/comment URL | Context and limits | Checked on |
| --- | --- | --- | --- |
| Pending (Codex adds the community section) | | | |

## Images
| Asset | Purpose/type | Data provenance | Dimensions/bytes | Visually checked |
| --- | --- | --- | --- | --- |
| Sketch thumbnail (pending, Codex) | sketch | Brief below | — | Pending |
| `/media/f7459fc3-3ec3-42d8-8149-cc4188f2a61d.webp` | chart (timeline of plans vs rental contracts) | Prospectus, Google FWP, Baron transcript, TDLR via Statesman | 1440×810, 43,026 B | Yes; labels, dates and sources checked |
| `/media/20b0806d-e59c-49e9-a39a-59013ec014a4.webp` | chart (H1 2026 AI segment revenue, operating loss, capex) | 10-Q segment note | 1440×810, 25,488 B | Yes; zero baseline, USD billions |

## Sketch brief
```
Product: GROK 5
Hero doodle: a simple satellite with a server rack for a body and two solar-panel wings
Callouts (2–4, exact text): "Promised: Q1 2026" | "Terafab: 2028" | "Anthropic pays $1.25B/mo" | "Google pays $920M/mo"
Bottom mini-flow (optional, ≤3 icons + arrows): none
Red accent on: a single line striking through "Promised: Q1 2026" (text must stay legible)
Output: public/images/posts/ai/grok-5-terafab-space-data-centers-notebook.webp (local file only; uploaded by publish-post.mjs)
```

## Reddit brief
- Reader question: can Grok 5, Terafab and orbital data centers let Musk catch OpenAI and Anthropic, and what do people make of SpaceX renting Colossus to Anthropic and Google?
- Queries: `SpaceX Anthropic Colossus rent`; `Grok 5 delay Musk AGI`; `orbital data center SpaceX radiator cost`; `Google engineers Claude Antigravity`
- Subreddits: r/singularity, r/grok, r/LocalLLaMA, r/spacex, r/ClaudeAI

## Review
- Reader value/evidence/reasoning/voice: one question (can the plan catch the leaders); every number traced to filings or named third parties; the user's opinion kept as opinion and paired with evidence; humor tied to "significant margin" → "we shall see", 1,000 Colossus clusters a year, Anthropic as first named Colossus tenant, Google buying from both
- Line-by-line cut pass (AGENTS §4): removed an unsupported "GPUs go out of date in two years" line, a standalone "Google has drawn the practical conclusion" line and a colon reveal in the table; Korean rewritten to one sentence per bullet. Headings alone: 1분기에 나온다던 Grok 5, 지금은 네 번째 순번 → 테라팹 목표는 해마다 Colossus 1,000개 → Anthropic·Google이 내는 GPU 월세 21.7억 달러 → OpenAI·Anthropic은 내일 모델을 오늘 씀 → 뒤처진 쪽은 뭘 해야 함?
- Korean-English parity: same numbers, dates, quotes, links and table rows
- Related article search and selected link, or reason no link helps: `/posts/claude-sonnet-5-5-pacing-mythos/` (and English) for the gated Mythos model; the second-tier article is not yet live, so not linked
- Automatic check command and actual result: `publish-post.mjs --dry-run` → "validation passed"
- Mobile/desktop visual check and actual result: pending publication
- Live URLs/listings/images/language switch/search/feed checks: pending publication
- Remaining limitations: X posts and the Statesman article read through secondary copies; OpenAI report read through a reader service; community section pending
