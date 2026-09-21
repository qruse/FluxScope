---
title: "음성-음성 직결(Speech-to-Speech) 실시간 멀티모달 모델의 지연 시간 단축 원리"
seoTitle: "실시간 음성 상호작용을 위한 Speech-to-Speech 모델 구조"
description: "기존 ASR-LLM-TTS 3단계 파이프라인의 음색 손실과 지연 시간을 극복하고, 사람처럼 자연스러운 호흡으로 대화하는 네이티브 오디오 멀티모달 기술."
publishedAt: 2026-09-18
updatedAt: 2026-09-21
category: other-ai
tags: [speech, audio-multimodal]
author: "FluxScope"
image:
  src: /images/other-ai.png
  width: 1200
  height: 630
  alt: "실시간 음성 오디오 파형과 신경망 상호작용 일러스트"
draft: false
lang: ko
---

## 핵심 요약

음성 인식(ASR) → 텍스트 생성(LLM) → 음성 합성(TTS)으로 이어지는 전통적인 대화 파이프라인은 1~2초 이상의 지연 시간이 불가피했습니다. 최신 **네이티브 오디오 멀티모달 모델**은 소리 파형을 연속 토큰으로 직접 인코딩하고 생성하여, 응답 지연을 300ms(사람의 대화 반응 속도) 수준으로 단축하고 감정과 어조까지 완벽히 전달합니다.
