---
title: "Can AI beat the KMA? ③ Aurora bare-handed: won on rain, lost on temperature"
description: "Untouched (zero-shot) Aurora against the KMA short-range forecast at 97 stations, from a sun that rose four hours late to a win on rain F1."
publishedAt: 2026-10-16
lang: en
project: beat-kma
part: 3
---

## In three lines

- Aurora with no changes at all (zero-shot) lost to the KMA on temperature and wind and beat it on rain
- At first the sun rose four hours late in Aurora's forecast; the culprit was feeding only the area around Korea
- Over the validation period at 97 stations: temperature MAE 1.46 °C vs 1.19 °C (loss), rain F1 0.59 vs 0.36 (win)

## Round one: a late sunrise

- To save memory, the first runs fed Aurora only East Asia
- A 48-hour forecast in 14 seconds looked great, until temperature MAE came out at 2.58 °C against the KMA's 0.74 °C
- By hour of day, mornings were 3–5 °C too cold and evenings 2–7 °C too warm
- The daily high landed at 6–7 p.m. instead of 2–3 p.m.
- The obvious suspect was a UTC vs Korean time (nine hours) bug
- Checking the timing of the daily peak at every step showed every conversion was right
- The only difference left was cropping the input

## The crop did it

Same date, only the input area changed

| Input area | L4 memory | Daily high at | Seoul temp MAE |
|---|---|---|---|
| East Asia | 5.3 GB | 18–19 h | 2.14 °C |
| Wider (65°N–equator, 70–190°E) | 6.5 GB | 22–23 h | 5.29 °C |
| Latitude band (all longitudes) | 14.2 GB | 14–15 h | 1.53 °C |

- A wider area with cut longitudes was even worse
- Aurora learned a planet that wraps around in longitude, and cutting it seems to scramble the sun's path
- The latitude band still differed from the full globe by 1–4 °C, so the whole globe went in (19.5 GB on the L4, about six minutes per 48 hours)
- Round one started from ERA5 reanalysis, so everything was rerun from real-time AIFS analyses under the rules

## The bare-handed scorecard

Validation period (2026-03 to 06), 40 issuances × 97 stations × 48 hours

| | Temp MAE | Humidity MAE | Wind MAE | Rain F1 |
|---|---|---|---|---|
| KMA | **1.19 °C** | 8.82% | **1.06 m/s** | 0.36 |
| Aurora zero-shot | 1.46 °C | **8.66%** | 1.20 m/s | **0.59** |

- Aurora temperature is corrected for the height gap between its grid and the station with a standard lapse rate
- Aurora rain counts 0.65 mm per hour or more as rain, not 1 mm
- Aurora paints rain wide and light, so this threshold was picked on the validation period (which flatters Aurora a little)
- The KMA keeps the 1 mm rule

## Why temperature lost and rain won

- One Aurora grid cell is about 25 km across
- It knows nothing about a station's own quirks: Seoul's urban heat, mountain-top sites, sea breezes
- Seoul came out more than 1 °C too cold on average
- Rain is more about where and when in the big picture
- The KMA forecast rain for many hours and had lots of false alarms (precision 0.30)
- Aurora hit precision and recall evenly at 0.55–0.63
- So Aurora has the big picture, and the KMA knows the stations
- The fix is a head on top of Aurora that learns the stations; that is part 4
