---
title: "Our AI seemed to miss the rain now and then, so I took a look..!"
description: "Why our forecast looked wrong while drizzle fell on Daegu, and how a 0.1 mm light-rain classifier was added without touching the 1 mm main score."
publishedAt: 2026-10-20
updatedAt: 2026-10-27
lang: en
project: beat-kma
part: 5
---

## In three lines

- On October 20 drizzle fell on Daegu. The site showed the KMA at "0.5 mm of rain" and us at a 11–49% rain chance, so we looked wrong
- Against the actual values we were more accurate on temperature, humidity and wind; the trouble was the scoring rule that counts only 1 mm or more as rain
- The 1 mm rule stays, and a separate light-rain classifier for 0.1 mm or more was added. Its test F1 is 0.51 against the KMA's 0.37

## Rain outside, clouds on screen

- Around lunchtime it was drizzling in Daegu
- The project page showed a rain icon and 0.5 mm for the KMA, and clouds with an 11–49% rain chance for us
- By eye the KMA won, so I checked hours 06–13 against the actual values

| Daegu, Oct 20, 06–13h | Ours | KMA |
|---|---|---|
| Temp MAE | **1.27 °C** | 1.65 °C |
| Humidity MAE | **2.3%** | 5.0% |
| Wind MAE | **0.53 m/s** | 0.86 m/s |

- We won all three
- The temperature sat at 15–16 °C. The KMA expected 20 °C by midday and we expected 17.8 °C, so both ran warm and the KMA ran warmer
- The observations are the KMA's nowcast values. Our API key cannot pull real-time ASOS data, so I used the same values the service uses to fill recent hours

## The 1 mm rule did it

- This contest has scored rain as "1 mm or more in an hour" from the start
- That morning only 12h passed 1 mm (1.2 mm); the other hours were 0.2–0.5 mm of drizzle
- Our model learned the chance of 1 mm or more, so low numbers in drizzle are expected
- The KMA short-range forecast shows "under 1 mm" as rain, which is why its screen matched the window
- Scored at 1 mm, both forecasts said "no rain" all morning and tied; both also missed 12h

![Hourly table for Daegu, Oct 20, 06 to 13h: observed rain, KMA forecast rain, our 1 mm rain chance and our 0.1 mm light-rain chance](/images/stories/beat-kma/part5-drizzle.webp)

*Made by HSL — observations are the KMA nowcast; light-rain chances were added to this issuance after the classifier was trained*

## Adding a second score instead of changing the first

- People call 0.1 mm rain, so a forecast should get that right too
- Changing the main rule the moment a bad-looking day shows up would mean rewriting the rules after seeing the result, and the test period was already opened once at 1 mm
- Switching only the threshold to 0.1 mm does not work either: the model outputs a 1 mm probability, so the score would be meaningless
- So 1 mm stays the main score, and a classifier trained for 0.1 mm or more becomes a second score

## On my PC instead of Colab

- The service ensemble mixes one LightGBM with two CNN heads (part 4)
- Retraining the CNN heads needs a Colab GPU, and only 12.56 compute units were left; the daily 05:00 forecast alone uses 0.2–1 a day
- LightGBM runs on a CPU. Inputs, train/validation/test periods and settings match the part 4 LightGBM; only the target changed to "0.1 mm or more"
- The training table stores rain in 0.1 mm steps, so the target was ready. Hours with 0.1 mm or more make up 6.0% of the data, about twice the 2.96% for 1 mm
- Training took a few minutes on a home PC (Ryzen 5600X). The cutoff is 0.31, the probability with the best validation F1

## Still ahead at 0.1 mm

| Rain F1 at 0.1 mm | Ours (light-rain classifier) | KMA |
|---|---|---|
| Validation (Mar–Jun 2026) | **0.645** | 0.373 |
| Test (Jul–Oct 12, 2026) | **0.506** | 0.368 |
| Last 7 days (Oct 14–19 issuances) | **0.719** | 0.565 |

- The KMA uses its forecast rain amounts as they are; "under 1 mm" is stored as 0.5 mm, so it counts as rain at 0.1 mm
- The test score is the first and only time this classifier saw the test period
- The last 7 days come from adding the classifier, built on October 20, to that week's issuances. Its training data ends with the October 10 issuance, so it never saw that week's answers
- Added to the drizzly morning the same way, the light-rain chance was 38–57%, so all 8 hours read "light rain": all 6 hours with 0.1 mm or more were caught, with 2 false alarms. The KMA caught 4 and missed 2
- Test is lower than validation because it covers the summer shower season, the same pattern as at 1 mm

![Bar chart of rain F1 at 0.1 mm for validation, test and the last 7 days, our light-rain classifier against the KMA](/images/stories/beat-kma/part5-f1.webp)

*Made by HSL — 97 stations × 48 hours; KMA "under 1 mm" counted as rain*

## What changed on the site

- When the 1 mm chance is low but the light-rain chance passes its cutoff, a drizzle icon (a cloud with dots) appears
- The KMA's "under 1 mm" rain calls now use the same drizzle icon, so both sides are shown the same way
- The station card and the hourly table show the light-rain chance
- The last-7-days table has a new light-rain F1 column next to the 1 mm rain F1 ([project page](/en/projects/beat-kma/))

![The Seoul forecast card on the project page: our AI shows the light-rain chance next to the rain chance, the KMA its rain chance and amount](/images/stories/beat-kma/part5-live-card.webp)

*Made by HSL — Seoul forecast card on the project page, 05:00 issuance on Oct 27*

## If I did it again

- Set the rain rule down to 0.1 mm before the contest starts; people call 0.1 mm rain, and at first only 1 mm was defined
- Keep a buffer of Colab compute units; with only 12.56 left, the CNN heads could not be retrained and a single LightGBM had to do
- That is why light rain is a single-LightGBM stopgap for now
- The US version, coming soon, will train the full best ensemble (LightGBM plus CNN heads) at 0.1 mm from the start, and Korea will be retrained at the same time
