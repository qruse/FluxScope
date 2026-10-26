<!-- Codex brief (AGENTS §7). Fill {{…}}, save as <workdir>/codex.md, run run_helpers.py <workdir>. -->
Research one blog article together with two other AIs, and draw one illustration for it. Work only in the current folder; write `research-codex.md`, `community.md`, `illustration.png` and the script that draws it.

Article: {{title}} · Reader question: {{question}} · Topic: {{topic}} · Look into: {{items}}

research-codex.md:
- `## Facts`: one line per fact: the fact, numbers/dates/market conditions, source URL, source type (official / original measurement / report / community)
- `## Open`: what you could not confirm, and where sources disagree

community.md: search Reddit ({{subreddits}}), then Hacker News if thin; last 12 months first.
- `## ko` and `## en`: 4–6 ready-to-paste bullets, same items in the same order. One short sentence each: who + one-line gist + `([Reddit](url))` / `([Hacker News](url))` at the end. Korean in natural 음슴체, no trailing period. Mark speculation `(측정 없는 추측)`/`(no measurements)` and self-promotion `(본인 프로젝트 홍보)`/`(self-promotion)`. Include differing views if the sources have them
  - e.g. `- 둘 다 $20씩 내는 한 사용자는 코딩은 Claude가 낫다며, 이미지 말고는 ChatGPT를 둘 이유가 없다고 고민함 ([Reddit](https://www.reddit.com/r/…/comments/…/))`
- `## Evidence`: per item the exact URL opened (comment permalink if a comment), site, author, date, a verbatim quote ≤25 words, claim type
- `## Queries`: queries used and pages that would not open

Only list pages you opened and read in this session; never construct a URL. Each line says only what its source says.

illustration.png — one picture for the middle of the article (1600x900 PNG), drawn with code (Python + Pillow or an SVG you render), NOT with an image-generation model:
- Scene, with a little wit: {{scene}}. Keep the joke readable at a glance; you may simplify the scene
- No real logos or brand marks; products are generic characters
- Style: flat, hand-drawn feel (slightly uneven strokes, rounded shapes), 4–5 muted colors on an off-white background (#F6F2E8-ish), dark ink outlines. No gradients, no glow, no neon, no 3D, no clichés
- Text in the picture: at most three short ENGLISH labels ({{labels}}); nothing else, no Korean
- Open the PNG yourself after drawing and fix anything that looks broken (overlaps, cut-off parts, unreadable labels)
