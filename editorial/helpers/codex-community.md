<!-- Codex community brief (AGENTS §7 role split). Fill every {{…}}, save as <workdir>/codex.md, run with run_helpers.py.
     Codex writes the community bullets ready to paste; Claude inserts them before Q&A. -->
Collect community reactions for one blog article and write them ready to paste. Work only inside the current folder and write one file: `community.md`.

Article: {{title}}
Reader question: {{reader question}}
Topic to search: {{who is talking about what, in plain words}}

Search Reddit first ({{subreddits}} and similar), then Hacker News if Reddit is thin. Prefer posts from the last 12 months.

## community.md format
1. `## ko` and `## en`: 4–6 candidate bullets each, same items in the same order, ready to paste into the article
   - One short sentence per bullet: who (in a few words) + the one-line gist + a source link at the end, e.g.
     - ko: `- 둘 다 $20씩 내는 한 사용자는 코딩은 Claude가 낫다며, 이미지 말고는 ChatGPT를 둘 이유가 없다고 고민함 ([Reddit](https://www.reddit.com/r/.../comments/.../))`
     - en: `- One user paying $20 for each prefers Claude for coding and sees little reason to keep ChatGPT beyond images ([Reddit](https://www.reddit.com/r/.../comments/.../))`
   - Korean: natural 음슴체 (-음/-함/-됨), no trailing period, no subreddit names or plan details unless they are the point
   - Mark speculation `(측정 없는 추측)` / `(no measurements)` and self-promotion `(본인 프로젝트 홍보)` / `(self-promotion)` in a short parenthesis
   - Mix different views when the sources actually contain them, including skeptical ones
   - Link text is `Reddit` or `Hacker News`; use the comment permalink when the bullet is about a comment
2. `## Evidence`: for each item, the exact URL opened, subreddit/site, author handle, date, a verbatim quote of 25 words or fewer, and the claim type (personal experience / small test / opinion / speculation)
3. `## Queries`: the search queries used and any page that would not open

Rules:
- Only list pages you actually opened and read in this session. Never construct or guess a URL. If a page would not open, leave it out
- Each bullet must say only what its source says; no "everyone agrees"
