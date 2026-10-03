/**
 * Deterministic generators for the conceptual pixel grids and feature maps.
 *
 * IMPORTANT: none of this is real activation data from a trained AlexNet.
 * These are hand-designed patterns chosen to make the *mechanism* legible.
 */

/** Stable pseudo-random in [0,1) so visuals don't flicker between renders. */
function hash(x, y, seed = 0) {
  const n = Math.sin(x * 127.1 + y * 311.7 + seed * 74.7) * 43758.5453
  return n - Math.floor(n)
}

/**
 * The conceptual "image patch" the Conv1 demo scans: a soft diagonal edge
 * between a warm and a cool region, plus mild texture. Returns rows of
 * {r,g,b} in 0..1 plus a luminance value.
 */
export function makePatchRGB(size) {
  const rows = []
  for (let y = 0; y < size; y++) {
    const row = []
    for (let x = 0; x < size; x++) {
      // Diagonal boundary -> gives filters a real edge + colour transition.
      const t = (x - y) / size
      const edge = 1 / (1 + Math.exp(-t * 7))
      const grain = (hash(x, y, 3) - 0.5) * 0.14
      const r = Math.min(1, Math.max(0, 0.22 + edge * 0.68 + grain))
      const g = Math.min(1, Math.max(0, 0.30 + edge * 0.34 + grain))
      const b = Math.min(1, Math.max(0, 0.68 - edge * 0.50 + grain))
      row.push({ r, g, b, lum: 0.299 * r + 0.587 * g + 0.114 * b })
    }
    rows.push(row)
  }
  return rows
}

/**
 * Three representative Conv1-style filters applied to the patch.
 * kind: 'edge' | 'color' | 'texture'
 */
export function filterResponse(patch, kind, cx, cy, win) {
  const size = patch.length
  const at = (x, y) => patch[Math.min(size - 1, Math.max(0, y))][Math.min(size - 1, Math.max(0, x))]
  let acc = 0
  let n = 0
  for (let j = 0; j < win; j++) {
    for (let i = 0; i < win; i++) {
      const px = at(cx + i, cy + j)
      const u = i / (win - 1) - 0.5
      const v = j / (win - 1) - 0.5
      if (kind === 'edge') {
        // Oriented derivative: strong where luminance changes along the diagonal.
        acc += px.lum * (u - v)
      } else if (kind === 'color') {
        // Red-vs-blue opponency: responds to a colour transition.
        acc += (px.r - px.b) * (1 - Math.abs(u) - Math.abs(v) * 0.5)
      } else {
        // High-frequency detector: responds to fine local variation, so it
        // lights up on grain rather than on the smooth edge.
        const ripple = Math.sin((i + j) * 1.9) * Math.cos((i - j) * 1.7)
        acc += px.lum * ripple
      }
      n++
    }
  }
  const raw = acc / Math.max(1, n)
  const gain = kind === 'edge' ? 5.2 : kind === 'color' ? 3.4 : 9.0
  // ReLU, as used throughout AlexNet: negative responses are clamped to zero.
  return Math.max(0, raw * gain + 0.5)
}

/**
 * A whole conceptual feature map for one filter kind.
 *
 * The raw responses are then stretched to the full 0..1 range. Without this the
 * maps look nearly uniform, which would hide the very thing this step teaches:
 * different filters respond to different structure.
 */
export function makeFeatureMap(patch, kind, out) {
  const size = patch.length
  const win = 11
  // Sample the window centres across the patch so the map covers the whole image.
  const span = Math.max(1, size - win)
  const grid = []
  let lo = Infinity
  let hi = -Infinity
  for (let oy = 0; oy < out; oy++) {
    const row = []
    for (let ox = 0; ox < out; ox++) {
      const x = Math.round((ox / Math.max(1, out - 1)) * span)
      const y = Math.round((oy / Math.max(1, out - 1)) * span)
      const v = filterResponse(patch, kind, x, y, win)
      if (v < lo) lo = v
      if (v > hi) hi = v
      row.push(v)
    }
    grid.push(row)
  }
  const range = hi - lo
  if (range < 1e-6) return grid
  return grid.map((row) => row.map((v) => (v - lo) / range))
}

