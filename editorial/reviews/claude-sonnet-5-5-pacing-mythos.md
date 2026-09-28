# Review: claude-sonnet-5-5-pacing-mythos
- Checked date/time and timezone: 2026-09-28, 08:25–08:45 UTC (17:25–17:45 Asia/Seoul)
- Live URLs and storage route (static/API): new D1 article via API, `/posts/claude-sonnet-5-5-pacing-mythos/` and `/en/posts/claude-sonnet-5-5-pacing-mythos/`; not yet published
- Reader question: does a Sonnet 5.5 launch weeks after "We Must Pace the Frontier" contradict Anthropic's pacing pledge, and is a stronger model being held back?
- Supported conclusion: no contradiction by the essay's own definition (pacing is not halting; outside evaluators tested Opus 5.5); the gated model is Mythos, which is the same model as public Fable; Opus 5.5 beats Fable 5.1 on all eight published percentage rows; an internal Fable 5.5 is unconfirmed; the leaked Sonnet 5.5 specs equal Sonnet 5's; the essay itself frames AI as a US–China security race
- Scope: Anthropic lineup and statements as of 2026-09-28; API list prices in USD per 1M tokens (standard, no batch/cache)
- User opinion: user's own words (2026-09-28): "앤트로픽 속도조절하자더니 뒤통수? 일반적으로 생각하면 mythos fable 하위로 opus sonnet 순으로 증류할테니 mythos fable 5.5는 내부적으로 가지고 있을듯? 자체 개발에 활용하거나 일부 협력 기업들만 프리뷰로 쓸지도.. 이제는 최첨단 AI가 국가 경쟁력이고 무기인듯 (루머는 루머일뿐 오해하지 말자)". Used as the stated guess (distillation ladder, internal model) and corrected by official facts; the national-strength reading is tied to the essay's own quotes

## Claim ledger
| Claim | Kind | Source URL and location | What was checked | Qualification/calculation |
| --- | --- | --- | --- | --- |
| "We must slow the pace…"; pacing "does not mean halting…"; "adequate time to align and safeguard"; third-party evaluators | Official statement (CEO essay) | https://darioamodei.com/post/we-must-pace-the-frontier | Quotes read verbatim; page shows "September 2026" | Exact day Sep 12 from secondary reports and Dario's X post (https://x.com/DarioAmodei/status/2098773920774074715, not opened); article says "September" in text, chart uses Sep 12 with "per Dario Amodei's post" |
| Unilateral first step: embedded evaluators with permanent, employee-level access | Official statement | Same essay; Dario's X post text in search result | "Anthropic is unilaterally committing to this step now" | — |
| Pacing limited by US lead over CCP; "pull ahead… national security risk"; "militarily dominate democracies (for example with AI-driven drones)"; crack down on "unauthorized distillation by companies in authoritarian countries"; "internal use of AI to improve AI" | Official statement | Same essay | Quotes read verbatim | Last one is a proposed pacing ingredient, not a disclosure; "only worth limiting if it happens" is editorial inference |
| Opus 5.5 Sep 22; "first release since we called for pacing the frontier"; tested by Frontier Design and METR; Sonnet 5.5 and Haiku 5.5 "will follow in the coming weeks"; "remaining competitive with China"; comparable to Mythos 5.1 in biology and cybersecurity, safeguards similar to Fable 5.1; preserved thinking = "anti-distillation safeguard" | Official | https://www.anthropic.com/claude-opus-5-5 | Read 2026-09-28 | 10 days = Sep 12 → Sep 22 |
| Benchmarks Opus 5.5 vs Fable 5.1: Terminal-Bench 4.0 66.4/55.8; AutomationBench 40.0/31.4; Terminal-Bench-Science 0.1 58.7/52.6; CursorBench 4.0 57.8/51.8; FrontierCode v1.1 54.4/50.3; HLE 67.7/65.6; OSWorld 2.0 81.8/80.7; Chartography 89.0/88.4; GDPval-AA v2.1 1846/1735 | Vendor-reported | Same page, raw HTML parsed with curl | All nine rows compared; Opus 5.5 higher on all | Differences in percentage points; vendor numbers, not our measurement |
| Preserved thinking applies to Fable 5.1 and Opus 5.5 for API accounts created on or after Aug 31, 2026 | Official | Same page | Read | — |
| Fable 5.1 and Mythos 5.1 same model, different safeguards; Mythos only via trusted access programs (Cyber Verification, Life Sciences Verification "in partnership with the US government"), US organizations; Fable 5.1 $10/$50 | Official | https://www.anthropic.com/claude-fable-and-mythos-5-1 (Sep 1, 2026) | Read | — |
| Fable 5 / Mythos 5 same model, Jun 9 | Official | https://www.anthropic.com/news/claude-fable-5-mythos-5 | Read | Timeline only |
| Mythos Preview withheld, Glasswing partners, Apr 7 | Official | https://www.anthropic.com/glasswing | Read | Timeline only |
| Sonnet 5: Jun 30, $2/$10, 1M context, 128K output; no Sonnet 5.5 on models page | Official | https://platform.claude.com/docs/en/about-claude/models/overview ; https://www.anthropic.com/news/claude-sonnet-5 | Models table read 2026-09-28 | — |
| Opus 5.5 60% lower per-token price than Fable 5.1 (40% of the price) | Calculation | 4/10 = 0.4 and 20/50 = 0.4 | Recomputed | List prices only |
| Sep 27 leak: Lyra (@lyraxana), second checkpoint to partners, launch near, $2/$10, 872K–1M context, 128K output, seen on Factory as not yet available | Rumor | https://www.testingcatalog.com/anthropic-claude-sonnet-5-5-release-date-leaks/ | Read | Labeled rumor |
| Sep 24 "leak" (@kimmonismus) of 1M/128K/$2/$10 matched Sonnet 5's public specs | Reported | https://startupfortune.com/the-claude-sonnet-55-leak-beating-gpt-6-sol-is-not-what-it-looks-like/ | Read; cross-checked against models overview | — |
| "Beats GPT-6 Sol" claims from testers | Rumor | TestingCatalog (Chetaslua video mention) | Read report only | Stated as unpublished evaluation |

