---
title: "Doesn't every TTS sound the same these days? Let's make one with my own voice!"
description: "Five open-source voice-cloning models run on the same sentence on a home RTX 3070, why OmniVoice won, and how a visitor's voice travels through a tunnel to the home PC and back."
publishedAt: 2026-10-27
lang: en
project: my-voice-tts
part: 1
---

## In three lines

- The goal: read one fixed sentence, then hear any text in your own voice, all on one RTX 3070 at home
- Five open-source models with licenses that allow monetization ran on the same sentence; OmniVoice won with 0.812 voice similarity and 5 seconds of speech in 2.2 seconds
- A visitor's voice reaches the home PC through the site's server and a tunnel, and Whisper first checks that the consent sentence was really read

## Licenses came first

- The site carries ads and the voice would end up in YouTube videos, so non-commercial (NC) models were out from the start
- That ruled out Fish Audio S2, XTTS-v2 and F5-TTS
- The first shortlist was Chatterbox, CosyVoice3 and GPT-SoVITS, all MIT or Apache 2.0
- Recent papers showed none of the three at the top. For Korean speaker similarity, VoxCPM2 and OmniVoice led the open models at about 0.83 ([OmniVoice paper](https://arxiv.org/abs/2604.00688), [multilingual comparison](https://arxiv.org/html/2608.11650v1))
- So those two joined, and I tested five

## Same voice, same sentence, five models

![Bar charts of voice similarity and time to generate 5 seconds of speech for OmniVoice, CosyVoice3, VoxCPM2, Chatterbox and GPT-SoVITS](/images/stories/my-voice-tts/part1-models.webp)

*Made by HSL — RTX 3070, one reference voice, one Korean sentence, measured Oct 24*

- Each model got the same 5.08-second reference voice and read the same Korean sentence
- Whisper transcribed each result to measure pronunciation errors (CER), and a speaker-verification model (ECAPA) measured how close it sounded to the reference

| Model | Char errors | Voice similarity | Time for 5 s | GPU memory |
|---|---|---|---|---|
| **OmniVoice** | 0% | **0.812** | **2.2 s** | 2.2 GB |
| CosyVoice3 0.5B | 3.1% | 0.808 | 7.1 s | 3.6 GB |
| VoxCPM2 | 0% | 0.783 | 17.1 s | 5.9 GB |
| Chatterbox | 0% | 0.749 | 11.2 s | 3.6 GB |
| GPT-SoVITS | 0% | 0.687 | 7.5 s | 1.9 GB |

- OmniVoice sounded closest and ran fastest, more than twice real time, short enough for a visitor to wait
- VoxCPM2 topped the papers, but on the 3070 it used 5.9 GB and took 17 seconds
- With 8 GB on the card, all five could never fit at once, so the service loads just one
- The limits: one sentence and one reference voice make a small test
- And the reference was not a real person. With no recording yet, I used a stand-in: Chatterbox's default voice reading the consent sentence
- One more snag: installed under my user folder, the audio libraries broke on the Korean characters in the path, so every model and environment moved to an ASCII-only path

## The 3070 is at home, the visitors are not

![Flow from a visitor's browser microphone through the hslab site server and a Cloudflare quick tunnel to Whisper and OmniVoice on the home PC, with the audio returning the same way](/images/stories/my-voice-tts/part1-flow.webp)

*Made by HSL — how a visitor's request reaches the home GPU*

- The GPU is in the home PC, so the site's server (a Cloudflare Worker) takes each request and passes it through a tunnel
- It is a Cloudflare quick tunnel, whose address changes on every start, so the home PC re-sends its current address to the site server every minute
- Requests need a secret key shared by the home PC and the site server, so knowing the tunnel address alone is not enough
- When the PC is off, the page says "Taking a break right now"
- End to end through the live site, checking a recording took 2.2 seconds and generating speech 2.5 seconds

## Only your own voice

![The project page's recording screen: step 1 shows the consent sentence to read aloud and a record button; the step 2 text box opens only after recording](/images/stories/my-voice-tts/part1-live-page.webp)

*Made by HSL — recording screen of the English project page, as of Oct 27*

- To keep it from cloning someone else's voice behind their back, there is no file upload at all; you read into the microphone
- The sentence is fixed: "This is my own voice, and I agree to let it be used for speech synthesis today"
- Whisper large-v3-turbo transcribes the recording, and anything more than 35% off the sentence is rejected

```python
score = cer(norm(CONSENT[lang], lang), norm(heard, lang))
if score > 0.35:
    raise HTTPException(422, f"mismatch:{heard[:120]}")
```

- Recordings must be 2–20 seconds long, and near-silent ones are rejected
- An accepted recording stays in a temporary folder for 30 minutes and is then deleted; it is never used for training, and typed text is not stored
- Rate limits count a hash of the IP, never the IP itself: 10 checks and 40 generations an hour

## If I did it again

- Start the shortlist from recent paper comparisons; the first three picks were a generation old
- Measure against a real person's recording from day one; in part 2, against my own recordings, similarity came out at 0.72–0.82
- After a reboot the voice server and tunnel have to be started by hand; they should start at login
- A named tunnel with a fixed address would probably remove the need to re-send the address every minute
- Part 2 covers narrating YouTube Shorts in this voice and trying LoRA training. To try it yourself, see the [project page](/en/projects/my-voice-tts/)
