---
title: "Added a head and fine-tuned it. So, how did it go?!"
description: "Freezing Aurora, adding a station correction head, and mixing LightGBM with neural heads into an ensemble that beat the KMA on four metrics in the test period, with its limits."
publishedAt: 2026-10-16
lang: en
project: beat-kma
part: 4
---

## In three lines

- Aurora stays frozen; a head corrects its forecast for each station, built with LightGBM and a ladder of neural networks
- The final model mixes LightGBM with two CNN heads, and in the test period it beat the KMA on temperature, humidity, wind and rain
- Scope: 33 issuances from July to October 12, 2026, two-day forecasts, 97 ASOS stations; Seoul rain was a loss

## What the head does

- Inputs: about 40 Aurora values at the station (temperature, dew point, wind, clouds, rain, upper-air temperature and more)
- Plus real observations up to issuance: current temperature, humidity and wind, rain over the last 6 and 24 hours, the same hour yesterday
- The most useful one was "how wrong Aurora has been just now": observation minus Aurora over the last 1–6 hours
- Outputs: corrections added to Aurora's temperature, humidity and wind, and the probability of at least 1 mm of rain
- Aurora is frozen, so the GPU is only needed to make boxes and head training is light

## The neural ladder

One feature per rung, scored on the validation period (mean of two seeds)

| Step | Temp MAE | Humidity MAE | Wind MAE | Rain F1 |
|---|---|---|---|---|
| KMA | 1.192 | 8.82 | 1.055 | 0.358 |
| Aurora zero-shot | 1.460 | 8.66 | 1.198 | 0.587 |
| **LightGBM** | **0.969** | **6.63** | **0.620** | **0.608** |
| MLP | 1.014 | 6.81 | 0.676 | 0.609 |
| + TabM (8 mini members) | 1.012 | 6.80 | 0.673 | 0.605 |
| + attention over lead time | 1.040 | 6.93 | 0.692 | 0.598 |
| + attention across stations | 1.028 | 6.91 | 0.683 | 0.598 |
| + last 24 h observation tokens | 1.025 | 6.92 | 0.682 | 0.607 |
| + reading the Aurora grid with a CNN | 0.999 | 6.78 | 0.675 | 0.602 |
| + reading the grid with a Perceiver | 0.995 | 6.77 | 0.670 | 0.604 |

- Even the top rung never beat LightGBM alone
- With only 122 training issuances, tree models are simply strong on tabular data
- But the neural heads read Aurora's grid directly and made different mistakes from LightGBM
- Mixing helped right away: LightGBM 2 : CNN head (two seeds) 1 : 1
- On validation the ensemble scored 0.953 °C, 6.51%, 0.632 m/s and rain F1 0.624
- Every 2–3 model mix landed within 0.003, so the simplest one stayed

## The test set was opened once

Test period (2026-07 to 10-12): 33 issuances × 97 stations × 48 hours. Models and the rain threshold were fixed on validation and scored once

| | Temp MAE | Humidity MAE | Wind MAE | Rain F1 |
|---|---|---|---|---|
| KMA | 1.077 °C | 6.51% | 0.963 m/s | 0.264 |
| Aurora zero-shot | 1.307 °C | 6.87% | 1.231 m/s | **0.412** |
| **Our ensemble** | **0.836 °C** | **4.54%** | **0.577 m/s** | 0.409 |

- Temperature error was 22% smaller than the KMA's, humidity 30% and wind 40%
- Rain F1 was 0.41 against the KMA's 0.26
- On rain the ensemble only matched zero-shot Aurora, so the head did not add much there
- Daegu was a big rain win, 0.54 vs 0.19
- Seoul won on temperature, humidity and wind but lost on rain, 0.19 vs 0.22 (only 38 rainy hours in Seoul during the test, so a shaky number)

## So nobody gets the wrong idea

- The win covers this test period, these 97 stations and 48 hours after issuance
- There is no evidence yet for every season or for big events like typhoons and heavy snow
- The KMA side is its 5 km grid value at each station, not the worded regional forecast forecasters actually issue
- Rain has a long way to go; being off by one hour counts as a miss, and timing was the hardest part

## An L4 that worked all day

- 195 Aurora boxes, the neural ladder and the ensemble all ran on one Colab Pro L4
- Boxes were made overnight; by day the ladder ran model after model, 20–30 minutes each
- The human's main job in between was asking "is it still running?"
- The biggest takeaway: with a pretrained model, a small head and an ensemble, one person can take on a national weather service without expensive GPUs

## With more GPUs

- To fit 24 GB, Aurora itself stayed frozen and only the head learned
- With more GPU, the same framework can fine-tune Aurora on Korean observations or even pretrain it
- A 10-day forecast fits the same framework too: roll the boxes to 240 hours and train the head out to a 240-hour lead
- What changes is GPU time; the code stays almost the same

## What's next

- For now the service runs a two-day forecast from the 05:00 KST issuance every day
- Our forecast and the KMA's sit side by side, with last week's scores against observations ([project page](/en/projects/beat-kma/))
- One more teaser: a US edition is coming soon, up against the US National Weather Service (NWS)
- That was fun. The end
- More projects like this are coming, so stay tuned
