/**
 * AlexNet architecture data model.
 *
 * Numbers marked `paper: true` come from Krizhevsky, Sutskever & Hinton (2012),
 * "ImageNet Classification with Deep Convolutional Neural Networks".
 * Geometry (size/x position) is chosen for legibility, NOT to scale.
 */

export const PALETTE = {
  input: '#8fa6c4',
  conv: '#4ea8ff',
  pool: '#3ddc97',
  dense: '#ff9f45',
  /** Softmax: a mathematical function, not a learned layer. */
  softmax: '#7f8da3',
  output: '#b57bff',
}

export const LEGEND = [
  { color: PALETTE.conv, label: 'Convolutional processing' },
  { color: PALETTE.pool, label: 'Pooling' },
  { color: PALETTE.dense, label: 'Dense / fully connected' },
  { color: PALETTE.softmax, label: 'Softmax function (not a learned layer)' },
  { color: PALETTE.output, label: 'Classification output' },
]

/**
 * Each layer: id, label, kind, x position, and block geometry.
 * `planes` = how many translucent slabs we draw (a visual sample, not the real
 * channel count). `dims` is the real tensor shape from the paper.
 */
export const LAYERS = [
  {
    id: 'input',
    label: 'Input',
    kind: 'input',
    x: -26,
    dims: '224 × 224 × 3',
    detail: 'RGB image',
    planes: 3,
    size: [6.4, 6.4],
    depth: 1.1,
  },
  {
    id: 'conv1',
    label: 'Conv1',
    kind: 'conv',
    x: -20,
    dims: '55 × 55 × 96',
    detail: '11 × 11 filters, stride 4',
    planes: 8,
    size: [5.4, 5.4],
    depth: 2.6,
  },
  {
    id: 'pool1',
    label: 'Pool1',
    kind: 'pool',
    x: -15.4,
    dims: '27 × 27 × 96',
    detail: '3 × 3 window, stride 2',
    planes: 8,
    size: [4.0, 4.0],
    depth: 1.7,
  },
  {
    id: 'conv2',
    label: 'Conv2',
    kind: 'conv',
    x: -10.6,
    dims: '27 × 27 × 256',
    detail: '5 × 5 filters',
    planes: 10,
    size: [3.9, 3.9],
    depth: 3.0,
  },
  {
    id: 'pool2',
    label: 'Pool2',
    kind: 'pool',
    x: -6.0,
    dims: '13 × 13 × 256',
    detail: '3 × 3 window, stride 2',
    planes: 10,
    size: [2.9, 2.9],
    depth: 2.0,
  },
  {
    id: 'conv3',
    label: 'Conv3',
    kind: 'conv',
    x: -1.8,
    dims: '13 × 13 × 384',
    detail: '3 × 3 filters',
    planes: 12,
    size: [2.8, 2.8],
    depth: 2.6,
  },
  {
    id: 'conv4',
    label: 'Conv4',
    kind: 'conv',
    x: 2.0,
    dims: '13 × 13 × 384',
    detail: '3 × 3 filters',
    planes: 12,
    size: [2.8, 2.8],
    depth: 2.6,
  },
  {
    id: 'conv5',
    label: 'Conv5',
    kind: 'conv',
    x: 5.8,
    dims: '13 × 13 × 256',
    detail: '3 × 3 filters',
    planes: 10,
    size: [2.8, 2.8],
    depth: 2.2,
  },
  {
    id: 'pool5',
    label: 'Pool5',
    kind: 'pool',
    x: 9.4,
    dims: '6 × 6 × 256',
    detail: '3 × 3 window, stride 2',
    planes: 10,
    size: [1.9, 1.9],
    depth: 1.8,
  },
  {
    id: 'fc6',
    label: 'Dense 1 / FC6',
    kind: 'dense',
    x: 13.2,
    labelDrop: 0.0,
    dims: '4,096 units',
    detail: 'Fully connected',
    nodes: 14,
    size: [0.9, 6.0],
    depth: 0.9,
  },
  {
    id: 'fc7',
    label: 'Dense 2 / FC7',
    kind: 'dense',
    x: 16.6,
    labelDrop: 1.15,
    dims: '4,096 units',
    detail: 'Fully connected',
    nodes: 14,
    size: [0.9, 6.0],
    depth: 0.9,
  },
  {
    // The third and final fully connected layer. It is the last layer with
    // learned weights: it produces one raw score (logit) per class.
    id: 'fc8',
    label: 'Dense 3 / FC8',
    kind: 'dense',
    x: 20.2,
    labelDrop: 0.0,
    dims: '1,000 class scores / logits',
    detail: 'Fully connected · learned',
    nodes: 11,
    size: [0.9, 5.4],
    depth: 0.9,
  },
  {
    // NOT a layer. Softmax is a fixed mathematical function with no weights and
    // nothing learned, so it is drawn as a small processing block rather than
    // as another column of neurons.
    id: 'softmax',
    label: 'Softmax',
    kind: 'function',
    x: 24.4,
    labelDrop: 2.0,
    dims: 'mathematical function',
    detail: 'Converts scores into probabilities',
    size: [1.9, 1.9],
    depth: 1.0,
  },
  {
    // The result of applying softmax: a probability per class, summing to 1.
    id: 'output',
    label: 'Class probabilities',
    kind: 'output',
    x: 28.6,
    labelDrop: 0.35,
    dims: '1,000 probabilities',
    detail: 'Normalized · sums to 1',
    bars: 7,
    size: [2.2, 4.6],
    depth: 0.6,
  },
]

