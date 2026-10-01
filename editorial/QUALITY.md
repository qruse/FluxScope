# Reference articles and release rubric

## Start with the latest published article

Follow the source-of-truth workflow in `AGENTS.md`: read the newest relevant live
article in both languages, then its saved review if available. This establishes
current structure, voice and visual treatment. Record its slug and the checked
revision in the new review. A saved draft may be newer but is not a publication.
Do not substitute a tracked JSON example when live retrieval fails; record the
limitation instead. New articles still need newly verified factual sources.

## Technique references (not the latest-post catalog)

These are maintained quality references, not immutable facts or text to paraphrase mechanically. Recheck changing prices and specifications for every new article. Use them for the techniques below, after checking the latest published baseline. Git copies may be older than the live articles; never republish them as a way to restore the current version.

| Reference | Source of truth for editing | Transferable technique | Mistake to avoid |
| --- | --- | --- | --- |
| AI: Astra vs Opus 5.5 | Live `/posts/gpt-6-sol-luna-opus-5-5-cost-per-success/`; versioned bilingual payloads in `editorial/api-posts/`; current review `editorial/reviews/astra-opus-rewrite-2026-09-28.md` | Separate user preference, official rates, maker evaluations and real licensed project screenshots | Present unmatched showcases as a controlled model contest; call token-rate savings measured project savings; omit creator and asset credits |
| IT: iPhone 18 Pro gaming | Live `/posts/iphone-18-pro-gaming-performance/`; payloads `editorial/api-posts/{en,ko}-iphone-18-pro-gaming-performance.json` | Define a benchmark before interpreting it; make the buying decision conditional on the reader's actual problem | Treat similar retention ratios as equal sustained speed; mix Solar Bay fps with Wild Life stability; use Pro Max results for Pro |
| Mobility: Roadster reveal/delivery | Live `/posts/all-new-avante-interior-price/`; payloads `editorial/api-posts/{en,ko}-all-new-avante-interior-price.json` | Separate a reveal date from delivery, historical claims from tested production specs, and a reservation from MSRP | Call 0–60 mph a 0–100 km/h result; treat the deposit as the car price; invent a confirmed delivery date |

Review records live under `editorial/reviews/`. These three topics and both languages must remain in the automatic check set. Do not add unrelated archived articles to the published catalog.

## Quality gates — no averaging away factual defects

Every row must pass. A polished title cannot compensate for fabricated experience or a wrong denominator.

| Gate | Pass only if | Automatic coverage |
| --- | --- | --- |
| Title approval | Final bilingual titles match the user's recorded confirmation; changed titles require confirmation again | Human workflow check |
| Reader value | One clear question; an answer and an actionable choice; each section adds a new fact or decision | Human review |
| Readability | Familiar words and short sentences; essential jargon explained once; repeated conclusions and captions cut; decision-changing evidence and qualifications retained | Human review |
| Evidence | Core claims traceable to opened original sources; market/model/date/units stated; calculations reproducible | Human review |
| Reasoning | Conclusion follows from the actual metric; opinion, calculation and observation remain distinct | Human review |
| Voice | One coherent question per article; headline titles with a hook the article answers (Korean titles not in 음슴체); natural witty humor grounded in facts; no fake experience, forced drama or repetitive filler | Human review |
| Structure | Exactly 3 summary bullets; final Q&A with 3–5 answered questions; community immediately before it when present, each reaction linked and Reddit represented | Shared validator |
| Metadata | Correct category; 5–15 unique kebab-case tags; useful title/description/alt; original date/URL preserved | Validator plus human |
| SEO | Title ≤ 70 chars with the product first; description states the answer; stable slug; body starts at H2; alt text 5–150 chars; no manual SEO tags | Validator plus human |
| Images | 2–10 distinct visuals, exactly one generated rough sketch hero; English text and USD labels; meaningful choice among five types; verified labels and dimensions; optimized files | Partial file/structure checks, then visual review |
| Bilingual | Same claims, prices, units, limitations and meaning; natural English | Pair existence/metadata plus human |
| Delivery | Both live pages and discovery paths work; actual production content matches the reviewed revision | Live checks |

### Stop publishing immediately when

- The final title has not been confirmed by the user, or a payload title differs from the confirmed bilingual pair (AGENTS §1.1)
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
| “그래도 서로 무관한 스크린샷 두 장을 붙여놓고 과학이라 부르는 것보다는 훨씬 나음” | Delete; the limit was already stated once | Meta self-defense against a strawman adds nothing |
| “그 마음을 벤치 점수로 필수품처럼 포장하려는 순간 서류가 창의적으로 변함” | “그 마음을 굳이 33%로 정당화할 필요는 없음” | A joke must land in one read and point at the article's own number |
| `## GPU는 빨라졌고, 내 게임이 알아채는지는 별개임` | `## 벤치는 33% 빨라졌는데 게임은?` | Headings are short, natural and carry the section's point |

## Per-article review record template

Create `editorial/reviews/<slug>.md` before drafting. Replace every placeholder and record what actually happened; do not pre-check boxes.

```markdown
# Review: <slug>
- Checked date/time and timezone:
- Live URLs (D1/API) and latest published style reference (slug, checked revision):
- Reader question:
- Supported conclusion:
- Scope: market/model/version/trim or test environment:
- User experience: actual supplied wording and provenance, or unavailable/published-material analysis

## Title confirmation (AGENTS §1.1)
- Final Korean title:
- Final English title:
- User's exact confirming message and date/context:
- Status: pending / confirmed / invalidated
- Pre-publication payload titles match:

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
- Line-by-line cut pass (AGENTS §4): bullets deleted, headings read alone in order:
- Plain-language pass (AGENTS §4): terms explained, repeated text cut, decision-changing limits retained:
- Korean-English parity:
- Related live article search, prior experience/prediction passage, selected same-language link and why it helps (or reason no link helps):
- Automatic check command and actual result:
- Mobile/desktop visual check and actual result:
- Live URLs/listings/images/language switch/search/feed checks:
- Remaining limitations:
```

## Prompt for the next writing agent

“Read AGENTS.md and editorial/QUALITY.md. Retrieve the newest relevant published bilingual article and its available review; use the three technique references as supplements. State the reader question internally. Verify sources and fill the claim ledger before drafting. Preserve only the user's actual experience. Write the English master and natural Korean counterpart with matching facts, USD prices and English-only shared images. Apply every release gate; fix failures instead of relaxing checks. Present the final bilingual title pair and obtain user confirmation under AGENTS §1.1 before publication; save drafts or unlisted previews while awaiting the decision. Publish the paired payloads with scripts/publish-post.mjs through D1/API and verify the live result. Report changes, checks and any unfinished publication separately.”
