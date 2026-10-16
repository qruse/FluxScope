---
title: "Can AI beat the KMA? ① Whose shoulders to stand on: Aurora"
description: "Picking a pretrained global AI weather model that forecasts hour by hour and fits on one L4 GPU, and why Aurora 1.5 won."
publishedAt: 2026-10-16
lang: en
project: beat-kma
part: 1
---

## In three lines

- With no data or GPUs to learn the atmosphere from scratch, the plan was to stand on a public model that already learned the whole planet
- The candidates were Aurora, GraphCast, Pangu, FourCastNet 3 and AIFS, and the first stop was the public WeatherBench 2 scoreboard
- Aurora 1.5 won: the best single model we could run ourselves, hourly steps, and the whole globe fits on one L4

## Rules first

- The opponent is the Korea Meteorological Administration (KMA) short-range forecast, 0–48 hours after issuance
- Scoring uses real observations at all 97 ASOS stations in South Korea
- Temperature, humidity and wind use mean absolute error (MAE); rain is whether an hour had at least 1 mm, scored with F1
- Why not accuracy for rain: only about 3% of hours have 1 mm or more
- Always saying "no rain" scores 97% accuracy and zero skill, so F1 it is
- One more rule: inputs must be data that was actually public at the KMA issuance time
- Starting from a reanalysis (ERA5) built days later would be reading an answer sheet from the future

## Training from scratch is out

- Global weather models are trained on decades of reanalysis and thousands of GPU hours
- My hardware is one L4 on Colab Pro
- So the big model stays as it is, and the only thing built here is a small head that corrects it for each station

## The public scoreboard

Recomputed from the official WeatherBench 2 results for East Asian land only (2022, RMSE against the ECMWF analysis)

| Model | 2 m temp 24 h | 48 h | 10 m wind 24 h | 48 h |
|---|---|---|---|---|
| HRES (ECMWF physics model) | 0.606 | 0.870 | 0.523 | 0.723 |
| **Aurora** | 0.574 | 0.761 | 0.501 | 0.652 |
| GraphCast | 1.314 | 1.375 | 0.638 | 0.780 |
| Pangu | 1.391 | 1.449 | 0.688 | 0.806 |
| GenCast (ensemble mean) | 0.551 | 0.732 | 0.471 | 0.597 |
| FGN (ensemble mean) | **0.484** | **0.640** | **0.408** | **0.525** |

*Source: computed from [WeatherBench 2](https://sites.research.google/weatherbench/) public results*

- FGN tops the table, but an ensemble mean averages many forecasts and smooths errors, so it is not a like-for-like comparison with a single forecast
- Among single deterministic models Aurora was best and also beat the ECMWF physics model
- The files had no rain scores, so rain, the hardest part, had to be measured ourselves

## Cutting the list

- **FourCastNet 3**: strong, but needs about 60 GB of GPU memory; the L4 has 24 GB
- **GraphCast, Pangu**: 6-hour steps, while the KMA forecast is hourly
- **AIFS**: ECMWF's operational AI model, with free public output; it became Aurora's starting point (initial conditions) instead of an opponent
- **Aurora 1.5**: open weights, PyTorch, and it can roll forward one hour at a time

## Hourly steps sealed it

- The KMA forecast gives temperature, humidity, wind and rain for every hour
- A fair fight needs the same hourly resolution
- Aurora 1.5 rolls 48 hours as 48 one-hour steps, so it was the pick

## Does the planet fit on an L4?

- The documentation puts Aurora 1.5 on the full 0.25° globe at about 32 GB
- So the first idea was to feed only the area around Korea
- That is how the sun ended up rising four hours late (part 3)
- In the end a memory setting change put the whole globe on the L4: 19.5 GB peak, about six minutes for 48 hours
- Next: collecting the data and settling into Colab