/**
 * How deep each block is drawn.
 *
 * 'schematic' = the hand-picked depths (legible, not to scale).
 * 'sqrt'      = channel count, square-rooted so every block stays visible.
 * 'linear'    = depth directly proportional to the channel count (true ratios).
 *
 * Channel counts run from 3 (the RGB input) to 384 — a factor of 128. Mapped
 * linearly the input image would be 0.09 units deep and effectively invisible,
 * while Conv3/Conv4 would dwarf everything else. So 'sqrt' maps the channel
 * count through a square root: the ordering 3 < 96 < 256 < 384 is preserved and
 * still readable, but every block stays visible.
 */
export const DEPTH_MODES = ['schematic', 'sqrt', 'linear']

/** Channel count parsed from 'H × W × C'; null for dense/softmax/output. */
function channelsOf(dims) {
  const m = dims.match(/(\d[\d,]*)\s*×\s*(\d[\d,]*)\s*×\s*(\d[\d,]*)/)
  return m ? Number(m[3].replace(/,/g, '')) : null
}

const MAX_CH = 384
const MAX_DEPTH = 9.5

/**
 * Linear scale: depth is directly proportional to the channel count, with no
 * correction at all. One channel = LINEAR_UNIT units of depth.
 *
 * This is the honest mapping and the default: the 128× span between the RGB
 * input (3 channels) and Conv3/Conv4 (384) is the point being made, so the thin
 * input block is the message rather than a defect. The 'sqrt' mode stays
 * available for when the ordering matters more than the ratios.
 */
const LINEAR_UNIT = 0.03

/** A layer's depth in the given mode. */
export function depthOf(layer, mode) {
  if (mode === 'schematic') return layer.depth
  const ch = channelsOf(layer.dims)
  if (!ch) return layer.depth
  if (mode === 'linear') return ch * LINEAR_UNIT
  // 'sqrt': compress the 128× span so every block stays visible.
  return Math.max(0.5, Math.sqrt(ch / MAX_CH) * MAX_DEPTH)
}

/** Channel count for labelling, when the layer has one. */
export function channelsForLabel(layer) {
  return channelsOf(layer.dims)
}

/**
 * Layer positions for a depth mode.
 *
 * In the scaled modes the blocks get much deeper, so the spacing has to grow with
 * them — otherwise Conv3 and Conv4 intersect. The gaps between blocks stay the
 * same as in schematic mode and only the depths change, which makes the whole
 * model longer.
 */
export function layoutFor(mode) {
  if (mode === 'schematic') {
    return LAYERS.map((l) => ({ ...l, depth: l.depth, x: l.x }))
  }
  const out = []
  let cursor = LAYERS[0].x - depthOf(LAYERS[0], mode) / 2
  for (let i = 0; i < LAYERS.length; i++) {
    const l = LAYERS[i]
    const d = depthOf(l, mode)
    out.push({ ...l, depth: d, x: cursor + d / 2 })
    if (i < LAYERS.length - 1) {
      // Keep the original gap between this block and the next.
      const gap = LAYERS[i + 1].x - LAYERS[i + 1].depth / 2 - (l.x + l.depth / 2)
      cursor += d + Math.max(0.9, gap)
    }
  }
  return out
}

