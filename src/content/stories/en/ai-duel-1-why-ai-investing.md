---
title: "Why I started an AI investing experiment"
description: "Looking for ways to make money with AI turned out harder than expected, so I picked the one where results show up as a number: a fully public AI stock portfolio."
publishedAt: 2026-10-18
updatedAt: 2026-10-27
lang: en
project: ai-duel
part: 1
---

## In three lines

- I spent a while looking for ways to make money with AI, and it was harder than I expected
- So I went for AI stock investing, where the result shows up directly as a return
- Day trading, quarterly quant and investing alone each had a catch, so AIs run the portfolio weekly and everything is public

## Making money with AI is harder than it looks

- I looked at a lot of ways AI could earn money
- Content, automation and side gigs all need a person to keep them going, and how much they really earned stays fuzzy
- The more I tried, the harder it got to say plainly whether the AI made any money
- So I looked for something where the result is one number, and that was the stock market
- A return does not lie: every day it shows whether you did better or worse than the market

## Each approach had a catch

![Table showing day trading blocked by costs, quarterly quant by macro risk, solo investing by lack of information, and the weekly public AI portfolio this project chose](/images/stories/ai-duel/part1-options.webp)

*Made by HSL: where each approach got stuck and what this project picked*

- **Day trading**: trading many times a day pays costs and spreads every time; small edges disappear in fees
- **Quarterly, quant-style investing**: the long gap between rebalances leaves the book open to macro shocks like rates, wars and oil
- **Doing it alone**: there is not enough time or information to read every earnings report, filing and headline each week
- So I picked the middle: **AIs research the market and rebalance every week, and every trade and result is published**

## Why fully public

- Running it quietly means remembering the wins and forgetting the losses
- Every order, reason and return goes on the project page from day one
- Losing weeks stay up too, so anyone can watch whether AI really beats the market
- It starts as paper trading with no real money. Prices are regular-session closes from the Toss Securities Open API

![Score cards at the top of the project page: returns for GPT-6.1 Sol, Claude Opus 5.5 and Gemini 4 Argon, their gap to the S&P 500 and Nasdaq-100, max drawdown, volatility and beta](/images/stories/ai-duel/part1-live-scoreboard.webp)

*Made by HSL — score cards on the project page, as of Oct 27 07:31 KST*

- The top of the page updates every morning with each AI's return and its gap to the indexes

## How it runs

![Flow from Toss Open API prices to the Saturday meeting, strategy rewrite, orders and a fill at the next US close, with results fed back into the next briefing](/images/stories/ai-duel/part1-loop.webp)

*Made by HSL: the loop that repeats every week*

- Every Saturday each AI reads a briefing: last week's return, holdings and rejected orders
- It reviews its last call, rewrites its own strategy document and sets new target weights
- Code checks the orders and fills them at the next US close
- Books are marked to the close every morning and published
- Those results go into the next briefing, which closes the feedback loop

## If I did it again

- Keep the 0.1% trading cost from day one; all three first-day values started below $20,000, so the cost showed up in the numbers at once
- The Toss Securities Open API can place real orders but has no paper-trading mode, so code simulates fills at the close. Before putting in real money, the gap between simulated and real fills would need measuring first
- The next part covers the AIs in this race and the rules they play by
