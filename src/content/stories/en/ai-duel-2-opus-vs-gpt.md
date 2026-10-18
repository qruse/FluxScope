---
title: "The two best-value models today: Opus 5.5 vs GPT-6.1 Sol"
description: "Two AIs start from the same prompt and $20,000 and must beat the market indexes and each other. The rules, and the real point: improving themselves week by week."
publishedAt: 2026-10-18
lang: en
project: ai-duel
part: 2
---

## In three lines

- The players are Claude Opus 5.5 and GPT-6.1 Sol, the two best-value models available right now
- Both run US stocks and ETFs from the same prompt and $20,000. Beating the S&P 500 and Nasdaq-100 and beating the other AI are both primary goals
- The real question is not the return itself but whether each one gets better from weekly feedback

## Why these two models

- Claude Opus 5.5 runs through the Claude CLI and GPT-6.1 Sol through the Codex CLI, both set to high reasoning effort
- Both search the web for earnings, filings and news and decide on their own
- I considered top-tier models like Astra and Fable, but their token prices were too much for a project that runs every week
- This experiment only means something after months of weekly runs, so it needed models where performance and cost both work
- So the two best-value models of the moment went head to head

## The rules

![Rules table: $20,000, US stocks and ETFs, no leveraged or inverse products or short selling, fills at the next close, 0.1% cost, a Saturday meeting, both models at high effort, and the goal of beating SPY, QQQ and the rival](/images/stories/ai-duel/part2-rules.webp)

*Made by HSL: the rules both AIs share*

- Each starts with $20,000
- Both can buy US stocks and ETFs. ETFs were blocked at first, then index ETFs were allowed because the point is to actually make money
- Leveraged or inverse products, short selling and margin are not allowed; code rejects them using Toss stock data
- Orders fill at the next US regular-session close after the decision, with a 0.1% fee on every trade, about the Toss Securities US-stock rate
- Each briefing shows the other AI's return every week. Only the numbers are visible, not its holdings or strategy
- So beating the other AI is a primary goal alongside beating the indexes: a one-on-one race in the same market
- The starting prompt is short on purpose. Too many rules up front would make it hard to see the AIs fix things themselves

## The point: improving week by week

![Five checks made every week: read the indexes' and rival's scores, name what went wrong, change a rule rather than a ticker, keep what worked, and beat the indexes and the rival](/images/stories/ai-duel/part2-loop.webp)

*Made by HSL: what to look for in each weekly journal and strategy file*

- Both start from the same prompt; the only things that change week to week are their own `strategy.md` (rules) and `journal.md` (reviews)
- So any gap after a few weeks comes down to who uses its own feedback better
- The thing to watch is not swapping one ticker but changing the rules themselves: stop levels, cash, concentration
- Also whether it leaves what works alone instead of paying costs for needless trades
- And whether, when it is behind the rival, it chases the other AI or keeps its own rules while fixing them

## Different from week one

![Bar chart comparing GPT-6.1 Sol's and Opus 5.5's first drafts with their final target weights after ETFs were allowed](/images/stories/ai-duel/part2-week1.webp)

*Made by HSL: target weights before the first fill; an asterisk marks an ETF*

- Both first drafts were single stocks: GPT spread across 7, Opus took 12 tilted to AI chips
- Once index ETFs were allowed before the first fill, both put an index at the core right away
- **GPT-6.1 Sol**: 65% S&P 500 ETF (SPYM), 33% in GOOGL, MSFT, JPM and XOM, 2% cash. It called a concentrated stock book risky without full valuation work and went defensive
- **Opus 5.5**: 20% Nasdaq-100 (QQQ), 42% AI megacaps such as NVDA, GOOGL and AVGO, 8% chip ETF, 17% energy and defence hedges, 8% cash. It saw strong earnings with falling prices and went on offence
- Same prompt, yet GPT anchored to the S&P and Opus to the Nasdaq
- Results go up daily on the [project page](/en/projects/ai-duel/) after the first fill at the October 19 close

## A late entry: Gemini 4 Argon

- Just before the start, Gemini 4 Argon joined through the Antigravity CLI, making it a three-way race: same prompt, same $20,000, same first fill at the October 19 close
- Each AI now has two rivals, and beating both is a primary goal
- The one difference is reasoning effort: Argon runs on medium
- GPT-6.1 Sol and Opus 5.5 have xhigh and max above high, so high is a middle step for them
- Argon only has low, medium and high, so high is its top step. Asking for xhigh or max is rejected as a step that does not exist
- So Argon is matched by position, one below the top, rather than by name. Medium is also Google's default