/** Visible extent of a layout, used to fit the camera. */
export function extentOf(layout) {
  const lo = Math.min(...layout.map((l) => l.x - Math.max(l.depth / 2, l.size[0] / 2)))
  const hi = Math.max(...layout.map((l) => l.x + Math.max(l.depth / 2, l.size[0] / 2)))
  return { lo, hi, width: hi - lo, centre: (lo + hi) / 2 }
}

/**
 * Translate a tour camera into one of the scaled depth modes.
 *
 * Steps are authored in schematic coordinates. In real mode the layers move, so
 * the look-at point is recomputed from the new layer positions and the distance
 * is scaled by how much wider the model became.
 */
export function cameraFor(step, mode, layout) {
  if (mode === 'schematic') return step.camera

  const schem = extentOf(layoutFor('schematic'))
  const real = extentOf(layout)
  const k = real.width / schem.width

  // Blickpunkt: Mitte der fokussierten Layer im neuen Layout.
  const byId = Object.fromEntries(layout.map((l) => [l.id, l]))
  let tx
  if (step.focus && step.focus.length) {
    const xs = step.focus.map((id) => byId[id]?.x).filter((v) => v != null)
    tx = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : real.centre
    // Keep the same sideways offset so the demo panel stays clear.
    const schemById = Object.fromEntries(layoutFor('schematic').map((l) => [l.id, l]))
    const sxs = step.focus.map((id) => schemById[id]?.x).filter((v) => v != null)
    if (sxs.length) {
      const sMid = (Math.min(...sxs) + Math.max(...sxs)) / 2
      tx += (step.camera.target[0] - sMid) * k
    }
  } else {
    tx = real.centre
  }

  const camOffsetX = (step.camera.position[0] - step.camera.target[0]) * k

  // Close-ups frame only a few layers, so scaling their distance by the full
  // width ratio pushes the camera much too far back — the blocks end up small
  // and the extra depth is wasted. Wide shots still need the full factor.
  const zScale = step.camera.fitWidth ? k : 1 + (k - 1) * 0.45
  const z = step.camera.position[2] * zScale

  // Swing the camera round to a three-quarter view. Straight on, extra depth
  // just reads as extra spacing — the blocks have to be seen at an angle for
  // the channel count to be legible as depth at all.
  const swing = 0.42 // radians off the straight-on axis
  const dx = tx + camOffsetX - tx
  const radius = Math.hypot(dx, z)
  const baseAngle = Math.atan2(dx, z)
  const a = baseAngle + swing

  return {
    ...step.camera,
    position: [tx + Math.sin(a) * radius, step.camera.position[1] * 1.15, Math.cos(a) * radius],
    target: [tx, step.camera.target[1], step.camera.target[2]],
    fitWidth: step.camera.fitWidth ? real.width * 0.94 : undefined,
    minZ: step.camera.minZ ? step.camera.minZ * k : undefined,
  }
}

export const LAYER_BY_ID = Object.fromEntries(LAYERS.map((l) => [l.id, l]))

/** Layers that carry the two-GPU split in the original paper. */
export const GPU_SPLIT_LAYERS = new Set([
  'conv1',
  'pool1',
  'conv2',
  'pool2',
  'conv3',
  'conv4',
  'conv5',
  'pool5',
])

/**
 * Guided tour. `camera` = {position, target} in world space.
 * `focus` = which layer ids stay lit; everything else dims.
 * `panel` = which 2D overlay demo renders, if any.
 */
