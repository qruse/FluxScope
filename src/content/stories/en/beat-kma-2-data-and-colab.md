---
title: "No decent GPU at home.. so let's try Colab!"
description: "Gathering the answers (ASOS), the opponent (KMA forecasts) and the starting point (AIFS analysis), then running Aurora 195 times overnight on one Colab L4."
publishedAt: 2026-10-16
lang: en
project: beat-kma
part: 2
---

## In three lines

- Three ingredients: the answers (ASOS observations), the opponent (KMA short-range forecasts) and Aurora's starting point (AIFS initial conditions)
- The KMA forecast API only keeps three days, so a collector runs every three hours; bulk-downloading past forecasts once got this PC's IP blocked for 19 hours
- All GPU work ran on one Colab Pro L4 from the terminal, rebuilt so jobs survive disconnects, which let Aurora run 195 times overnight

## Three ingredients

| Role | Data | Source |
|---|---|---|
| Answers | Hourly data from 97 ASOS stations (temperature, humidity, wind, rain) | data.go.kr |
| Opponent | KMA short-range forecast for the same issuance, at the 5 km grid cell holding each station | KMA API Hub |
| Starting point | AIFS step 0 = ECMWF operational analysis | ECMWF open data (AWS S3) |

- Training covers 2025-03 to 2026-02, validation 2026-03 to 06, test 2026-07 to 10-12
- Issuances were picked every three days, alternating 05:00 and 17:00 KST, 197 in total
- Two lost their initial conditions, leaving 122 for training, 40 for validation and 33 for test

![Data flow from AIFS analysis to Aurora box, station head, our forecast and ASOS scoring](/images/stories/beat-kma/part2-pipeline.webp)

*Made by HSL: how the three ingredients reach scoring through the Aurora box and the head*

## Starting eight hours behind the KMA

- Inputs had to be public before the KMA issuance time
- So the AIFS files were chosen by the time they actually landed on S3
- The 05:00 issuance gets the previous day's 21:00 KST analysis; the 17:00 issuance gets 09:00 of the same day
- Our model starts from information eight hours older than the KMA's
- Only slow fields missing from open data, like sea ice and snow, come from ERA5 at least a week old

![Split of 122 training, 40 validation and 33 test issues, with the starting analysis for 05:00 and 17:00 issues](/images/stories/beat-kma/part2-split.webp)

*Made by HSL: the time split and what each issue could see*

## The opponent's record lives for three days

- The KMA forecast API says it only serves the last three days
- Without collecting now, the opponent's record is gone forever
- So this PC fetches and commits the forecast every three hours
- Past validation and test forecasts came from the API Hub's gridded archive
- Pulling it with four threads got the IP blocked for 19 hours
- After that, every downloader got a `Pacer` that widens or narrows the request gap based on the server's replies
- The data.go.kr key comes in an "Encoding" form that gets encoded twice by the HTTP library and is then rejected as unregistered
- That bit on the first day, and again on the last

## Aurora boxes

- For each issuance Aurora 1.5 runs on the whole globe, hourly, for 60 hours or more
- Only the box around Korea (30–45°N, 120–135°E, 61×61 cells, 33 variables) is saved
- That way a new station list or a retrained head never needs the GPU again
- The first version saved plain float16, and pressure and radiation all became `inf`
- float16 tops out at 65,504, so 101,325 Pa of sea-level pressure does not fit
- Each variable now stores an offset and scale, and every box was regenerated

## Surviving Colab

- Windows meant WSL (Ubuntu) plus Google's `google-colab-cli`, driving `colab new --gpu L4` from the terminal
- Anything longer than a few minutes died with "Connection was lost"
- So jobs run inside the VM under `nohup`, and the local side only checks in now and then
- Then the PC went to sleep, the watcher stopped, the session was recycled, and 19 finished boxes vanished
- Now boxes are fetched as soon as they appear, and the VM hands back its own session when done
- Uploads work up to 70 MB and fail from 90 MB, so data goes up in 45 MB chunks
- S3 also says "Slow Down" when poked too often; `Pacer` again

## One L4, all night

- Box generation started at 7 p.m. on October 15 and ran into the next morning over three sessions
- 195 runs at five to six minutes each, about 33 compute units
- A Colab Pro month (about 10,000 KRW) includes 100 units, so all the boxes cost about a third of a month
- **Counting the Colab subscription and the Claude tokens, the whole project cost about 20,000 KRW (roughly 15 USD)**
- Cheap enough to feel sorry for the L4 that worked all night
- Next: pitting untouched Aurora against the KMA
