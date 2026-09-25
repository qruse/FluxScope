---
title: "GPT-6 Sol·Luna vs Opus 5.5: 토큰은 반값, 수정은 누가 함?"
description: "Sol·Luna의 반가운 가격표와 Opus 5.5의 결과물 체감. 할인된 토큰값 뒤의 재시도·검수 비용까지 따져봄"
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

- Sol·Luna를 직접 써보니 **가성비는 확실히 좋았음**. 100만 토큰당 입력/출력 단가는 Sol **$2/$10**, Luna **$0.10/$0.50**임. 요금표만 보면 지갑이 먼저 박수 침 ([OpenAI](https://openai.com/index/introducing-gpt-6-sol-and-luna/))
- Opus 5.5는 결과물 완성도가 **압도적**이라는 체감이었음. 전작의 **$5/$25 → $4/$20**으로 내려왔지만 여전히 싼 모델은 아님 ([Anthropic](https://www.anthropic.com/claude-opus-5-5))
- 할인된 토큰값이 수정 시간까지 할인해 주진 않음. **재시도와 사람 검수까지 넣은 작업당 성공 비용**으로 비교해야 함

![작업 특성에 따른 Luna, Sol, Opus 5.5 선택과 검증 흐름](/images/posts/agi/gpt-6-workload-routing.webp)

## 직접 써보니: 값어치의 기준이 서로 다름

- **GPT-6 Luna·Sol**: 가성비가 좋다는 체감이 분명했음. 반복적인 초안·분류 작업에서 호출 한 번 더 해도 청구서가 무섭지 않은 게 장점임
- **Claude Opus 5.5**: 출력물 품질의 체감이 훨씬 강했음. 복잡한 작업에서 여러 번 고치던 결과를 한 번에 받으면 비싼 모델이 오히려 덜 피곤했음
- 이는 동일 프롬프트를 여러 번 실행한 통제 실험이나 객관적 승률 주장이 아님. 사용 경험을 요금표 및 공식 평가와 분리해 적음

## 가격표: 다 같이 할인 중인데 계산대는 여전히 다름

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
- Sol을 세 번 다시 부르고 사람이 결과를 뜯어고치면 반값 토큰의 축제가 끝남. 반대로 단순 분류에 Opus를 쓰면 계산대에서 프리미엄 영수증만 챙겨 오는 셈임

## 어디에 쓸지: 모두에게 같은 일을 시키면 요금표만 웃음

1. **Luna**: 대량 분류, 짧은 요약, 정답을 검증하기 쉬운 1차 추출부터 시험
2. **Sol**: 여러 단계의 코딩·도구 작업이나 애매한 요구사항에 대한 반복 작업을 시험
3. **Opus 5.5**: 결과물 완성도가 중요한 설계·긴 문서·복잡한 코드 작업에서 시도하고 수정 시간까지 비교

이 배치는 직접 사용 경험과 공식 단가를 바탕으로 한 실무 제안이며, 제품에 내장된 자동 라우터 설명은 아님. [OpenAI의 평가](https://openai.com/index/introducing-gpt-6-sol-and-luna/)와 [Anthropic의 평가](https://www.anthropic.com/claude-opus-5-5/)는 설정·추론 노력·측정 환경이 달라 점수만 붙여 승패를 판정하기 어려움

## 커뮤니티 반응

- **Sol의 반값 요금표에 박수, 결과물엔 갸웃**: r/OpenAI 출시 토론에선 가격 인하를 반기면서도 이전 Sol보다 덜 꼼꼼하다는 사용자가 나옴. 반대로 차이를 못 느끼거나 잘 쓰고 있다는 댓글도 있어, 반값이라는 사실과 성능 체감은 별개임
- **Luna의 ‘짧게 답하기’가 빠뜨린 것**: 보고서 에이전트 운영자의 사용 후기는 항목 누락과 지나치게 짧은 답변을 문제 삼음. 공개 검증된 비교 시험은 아니지만, 대량 추출에선 토큰값보다 누락률을 먼저 봐야 한다는 실무 경고로 읽힘
- **Opus의 호평과 Sol의 역풍**: r/ClaudeAI의 Opus 5.5 사용 토론은 결과물과 대화 경험을 반기는 분위기고, r/OpenAI의 Sol 토론에선 이전 버전으로 돌아갔다는 의견과 ‘느낌만으로 성능을 단정할 수 없다’는 반론이 함께 나옴

## Q&A 또 궁금한 것은?

- **Q. Opus 5.5는 전작보다 실제로 싸진 게 맞음?**
  - 표준 API 입력·출력 가격은 각각 20% 인하됨. 특정 작업의 총비용은 캐시·토큰 수·재시도에 따라 따로 측정해야 함
- **Q. Luna가 가장 싸니 기본 모델로 고정하면 됨?**
  - 검증 가능한 대량 작업에 먼저 쓰기 좋지만, 실패·재시도가 많으면 작업당 비용이 뒤집힐 수 있음
- **Q. Opus 5.5가 항상 Sol보다 좋은 결과를 냄?**
  - 직접 써본 인상은 매우 좋았지만 모든 작업의 객관적 우위라는 뜻은 아님. 같은 작업·기준·예산으로 비교해야 함
