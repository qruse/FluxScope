---
title: "Week one goes to GPT, the one I took for a scaredy-cat! It seems to have handled a risky market well"
description: "Week one ended GPT +0.39%, Opus −0.83%, Argon −2.89%. Grading their own hypotheses, they scored 3/3, 1/3 and 0/3, then split three ways: hold, turn defensive, add energy."
publishedAt: 2026-10-27
lang: en
project: ai-duel
part: 3
---

## In three lines

- Week one (filled Oct 19, marked at the Oct 23 close) had one winner: GPT-6.1 Sol. Opus 5.5 matched the S&P 500, and Gemini 4 Argon fell further than the Nasdaq-100
- Each AI grades its own weekly hypotheses; GPT got all three right, Opus one, Argon none
- For week two, GPT kept its weights, Opus cut tech and added defensive stocks, and Argon, a day late because of its usage limit, added more energy

## Week one went to GPT's financials and equal weight

![Project page chart of cumulative returns from October 19 to 26 for GPT-6.1 Sol, Claude Opus 5.5, Gemini 4 Argon, the S&P 500 and the Nasdaq-100](/images/stories/ai-duel/part3-live-return.webp)

*Made by HSL — cumulative return chart on the project page, as of Oct 27 07:31 KST*

| At the Oct 23 close | Value | Return |
|---|---|---|
| GPT-6.1 Sol | $20,079 | **+0.39%** |
| S&P 500 (SPY) | $19,830 | −0.85% |
| Claude Opus 5.5 | $19,833 | −0.83% |
| Nasdaq-100 (QQQ) | $19,613 | −1.94% |
| Gemini 4 Argon | $19,422 | −2.89% |

- All three started with $20,000; first-day values sit slightly below that because the 0.1% trading cost comes off
- GPT held equal-weight S&P 500 (RSP) at 45% and financials (XLF) at 20%, so it owned less tech. Tech fell that week, and that choice paid
- Opus built on QQQ and SPY with chips on top; energy (XLE) cushioned part of the drop
- Argon put 85% into TSMC, Nvidia, the 2x Nasdaq ETF (QLD) and GE Vernova, and lost 4.5% on Oct 22 alone
- Including the Oct 26 close: GPT +0.87%, Opus −0.05%, Argon −1.09%, SPY −0.14%, QQQ −0.85%

## Hypotheses graded 3/3, 1/3, 0/3

![Check and cross marks: GPT-6.1 Sol judged all three hypotheses right, Claude Opus 5.5 one, Gemini 4 Argon none](/images/stories/ai-duel/part3-hypotheses.webp)

*Made by HSL — each AI's own verdicts from its week-two meeting*

- Under the rule added in part 2, each AI writes 2–3 hypotheses a week with the test that decides them, and grades them itself the following week
- All of GPT's were "A beats/trails SPY", with a numeric test and a ±0.30-point band that counts as open
  - RSP beat SPY by 2.32 points, XLF by 2.37 points, and QQQ trailed by 1.09 points. All right
- Opus got only the energy call right (XLE +2.3%, SPY −0.8%)
  - "Chips beat QQQ" was wrong; chips fell 6% in a single day after Meta's results on Oct 22
  - "Less volatile than SPY and ahead of it" was wrong too; volatility ran above SPY's, which Opus blamed on "a core tilted to QQQ"
- Argon got all three wrong, mostly from QLD (−4.90%) and GE Vernova (−10.29%)
- I checked the verdicts against the index numbers; the briefing's SPY −0.85% and QQQ −1.94% match what the AIs wrote

## Week two, three different roads

![Project page record of weekly decisions, showing each AI's week-two and week-one decisions and target weights side by side](/images/stories/ai-duel/part3-live-decisions.webp)

*Made by HSL — weekly decisions on the project page, through the Oct 26 fills*

| Week-two decision | What changed | Beta vs SPY (Oct 26) |
|---|---|---|
| GPT-6.1 Sol | Nothing (RSP 45%, QQQ 24%, XLF 20%, cash 10%) | 0.55 |
| Claude Opus 5.5 | QQQ 42% → 26%, SPY 26%, chips 10% → 5%, new 7% in consumer staples | 1.04 |
| Gemini 4 Argon | XLE 15% → 25%, QLD 30% → 20%, GEV 15% → 10%, cash 0% | 2.83 |

- GPT left everything alone: it would not size up on one week and wanted to see the trend survive the FOMC meeting
- Opus acted on both wrong calls, cutting tech and adding defensive sectors
- Argon kept its direction even with every call wrong: more energy, and TSMC up from 20% to 25%
- Risk spread apart as a result; annualized volatility is 9% for GPT, 14% for Opus and 42% for Argon

## Argon met a day late

- At the Saturday Oct 24 meeting, Argon had 1% of its weekly usage left (AI Mafia part 4)
- Letting another model decide would break the point of a continuing portfolio, so the meeting now waits instead

```python
if a == "argon" and (u := argon_usage()) and u[0] < 3:
    argon_deferred(u[1])
    continue
```

- Under 3% left, Argon is skipped and a one-off task is scheduled 30 minutes after its limit resets
- The limit came back at 20:31 on Oct 25, and the scheduled task ran the meeting at 21:01
- All three filled at the same Oct 26 (US Monday) close, so meeting a day late cost Argon nothing

## If I did it again

- The limit check belonged in week one; this time it went in only after the limit ran dry right before a meeting
- Hypothesis tests work best the way GPT wrote them, with numbers and an open band, so grading stays clean
- I plan to have code re-check the self-grades; for now I only match the index numbers by hand
- Five trading days is too short to call anyone good; a month is the minimum before judging
- The latest standings and decisions go up daily on the [project page](/en/projects/ai-duel/)
