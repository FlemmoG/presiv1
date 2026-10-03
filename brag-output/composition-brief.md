# Hyperframes Composition Brief: AlexNet — A Guided Journey Through the Architecture

## Objective
Create a polished launch-style brag video for AlexNet: A Guided Journey Through the Architecture.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: ~45 seconds (user override of the 15–25s default; acceptable range 30–60s)

## Source Material
- Project root: /Users/flemminggrabowski/presiv1
- Primary files read: README.md, index.html, package.json, src/styles.css (tokens), src/lib/architecture.js (PALETTE, TOUR, SOFTMAX_CLASSES), src/lib/patterns.js
- Product name: AlexNet: A Guided Journey Through the Architecture
- Tagline / strongest claim: "The model never receives the concept “dog.” It receives numbers describing colour and brightness."
- Key UI or visual moment to recreate: the colour-coded 3D-style block model with tensor-shape labels; the 11×11 stride-4 filter sliding over a pixel grid; the 3×3 stride-2 max-pool; softmax bars
- Copy that must appear verbatim:
  - The model never receives the concept “dog.”
  - AlexNet contains five convolutional layers followed by three fully connected layers.
  - A filter scans local regions of the image and responds to a specific visual pattern.
  - Max-pooling reduces spatial size and keeps the strongest activation.
  - In a dense layer, every neuron is connected to every neuron in the previous layer.
  - The final fully connected layer produces 1,000 class scores. Softmax then converts these scores into probabilities.
  - Illustrative softmax output / Conceptual close-up / not a learned layer
  - Nothing here is a trained model.

## Creative Direction
- Tone preset: polished
- Creative direction: quiet premium product film — museum-grade explainer
- Interpretation: fewer scenes, long settled holds, mixed-case light type, slow 0.6–0.8s crossfades; one idea and one caption per scene.
- Angle: See brag-plan.md. Follow the tour's own journey: numbers in → one mechanism per scene → a probability out.
- Hook: "The model never receives the concept “dog.”" then "It receives numbers." with a dog illustration dissolving into RGB values.
- Outro / punchline: "Nothing here is a trained model. Every number is there to make the mechanism legible." → AlexNet title card → silence.
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign (stay in the project's dark cinematic palette)
  - Claiming the numbers are real activations — keep the "conceptual / illustrative" badges

## Visual Identity
- Background: #070a12 with radial vignette to rgba(3,5,10,0.72)
- Text: #e9eef7 (dim #9aa8bd, faint #6b7890)
- Accent: conv #4ea8ff, pool #3ddc97, dense #ff9f45, output #b57bff, softmax #7f8da3, input #8fa6c4
- Display font: system UI sans (Inter acceptable substitute)
- Body font: same
- Visual references from the project: colour-coded layer blocks with tensor labels, legend, "Step N of 7" counter, dark panels rgba(12,17,28,.86) with hairline borders rgba(255,255,255,.1)

## Storyboard
Use the storyboard in `brag-output/brag-plan.md` as the creative contract.

Scene summary:
1. Hook — 6s — dog illustration → RGB numbers; two lines of type
2. Whole architecture — 7s — colour-coded block model, tensor shapes, legend, caption
3. One filter — 8s — 11×11 stride-4 filter sliding, feature map filling, three filters
4. Pooling — 7s — 3×3 stride-2 max-pool on 5×5 → 2×2, overlap band
5. Dense layers — 6s — flatten → FC6/FC7/FC8, representative connections
6. The answer — 7s — softmax bars, dog 0.72
7. Outro — 4s — "Nothing here is a trained model." → AlexNet title → fade

## Audio
- Audio role: warm bed with sparse professional accents
- Audio arc: fades in under the hook, opens on the architecture, quiet ticks through mechanisms, peak at the answer, fades to silence in the outro
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` (already copied to `composition/assets/music/`)
- Music treatment: low, under copy; ~1.5s fade-in; ~4s fade-out ending at silence
- Music cue guidance: bundled preset `~/.claude/plugins/cache/brag/brag/0.4.0/skills/brag/assets/music/cues/happy-beats-business-moves-vol-12-by-ende-dot-app.music-cues.json` (110 BPM; strong cues at 8.74, 9.29, 10.93, 13.11, 17.47, 18.56, 22.93, 24.56s). Preset covers only 0–25s; run `npx hyperframes beats` for later cues.
- Audio-reactive treatment: subtle — block glow and vignette breathe with bass/RMS
- Audio-coupled moments:
  - Scene 1 numbers resolving — soft ticks
  - Scene 2 blocks arriving left to right — card sounds on consecutive beats
  - Scene 3 / 4 stride and window steps — ticks on beat grid
  - Scene 6 bars resolving — chime on the dog bar, beat-locked to a strong cue
- SFX selection guidance: sparse, low high-frequency-risk from `sfx-analysis.md`; motion-matched
- SFX analysis guidance: `~/.claude/plugins/cache/brag/brag/0.4.0/skills/brag/assets/sfx/sfx-analysis.md`
- Exact SFX choice: Hyperframes should choose filenames, timestamps, density, and volume based on the implemented animation.
- Audio files: copy the chosen SFX into `brag-output/composition/assets/`

## Hyperframes Instructions
Load `hyperframes-core`, `hyperframes-animation`, `hyperframes-creative`, `hyperframes-keyframes`, `hyperframes-cli`. /brag is its own workflow: do not enter the `hyperframes` entry-point interview or generic promo workflow.

Requirements:
- Show real UI, copy, or visuals from the source project (see above).
- Keep all text readable; honour the reading-time floor (~0.3s/word, ≥1.2s per sentence).
- Duration ≈ 45s (30–60s allowed by the user).
- Include the planned music/SFX layer.
- Treat music cues as optional hints; 1–3 beat-locked major reveals (±0.15s) and beat-grid snapping (±0.10s) for non-text accents.
- Subtle audio-reactive glow tied to music energy; no waveforms.
- Run `hyperframes check` before render.
