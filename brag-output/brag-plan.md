# Brag Plan: AlexNet — A Guided Journey Through the Architecture

## What is this app?
An interactive 3D guided camera tour that explains how AlexNet turns an image into a classification result — for a university Information Systems classroom, with no math, no training and no backend.

## The angle
A quiet premium product film about *understanding*. The project's best idea is its first honest sentence: the network never sees a "dog," it sees numbers. The video follows the same journey the tour does — numbers in, one mechanism per scene, a probability out — and treats the tour's own carefully worded copy as the script. Restraint is the point: it is a teaching tool that refuses to overclaim ("Nothing here is a trained model").

**Duration override:** the user asked for 30–60s, which supersedes the skill's 15–25s default. Target ≈ 45s.

## Hook (first 2-3 seconds)
Near-black stage. Line one, in large light type: *The model never receives the concept "dog."* (the tour's own step-1 headline). Under it, a soft CSS-illustration dog silhouette dissolves into a grid of RGB numbers as the second line lands: *It receives numbers.*

## Key moments (the middle)
- The wide architecture shot: colour-coded blocks (blue conv, green pool, orange dense, grey softmax, purple output) with real tensor-shape labels (224×224×3, 55×55×96, 27×27×256, 13×13×384, 6×6×256).
- The 11 × 11 filter sliding across a pixel patch with stride 4, writing one value per position into a feature map.
- The 3 × 3 max-pool window, stride 2, over a 5 × 5 grid → 2 × 2 output, with the shared overlap band outlined.
- Dense layers: connections fanning between 4,096 → 4,096 → 1,000 units.
- Softmax bars resolving: dog 0.72, wolf 0.11, fox 0.06, cat 0.04, rabbit 0.03.

## Outro / punchline
*Nothing here is a trained model. Every number is there to make the mechanism legible.* Then product name **AlexNet** + subtitle *A Guided Journey Through the Architecture*. Music fades. Silence.

## User flow worth showing
1. Entry — overview wide shot, Step 0 (Overview), then arrow-key "Next" (a small step counter "Step 2 of 7" and a Next button are shown ticking).
2. Key action — step through the tour: input pixels → Conv1 filter → pooling → dense.
3. Result — Classification step: illustrative softmax output, dog 0.72.

## Tone
- Preset: polished
- Creative direction: quiet premium product film — a museum-grade explainer
- Interpretation: Few scenes, long settled holds, mixed-case light type, slow crossfades (0.6–0.8s); each scene carries exactly one idea and one caption.

## Format: landscape — 1920x1080
## Duration: ~45 seconds

## Visual identity (from the project)
- Background: #070a12 (with a radial vignette to rgba(3,5,10,.72))
- Accent: conv #4ea8ff · pool #3ddc97 · dense #ff9f45 · output #b57bff · softmax/grey #7f8da3
- Text: #e9eef7 (dim #9aa8bd, faint #6b7890)
- Display font: system UI stack (-apple-system / Inter / Segoe UI); Hyperframes may substitute Inter
- Body font: same stack
- Strongest visual element: the colour-coded block model with tensor-shape labels on the dark cinematic stage, and the sliding 11×11 filter

## Share copy (draft)
Introducing AlexNet: A Guided Journey — an interactive 3D tour that shows how a neural network turns an image into "dog, 72%", no math required.

## Audio direction
- Role: warm bed with sparse professional accents
- Music: `happy-beats-business-moves-vol-12` (110 BPM, 1:58) — gentle business-groove bed
- Music treatment: fade in over ~1.5s from 0:00 at low volume; sit under the copy; slow fade-out over the last ~4s into the outro
- Music cue guidance: bundled preset `cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json`, ~110 BPM. Strong cues: 8.74s, 9.29s, 10.93s, 13.11s, 17.47s, 18.56s, 22.93s, 24.56s (preset covers 0–25s; beyond that detect at composition time with `hyperframes beats`). Lock scene 2's reveal near 8.74s (lands ~2.7s into the wide shot — nudge scene boundary ≤0.15s), and the softmax payoff to a strong beat detected after 25s. Beat grid ≈ every 0.55s for the filter-stride ticks (non-text accents only).
- Audio-reactive treatment: subtle; use music RMS/bass to breathe the glow around the colour-coded blocks and the vignette, not waveforms
- SFX posture: sparse, motion-matched, low high-frequency risk
- Audio-coupled moments: pixel-number grid appearing; filter stride steps ticking on the beat grid; softmax bars resolving; final title
- Restraint rule: no risers or hits under text-heavy holds; nothing louder than the music; no waveform/equalizer graphics

## Storyboard

### Scene 1 — The hook — 6s
Dark stage. "The model never receives the concept “dog.”" fades up (hold ≥3s, ~9 words → floor ≈2.7s). A soft dog illustration dissolves into an 8×8 grid of RGB values (the tour's "Conceptual close-up" badge shown). Second line "It receives numbers." lands and holds ≥1.2s.
Sequential/interaction: yes — pixel cells resolve to numbers one diagonal at a time.
Audio intent: hushed, curious; music fades in.
Audio-coupled idea: soft tick as the numbers resolve
Music: warm bed fading in
Transition mood: soft crossfade → Scene 2

### Scene 2 — The whole architecture — 7s
Wide shot of the model: Input → Conv1 → Pool1 → Conv2 → Pool2 → Conv3 → Conv4 → Conv5 → Pool5 → FC6 → FC7 → FC8 → Softmax → Probabilities, in project colours with tensor-shape labels, legend top right. Caption: "Five convolutional layers followed by three fully connected layers." Title bar top left: "AlexNet: A Guided Journey" and a "Step 0 · Overview" counter.
Sequential/interaction: yes — blocks arrive left to right, one per beat (accents only; caption holds ≥2.5s).
Audio intent: the piece opens up
Audio-coupled idea: blocks arrive on consecutive beats with a soft card sound
Music: bed swells slightly at the first strong cue
Transition mood: soft crossfade → Scene 3

### Scene 3 — One filter, one feature map — 8s
Step 2 of 7 · "Conv1 and the 11 × 11 filter". A pixel patch with an 11×11 window sliding at stride 4; each stop writes one value into a growing feature map beside it. Caption: "A filter scans local regions of the image and responds to a specific visual pattern." Chips: "11 × 11 × 3" and "Stride: 4". Ends with "One filter produces one feature map. Many filters produce many feature maps." (3 small maps appear) ; holds ≥2.4s each caption.
Sequential/interaction: yes — window steps across positions; feature-map cells fill in time.
Audio intent: mechanical, satisfying
Audio-coupled idea: a subtle tick per stride stop on the beat grid
Music: steady
Transition mood: slide → Scene 4

### Scene 4 — Pooling — 7s
Step 4 of 7 · "Pooling". 5×5 activation grid; a 3×3 window (stride 2) highlights the max in each region and writes a 2×2 output; the shared overlapping band is outlined. Caption: "Max-pooling reduces spatial size and keeps the strongest activation." Chip: "3 × 3 window, stride 2".
Sequential/interaction: yes — four window positions, one per two beats.
Audio intent: precise
Audio-coupled idea: window snap ticks
Music: steady
Transition mood: soft crossfade → Scene 5

### Scene 5 — Dense layers — 6s
Step 6 of 7 · "Dense layers". Final feature maps flatten to a column; connections fan to FC6 (4,096) → FC7 (4,096) → FC8 (1,000), labelled "Representative connections shown". Caption: "In a dense layer, every neuron is connected to every neuron in the previous layer."
Sequential/interaction: yes — connections draw layer to layer.
Audio intent: growing density
Audio-coupled idea: light swell as connections fill
Music: gently building
Transition mood: soft crossfade → Scene 6

### Scene 6 — The answer — 7s
Step 7 of 7 · "Classification". FC8's 1,000 scores pass through the grey σ block ("not a learned layer") and resolve into bars: dog 0.72, wolf 0.11, fox 0.06, cat 0.04, rabbit 0.03, other 995 classes 0.04. Badge: "Illustrative softmax output". Caption: "Softmax then converts these scores into probabilities."
Sequential/interaction: yes — bars grow one by one, dog last and brightest (text labels hold ≥1s each once all settled).
Audio intent: payoff
Audio-coupled idea: bars resolve with a soft chime on the dog bar; beat-locked to a strong cue
Music: peak level
Transition mood: slow crossfade → Scene 7

### Scene 7 — Outro — 4s
"Nothing here is a trained model." (hold 1.5s) / "Every number is there to make the mechanism legible." → then **AlexNet** with "A Guided Journey Through the Architecture". Music fades to silence over the last seconds.
Sequential/interaction: none
Audio intent: quiet finish
Audio-coupled idea: none — final fade only
Music: fade out
Transition mood: end

Scene durations: 6 + 7 + 8 + 7 + 6 + 7 + 4 = **45s**.

**Music mood for this video:** warm, understated business groove
**Audio summary:** A soft bed fades in under the hook, opens up on the architecture reveal, ticks quietly along with each mechanism, peaks on the softmax answer, and fades to silence under the closing title.
