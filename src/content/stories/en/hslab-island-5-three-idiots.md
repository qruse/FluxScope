---
title: "The Three Idiots"
description: "Same brain, one different bonus: Galoot caught 250 fish a life, Pickle did six things a day, Peppo walked the whole island. Retrained under harsher rules, Peppo settled at 51% reaching day 30."
publishedAt: 2026-11-05
lang: en
project: hslab-island
part: 5
---

## In three lines

- Peppo the explorer, Pickle the joker and Galoot the glutton got the same HyPPO brain, with one personality bonus each on top of the survival reward
- On 512 islands Galoot caught 250.7 fish per life, Pickle 47.6 and Peppo 15.5, and only Peppo fell behind on reaching day 30 (60.2% against about 97% for the other two)
- After fixing the sea rules I retrained only Peppo and made episode 1 from that. A Peppo that never caught a fish reached day 30 in none of 204 lives

## One bonus is the only difference

![Peppo, Pickle and Galoot side by side holding spears: straw hat and orange shirt, bucket hat and green shirt, red headband and blue shirt](/images/stories/hslab-island/part5-cast.webp)

*Made by HSL — the three castaways. The video and the project page simply present them as different people*

- All three have the same brain structure and training setup: HyPPO, 40M steps, 2,048 islands (part 4)
- The base reward is also the same, 1 point per day alive. Only the bonus on top differs
- A full day of bonus was meant to be worth about a third of a day alive. A personality may get them killed, but staying alive still has to matter most

| Castaway | Bonus for | Size | Earned per day in practice |
|---|---|---|---|
| Peppo (explorer) | Each 4 m cell visited for the first time today. The map resets every morning | 0.006 per cell | About 0.35 |
| Pickle (joker) | Each of today's 15 bingo squares done for the first time. The card resets every morning | 0.02 per square | At least about 0.13 |
| Galoot (glutton) | The food value of whatever is eaten, even when full | 0.002 per food point | About 0.33 |

*Sizes from rules.json `personas`. Per-day figures are my calculation: Peppo 58 cells a day; Pickle 6.3 a day of the 12 squares a replay can show; Galoot 250.7 fish per life × 20 food ÷ 30 days. Crates, caves and stabs cannot be counted, so Pickle's is a lower bound*

- The bingo squares are drinking, eating four kinds of food, gathering five kinds of thing, making a spear, stabbing water, catching a fish, opening a crate and sleeping in the cave
- They need to know where they went and what they did today, so today's card and the visited state of the 3×3 cells around them went into everyone's observation (sim/env.py)
- The remaining records show no tuning of these sizes. They are still the first calculated values

## Same island, different lives

| Castaway | Mean survival | Reached day 30 | Lives with a catch | Fish per life |
|---|---|---|---|---|
| Peppo | 24.8 days | 60.2% | 75.4% | 15.5 |
| Pickle | 29.9 days | 97.1% | 100% | 47.6 |
| Galoot | 29.5 days | 97.7% | 99.8% | 250.7 |

*Brains finished on 11/1, 512 islands, seed 777 (runs/cast_\*/eval.json). All three on the rules from before the 11/2 change*

