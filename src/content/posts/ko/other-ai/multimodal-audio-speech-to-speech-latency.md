---
title: "음성-음성 직결(Speech-to-Speech) 실시간 멀티모달 모델의 지연 시간 단축 원리"
seoTitle: "실시간 음성 상호작용을 위한 Speech-to-Speech 모델 구조"
description: "기존 ASR-LLM-TTS 3단계 파이프라인의 음색 손실과 지연 시간을 극복하고, 사람처럼 자연스러운 호흡으로 대화하는 네이티브 오디오 멀티모달 기술."
publishedAt: 2026-09-18
updatedAt: 2026-09-21
category: other-ai
tags: [speech, audio-multimodal, low-latency, streaming-audio, voice-ai, conversational-ai]
author: "FluxScope"
image:
  src: /images/other-ai.png
  width: 1200
  height: 630
  alt: "실시간 음성 오디오 파형과 신경망 상호작용 일러스트"
draft: false
lang: ko
experienceNote: "기존 STT-LLM-TTS 조합은 아무리 튜닝해도 1.8초 밑으로 안 내려갔는데 네이티브 오디오 토큰 직결 모델로 바꾸자마자 310ms로 떨어지며 자연스러운 맞장구 대화 가능해짐"
---

## 3줄 요약

- ASR(인식) $\to$ LLM(생성) $\to$ TTS(합성) 거치던 3단계 파이프라인 버리고 오디오 파형을 토큰으로 직결 처리함
- 텍스트 중간 변환 과정에서 증발하던 억양, 호흡, 한숨, 말끊기(Barge-in) 신호를 온전히 보존함
- 인간 대화 반응 속도인 300ms 이내 지연 시간 달성으로 기계적인 어색함 완전히 극복함

---

## 3단계 직렬 파이프라인 vs 네이티브 S2S 모델 비교

| 비교 항목 | 전통적 연쇄 파이프라인 (ASR + LLM + TTS) | 네이티브 Speech-to-Speech (GPT-4o Voice 등) |
| :--- | :--- | :--- |
| **전체 지연 시간** | 1,500ms ~ 2,500ms (각 단계 누적) | 250ms ~ 350ms (인간 대화 호흡 일치) |
| **청각 뉘앙스** | 텍스트만 남아 분노/웃음/속삭임 정보 전멸 | 음향 토큰(Acoustic Token)으로 감정·어조 완벽 반영 |
| **중간 말끊기(Barge-in)** | 별도 VAD 센서 감지 후 재생 강제 중단 | 모델 자체가 입력 스트림 들으며 실시간 발화 전환 |
| **인프라 복잡도** | 3개 모델 개별 서빙 및 버퍼 관리로 장애점 3배 | 단일 멀티모달 가중치로 엔드투엔드 스트리밍 |

---

## 실시간 300ms 방어벽을 깨기 위한 3대 엔지니어링 기법

1. **뉴럴 오디오 코덱(Neural Audio Codec)**
   - EnCodec, SNAC 등 신경망 코덱으로 24kHz 오디오를 초당 수십 개 이산(Discrete) 토큰으로 압축
2. **스트리밍 디코딩(Streaming Chunk Decoding)**
   - 문장 완성될 때까지 기다리지 않고 첫 음향 토큰 5개 생성되는 즉시 DAC로 음성 스트리밍 송출
3. **양방향 전이중 통신(Full-Duplex WebRTC)**
   - HTTP 왕복 오버헤드 버리고 WebRTC 데이터 채널과 Opus 코덱으로 패킷 왕복 40ms 이하 유지

---

## Q&A 또 궁금한 것은?

- **Q. 모델이 말을 너무 빨리 끊어먹거나 끼어들지 않음?**
  - 말끝 어조(피치 하강)와 침묵 시간(Silence Threshold)을 판별하는 턴테이킹(Turn-taking) 예측 헤드가 음향 문맥을 분석해 적절한 타이밍에만 개입함
- **Q. 비용 측면에서 텍스트 기반 챗봇 대비 얼마나 차이 남?**
  - 오디오 토큰은 텍스트 대비 초당 생성 토큰 수가 3~5배 많아 API 비용이 최소 3~4배 비쌈
- **Q. 소음이 심한 공공장소에서도 정확하게 알아들음?**
  - 빔포밍 마이크와 전처리 노이즈 억제(RNNoise/DeepFilterNet) 레이어를 단말 앞단에 두지 않으면 배경 음악이나 주변 대화에 모델이 환각을 일으킴
