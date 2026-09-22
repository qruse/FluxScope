---
title: "System 2 thinking in reasoning models: test-time compute and AGI"
seoTitle: "System 2 Thinking in Reasoning Models and Test-time Compute"
description: "How allocating dynamic compute during inference enables complex math and coding problem-solving, charting a practical path toward AGI."
publishedAt: 2026-09-21
updatedAt: 2026-09-21
category: agi
tags: [reasoning, test-time-compute, system-2, chain-of-thought, mcts, model-architecture]
author: "FluxScope"
image:
  src: /images/agi.png
  width: 1200
  height: 630
  alt: "Illustration representing abstract reasoning chains"
draft: false
lang: en
experienceNote: "Deploying reasoning models to automated SQL synthesis boosted multi-table join precision from 62% to 91%, but introduced a 12-second latency penalty requiring query intent routing"
---

## 3-Line TL;DR

- Conventional LLMs are fast-talking bullshitter parrots (System 1); reasoning models are tortured introverts agonizing over every comma (System 2)
- Multi-table SQL precision jumped from 62% to 91%, but asking it to run `SELECT 1` triggers a 12-second existential crisis that blows up API timeouts
- Feeding brainless queries into reasoning models will bankrupt the company by Friday unless an aggressive front-door routing gate drops the hammer

---

## 3 Ways Reasoning Models Burn Cloud Compute to Act Smart

1. **Hidden Chain-of-Thought (CoT)**
   - Before replying to the user, the model mutters thousands of tokens to itself in a dark digital corner
   - Catches its own blunders with self-critical backtracking ("Wait, this pointer could be null, let me rewrite this whole loop")
   - The catch: finance bills your credit card for every single invisible word of that agonizing self-reflection

2. **Tree Search & Process Reward Models (PRM)**
   - Mimics Monte Carlo Tree Search (MCTS) to explore only promising reasoning branches instead of hallucinating straight into a wall
   - Grades every single intermediate deduction step rather than blindly hoping the final answer turns out right
   - Demolishes nested queries, recursive tree traversals, and concurrency race conditions with uncanny precision

3. **Inference Compute Proportionality (and Invoice Inflation)**
   - Trivial prompts should finish instantly, but when the model gets obsessed, it burns thousands of hidden tokens overthinking
   - Nothing tests an engineer's blood pressure like staring at a pulsating "Thinking..." spinner for 25 seconds just to parse an ISO timestamp

![OpenAI o1 Test-Time Compute Scaling Law Plot](/images/posts/agi/test-time-compute-scaling-sourced.webp)
*Source: [OpenAI](https://openai.com/index/learning-to-reason-with-llms/) — Learning to reason with LLMs (o1 Test-Time Compute Scaling)*

---

## Bullshit Generator (Classic LLM) vs Tortured Thinker (Reasoning Model)

| Dimension | General-Purpose LLMs (e.g. GPT-4o) | Reasoning Architectures (o1 / o3 / R1) |
| :--- | :--- | :--- |
| **Cognitive Mode** | Instant confident fabrication (System 1) | Neurotic self-critique & backtracking (System 2) |
| **Time to First Token (TTFT)** | 0.3s (gratifying instant dopamine) | 10s–30s (long enough to grab another espresso) |
| **Ideal Workload** | Marketing spin, boilerplate summaries, simple chat | 7-way SQL joins, kernel security audits, nasty race bugs |
| **Billing Trauma** | Dirt cheap pennies per call | Ghost thinking tokens multiply cloud invoices 5x–10x |

---

## Community Reactions

- **The Overthinking Catastrophe**: Field developers report users abandoning apps after asking "What day is today?" only to endure a 30-second silent monologue on the Gregorian calendar
- **Phantom Token Invoicing Panic**: Deep discussions across platform forums on surprise invoices from invisible thinking tokens, forcing teams to hack together aggressive classifier routers
- **Unstoppable on Hairy SQL & Kernel Bugs**: General agreement that when tasked with untangling 500-line legacy stored procedures, it humiliates human senior engineers

---

## Q&A (Field Notes)
- **Can I hook this up to our customer support bot?**: Only if your goal is getting fired after users wait 25 seconds for a simple return shipping address
- **Where does it actually belong?**: Put it exclusively where a single silent hallucination costs more than the compute bill: multi-table SQL generation, smart contract audits, and zero-day patch analysis
