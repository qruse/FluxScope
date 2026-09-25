---
title: "GPT-6 Sol and Luna vs Opus 5.5: Half-Price Tokens, Full-Price Fixes?"
description: "Sol and Luna's welcome price cuts meet Opus 5.5's polished output; retries and review time still show up on the bill"
category: agi
publishedAt: 2026-09-23
updatedAt: 2026-09-26
tags: [gpt-6, gpt-6-sol, gpt-6-luna, opus-5-5, api-pricing, token-economics, agent-routing]
author: HSL
image:
  src: /images/posts/agi/gpt-6-workload-routing.webp
  alt: "Concept flow for choosing Luna, Sol, or Opus 5.5 by task and checking the result"
  width: 1140
  height: 522
draft: false
lang: en
experienceNote: "I used Sol and Luna and found their value excellent, while Opus 5.5 felt overwhelmingly strong in the quality of its finished output"
---

## 3-Line TL;DR

- Sol and Luna felt like **excellent value** in my use; their API input/output rates per million tokens are **$2/$10** and **$0.10/$0.50**. The price sheet deserves applause, at least ([OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/))
- Opus 5.5's finished output felt **exceptionally strong**; its standard rates fell from **$5/$25 to $4/$20**, though it remains the expensive guest at the table ([Anthropic](https://www.anthropic.com/claude-opus-5-5))
- A discounted token does not discount your repair time; compare **cost per successful task** after retries and human review

![Conceptual task routing through Luna, Sol, Opus 5.5, and review](/images/posts/agi/gpt-6-workload-routing.webp)

## Firsthand impression: value means different things here

- **GPT-6 Luna and Sol** felt especially good for the money; another pass on a routine draft does not immediately make the invoice frightening
- **Claude Opus 5.5** stood out for final-output quality; on complex work the higher price sometimes felt justified, and I was very satisfied with the result
- This is a personal impression, not a controlled, repeated, same-prompt win-rate study; keep it distinct from price sheets and published evaluations

## The price sheet: everyone brought a discount, not the same bill

These [OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/) and [Anthropic](https://www.anthropic.com/claude-opus-5-5/) standard API prices are USD per million tokens, excluding caching, tools, and other processing modes

| Model | Input | Output | Earlier model |
| :--- | ---: | ---: | :--- |
| GPT-6 Luna | $0.10 | $0.50 | GPT-5.6 Luna $0.20/$1.20 |
| GPT-6 Sol | $2 | $10 | GPT-5.6 Sol $4/$20 |
| Claude Opus 5.5 | $4 | $20 | Opus 5 $5/$25 |

![Official Luna, Sol, and Opus 5.5 API prices](/images/posts/agi/gpt-6-api-prices.webp)

*Chart data: standard API input/output prices in [OpenAI's release](https://openai.com/index/introducing-gpt-6-sol-and-luna/) and [Anthropic's release](https://www.anthropic.com/claude-opus-5-5/)*

- One million input plus 250,000 output tokens would be **$0.225 on Luna**, **$4.50 on Sol**, or **$9 on Opus 5.5**, assuming the same task succeeds without caching
- Opus 5.5's list input and output rates each fell **20%** from Opus 5, while cache reads fell from **$0.50 to $0.20**; Anthropic's **40% lower typical task cost** also reflects token usage and caching in its tests
- Three attempts on a cheaper model plus a long manual fix can end the half-price celebration; paying Opus rates for trivial classification just buys a premium receipt

## Assign the work before the price sheet assigns you a headache

1. **Luna** for high-volume classification, brief summaries, and first-pass extraction with verifiable outputs
2. **Sol** for multi-step coding, tool workflows, and iterative work with ambiguous requirements
3. **Opus 5.5** for design, long documents, and difficult code work where the finished result and repair time matter most

This is an editorial workflow based on firsthand use and published prices, not a built-in router. [OpenAI's evaluations](https://openai.com/index/introducing-gpt-6-sol-and-luna/) and [Anthropic's evaluations](https://www.anthropic.com/claude-opus-5-5/) vary in effort, setup, and measurement, so their scores are not a clean head-to-head result

## Community Reactions

- **Cheaper Sol, divided verdict**: The r/OpenAI launch discussion welcomed the price cut, while some users said Sol felt less thorough than its predecessor; others reported no loss or said it worked well for them. Price and perceived quality are separate claims
- **Luna's brevity has a cost**: A reporting-agent maintainer's account describes missed items and answers so terse they required follow-up. It is one user's test, not a published benchmark, but a useful reminder to measure omissions in extraction work
- **Opus praise, Sol pushback**: An r/ClaudeAI Opus 5.5 thread praises the output and interaction; an r/OpenAI Sol thread includes both users returning to 5.6 and a reply challenging conclusions based on feeling alone

## Q&A (Field Notes)

- **Q: Is Opus 5.5 really cheaper than Opus 5?**
  - Standard API input and output rates each fell 20%; total task cost still depends on caching, tokens, and retries
- **Q: Should Luna be the default for everything?**
  - Start with verifiable bulk tasks, then measure whether failures and retries erase the savings
- **Q: Does the firsthand impression prove Opus 5.5 always beats Sol?**
  - No; it describes a strong experience with finished output, not a controlled universal ranking
