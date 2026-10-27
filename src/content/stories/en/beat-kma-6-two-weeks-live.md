---
title: "Two weeks of running the forecast service - pretty accurate, actually"
description: "Two live weeks, 14 issuances: more accurate than the KMA on temperature, humidity and wind every time. Rain swung day to day, and a check found our own bug in the KMA wind numbers."
publishedAt: 2026-10-30
lang: en
project: beat-kma
part: 6
---

## In three lines

- For two weeks a home PC has run the 05:00 issuance on its own. In all 14 issuances our temperature, humidity and wind errors were smaller than the KMA's
- Rain was won big on rainy days, but on days with only a few rainy hours we sometimes caught none
- Re-checking the KMA numbers before posting a Short, I found a bug on our side that added 0.05 to the KMA's wind, and fixed it

## Every day at 05:30, the home PC runs itself

![Five-step flow: build the Aurora box on a Colab L4, fetch yesterday's official observations, store the ensemble and the KMA forecast, upload to the site, archive the KMA issuances](/images/stories/beat-kma/part6-pipeline.webp)

*Made by HSL — the daily job Windows Task Scheduler starts at 05:30*

- At 05:30 Task Scheduler runs one script; nobody touches it
- The slowest step is running Aurora on a Colab L4 to build the box around Korea
- The forecast reached the site between 05:46 and 06:09, so a run takes 16–39 minutes
- On 5 of the 11 mornings from Oct 17 to 27 the Colab connection dropped mid-run. A retry that reconnects up to three times meant not a single day was missed

```text
[05:30:05] Aurora 박스 (2026102705)
[colab] Session READY.
RuntimeError: Connection was lost.
[colab_bg] exec 끊김 (1/3)
...
[06:09:07] 올리기
[service] 16개 올림 -> https://hslab.space/api/weather
```

- The log is in Korean: "Aurora box", "exec dropped (1/3)", "upload", "16 files uploaded"
- Observations arrive twice. The last hours before issuance are filled from the KMA nowcast, then overwritten by official ASOS observations the next day

## Two weeks: 14 out of 14

![Line chart of temperature MAE for the 14 issuances at 05:00 from October 13 to 26, our AI against the KMA; ours is lower every time](/images/stories/beat-kma/part6-daily.webp)

*Made by HSL — temperature MAE per issuance, 97 stations, as of Oct 27*

| Two live weeks (14 issuances, Oct 13–26) | Ours | KMA | Test period (part 4) |
|---|---|---|---|
| Temp MAE | **0.90 °C** | 1.18 °C | 0.84 vs 1.08 °C |
| Humidity MAE | **5.4%** | 7.9% | 4.5 vs 6.5% |
| Wind MAE | **0.66 m/s** | 1.21 m/s | 0.58 vs 0.96 m/s |
| Rain F1 (1 mm) | **0.70** | 0.44 | 0.41 vs 0.26 |
| Light-rain F1 (0.1 mm) | **0.82** | 0.71 | 0.51 vs 0.37 |

- Temperature, humidity and wind: our error was smaller in all 14 issuances, not one day lost
- Our temperature error was 24% below the KMA's, close to the 22% of the test period, which suggests the test result was not luck
- Scores cover the 62,638 station-hours (97 stations × 48 hours) where both the KMA value and an observation exist
- The Oct 26 issuance is only half scored so far, and light rain before Oct 20 comes from adding the classifier afterwards (part 5)

![The project page's last-7-days table, with temperature, humidity and wind errors and rain F1 for each issuance from October 21 to 26, our AI next to the KMA](/images/stories/beat-kma/part6-live-week.webp)

*Made by HSL — last-7-days table on the project page, updated Oct 27 06:09 KST*

## Rain still swings

| Issuance | Rainy hours | Our rain F1 | KMA rain F1 |
|---|---|---|---|
| Oct 16 | 1 | 0.00 | 0.29 |
| Oct 21 | 12 | 0.00 | 0.28 |
| Oct 23 | 1,504 | **0.81** | 0.38 |
| Oct 24 | 1,736 | **0.78** | 0.51 |

- Rainy days were big wins; on Oct 23 our score was more than double the KMA's
- Days with only a few rainy hours went the other way. On Oct 21 we missed all 12 rainy hours while the KMA caught 6
- Our model calls rain only when the chance of 1 mm or more passes 0.55, and a passing shower rarely pushes it that high
- Our rain F1 was 0 in 5 of the 14 issuances. All five had 12 rainy hours or fewer, and in three of them the KMA also scored 0

## The better we do, the harder I check the other side

- On Oct 24, before posting the Short, I re-checked one question: was the KMA really scored at each station's own location?
- The locations were right. Station coordinates map to 5 km grid cells with the conversion in the KMA's guide, and values in the same cell matched
- Wind was not. The grid files truncate wind to one decimal, so we added 0.05; from Oct 13 the same 0.05 was also being added to point values that need no fix
- The KMA tends to forecast wind too strong, so an extra 0.05 made its error look that much bigger

| KMA wind MAE | Before the fix | After |
|---|---|---|
| Test (grid files) | 0.963 | 0.963 |
| Last 7 days (Oct 16–22 issuances, point values) | 1.347 | **1.321** |

- I refilled 11 stored forecasts from the originals and rebuilt the site numbers; the ranking did not change
- Still, a number skewed against the KMA sat on the page for more than ten days, which did not feel good
- The two-week table above uses the fixed numbers

## If I did it again

- Test the code that handles the opponent's data as hard as our own model; one correction worked against the KMA for 11 days
- Do not read rain scores one day at a time; only periods with hundreds of rainy hours mean much
- Building in retries from the start was the best call; the connection dropped on 5 of 11 mornings and no forecast was missed
- The next part is the US version against the US National Weather Service; today's forecast is on the [project page](/en/projects/beat-kma/)
