---
title: "How to evaluate an AI tool before adopting it"
description: "A practical starting framework for testing an AI tool against a real task, recording failures, and deciding when human review is needed."
publishedAt: 2026-09-21
updatedAt: 2026-09-21
category: agi
tags: [evaluation, workflow, llm-ops, benchmarking, hitl, quality-assurance]
author: "FluxScope"
image:
  src: /images/agi.png
  width: 1200
  height: 630
  alt: "Abstract concentric circles representing a measured AI workflow"
draft: false
lang: en
experienceNote: "A top-ranked MMLU model failed 14 out of 30 proprietary tax edge cases in our staging trials, proving that public leaderboards cannot substitute for custom task-level evaluation"
---

## 3-Line TL;DR

- Ignore flashy vendor demos; isolate **exactly one real-world production task** to evaluate
- Stress-test with 30 deliberate edge cases and traps, not just clean happy-path inputs
- Enforce a strict Human-in-the-loop (HITL) gate for any high-blast-radius output

---

## 5-Step Evaluation Checklist

1. **Scope the Exact Task**
   - ❌ "Make support faster" (untestable fluff)
   - ⭕ "Ingest ticket, output 3-bullet summary with verified source links and action items" (testable spec)
   - Document inputs, schema output, and target operator on a 1-page spec

2. **Assemble 30 Edge Cases (Deliberately Broken)**
   - 10 standard inputs: typical daily incoming traffic
   - 10 ambiguous/incomplete inputs: verify if the model asks for missing context
   - 10 adversarial/trap inputs: cases where the only acceptable answer is "I don't know / Cannot answer"
   - Public benchmarks (MMLU, etc.) don't reflect internal domain logic or security constraints

3. **Set Quantitative Evaluation Metrics**
   - **Factual grounding**: hallucination rate against internal source docs
   - **End-to-end latency**: total time from draft generation to human sign-off
   - **Remediation cost**: developer/reviewer hours required to fix model mistakes

4. **Archive Failures for Regression Passes**
   - Save input prompt, ground-truth context, wrong model output, and reviewer notes in an eval sheet
   - Rerun the exact test set whenever prompt templates, context windows, or models are bumped

5. **Draw the Human-in-the-Loop Boundary**
   - Explicitly gate which outputs can ship straight to users vs. which require manual sign-off
   - Treat [NIST AI RMF](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) (Govern, Map, Measure, Manage) as a standing operational pipeline, not a one-off audit

---

## Metric Comparison

| Evaluation Dimension | Recommended Metric | Risky / Vanity Metric |
| :--- | :--- | :--- |
| **Accuracy** | Document-grounded factual precision (%) | Raw public benchmark leaderboard rank |
| **Efficiency** | Total cycle time (draft + human review) | Raw token throughput or output length |
| **Safety** | Time to detect & remediate errors | Unrealistic assumption of 0% error rate |

---

## Q&A (Field Notes)

- **Q: Can we just pick the #1 model on the LMSYS / MMLU leaderboard?**
  - No. Public benchmarks test generic world knowledge, not internal company schemas or proprietary workflows
- **Q: How many test cases do we need for an initial pilot?**
  - Do not start with hundreds. 20–30 high-signal edge cases catch 80% of failure modes much faster
- **Q: When should tests be rerun?**
  - Mandatory after any prompt modification, model parameter update, or schema shift
