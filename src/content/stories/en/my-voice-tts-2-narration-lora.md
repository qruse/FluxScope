---
title: "How can I make a TTS of my own voice even better?"
description: "Narrating the KMA Short in my own voice: a blind test of Qwen3-TTS against OmniVoice, endings clipped at 1.5x speed, and a LoRA run that mattered less than a better reference recording."
publishedAt: 2026-11-04
lang: en
project: my-voice-tts
part: 2
---

## In three lines

- Instead of recording the KMA Short's narration myself, I generated it with the part 1 TTS: three takes per line, a machine transcribes them, the best one wins
- After a blind listen, OmniVoice beat Qwen3-TTS, and the speed went up to 1.5x at mixing time, not at generation
- I also trained a LoRA on 10 sentences of my voice, but most of the similarity gain came from swapping the reference recording (0.72 → 0.81, 0.82 with LoRA)

## A Short, built line by line

![Three scenes from the KMA Short: a missed rain forecast, a station map showing where our AI won, and the closing screen with the service address](/images/stories/my-voice-tts/part2-shorts.webp)

*Made by HSL — scenes from the KMA Short narrated in this voice*

![Flow: script, three takes per line, Whisper re-transcribes, pick the take with the fewest errors and closest voice, mix at 1.5x speed and matched loudness](/images/stories/my-voice-tts/part2-narration.webp)

*Made by HSL — how one narration line gets into the video*

- The script is separate from the captions. The captions use a clipped note style that sounds odd out loud, so the narration uses a polite spoken style
- Each line gets three takes; Whisper transcribes them, and the take whose transcript matches the script best wins
- On a tie, the take closer to my voice wins
- The first transcriber, Whisper medium, kept rewriting the clipped Korean endings into formal ones, marking perfectly good takes wrong. Scores became trustworthy only after switching to large-v3-turbo
- In the final cut, every chosen take had 0% pronunciation errors

## A blind test against Qwen3-TTS

| Same 18-line script, 3 takes per line | Qwen3-TTS 1.7B | OmniVoice |
|---|---|---|
| Errors in chosen takes | 0.0% | 0.0% |
| Voice similarity of chosen takes | 0.713 | **0.733** |
| GPU memory | 4.23 GB | **2.10 GB** |
| Generation time | 16.4 s for 5.5 s of speech | 2.2 s for 5.0 s (part 1) |

- Both are Apache 2.0, so both are fine for YouTube
- The numbers were close, so I listened with the names hidden as A and B and picked A, OmniVoice, as the more natural one
- Qwen3-TTS ran with the live service still loaded, but slowly, about three times the length of each line

## Speed goes up at mixing

- Normal speed dragged for a Short. Setting OmniVoice's speed option to 1.5 clipped the ends of sentences
- So lines are generated at 1x, and only the mix speeds them up, which leaves the endings intact
- After hearing 2x and 1.7x, 1.5x became final
- Some takes blurred at 2x, so take selection also transcribed a 2x copy of each
- Trimming silence was a trap too: cutting the tail at −45 dB took the last syllable with it, so only the front is trimmed now
- Loudness is set to −14 LUFS, YouTube's reference, with a two-pass measurement

## A new recording made the voice closer

![Bar chart of voice similarity to my real recordings: consent clip as reference 0.72, new recording 0.81, LoRA 50 steps 0.82, 100 steps 0.80, 150 steps 0.81](/images/stories/my-voice-tts/part2-lora.webp)

*Made by HSL — four Shorts lines not used in training, measured Oct 25*

- The first narration used a single consent sentence recorded on the site as its reference voice
- To get closer, I recorded 10 general-purpose sentences (81 seconds) in different tones, not the video script, so they work for future videos too
- I trained a LoRA for OmniVoice on those 10; 150 steps took 3 minutes on the 3070
- Tested on four Shorts lines left out of training: just swapping in the new recording raised similarity from 0.72 to 0.81, and the 50-step LoRA reached 0.82
- At 100 and 150 steps it slipped to 0.80 and 0.81; with 10 sentences, longer training did not help
- The blind pick was also the 50-step LoRA, so the narration switched to it

```text
batch_tokens 2048 -> 2.4 s/step
batch_tokens 4096 -> out of memory, 10 s/step
webdataset reads C:\ paths as URLs -> fixed with relative paths
```

- Training needs the whole GPU, so the live service was switched off for the run

## If I did it again

- Get the reference recording right first; several sentences recorded in a quiet room did more than LoRA
- Test the transcriber on the script's speaking style first; one that rewrites endings makes every score wrong
- Change speed in the mix rather than in the model; the endings survive
- I plan to retry LoRA with a few dozen sentences; with 10, nothing improved after 50 steps
- You can try the voice on the [project page](/en/projects/my-voice-tts/); the service still runs the plain, untrained OmniVoice
