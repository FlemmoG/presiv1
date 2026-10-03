# Brag Plan: AlexNet — A Guided Journey Through the Architecture

## What is this app?
An interactive 3D guided camera tour (React + Three.js) that explains how AlexNet turns an image into a classification, with no math and no trained model.

## The angle
User direction: **use the actual 3D application, not just recreated UI.** Every scene is real screen footage of the running app, captured headlessly (Chrome, 1920x1080, ~50fps screencast) while stepping through the tour with the → key. Hyperframes only adds captions, soft dips on the beat, music and the outro.

## Hook (0–3.6s)
The real overview shot, a slow push-in on the colour-coded model. Caption: "Fly through a neural network."

## Key moments (all real footage)
- Step 1: camera flies to the input; panel shows the 224x224x3 pixel numbers. "It never sees 'dog.' It sees numbers."
- Step 2: Conv1 and the sliding 11x11 filter. "One 11×11 filter scans for a pattern."
- Step 4: pooling, 3x3 window. "Keep only the strongest response."
- Step 7: softmax bars. "Out comes a verdict: dog 0.72"

## Outro
"AlexNet — A Guided Journey Through the Architecture", then the project's own disclaimer: "Nothing here is a trained model. Every number is there to make the mechanism legible."

## Tone
- Preset: polished — quiet premium product film; soft dip-to-ink cuts on the beat, one idea per scene.

## Format: landscape — 1920x1080. Duration: 24.8s

## Visual identity
Background #070a12, text #e9eef7, accents conv #4ea8ff / pool #3ddc97 / dense #ff9f45 / output #b57bff, system UI font.

## Audio direction
- Music: happy-beats-business-moves-vol-12 (110 BPM), fade in 1.2s, ~0.33 volume, fade out to the end.
- Music cue guidance: bundled preset. Cuts locked to strong cues 8.74s, 13.11s, 17.47s; title lands on 22.93s.
- Audio-reactive: none. The visuals are recorded footage, so no extra reactive layer was added.
- SFX: sparse soft UI switch on each cut, soft impact on the title.

## Storyboard
1. Hook — 0–3.6s — real overview, push-in
2. Input numbers — 3.6–8.74s — real step 1
3. Filter — 8.74–13.11s — real step 2 (beat-locked)
4. Pooling — 13.11–17.47s — real step 4 (beat-locked)
5. Softmax — 17.47–22.37s — real step 7 (beat-locked)
6. Outro card — 22.37–24.8s (title beat-locked 22.93)