/**
 * 5 × 5 activation grid for the pooling demo.
 *
 * With a 3 × 3 window and stride 2 this gives exactly a 2 × 2 output —
 * AlexNet's real pooling geometry, and small enough to follow on a projector.
 * Values are fixed so each window's maximum is unambiguous.
 */
export const POOL_INPUT = [
  [0.12, 0.91, 0.33, 0.24, 0.38],
  [0.55, 0.21, 0.33, 0.67, 0.86],
  [0.42, 0.19, 0.28, 0.45, 0.31],
  [0.84, 0.30, 0.41, 0.16, 0.29],
  [0.22, 0.47, 0.35, 0.58, 0.73],
]

export const POOL_WINDOW = 3
export const POOL_STRIDE = 2

/**
 * Overlapping 3 × 3 max-pooling with stride 2 over POOL_INPUT.
 *
 * Because stride (2) is smaller than the window (3), neighbouring windows share
 * a column/row — this is exactly what "overlapping max-pooling" means, and the
 * demo highlights that overlap.
 */
export function poolRegions() {
  const n = POOL_INPUT.length
  const out = Math.floor((n - POOL_WINDOW) / POOL_STRIDE) + 1 // (5-3)/2+1 = 2
  const regions = []
  for (let by = 0; by < out; by++) {
    for (let bx = 0; bx < out; bx++) {
      const x0 = bx * POOL_STRIDE
      const y0 = by * POOL_STRIDE
      let best = -Infinity
      let bestCell = null
      for (let j = 0; j < POOL_WINDOW; j++) {
        for (let i = 0; i < POOL_WINDOW; i++) {
          const v = POOL_INPUT[y0 + j][x0 + i]
          if (v > best) {
            best = v
            bestCell = [x0 + i, y0 + j]
          }
        }
      }
      regions.push({ bx, by, x0, y0, max: best, maxCell: bestCell })
    }
  }
  return regions
}

/**
 * Abstraction ladder for the deeper-layers step. Each stage renders as a small
 * grid; values get blockier and sparser with depth to suggest growing
 * abstraction and shrinking spatial size.
 */
export const DEEP_STAGES = [
  { id: 'conv2', label: 'Conv2', dims: '27 × 27 × 256', caption: 'Edges combine into textures', res: 12, scale: 1.0 },
  { id: 'conv3', label: 'Conv3', dims: '13 × 13 × 384', caption: 'Textures combine into shapes', res: 9, scale: 0.86 },
  { id: 'conv4', label: 'Conv4', dims: '13 × 13 × 384', caption: 'Shapes grow more complex', res: 7, scale: 0.74 },
  { id: 'conv5', label: 'Conv5', dims: '13 × 13 × 256', caption: 'More complex, object-related patterns', res: 5, scale: 0.62 },
]

/** Conceptual map for a deep stage: lower res + sparser, blobbier activations. */
export function makeDeepMap(res, seed) {
  const grid = []
  for (let y = 0; y < res; y++) {
    const row = []
    for (let x = 0; x < res; x++) {
      const u = x / res
      const v = y / res
      // A couple of smooth blobs plus sparsity => "abstract" look.
      const blob =
        Math.exp(-(((u - 0.35) ** 2 + (v - 0.4) ** 2) / 0.05)) +
        0.8 * Math.exp(-(((u - 0.7) ** 2 + (v - 0.68) ** 2) / 0.03))
      const noise = hash(x, y, seed) * 0.5
      let val = blob * 0.8 + noise
      if (val < 0.28) val = 0 // ReLU-like sparsity
      row.push(Math.min(1, val))
    }
    grid.push(row)
  }
  return grid
}
