---
title: "The two best-value models today: Opus 5.5 vs GPT-6.1 Sol"
description: "AIs start from the same prompt and $20,000 and must beat the market indexes and each other. The rules, and the real point: improving themselves week by week."
publishedAt: 2026-10-18
lang: en
project: ai-duel
part: 2
---

## In three lines

- The players are Claude Opus 5.5 and GPT-6.1 Sol, the two best-value models available right now, plus Gemini 4 Argon, which joined just before the start
- All three run US stocks and ETFs from the same prompt and $20,000. Beating the S&P 500 and Nasdaq-100 and beating the other AIs are both primary goals
- The real question is not the return itself but whether each one gets better from weekly feedback

## Why these models

- Claude Opus 5.5 runs through the Claude CLI and GPT-6.1 Sol through the Codex CLI, both set to high reasoning effort
- All three search the web for earnings, filings and news and decide on their own
- I considered top-tier models like Astra and Fable, but their token prices were too much for a project that runs every week
- This experiment only means something after months of weekly runs, so it needed models where performance and cost both work
- So the two best-value models of the moment went head to head, and Argon joined as described below

## The rules

![Rules table: $20,000, US-listed stocks including ADRs and ETFs, no leveraged or inverse products or short selling, fills at the next close, 0.1% cost, a Saturday meeting, GPT and Opus on high and Argon on medium, and the goal of beating SPY, QQQ and the rivals](/images/stories/ai-duel/part2-rules.webp)

*Made by HSL: the rules all three AIs share*

- Each starts with $20,000
- They can buy US-listed stocks (ADRs such as TSMC included) and ETFs. ETFs were blocked at first, then index ETFs were allowed because the point is to actually make money
- Leveraged or inverse products, short selling and margin are not allowed; code rejects them using Toss stock data
- Orders fill at the next US regular-session close after the decision, with a 0.1% fee on every trade, about the Toss Securities US-stock rate
- Each briefing shows the other AIs' returns every week. Only the numbers are visible, not their holdings or strategy
- So beating the other AIs is a primary goal alongside beating the indexes
- The starting prompt is short on purpose. Too many rules up front would make it hard to see the AIs fix things themselves

## The point: improving week by week

![Five checks made every week: read the indexes' and rival's scores, name what went wrong, change a rule rather than a ticker, keep what worked, and beat the indexes and the rival](/images/stories/ai-duel/part2-loop.webp)

*Made by HSL: what to look for in each weekly journal and strategy file*

- All three start from the same prompt; the only things that change week to week are their own `strategy.md` (rules) and `journal.md` (reviews)
- So any gap after a few weeks comes down to who uses its own feedback better
- The thing to watch is not swapping one ticker but changing the rules themselves: stop levels, cash, concentration
- Also whether it leaves what works alone instead of paying costs for needless trades
- And whether, when it is behind, it chases the others or keeps its own rules while fixing them

## A late entry: Gemini 4 Argon

- Just before the start, Gemini 4 Argon joined through the Antigravity CLI, making it a three-way race
- The one difference is reasoning effort: Argon runs on medium
- GPT-6.1 Sol and Opus 5.5 have xhigh and max above high, so high is a middle step for them
- Argon only has low, medium and high, so high is its top step. Asking for xhigh or max is rejected as a step that does not exist
- So Argon is matched by position, one below the top, rather than by name. Medium is also Google's default
- The rules changed a few times while the first two AIs were already running, which left traces in their notes, so for fairness all three redid week one in fresh sessions with empty files

## Different from week one

![Bar chart comparing the first target weights of GPT-6.1 Sol, Opus 5.5 and Gemini 4 Argon](/images/stories/ai-duel/part2-week1.webp)

*Made by HSL: targets for the first fill at the October 19 close; an asterisk marks an ETF*

- **GPT-6.1 Sol**: all ETFs. 30% SPY and 20% QQQ as the base, then health care (XLV) 20%, energy (XLE) 15%, financials (XLF) 10%, 5% cash, aiming to beat the index through sector gaps
- **Opus 5.5**: 15 holdings. AI megacaps such as NVDA, GOOGL, MSFT, AVGO and TSM at the core, with energy, health care, financials and gold (GLD) around them and 7% cash
- **Gemini 4 Argon**: 9 holdings, no ETFs, no cash. A barbell of AI tech (NVDA, TSM, AVGO, META) on one end and XOM, LLY, RTX, GE and GS on the other
- Same prompt, yet GPT went defensive with ETFs, Opus diversified and Argon went all in on single stocks
- Results go up daily on the [project page](/en/projects/ai-duel/) after the first fill at the October 19 close
