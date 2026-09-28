# Reference articles and release rubric

## What to copy from the three samples

These are maintained quality references, not immutable facts or text to paraphrase mechanically. Recheck changing prices and specifications for every new article. Read the relevant sample in full before drafting.

| Reference | Source of truth for editing | Transferable technique | Mistake to avoid |
| --- | --- | --- | --- |
| AI: Astra vs Opus 5.5 | Live `/posts/gpt-6-sol-luna-opus-5-5-cost-per-success/`; versioned bilingual payloads in `editorial/api-posts/`; current review `editorial/reviews/astra-opus-rewrite-2026-09-28.md` | Separate user preference, official rates, maker evaluations and real licensed project screenshots | Present unmatched showcases as a controlled model contest; call token-rate savings measured project savings; omit creator and asset credits |
| IT: iPhone 18 Pro gaming | `src/content/posts/{ko,en}/it-devices/iphone-18-pro-gaming-performance.md` | Define a benchmark before interpreting it; make the buying decision conditional on the reader's actual problem | Treat similar retention ratios as equal sustained speed; mix Solar Bay fps with Wild Life stability; use Pro Max results for Pro |
| Mobility: Roadster reveal/delivery | `src/content/posts/{ko,en}/mobility/all-new-avante-interior-price.md` | Separate a reveal date from delivery, historical claims from tested production specs, and a reservation from MSRP | Call 0–60 mph a 0–100 km/h result; treat the deposit as the car price; invent a confirmed delivery date |

Review records live under `editorial/reviews/`. These three topics and both languages must remain in the automatic check set. Do not add unrelated archived articles to the published catalog.

## Quality gates — no averaging away factual defects

Every row must pass. A polished title cannot compensate for fabricated experience or a wrong denominator.

| Gate | Pass only if | Automatic coverage |
| --- | --- | --- |
| Reader value | One clear question; an answer and an actionable choice; each section adds a new fact or decision | Human review |
| Evidence | Core claims traceable to opened original sources; market/model/date/units stated; calculations reproducible | Human review |
| Reasoning | Conclusion follows from the actual metric; opinion, calculation and observation remain distinct | Human review |
| Voice | One coherent question per article; Korean titles in 음슴체; restrained cynical humor grounded in facts; no fake experience, forced drama or repetitive filler | Human review |
| Structure | Exactly 3 summary bullets; final Q&A with 3–5 answered questions; community immediately before it when present, each reaction linked and Reddit represented | Shared validator |
| Metadata | Correct category; 5–15 unique kebab-case tags; useful title/description/alt; original date/URL preserved | Validator plus human |
| SEO | Title ≤ 70 chars with the product first; description states the answer; stable slug; body starts at H2; alt text 5–150 chars; no manual SEO tags | Validator plus human |
| Images | 2–10 distinct visuals, exactly one generated rough sketch hero; English text and USD labels; meaningful choice among five types; verified labels and dimensions; optimized files | Partial file/structure checks, then visual review |
| Bilingual | Same claims, prices, units, limitations and meaning; natural English | Pair existence/metadata plus human |
| Delivery | Both live pages and discovery paths work; actual production content matches the reviewed revision | Live checks |

### Stop publishing immediately when

- A core claim has no checked source, a supplied experience has been embellished, or a diagram contradicts the text
- A key price/spec is disputed and the disagreement changes the conclusion
- One language is missing, a required image is broken, or a core build/check fails
- The source changed during editing; reconcile with the newer live version before overwriting it

### Repair examples

| Do not write | Write instead | Why |
| --- | --- | --- |
| “안정성은 1.7% 좋아졌으니 장시간 성능도 비슷함” | “유지율은 +1.7%p. 절대 성능 비교에는 같은 시험의 최고·최저 점수가 더 필요함” | A ratio is not a cross-device speed measurement |
| “아반떼가 336만 원 올랐음” | “최저가 선택지는 336만 원 높아졌지만 스마트 1.6과 모던 2.0 비교임” | Identify what changed |
| “Opus는 포기하기 어려움” | “완성된 결과물은 Opus가 더 마음에 들었음. 검수 시간까지 기록해 비용을 비교하겠음” | State the preference and practical consequence |
| “Luna 성공률 96.7%” | “한 사용자의 10개 코딩 작업 × 3회 시험에서 29/30 통과” | Keep sample and attribution together |
| “써보니 발열이 확 줄었음” without supplied experience | “제조사는 냉각 개선을 설명함. 직접 측정한 온도 자료는 없음” | Do not invent hands-on evidence |
| “API 요금 + 재시도 + 검수 시간” as a numeric cost formula | “모든 시도의 API 요금 / 합격 작업 수; 검수 분은 별도 기록” | Quantities need compatible units |

## Per-article review record template

Create `editorial/reviews/<slug>.md` before drafting. Replace every placeholder and record what actually happened; do not pre-check boxes.

```markdown
# Review: <slug>
- Checked date/time and timezone:
- Live URLs and storage route (static/API):
- Reader question:
- Supported conclusion:
- Scope: market/model/version/trim or test environment:
- User experience: actual supplied wording and provenance, or unavailable/published-material analysis

## Claim ledger
| Claim | Kind | Source URL and location | What was checked | Qualification/calculation |
| --- | --- | --- | --- | --- |

## Community evidence
| Published paraphrase | Exact thread/comment URL | Context and limits | Checked on |
| --- | --- | --- | --- |
If omitted: list searches, date and why no usable reaction was found

## Images
| Asset | Purpose/type | Data provenance | Dimensions/bytes | Visually checked |
| --- | --- | --- | --- | --- |

## Review
- Reader value/evidence/reasoning/voice:
- Korean-English parity:
- Related article search and selected link, or reason no link helps:
- Automatic check command and actual result:
- Mobile/desktop visual check and actual result:
- Live URLs/listings/images/language switch/search/feed checks:
- Remaining limitations:
```

## Prompt for the next writing agent

“Read AGENTS.md, editorial/QUALITY.md, the closest of the three reference articles, and its review record. State the reader question internally. Verify sources and fill the claim ledger before drafting. Preserve only the user's actual experience. Write the English master and natural Korean counterpart with matching facts, USD prices and English-only shared images. Apply every release gate; fix failures instead of relaxing checks. Publish through the existing static/API route and verify the live result. Report changes, checks and any unfinished publication separately.”
