# AlexNet: A Guided Journey Through the Architecture

An interactive 3D visualization that explains how AlexNet turns an image into a
classification result. No advanced mathematics, no training, no backend.

The experience is a guided camera tour through a 3D model of the network: first
the whole architecture, then a flight to each stage for a concrete visual
explanation.

https://github.com/user-attachments/assets/68420d2f-e8e9-42b8-9847-a8cf7387dc33

> **Nothing here is a trained model.** There is no inference and no real
> weights. Every feature map, activation grid and probability is a hand-designed
> illustration chosen to make the *mechanism* legible. See
> [Conceptual vs. paper numbers](#conceptual-vs-paper-numbers).

---

## Getting started

Requires Node.js 18 or newer.

```bash
npm install
npm run dev       # then open the URL Vite prints (default http://localhost:5173)
npm run build     # production build into dist/
npm run preview   # serve the production build locally
```

## Controls

| Key | Action |
| --- | --- |
| `→` or `Space` | Next step |
| `←` | Previous step |
| `R` | Restart tour (back to the overview, demos replay) |
| `O` | Overview (wide shot, demos keep their state) |
| `D` | Cycle block depth: schematic → √ channels → linear |

Mouse / trackpad: **drag** to orbit, **scroll** to zoom (towards the pointer),
**click a layer** to jump to the step that explains it. Camera controls are
disabled during a flight, and **Overview** or `O` always restores the guided
mode.

---

## The guided tour

| Step | Title | What it shows |
| --- | --- | --- |
| Overview | Overview | The whole architecture, the colour legend and the two GPU lanes |
| 1 | The input image | An image turning into labelled RGB pixel values |
| 2 | Conv1 and the 11 × 11 filter | A filter sliding across a pixel grid with stride 4, writing a feature map |
| 3 | Feature maps | Three representative filters producing three different feature maps |
| 4 | Pooling | A 3 × 3 max-pooling window (stride 2) over a 5 × 5 grid, giving a 2 × 2 output |
| 5 | Deeper convolutional layers | Conv2 → Conv5, shrinking and increasingly abstract |
| 6 | Dense layers | Feature maps flattening into a vector through FC6, FC7 and FC8 |
| 7 | Classification | 1,000 class scores, softmax, and an illustrative probability chart |

Steps 2 and 4 animate continuously; step 2 also has Play / Pause / Step controls
and a filter switcher.

---

## Conceptual vs. paper numbers

**From the paper** (Krizhevsky, Sutskever & Hinton, *ImageNet Classification
with Deep Convolutional Neural Networks*, 2012):

- Five convolutional layers, then three fully connected layers
- Input `224 × 224 × 3`; Conv1 uses 96 filters of `11 × 11 × 3`, **stride 4**
- Overlapping max-pooling: `3 × 3` windows, **stride 2**
- FC6 (4,096), FC7 (4,096), FC8 (1,000 class scores), then softmax
- The original network was split across **two GPUs**
- The per-layer tensor shapes shown under each block

**Softmax is not a fourth layer.** Only FC6 to FC8 have learned weights; softmax
is a parameter-free function. In the 3D scene it is a small grey wireframe block
with a σ glyph, joined by dotted trails instead of the solid links used between
learned layers.

**Conceptual and simplified**, labelled as such in the interface:

- **Feature maps and activations** come from small hand-written generators in
  [`src/lib/patterns.js`](src/lib/patterns.js), not from a trained network.
- **The input photograph** is a CSS illustration, not an ImageNet image.
- **Pixel grids** show only a small region (8 × 8 input corner, 27 × 27 Conv1
  patch) under a "Conceptual close-up" badge.
- **The pooling grid and values** are invented; the window and stride are the
  paper's.
- **Softmax probabilities** (dog 0.72, wolf 0.11, …) are illustrative.
- **Dense connections** are a small sample; a real layer has millions.
- **Step 3's three filters** are examples, not the full 96-filter layer.
- **3D geometry** is not to scale. The **Block depth** toggle (or `D`) maps
  channel count to depth: *Schematic* (hand-picked, most legible), *√ channels*
  (exact ordering, compressed ratios) or *Linear* (exact ratios, but the input
  block is nearly invisible). Height and width are never to scale.

Deeper layers are described only as responding to "more complex and
object-related patterns", never as detecting specific object parts. Channel
counts do not simply grow (96 → 256 → 384 → 384 → 256), which is why the step 5
text says they *change*.

---

## Accessibility

- `prefers-reduced-motion: reduce` is respected: flights cut directly to their
  destination, ambient motion stops and demos render in their final state.
- All controls are real buttons, keyboard reachable, with `aria-label`s and
  `aria-pressed` on toggles.
- Step changes are announced via `aria-live="polite"`; pixel grids, feature
  maps and charts carry `role="img"` with descriptive labels.
- Visible `:focus-visible` outlines on the dark theme.

---

## Project structure

```
src/
  App.jsx                  tour state, keyboard handling, layout
  styles.css               dark theme
  lib/
    architecture.js        layer + tour data model, palette, paper figures
    patterns.js            deterministic conceptual pattern generators
    useReducedMotion.js    prefers-reduced-motion hook
  components/
    ArchitectureScene.jsx  the R3F canvas, lighting, GPU lanes, connectors
    LayerNode.jsx          one stage: plane stack or neuron column + label
    CameraTour.jsx         eased camera + orbit-target flights
    DataFlow.jsx           data-flow particles
    *Demo.jsx, SoftmaxOutput.jsx   the per-step demo panels
    TourControls.jsx       control bar
```

The tour is data-driven: each entry in `TOUR` in
[`src/lib/architecture.js`](src/lib/architecture.js) declares its camera framing,
lit layers, headline and demo panel. To reorder, reword or re-frame a step, edit
that array.

## Tech stack

React 18, React Three Fiber 8 and drei 9, Three.js, Vite. All assets are local
and procedural; no backend, no runtime network requests.
