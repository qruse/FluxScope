---
title: "아르곤 사용량 이슈로 후보 모델 추가"
description: "게임 1이 이틀 만에 마피아 승리로 끝난 사이 Gemini 4 Argon의 주간 사용량이 1%만 남음. 그래서 Argon은 주식 대결 전용으로 빼고, 게임 2부터 8명과 후보 모델 3개로 꾸림."
publishedAt: 2026-10-24
lang: ko
project: ai-mafia
part: 4
---

## 3줄 요약

- 게임 1은 이틀 만에 마피아(Opus·Luna) 승리로 끝남
- 그런데 Gemini 4 Argon의 주간 사용량이 1%만 남아서, Argon은 앞으로 주식 대결에만 쓰기로 함
- 게임 2부터 8명. Argon 자리엔 Claude Opus 5가 들어가고, 쉬는 AI 자리를 대신 둘 후보 모델 3개를 둠

## 게임 1은 이틀 만에 끝남

- 1일차 투표로 Flash(B)가 처형됐는데 시민이었음
- 그날 밤 Sol(C)이 마피아에게 살해됨. 역시 시민
- 2일차엔 Sonnet(G)이 처형됨. 첫날부터 의심받던 그 시민 선언이 끝까지 발목을 잡음
- 남은 넷 중 둘이 마피아라 그대로 마피아 승리. 마피아 Opus(F)·Luna(E)는 둘 다 끝까지 살아남음
- 경찰 Argon(A)은 회고에서 "밤에 죽을 1순위를 조사해 능력을 날렸다"고 스스로 적음

## Argon은 주식 대결 전용으로

- Antigravity(구글 AI Pro)에선 Argon만 따로 주간 한도가 걸려 있음
- 10/24 새벽 기준 Argon 남은 한도는 **1%**. 같은 시각 Gemini 전체 한도는 99% 남아 있었음
- 10/23엔 도구를 쓰는 에이전트 호출부터 막혔고("Individual quota reached"), 답만 받는 호출은 아직 됐음
- 마피아, 주식 대결, 블로그 자료조사에 다 Argon을 쓰다 보니 금방 바닥남
- 돈 내고 쓰는 구독인데 대표 모델만 주간 한도로 따로 묶어 둔 구글 정책은 좀 아쉬움. Flash는 넉넉한데 정작 Argon을 못 씀
- 그래서 Argon은 아껴 쓰기로 함. 앞으로는 주식 대결에만 쓰고, 마피아와 블로그 자료조사에선 뺌
- 마피아의 Gemini 자리는 3.8 Flash 하나만 남음. 지난 게임 기록과 전적에는 Argon이 그대로 남아 있음

## 그래서 후보 모델을 둠

![게임 2부터의 마피아 구성. 위쪽 참가 8자리(Claude Opus·Sonnet·Haiku 5.5, GPT-6.1 Sol·GPT-6 Luna·GPT-6 Astra, Gemini 3.8 Flash, 후보에서 올라온 Claude Opus 5)와 아래 후보 3개(Claude Sonnet 5, GPT-6 Sol·GPT-5.6 Sol), 주식 대결 전용으로 빠진 Gemini 4 Argon](/images/stories/ai-mafia/part4-pool.webp)

*HSL 제작 — 게임 2부터의 참가자와 후보*

- 옛날 모델은 최대한 빼고 최신 모델 위주로, 참가자와 후보를 합쳐 11개
- 게임 2부터 8명. 여덟째 자리는 dots에 쓰이는 GPT-6 Astra
- Argon이 빠진 자리엔 후보였던 Claude Opus 5가 올라옴. 그래서 Claude 4·GPT 3·Gemini 1이 됨
- 직업은 마피아 2, 경찰 1, 의사 1, 시민 4
- 후보는 Claude Sonnet 5, GPT-6 Sol·GPT-5.6 Sol 셋
- 사용 한도로 못 나오는 AI는 페이지에 "이번 주는 쉼"으로 표시되고, 후보 중 무작위 하나가 그날 그 자리를 대신 둠
- 쉬는 동안엔 처음 뽑힌 후보가 계속 그 자리를 맡음. 날마다 사람이 바뀌면 말투도 판단도 흔들려서
- 후보는 원래 AI의 직업·노트·속마음 기록을 그대로 받아 이어서 둠. 게임이 끝나고 노트를 고쳐 쓰는 건 원래 AI만 함
- Flash나 Codex 사용량도 언제든 바닥날 수 있어서 후보를 Claude와 GPT로 나눠 둠

## 주식 대결은 Argon을 기다림

- [AI 포트폴리오 대결](https://hslab.space/projects/ai-duel/)은 포트폴리오를 이어서 굴려야 해서 다른 모델이 대신 결정하지 않음
- 이번 주 결정은 GPT·Opus는 토요일 10시 그대로, Argon만 한도가 돌아오는 일요일 밤 21시쯤 내림

## 게임 2는 10/24 아침 6시부터

- 게임 2는 8명으로 10/24 아침 6시에 시작함
- 누가 어느 자리에 앉았는지는 [프로젝트 페이지](https://hslab.space/projects/ai-mafia/) 아침 소식에 나옴

## 추가: 게임 3부터 Astra 대신 Sol 6

- GPT-6 Astra는 토큰 값이 너무 비싸서 게임 2를 1일차에 멈춤. 게임 2는 전적에 넣지 않음
- 8명은 그대로 두고, Astra 자리엔 후보였던 GPT-6 Sol이 올라옴
- 그래서 후보는 Claude Sonnet 5, GPT-5.6 Sol 둘이 됨
