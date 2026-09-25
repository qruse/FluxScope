---
title: "GPT-6 Sol·Luna와 Opus 5.5: 가성비는 훌륭, 결과물은 비싼 이유가 있음"
description: "Sol·Luna를 직접 써본 가성비 평가와 Opus 5.5의 압도적인 결과물 체감. 공식 API 단가와 실패·재시도 비용을 분리해 실무 모델 선택법을 정리함"
category: agi
publishedAt: 2026-09-23
updatedAt: 2026-09-26
tags: [gpt-6, gpt-6-sol, gpt-6-luna, opus-5-5, api-pricing, token-economics, agent-routing]
author: HSL
image:
  src: /images/posts/agi/gpt-6-workload-routing.webp
  alt: "Luna·Sol·Opus 5.5를 작업에 맞춰 선택하고 결과를 검증하는 개념 흐름"
  width: 1140
  height: 522
draft: false
lang: ko
experienceNote: "Sol과 Luna를 직접 써봤는데 가성비가 매우 훌륭했고, Opus 5.5는 결과물 성능이 압도적이라 매우 만족스러웠음"
---

## 3줄 요약

- Sol·Luna를 직접 써보니 **가성비가 매우 훌륭**했음. 공식 API 단가는 100만 토큰당 Sol 입력/출력 **$2/$10**, Luna **$0.10/$0.50**임 ([OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/))
- Opus 5.5는 결과물의 완성도가 **압도적**이라는 체감이었음. 가격은 여전히 높지만, 전작 Opus 5의 **$5/$25 → $4/$20**으로 표준 단가가 낮아짐 ([Anthropic](https://www.anthropic.com/claude-opus-5-5))
- 싼 토큰과 좋은 결과물을 한 숫자로 줄 세우면 실패함. 재시도·검수까지 포함해 **작업당 성공 비용**을 비교해야 함

![작업 특성에 따른 Luna, Sol, Opus 5.5 선택과 검증 흐름](/images/posts/agi/gpt-6-workload-routing.webp)

## 직접 써보니: 값어치의 기준이 서로 다름

- **GPT-6 Luna·Sol**: 가성비가 좋다는 체감이 분명했음. 반복적인 초안·분류 작업에는 저렴한 호출이 주는 여유가 큼
- **Claude Opus 5.5**: 출력물 품질의 체감이 훨씬 강했음. 복잡한 작업의 결과물을 놓고 보면 비싼 값을 할 때가 있었고, 개인적으로 매우 만족스러웠음
- 이는 동일 프롬프트를 여러 번 실행한 통제 실험이나 객관적 승률 주장이 아님. 사용 경험을 요금표 및 공식 평가와 분리해 적음

## 가격표: 전작보다 싸진 Opus도 Sol보다는 두 배

아래는 [OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/)와 [Anthropic](https://www.anthropic.com/claude-opus-5-5)이 공개한 표준 API 단가임. 단위는 USD/100만 토큰이며 캐시·도구·별도 처리 모드는 제외함

| 모델 | 입력 | 출력 | 비교 기준 |
| :--- | ---: | ---: | :--- |
| GPT-6 Luna | $0.10 | $0.50 | GPT-5.6 Luna $0.20/$1.20 |
| GPT-6 Sol | $2 | $10 | GPT-5.6 Sol $4/$20 |
| Claude Opus 5.5 | $4 | $20 | Opus 5 $5/$25 |

![GPT-6 Luna와 Sol, Claude Opus 5.5 공식 API 단가 비교](/images/posts/agi/gpt-6-api-prices.webp)

*그래프 데이터: [OpenAI 모델 발표](https://openai.com/index/introducing-gpt-6-sol-and-luna/) 및 [Anthropic 모델 발표](https://www.anthropic.com/claude-opus-5-5/)의 표준 입력·출력 가격*

- 입력 100만 + 출력 25만 토큰이면 Luna **$0.225**, Sol **$4.50**, Opus 5.5 **$9**임. 같은 작업을 모두 성공시키고 캐시가 없다는 가정의 산술 예시임
- Opus 5.5는 전작 대비 표준 입출력 단가가 각각 **20%** 낮고 캐시 읽기는 **$0.50 → $0.20**임. Anthropic이 말한 전형적 작업 비용 **40% 감소**는 토큰 사용량과 캐시까지 포함한 자사 측정치임
- 결과물 수정을 위해 Sol을 세 번 호출하거나 사람 검수가 길어지면, 비싼 모델 한 번이 더 쌀 수도 있음. 반대로 간단한 일에 Opus를 쓰면 품질 여유를 비용으로 사는 셈임

## 어디에 쓸지: 세 모델을 같은 역할로 억지 배치하지 말 것

1. **Luna**: 대량 분류, 짧은 요약, 정답을 검증하기 쉬운 1차 추출부터 시험
2. **Sol**: 여러 단계의 코딩·도구 작업이나 애매한 요구사항에 대한 반복 작업을 시험
3. **Opus 5.5**: 결과물 완성도가 중요한 설계·긴 문서·복잡한 코드 작업에서 시도하고 수정 시간까지 비교

이 배치는 직접 사용 경험과 공식 단가를 바탕으로 한 실무 제안이며, 제품에 내장된 자동 라우터 설명은 아님. [OpenAI의 평가](https://openai.com/index/introducing-gpt-6-sol-and-luna/)와 [Anthropic의 평가](https://www.anthropic.com/claude-opus-5-5/)는 설정·추론 노력·측정 환경이 달라 점수만 붙여 승패를 판정하기 어려움

## Q&A 또 궁금한 것은?

- **Q. Opus 5.5는 전작보다 실제로 싸진 게 맞음?**
  - 표준 API 입력·출력 가격은 각각 20% 인하됨. 특정 작업의 총비용은 캐시·토큰 수·재시도에 따라 따로 측정해야 함
- **Q. Luna가 가장 싸니 기본 모델로 고정하면 됨?**
  - 검증 가능한 대량 작업에 먼저 쓰기 좋지만, 실패·재시도가 많으면 작업당 비용이 뒤집힐 수 있음
- **Q. Opus 5.5가 항상 Sol보다 좋은 결과를 냄?**
  - 직접 써본 인상은 매우 좋았지만 모든 작업의 객관적 우위라는 뜻은 아님. 같은 작업·기준·예산으로 비교해야 함
