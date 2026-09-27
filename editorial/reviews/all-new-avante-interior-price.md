# Review: All-new Avante price and options
- Checked: 2026-09-27, Asia/Seoul
- Route: static; `/mobility/all-new-avante-interior-price/` and `/en/mobility/all-new-avante-interior-price/`
- Reader question: what does the improved car actually cost with the features I want?
- Conclusion: acknowledge better equipment and space while retaining the author's criticism of the higher entry price and option bundling
- User opinion: prior explicit request says the product improved but the price increased more than the value, and the option packaging feels particularly harsh; preserve as opinion, not an objective value measurement or test drive

## Claim ledger
| Claim | Kind | Original source/location | Checked qualification |
| --- | --- | --- | --- |
| Old Smart 20.62m and Modern 23.88m KRW | Official price | https://www.hyundai.com/contents/repn-car/catalog/avante-2026-price.pdf — p1 gasoline | Old 1.6; distinguish entry vs same-named trim |
| New Modern 23.98m; Convenience I 0.65m; SmartSense I 0.96m; cluster 0.35m | Official price | https://www.hyundai.com/contents/repn-car/catalog/the-all-new-avante_price.pdf — pp1–2 | Korean gasoline 2.0 Modern; screen and phone projection standard, built-in maps optional |
| Premium screens 0.83m; Inspiration cluster standard | Official price | Same new price PDF, p1 | Do not generalize Modern option pricing to other trims |
| 25.59m / 25.94m | Calculation | 23.98 + .65 + .96 [+ .35] | Vehicle + listed options only, not registration/insurance/paint; no ventilated seats in this configuration |
| Improvements and hybrid 30.42m before benefits | Maker announcement | https://www.hyundaimotorgroup.com/ko/news/hyundai-motor-company-all-new-avante | Hybrid is not the gasoline quote; preserve tax qualification |
| Rear legroom 964→993mm and headroom 940→958mm | Maker technical description | https://www.hyundaimotorgroup.com/ko/story/the-all-new-avante-tech-day | Published geometry, not a personal comfort trial |

## Community evidence
| Paraphrase | Exact source | Context |
| --- | --- | --- |
| Dislike of floating screen; others like big screen plus physical buttons | https://www.reddit.com/r/Hyundai/comments/1uftasb/the_cn8_elantraavante_has_been_unveiled/ | Reveal-photo reactions; not evidence about Korean trim prices, driving or ownership |

## Images
- `all-new-avante-price-options-scribble.webp`: rough conceptual price/options notebook
- `all-new-avante-price-entry.webp`: old entry and Modern comparison; values checked against published prices
- `all-new-avante-rear-space.webp`: four dimension labels match Hyundai technical explanation

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
- No new-generation US official price sheet verified after checking Hyundai USA and searching Hyundai USA Media Center (2026-09-27 KST). Existing 2026 US model is not substituted for the new Korean model
- Per user fallback: Korean launch-price figures converted at 1 USD = KRW 1,354.81. Xe quote timestamp 2026-09-26 23:08 UTC (2026-09-27 08:08 KST): https://www.xe.com/en-gb/currencyconverter/convert/?Amount=1&From=USD&To=KRW. Small nearby note explicitly says converted Korean prices, not US MSRP
- Source KRW inputs: 20,620,000; 23,880,000; 23,980,000; bundles 650,000/960,000; cluster 350,000; Premium option 830,000. Totals 24,630,000/25,590,000/25,940,000. Divide unrounded inputs/totals by 1,354.81 then round to whole USD: 15,220/17,626/17,700; 480/709/258/613; totals 18,180/18,888/19,147. Differences 3,360,000→2,480 and 100,000→74. Rounding may differ by $1 from summing displayed components
