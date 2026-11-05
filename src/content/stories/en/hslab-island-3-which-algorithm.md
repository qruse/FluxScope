---
title: "So which reinforcement-learning algorithm should I use?"
description: "It had to run on one RTX 3070. RePPO, PQN and AGaLiTe met a PPO baseline on the same island: plain PPO came first at 14.0 days on average, and all four barely found the hidden fishing spots."
publishedAt: 2026-11-05
lang: en
project: hslab-island
part: 3
---

## In three lines

- Just using an existing algorithm is no fun, and with one GPU I needed a very efficient structure
- I picked three light candidates with strong recent results, RePPO, PQN and AGaLiTe, and ran them against a PPO baseline on the same island for 15 minutes each. Plain PPO came first at 14.0 days on average
- In all four, the share of lives that fished peaked at 7.1%. So I decided to build our own brain, Mk.1, on PPO and a GRU, aimed at finding fish

## There were two conditions

- **Light**: 4,096 islands have to run together on one 8GB RTX 3070. If one training run takes days, there is no video
- **Varied behaviour**: this is a simulation to watch, not a speedrun. A high score from moving the same way every time gives nothing to see
- I also assumed the island needs memory: where the spring was, which bushes are picked clean

## The candidates that were out

- **World models (DreamerV3 and others)**: they learn by simulating the world in imagination. That saves data, but a GPU simulator gives us plenty of data and the models are heavy
- **Transformer memory (TrXL)**: good memory, far heavier than the others. Too much to fit beside thousands of islands in 8GB

## The three picks and the baseline

| Name | In one line | Why |
|---|---|---|
| PPO + GRU | The most common policy learning + recurrent memory | Baseline |
| RePPO | PPO that assumes it can retry and pushes up the best outcome | Exploration that gets bolder with retries |
| PQN | Q-learning straight from parallel environments, no replay buffer or target network | Simple and fast |
| AGaLiTe | A light transformer-style memory of fixed size | Transformer memory on the cheap |

*Sources: [RePPO code](https://github.com/nissymori/remax-rl) · [PQN paper](https://arxiv.org/abs/2407.04811) · [AGaLiTe paper](https://arxiv.org/abs/2310.15719)*

- All four trained for 15 minutes on the same island with the same observations and the same reward (1 point per day alive)
- The learning rate fell toward the end, and the brain from the best moment was saved separately

## PPO by the clock, AGaLiTe by experience

![Line chart of mean days alive over the same 15 minutes. PPO ends at 14.0 days, AGaLiTe 11.8, PQN 9.4, RePPO 2.5](/images/stories/hslab-island/part3-curves.webp)

*Made by HSL — 4,096 islands, 15 minutes each, 10/29 (runs/mk1_\*/log.json)*

| Algorithm | Mean survival after 15 min | At the same 18.35M steps | Steps per second | Lives that fished (peak) |
|---|---|---|---|---|
| PPO + GRU | **14.0 days** | 11.1 days | 44,000 | 7.1% |
| AGaLiTe | 11.8 days | **11.8 days** | 20,000 | 6.1% |
| PQN | 9.4 days | 3.5 days | **50,000** | 3.5% |
| RePPO | 2.5 days | 2.1 days | 45,000 | 0.3% |

*Means from the training logs, one seed per algorithm, survival reward only, 10/29*

- By the clock, PPO wins. The simplest baseline did best
- By experience, AGaLiTe is slightly ahead, but one step takes twice as long as with a GRU
- PQN runs fastest and shot up late
- RePPO stayed around 2 to 2.5 days and 95% died of thirst. I used the original code's defaults, so without tuning for our island I cannot call it bad
- With one seed each, the ranking itself is not reliable. I only took the broad direction from it

## All four missed the fish

![Peppo stands on the rocks beside a fishing spot. Fish show in the water inside the ring, and the bag panel lists 1 fish and a spear](/images/stories/hslab-island/part3-fishing.webp)

*Made by HSL — a scene this comparison never produced: a catch at a hidden spot (later brain, attempt 6,000)*

![Peak share of lives that fished for each algorithm: PPO 7.1%, AGaLiTe 6.1%, PQN 3.5%, RePPO 0.3%](/images/stories/hslab-island/part3-fished.webp)

*Made by HSL — peak share of lives that fished (runs/mk1_\*/log.json)*

- The island's food is gone in a little over two weeks (part 2). Without fish, that is the limit
- Even with the lower difficulty, the share of lives that fished peaked at 7.1%
- So the real result of this match was not the ranking but that all four hit the same wall

## So here is what Mk.1 aimed for

- Almost nothing came from the three candidates. PPO + GRU did best, so it stayed as the base
- AGaLiTe's memory did not justify being twice as slow, so memory stayed a GRU for now
- The new parts came from outside the comparison: curiosity that likes unvisited places (RND), a body that stays stable when stacked deeper (SimBa), and a Simplicial Embedding that splits up the policy's features
- Goal 1: learn faster on the same GPU
- Goal 2: find the fishing breakthrough before the island's food runs out
- Goal 3: not move the same way every time, with different ways of surviving from life to life

## If I did it again

- Measure by both time and experience. The winner changed with the yardstick
- Run several seeds from the start. A one-seed ranking had to be measured again later (part 4)
- Track the behaviour that gets past the wall (here, fishing) next to mean survival. That number set the direction
- Next part: building Mk.1 and fixing it until it became HyPPO