![Thirty days of movement drawn on the island map for each castaway. Peppo's lines cover the whole island densely, Pickle's cluster in the middle and near the northeast fishing spot, and Galoot's form thick paths between the three fishing spots](/images/stories/hslab-island/part5-tracks.webp)

*Made by HSL — one 30-day life per castaway. Blue rings are the three hidden fishing spots (replays/hl/cast_\*/step_40M/01_survived.json)*

- **Galoot** commutes between the three fishing spots. 250 fish in 30 days is 8.4 a day, close to four times the food a day requires
- **Peppo** covers 56–59 cells a day, against 24–31 for Galoot and Pickle. That leaves less time at the fishing spots and the smallest catch of the three
- **Pickle** does 6.0–6.6 of the 12 countable things a day. Peppo does 3.6–4.2 and Galoot 3.2–3.4
- The behaviour numbers come from 7 or 8 replays per castaway that lasted over 20 days, some of them the same life, so the sample is small. Mean survival cannot tell Pickle and Galoot apart; the drawn paths did it at once
- I think Peppo survives less because the walking eats the time. That is my reading, and I did not run a separate test for it

## The video exposed the sea, so the rules changed

- Watching the finished video, swimming looked far too safe (part 2). On 11/2 I raised the cold and the deep-water energy drain, and banned sleeping in water
- Episode 1 was going to be Peppo alone, so only Peppo was retrained: 40M steps, 21.8 minutes, 11,091 lives
- Galoot's and Pickle's brains are still on the old rules

![Mean days alive per attempt stage. It climbs slowly from 0.8 at attempt 1 to 5.0 at attempt 5,000, jumps to 17.7 at attempt 6,000, then reaches 26.3 at attempt 10,000 and 24.3 at attempt 11,000](/images/stories/hslab-island/part5-stages.webp)

*Made by HSL — 48 islands per stage, dot color is the most common ending. 11/2 rules (replays/hl/cast_peppo_v3/report_stages.md, report.md)*

- The walls came in order: sea, thirst, hunger. Episode 1 follows the same order
- The biggest jump came between attempts 5,000 and 6,000, when two habits changed at once

| Stage | Mean survival | Cells walked per day | Most berries and coconuts in the bag |
|---|---|---|---|
| Attempt 4,000 | 3.7 days | 6–10 | 1–3 |
| Attempt 5,000 | 5.0 days | 10–18 | 1–3 |
| Attempt 6,000 | 17.7 days | 44–54 | 3–12 |

*Cells and bag are ranges over 7 or 8 replays per stage (replays/hl/cast_peppo_v3)*

- An attempt number is not a clock. Attempt 5,000 sits at 3.15M steps and attempt 6,000 at 9.83M, because longer lives make each attempt longer
- The learning curve did not end neatly. The saved best brain averaged 28.44 days (best.json) while the last log line says 24.44. Every number and scene here comes from the last brain, attempt 11,000

## No fish, no day 30

![Two grids of squares for lives that caught a fish and lives that did not. 260 of the 308 that caught one reached day 30, and 0 of the 204 that did not](/images/stories/hslab-island/part5-fish.webp)

*Made by HSL — last brain, 512 islands, seed 1 (lastday_v3.log)*

- 260 of 512 lives reached day 30, or 50.8%. That is below the old rules' 60.2%, but the seeds differ, so the comparison is rough
- The first fish comes late. Half of the lives that caught one did so after day 16.4, and none did by day 8. Fishing starts about when the fruit runs out
- Of the 105 lives that caught one before day 16, 89 survived. Of the 203 that caught one later, 171 did. Starting late cost almost nothing

| | Lives | Reached day 30 | Most common death |
|---|---|---|---|
| Caught a fish | 308 | 260 | Cold, 33 |
| Never caught one | 204 | 0 | Hunger, 172 |

*lastday_v3.log, 11/2*

- Fishing solves hunger, and then the night cold does the killing
- The closest miss is island 343: frozen on day 29.9, 2.1 hours before the end. It can be replayed in 3D on the [project page](/en/projects/hslab-island/)
- The rescue boat at the end of episode 1 is staged, not learned. It is an ending added after the 30 days (viewer/main.js)

## Why do this, and the next island

- The goal is not to clear the island. It is to see how differently the same island can be survived, and the table and paths above are the first result
- The plan was to put all three in episode 1. On 11/2 I dropped that and went with one castaway growing up
- On the next island the map gets bigger and the three live together. That first requires retraining Galoot and Pickle on the new rules
- I also plan to let a human step in and rescue them. For now a human can only play alone under the same rules
- The end condition, animals and the extra rules are not decided yet

## What I learned

- Personality does not need a big bonus. Pickle's was around 0.13 a day, and it still did about 1.5–2 times as many different things as the other two
- Each personality has its own price. Bonuses of a similar size do not mean a similar difficulty: only Peppo was about 37 percentage points behind on reaching day 30
- Draw the behaviour before the average. Two castaways were 0.3 days apart on mean survival and over five times apart on fish per life
- New rules mean retraining. At a little over 20 minutes per castaway, changing the rules was never scary
- The video and the playable island are on the [project page](/en/projects/hslab-island/)
