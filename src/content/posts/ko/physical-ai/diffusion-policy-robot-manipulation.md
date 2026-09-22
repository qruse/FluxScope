---
title: "로봇 조작을 혁신하는 디퓨전 정책(Diffusion Policy): 멀티모달 행동 학습의 원리"
seoTitle: "로봇 매니퓰레이션을 위한 Diffusion Policy 원리와 실시간 제어"
description: "기존 모방 학습의 다중 모드 붕괴를 극복하고 로봇의 정밀한 손동작과 궤적 생성을 가능하게 만든 디퓨전 정책(Diffusion Policy)의 수학적 원리와 실무 배포 전략."
publishedAt: 2026-09-20
updatedAt: 2026-09-22
category: physical-ai
tags: [diffusion-policy, robotics, visuomotor-control, dexterous-manipulation, embodied-ai, imitation-learning]
author: "FluxScope"
image:
  src: /images/physical-ai.png
  width: 1200
  height: 630
  alt: "로봇 매니퓰레이션 신경망과 궤적 생성 시각화"
draft: false
lang: ko
---

## 3줄 요약

- 기존 로봇 모방 학습은 장애물을 '왼쪽으로 피할지 오른쪽으로 피할지' 갈릴 때 평균값(정면 충돌)으로 수렴하는 치명적 한계가 존재했음
- **디퓨전 정책(Diffusion Policy)** 은 이미지 생성형 디퓨전 기술을 모터 조작 궤적에 적용해, 다중 모드(Multimodal) 행동 분포를 완벽하게 표현함
- 노이즈 제거 단계를 16스텝 이내로 압축하는 DDIM 스케줄러와 Receding Horizon 제어로 50Hz 실시간 로봇 구동 달성함

---

## 다중 모드(Multimodal) 행동 붕괴와 디퓨전의 해결책

- **고전적 행동 복제(Behavioral Cloning)의 실패 원인**
  - 작업자가 T자형 블록을 밀 때 왼쪽으로 밀거나 오른쪽으로 미는 2가지 정상 시연(Demonstration)을 제공함
  - 단순 평균 제곱 오차(MSE Loss)로 신경망을 학습시키면 두 행동의 중간값인 '가운데'를 출력하여 블록을 똑바로 들이받고 멈춤
- **디퓨전 정책(Diffusion Policy)의 접근법**
  - 출력 공간을 단일 결정론적 벡터로 보지 않고, 확률적 스코어 기반 노이즈 제거 과정(Score-based Denoising)으로 모델링함
  - 무작위 가우시안 노이즈 궤적에서 시작하여 카메라 비전 피처를 조건(Conditioning)으로 삼아 명확한 하나의 유효 궤적으로 수렴시킴 ([arXiv:2303.04137](https://arxiv.org/abs/2303.04137))

![Diffusion Policy 벤치마크](/images/posts/physical-ai/diffusion-policy-benchmarks.webp)
*출처: [Columbia AI Robotics Lab](https://diffusion-policy.cs.columbia.edu/) — Diffusion Policy: Visuomotor Policy Learning via Action Diffusion*

---

## 주요 로봇 정책 아키텍처 기술 비교

| 비교 항목 | 고전 MLP/CNN 정책 | 액션 청킹 트랜스포머 (ACT) | 디퓨전 정책 (Diffusion Policy) |
| :--- | :--- | :--- | :--- |
| **행동 모델링** | 단일 가우시안 분포 (Uni-modal) | CVAE 기반 잠재 변수 샘플링 | 노이즈 반전 기반 복합 분포 (Multi-modal) |
| **복잡 궤적 정밀도** | 낮음 (오차 누적으로 궤적 흔들림) | 높음 (트랜스포머 시퀀스 예측) | 매우 높음 (미세 곡선 및 접촉 안정성 압도적) |
| **연산 복잡도** | 1회 순방향 전파 (극도로 빠름) | 1회 어텐션 디코딩 (빠름) | 다단계 디노이징 반복 (상대적으로 무거움) |
| **시연 데이터 요구량** | 수천 회 이상 필요함 | 50~100회 시연으로 학습 가능 | 30~50회 극소 시연으로도 높은 성공률 달성 |

---

## 50Hz 실시간 루프 유지를 위한 3대 하드웨어 엔지니어링

1. **디노이징 스텝 축소 (100스텝 $\to$ 16스텝)**
   - 이미지 생성과 달리 로봇 제어는 20ms 안에 계산이 끝나야 하므로 DDIM(Denoising Diffusion Implicit Models) 스케줄러로 스텝 압축 필수임
2. **액션 지평선(Receding Horizon Action Chunking)**
   - 모델이 한 번 추론할 때 미래 16타임스텝($T_a=16$)을 예측하되, 앞선 8스텝만 실행하고 즉시 새 비전 프레임으로 재추론 돌림
3. **TensorRT 엔진 컴파일 및 비동기 워커**
   - ResNet/ViT 비전 인코더와 1D-Unet 노이즈 예측기를 TensorRT FP16으로 컴파일하여 엔비디아 Jetson Orin에서 12ms 이내 추론 방어

---

## Q&A 또 궁금한 것은?

- **Q. 관절 모터 각도를 직접 예측함, 아니면 엔드이펙터(손끝) 좌표를 예측함?**
  - 손끝 3차원 위치와 쿼터니언 회전값($SE(3)$ 공간)을 예측한 뒤 로컬 IK(역기구학) 컨트롤러로 넘기는 방식이 일반화 성능과 안전성 면에서 훨씬 우수함
- **Q. 카메라 해상도가 높을수록 파지 성공률이 올라감?**
  - 아님. 비전 인코더에는 $224 \times 224$ 또는 $320 \times 240$ 저해상도 크롭 이미지로 충분하며, 해상도보다 손목 카메라(Eye-in-Hand)와 전방 고정 카메라의 멀티뷰 시점 확보가 훨씬 중요함
- **Q. 물건 위치가 훈련 때와 달라져도 잘 집어올림?**
  - 데이터 증강(Random Crop/Color Jitter)과 공간 크로스 어텐션 덕분에 작업대 위 $\pm 20\text{cm}$ 범위 내 위치 편차는 재학습 없이도 자연스럽게 추적함
