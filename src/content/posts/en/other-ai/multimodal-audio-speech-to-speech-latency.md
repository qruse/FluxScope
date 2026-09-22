---
title: "Reducing latency in native real-time speech-to-speech multimodal models"
seoTitle: "Low-Latency Speech-to-Speech Native Multimodal Architectures"
description: "How bypassing conventional ASR-LLM-TTS cascaded pipelines achieves sub-300ms natural conversational latency with emotional tone preservation."
publishedAt: 2026-09-18
updatedAt: 2026-09-21
category: other-ai
tags: [speech, audio-multimodal, low-latency, streaming-audio, voice-ai, conversational-ai]
author: "FluxScope"
image:
  src: /images/other-ai.png
  width: 1200
  height: 630
  alt: "Illustration of real-time audio waveform and neural communication"
draft: false
lang: en
experienceNote: "Cascaded STT-LLM-TTS pipelines hit an irreducible 1.8-second latency floor; migrating to native neural audio token streams compressed round-trip response time to 310ms"
---

## 3-Line TL;DR

- Dismantles the serialized ASR $\to$ LLM $\to$ TTS pipeline in favor of end-to-end discrete audio token generation
- Retains critical non-verbal signals—whispering, laughter, hesitations, and breathing cadence—lost in text intermediaries
- Slashes total voice turnaround latency under 300ms, matching natural human conversational cadence

---

## Cascaded Pipelines vs Native Speech-to-Speech (S2S)

| Dimension | Cascaded Stack (Whisper + LLM + ElevenLabs) | Native Multimodal S2S (GPT-4o Voice / Moshi) |
| :--- | :--- | :--- |
| **Total Turnaround Latency** | 1,500ms–2,500ms (accumulated serialization delay) | 250ms–350ms (matches human conversational reflex) |
| **Acoustic Nuance** | Stripped down to flat ASCII strings; emotion lost | Acoustic tokens preserve pitch, sarcasm, and inflection |
| **Barge-in / Interruptions** | Requires external heuristic Voice Activity Detectors | Model continuously monitors audio input for natural yield |
| **Serving Architecture** | 3 independent microservices with separate network queues | Single end-to-end full-duplex inference stream |

---

## Turnaround Latency Benchmark Comparison

![Speech-to-Speech Latency Comparison](/images/posts/other-ai/speech-latency-comparison.webp)
*Source: [Kyutai Moshi / OpenAI](https://kyutai.org/moshi.pdf) — Real-Time Full-Duplex Speech-to-Speech Multimodal Benchmark*

---

## 3 Engineering Pillars of Sub-300ms Conversational AI

1. **Neural Audio Codec Compression**
   - High-fidelity codecs (EnCodec, Mimi, SNAC) quantize 24kHz raw PCM into low-bitrate discrete token books
2. **Chunked Streaming Autoregressive Decoding**
   - Synthesizes and streams out initial PCM audio buffers the moment the first 5 acoustic tokens emerge
3. **Full-Duplex WebRTC Transport**
   - Replaces high-overhead HTTPS REST round-trips with UDP-based WebRTC data channels running Opus audio frames

---

## Q&A (Field Notes)

- **Q: How does the model avoid interrupting the user mid-sentence?**
  - Acoustic turn-taking heads analyze pitch cadence and micro-silences rather than relying on crude silence timers
- **Q: How does operating cost compare to text chatbots?**
  - Continuous audio streams generate 3–5x more tokens per second than text, increasing API and GPU serving bills by roughly 4x
- **Q: How robust are these models in noisy outdoor environments?**
  - Without frontend directional beamforming microphones and deep neural noise reduction (e.g. DeepFilterNet), ambient crowd chatter triggers perceptual hallucinations
