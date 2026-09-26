# Review: iPhone 18 Pro gaming
- Checked: 2026-09-27, Asia/Seoul
- Route: static; `/it-devices/iphone-18-pro-gaming-performance/` and `/en/it-devices/iphone-18-pro-gaming-performance/`
- Reader question: is the gaming evidence enough to justify replacing a 17 Pro?
- Conclusion: synthetic graphics improve, but retention ratios alone do not establish sustained game speed; verify the game and problem that matter to the buyer
- Experience: no direct 18 Pro gaming experience supplied; article explicitly identifies itself as published-material analysis

## Claim ledger
| Claim | Kind | Original source/location | Checked qualification |
| --- | --- | --- | --- |
| Solar Bay 46.4 → 61.93 fps | Original test | https://www.tomsguide.com/phones/iphones/iphone-18-pro-and-pro-max-review — performance table | Unlimited test, not an in-game rate; `(61.93/46.4-1)*100 = 33.47%`, rounded to about 33% |
| Wild Life Extreme stability 61.1 → 62.8% | Original test | Same review, Sustained Performance table | +1.7 percentage points; no equal sustained-speed conclusion |
| Pro Max 65.2 → 79.4% | Original test | Same table | Separate size/model; not applied to Pro |
| Worst/best retention interpretation | Metric definition | https://support.benchmarks.ul.com/support/solutions/articles/44002134931-stress-test-result-screen | Ratio within a device; toy scores 100→60 and 150→90 explicitly hypothetical |
| Seven-core GPU; side-by-side memory; cooling; up to 40% | Maker claim | https://www.apple.com/newsroom/2026/09/apple-debuts-iphone-18-pro-and-iphone-18-pro-max/ | Maker test claim, not independent sustained-game confirmation |
| Korean 256GB from KRW 1,990,000 | Official price | https://www.apple.com/kr/shop/buy-iphone/iphone-18-pro | Korean Pro; not Pro Max or overseas price |

## Community evidence
| Paraphrase | Exact source | Context |
| --- | --- | --- |
| Cooling expectations and sufficient existing speed; battery/camera upgrade motive | https://www.reddit.com/r/iphone/comments/1wi44sl/iphone_18_pro_a20_pro_deep_dive_possibly_apples/ | Expectations and individual opinion; no firsthand game measurement |
- Two previously used game-report threads could not be reopened during this review, so their Aniimo/120fps claims were removed rather than carried forward unchecked

## Images
- `iphone-18-pro-thermal-scribble.webp`: conceptual sketch with explicit article qualification; not a phone teardown
- `iphone-18-pro-gaming-benchmarks.webp`: original-test numbers matched; chart separates Solar Bay fps and Wild Life stability; title refers to stability rather than sustained speed

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
