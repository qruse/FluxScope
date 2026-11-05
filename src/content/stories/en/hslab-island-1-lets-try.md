---
title: "Those reinforcement-learning 3D simulators I loved watching.. let me try one too!"
description: "Watching AI learn games through reinforcement learning led to a simulator of my own: desert-island survival, the theme I loved as a kid, with 4,096 islands at once on one RTX 3070."
publishedAt: 2026-11-05
lang: en
project: hslab-island
part: 1
---

## In three lines

- I enjoyed videos of AI learning inside small game worlds, and desert-island survival seemed like an even more fun theme, so I started one
- With one RTX 3070 at home instead of a big-tech GPU farm, I first built a simulator that runs 4,096 islands at once on the GPU
- In the first 60-minute training run, average survival went from 1.4 days to 13.2 days. It never got past the island's food running out, and the 70,000th brain had fallen back to 8.1 days

## The videos I kept watching

![The 3D viewer I built. A character in a straw hat stands on the beach, with bars for health, food, water, energy and warmth at the top left](/images/stories/hslab-island/part1-viewer.webp)

*Made by HSL — the tutorial island in a 3D viewer you can also play yourself*

- I often watched videos where an AI dies tens of thousands of times on a fixed map and slowly gets good
- The best known is AI Warehouse, a channel where AIs learn hurdles and sumo on Unity maps. As of 11/5 it had 21 videos and 833K subscribers ([AI Warehouse](https://www.youtube.com/@aiwarehouse))
- The classic is the 2019 hide-and-seek experiment. Hiders and seekers only competed, yet building walls from boxes and climbing over them with ramps emerged on their own ([arXiv 1909.07528](https://arxiv.org/abs/1909.07528))
- The more I watched, the more I thought: couldn't I build that?

## Why a desert island

- As a kid I loved Robinson Crusoe and a Korean book on how to survive on a desert island
- The rules of survival are intuitive. Eat when hungry, drink when thirsty, nights are cold, the sea is dangerous
- But there is no single right answer. Pick fruit, make a spear and fish, or find a cave for the night
- What I most wanted to see was which of these an AI would work out on its own
- In what I could find, there were almost no videos showing desert-island survival through reinforcement learning in 3D

## How I set it up

- The 3D island can also be played by me: the same island and the same rules as the AI
- The AI sees through 24 rays around it, not screen pixels (details in part 2)
- For training there is a separate simulator with no graphics, only the rules. One island is one row of a tensor, so thousands run on the GPU in one go

| Item | Value |
|---|---|
| GPU | One RTX 3070 (8GB) |
| Islands at once | 4,096 |
| Training speed | About 54,000 steps per second (about 13,500 island days per real minute) |
| 60-minute run | About 195M steps, about 70,000 lives lived and lost |

*From the 10/29 training log (runs/full_v2)*

## First run: the cause of death kept changing

- During the 60-minute run I saved the brain at round attempt numbers, then replayed each stage on 256 islands

| Attempt | Mean survival | Top cause of death |
|---|---|---|
| 1st | 1.4 days | Drowned 79% |
| 3,000th | 2.6 days | Thirst 84% |
| 10,000th | 9.5 days | Hunger 64% |
| 50,000th | 13.2 days | Hunger 93% |
| 70,000th | 8.1 days | Thirst 77% |

*256 islands × 1 life per stage, 10/29 rules (replays/hl/full_v2/report.md). The rules changed later, so these do not compare directly with today's numbers (part 2)*

![Bars of death causes by stage. Drowning leads at attempt 1, thirst at 3,000, hunger at 10,000 and 50,000, and thirst again at 70,000](/images/stories/hslab-island/part1-deaths.webp)

*Made by HSL — causes of death at each attempt stage*

- At first it walks into the sea and drowns
- Once it avoids water, it dies of thirst because it cannot find a drink
- Once it finds the spring, it starves. The island's fruit never grows back, so it runs out in about two weeks
- You could watch each lesson lead straight to the next wall
- At attempt 70,000 it got worse. I blamed a learning rate left fixed to the end and fixed that, but that did not solve all of it (part 4)

![Last scene of attempt 50,000. A starvation notice over a fallen character on the beach, with 2 coconuts and a spear still in the bag panel](/images/stories/hslab-island/part1-coconuts.webp)

*Made by HSL — attempt 50,000, day 13: starved with 2 coconuts in the bag*

## If I did it again

- Writing the simulator in GPU tensors from day one was the right call. With thousands of islands at once, one hour means 70,000 lives
- Add learning-rate decay and best-score saving from the start. I noticed too late that a trained brain could fall apart
- Mine video scenes automatically instead of hunting by hand. The coconut scene only stopped slipping past me once I added an event detector
- Next part: the island's rules, controls and map