## Community evidence
Codex adds this section and the rows below, per AGENTS §7.

| Published paraphrase | Exact thread/comment URL | Context and limits | Checked on |
| --- | --- | --- | --- |

## Images
| Asset | Purpose/type | Data provenance | Dimensions/bytes | Visually checked |
| --- | --- | --- | --- | --- |
| `claude-sonnet-5-5-pacing-mythos-notebook.webp` | sketch thumbnail | Codex, from the brief below | pending | pending |
| `claude-sonnet-5-5-pacing-timeline.webp` | chart: 2026 release timeline vs pacing essay | Anthropic pages above | 1440×810, 42,698 B | Yes: 7 events, dates, "10 days" arrow Sep 12→Sep 22, grey "Coming weeks", footnote |
| `claude-sonnet-5-5-opus-vs-fable.webp` | chart: 8 benchmark rows Opus 5.5 vs Fable 5.1 | Opus 5.5 page table | 1440×810, 52,908 B | Yes: 16 values, 8 point gaps recomputed, $ prices, zero baseline, GDPval note |

## Sketch brief
```
Product: CLAUDE SONNET 5.5
Hero doodle: a car speedometer with the needle near the top, a small hand-drawn "SLOW DOWN" road sign beside it
Callouts (2–4, exact text): "Pacing essay: Sep 12" | "Opus 5.5: Sep 22" | "Mythos = Fable (same model)" | "Rumor: $2 in / $10 out"
Bottom mini-flow (optional, ≤3 icons + arrows): essay page -> magnifying glass -> rocket
Red accent on: the speedometer needle
Output: public/images/posts/ai/claude-sonnet-5-5-pacing-mythos-notebook.webp
```
- Size 1536×1024 (3:2), all text English, currency `$`
- Alt text (en): Notebook sketch of Claude Sonnet 5.5 beside the pacing essay, Mythos equals Fable, and the rumored $2 / $10 price

## Reddit brief
- Reader question: is Sonnet 5.5 arriving weeks after Anthropic's "pace the frontier" essay hypocritical, and is Anthropic keeping a stronger Mythos/Fable model internally?
- Queries: "Sonnet 5.5" ; "pace the frontier Anthropic" / "Dario pacing essay" ; "Mythos 5.1 Fable same model"
- Subreddits: r/ClaudeAI, r/Anthropic, r/singularity, r/LocalLLaMA, r/OpenAI
- Want: one reaction on pacing vs release cadence (hypocrisy or not), one on Mythos/Fable gating or an internal model; do not overlap the user's own opinion; no leaked benchmark screenshots presented as fact

## Review
- Reader value/evidence/reasoning/voice: one question (pacing vs Sonnet 5.5, hidden model); user's guess stated as a guess and corrected by the same-model fact; national-security reading tied to direct essay quotes
- Line-by-line cut pass (AGENTS §4): done on both languages; headings alone: slowdown essay 10 days before the next release → leak reprinted Sonnet 5's price → hidden model already named Mythos → essay itself calls it a security race → what to do when Sonnet 5.5 lands
- Korean-English parity: same numbers, dates, links and qualifications
- Related article: the Astra vs Opus 5.5 same-prompt article (same language each) supports "per-token price vs cost per task"
- Automatic check command and actual result: `publish-post.mjs --dry-run` passed both languages with a temporary stand-in thumbnail (removed afterwards); `npm run check` exit 0
- Mobile/desktop visual check and actual result: pending
- Live URLs/listings/images/language switch/search/feed checks: pending
- Remaining limitations: essay day (Sep 12) from secondary reports; leak has no primary source; community section and sketch pending from Codex