export const TOUR = [
  {
    id: 'overview',
    title: 'Overview',
    headline:
      'AlexNet contains five convolutional layers followed by three fully connected layers.',
    facts: [
      'Input: 224 × 224 × 3',
      'Five convolutional layers · three fully connected layers',
      'The final fully connected layer produces 1,000 class scores',
      'Softmax then converts these scores into probabilities',
    ],
    camera: { position: [0.25, 2.8, 55], target: [0.25, -2.5, 0], fitWidth: 58.9, minZ: 38 },
    focus: null,
    panel: null,
    showGpuLanes: true,
  },
  {
    id: 'input',
    title: 'The input image',
    headline:
      'The model never receives the concept “dog.” It receives numbers describing colour and brightness.',
    facts: ['224 × 224 × 3 numerical pixel values'],
    camera: { position: [-30.5, 3.2, 16.5], target: [-26.2, -1.2, 0] },
    focus: ['input'],
    panel: 'input',
  },
  {
    id: 'conv1',
    title: 'Conv1 and the 11 × 11 filter',
    headline:
      'A filter scans local regions of the image and responds to a specific visual pattern.',
    facts: ['Conv1 filter: 11 × 11 × 3', 'Stride: 4'],
    camera: { position: [-26.5, 3.4, 18.5], target: [-22.6, -1.2, 0] },
    focus: ['input', 'conv1'],
    panel: 'convolution',
  },
  {
    id: 'featuremaps',
    title: 'Feature maps',
    headline:
      'One filter produces one feature map. Many filters produce many feature maps.',
    facts: ['AlexNet Conv1: 96 learned filters'],
    camera: { position: [-24.2, 3.4, 16.5], target: [-20.6, -1.2, 0] },
    focus: ['conv1'],
    panel: 'featuremaps',
  },
  {
    id: 'pool1',
    title: 'Pooling',
    headline: 'Max-pooling reduces spatial size and keeps the strongest activation.',
    facts: ['AlexNet uses overlapping max-pooling', '3 × 3 pooling window, stride 2'],
    camera: { position: [-21.6, 3.2, 15.5], target: [-17.8, -1.2, 0] },
    focus: ['conv1', 'pool1'],
    panel: 'pooling',
  },
  {
    id: 'deep',
    title: 'Deeper convolutional layers',
    headline:
      'As the network gets deeper, spatial dimensions generally shrink, while the number of feature channels changes to support richer representations.',
    facts: ['Geometry → textures → shapes → object-related features'],
    camera: { position: [0.5, 4.0, 30.0], target: [1.5, -1.6, 0], fitWidth: 42, minZ: 22 },
    focus: ['conv2', 'pool2', 'conv3', 'conv4', 'conv5', 'pool5'],
    panel: 'deep',
  },
  {
    id: 'dense',
    title: 'Dense layers',
    headline:
      'In a dense layer, every neuron is connected to every neuron in the previous layer.',
    facts: [
      'Dense 1 / FC6: 4,096 learned units',
      'Dense 2 / FC7: 4,096 learned units',
      'Dense 3 / FC8: 1,000 class scores / logits',
      'Representative connections shown',
    ],
    camera: { position: [17.5, 4.2, 27.0], target: [18.6, -1.4, 0] },
    focus: ['pool5', 'fc6', 'fc7', 'fc8'],
    panel: 'dense',
  },
  {
    id: 'output',
    title: 'Classification',
    headline:
      'The final fully connected layer produces 1,000 class scores. Softmax then converts these scores into probabilities.',
    facts: [
      'Dense 3 / FC8: 1,000 class scores / logits',
      'Softmax function — converts scores into probabilities',
      '1,000 class probabilities',
    ],
    camera: { position: [26.5, 4.4, 27.0], target: [27.2, -1.6, 0] },
    focus: ['fc8', 'softmax', 'output'],
    panel: 'softmax',
  },
]

/** Illustrative only — not the output of a trained network. */
export const SOFTMAX_CLASSES = [
  { label: 'dog', p: 0.72 },
  { label: 'wolf', p: 0.11 },
  { label: 'fox', p: 0.06 },
  { label: 'cat', p: 0.04 },
  { label: 'rabbit', p: 0.03 },
  { label: 'other 995 classes', p: 0.04 },
]

/** Map a clicked layer id to the tour step that best explains it. */
export const LAYER_TO_STEP = {
  input: 1,
  conv1: 2,
  pool1: 4,
  conv2: 5,
  pool2: 5,
  conv3: 5,
  conv4: 5,
  conv5: 5,
  pool5: 5,
  fc6: 6,
  fc7: 6,
  fc8: 6,
  softmax: 7,
  output: 7,
}
