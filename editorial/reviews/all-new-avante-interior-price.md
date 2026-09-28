# Review: Tesla Roadster reveal versus delivery
- Checked: 2026-09-28, Asia/Seoul
- Static replacement of the Avante article at existing `/mobility/all-new-avante-interior-price/` and `/en/mobility/all-new-avante-interior-price/`; original publication date and URL retained per AGENTS.md
- Reader question: does the new reveal date make the Roadster a car ready to buy, and what evidence should change that judgment?
- Conclusion: watch the reveal, separate historical claims from new production specifications, and distinguish the $50,000 US reservation from the final vehicle price and delivery commitment
- Scope: next-generation Roadster; US reservation page; historical 2017 announcement versus September 28, 2026 pre-event information
- User experience: unavailable; analysis of published material, not a road test. No Avante opinion transferred to Tesla

## Claim ledger
| Claim | Kind | Source | Checked | Qualification |
| --- | --- | --- | --- | --- |
| Official countdown points to October 2 00:30 UTC / 09:30 KST | Official page data + timezone conversion | https://www.tesla.com/roadster | Page's targetTime and livestream link retrieved directly with curl | Scheduled countdown as of check, subject to change; October 1 US announcement date |
| 2017 original reveal and planned October 1, 2026 unveiling | Historical event / reporting | https://www.reuters.com/business/autos-transportation/tesla-signals-oct-1-launch-long-delayed-roadster-2026-09-12/ | Opened full article lines 174–186 | Announcement is not delivery; Reuters-derived portion kept short |
| 1.9s 0–60 mph, >250 mph, 620 miles / approximately 1,000 km | Historical official claim | https://ir.tesla.com/_flysystem/s3/sec/000156459018001521/tsla-8k_20180207-gen_0.pdf | Downloaded original PDF, pdftotext page 4 | Q4 2017 update issued February 2018; not 2026 measured specs, EPA or WLTP result |
| $5,000 initial + $45,000 wire within 10 days = $50,000 general US reservation | Official reservation / arithmetic | https://www.tesla.com/roadster/reserve | Downloaded page's amount_general and Roadster-specific payment description | USD reservation, not MSRP; no founder-series assumption or blanket refund assurance |
| Production, repeatable measurements, purchase terms are separate evidence | Editorial analysis | Reasoning from the evidence above | Concrete event checklist | Does not claim a new regulation or unverified performance defect |

## Community evidence
| Published paraphrase | Exact thread | Context | Checked |
| --- | --- | --- | --- |
| Comments joke that it was already revealed and ask which year October means | https://www.reddit.com/r/electricvehicles/comments/1weluif/tesla_teases_roadster_reveal_for_october_1/ | Opened original; lines 54,62; skepticism about schedule, not a test | 2026-09-28 |
| A reply points out that there is a countdown | Same original thread, lines 94–101 | Narrow factual pushback, not invented enthusiasm or consensus | 2026-09-28 |

## Images
| Asset | Purpose/type | Provenance | Validation |
| --- | --- | --- | --- |
| tesla-roadster-reveal-notebook.webp | Exactly one generated sketch thumbnail | Built-in imagegen: rough grid-paper car, 2017 → 2026, reveal ≠ delivery, specs need proof; conceptual illustration | Generated and optimized outputs visually inspected; 1536×1024, 168468 bytes |
| tesla-roadster-reservation-usd.webp | Deterministic reservation breakdown chart | Official general US $5,000 + $45,000; not MSRP | Code-rendered and visually inspected; 1440×810, 49112 bytes; exact 10%/90% segment widths |

## Review
- Both live Avante editions read before editing and agree with repository revision
- English master drafted first; Korean counterpart reviewed for matching figures, dates, units and qualifications. Restrained cynical voice and no invented ownership/test history confirmed
- Current catalog offers AI pricing and iPhone gaming articles, neither directly answers this Roadster question; no forced cross-category internal link
- Automatic checks: `npm run check` passed: editorial regression tests, 3 bilingual reference pairs, Astro, build, 43 HTML link checks and image/performance budgets
- Mobile/desktop checks: local browser unavailable (Chromium installation download failed, cloud browser rejects localhost); production desktop browser reviewed in both languages: title, thumbnail, spec table and language switch render correctly, with no page-wide overflow. Exact 390px mobile viewport remains unverified because the available browser cannot resize. No responsive template changes made
- Production verification: Cloudflare Workers Builds and GitHub integrity check succeeded for commit b4ac353c630fae9de5cfe6e3eb5a4237b84484eb (Worker version 5279a5c5-588b-4b45-b4a7-430a8f41d5db). Both article URLs, both home/category listings, RSS, sitemap and two image URLs returned 200; all article/listing/feed checks show Roadster and no old Avante title. Image bytes match local assets. Canonical and hreflang pairs use hslblog.com. Existing URL and September 26 publication date preserved, updated September 28. Public domain, HTTPS, www and workers.dev redirects verified; robots lists both sitemaps. No account/DNS changes were needed
