import type { CardCornerDetection, PocketSeat } from './card-corner-detection'

export type CardRank = 'A' | 'K' | 'Q' | 'J' | 'T' | '9' | '8' | '7' | '6' | '5' | '4' | '3' | '2' | '?'
export type CardSuit = 'S' | 'H' | 'D' | 'C' | '?'

export interface RecognizedCard {
  seat: PocketSeat
  index: number
  rank: CardRank
  suit: CardSuit
  confidence: number
  token: string
}

const RANK_TEMPLATES: Record<Exclude<CardRank, '?'>, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '3': ['11110', '00001', '00001', '01110', '00001', '00001', '11110'],
  '2': ['01110', '10001', '00001', '00010', '00100', '01000', '11111'],
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function extractBinaryMask(
  imageData: ImageData,
  bounds: CardCornerDetection['bounds'],
): { dark: Uint8Array; redDark: Uint8Array; width: number; height: number } {
  const width = bounds.width
  const height = bounds.height
  const dark = new Uint8Array(width * height)
  const redDark = new Uint8Array(width * height)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const px = bounds.x + x
      const py = bounds.y + y
      const offset = (py * imageData.width + px) * 4
      const r = imageData.data[offset]
      const g = imageData.data[offset + 1]
      const b = imageData.data[offset + 2]
      const brightness = (r + g + b) / 3

      const idx = y * width + x
      if (brightness < 180) {
        dark[idx] = 1
      }

      if (brightness < 180 && r > g * 1.15 && r > b * 1.15) {
        redDark[idx] = 1
      }
    }
  }

  return { dark, redDark, width, height }
}

function downsampleBinary(
  binary: Uint8Array,
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number,
  crop: { x: number; y: number; width: number; height: number },
): string[] {
  const rows: string[] = []

  for (let ty = 0; ty < targetHeight; ty += 1) {
    let row = ''

    for (let tx = 0; tx < targetWidth; tx += 1) {
      const startX = Math.floor(crop.x + (tx * crop.width) / targetWidth)
      const endX = Math.floor(crop.x + ((tx + 1) * crop.width) / targetWidth)
      const startY = Math.floor(crop.y + (ty * crop.height) / targetHeight)
      const endY = Math.floor(crop.y + ((ty + 1) * crop.height) / targetHeight)

      let pixels = 0
      let darkPixels = 0

      for (let y = startY; y < Math.max(startY + 1, endY); y += 1) {
        for (let x = startX; x < Math.max(startX + 1, endX); x += 1) {
          const cx = clamp(x, 0, srcWidth - 1)
          const cy = clamp(y, 0, srcHeight - 1)
          const idx = cy * srcWidth + cx
          darkPixels += binary[idx]
          pixels += 1
        }
      }

      row += darkPixels / Math.max(1, pixels) > 0.35 ? '1' : '0'
    }

    rows.push(row)
  }

  return rows
}

function bitmapSimilarity(a: string[], b: string[]): number {
  let equal = 0
  let total = 0

  for (let y = 0; y < a.length; y += 1) {
    for (let x = 0; x < a[y].length; x += 1) {
      if (a[y][x] === b[y][x]) {
        equal += 1
      }

      total += 1
    }
  }

  return equal / Math.max(1, total)
}

function recognizeRank(
  dark: Uint8Array,
  width: number,
  height: number,
): { rank: CardRank; confidence: number } {
  // Bridge card corners usually show rank above suit symbol.
  // Keep rank sampling in the upper half to reduce suit-shape bleed-in.
  const rankCrop = {
    x: 0,
    y: 0,
    width: Math.max(1, Math.floor(width * 0.72)),
    height: Math.max(1, Math.floor(height * 0.5)),
  }

  const observed = downsampleBinary(dark, width, height, 5, 7, rankCrop)

  let bestRank: CardRank = '?'
  let bestScore = 0

  for (const [rank, template] of Object.entries(RANK_TEMPLATES) as Array<[Exclude<CardRank, '?'>, string[]]>) {
    const score = bitmapSimilarity(observed, template)
    if (score > bestScore) {
      bestScore = score
      bestRank = rank
    }
  }

  if (bestScore < 0.58) {
    return { rank: '?', confidence: bestScore }
  }

  return { rank: bestRank, confidence: bestScore }
}

function recognizeSuit(
  dark: Uint8Array,
  redDark: Uint8Array,
  width: number,
  height: number,
): { suit: CardSuit; confidence: number } {
  // For stacked rank-over-suit printing, sample the lower part of the corner.
  const suitCrop = {
    x: Math.max(0, Math.floor(width * 0.12)),
    y: Math.max(0, Math.floor(height * 0.5)),
    width: Math.max(1, Math.floor(width * 0.7)),
    height: Math.max(1, Math.floor(height * 0.5)),
  }

  const suitBitmap = downsampleBinary(dark, width, height, 5, 5, suitCrop)

  let blackPixels = 0
  let redPixels = 0
  for (let y = suitCrop.y; y < suitCrop.y + suitCrop.height; y += 1) {
    for (let x = suitCrop.x; x < suitCrop.x + suitCrop.width; x += 1) {
      const idx = y * width + x
      blackPixels += dark[idx]
      redPixels += redDark[idx]
    }
  }

  const darkPixels = Math.max(1, blackPixels)
  const redRatio = redPixels / darkPixels
  const row1 = suitBitmap[1].split('').reduce((sum, value) => sum + Number(value), 0)
  const row2 = suitBitmap[2].split('').reduce((sum, value) => sum + Number(value), 0)
  const row4 = suitBitmap[4].split('').reduce((sum, value) => sum + Number(value), 0)

  if (blackPixels < 2) {
    return { suit: '?', confidence: 0 }
  }

  if (redRatio > 0.3) {
    // Hearts usually have broader upper rows than diamonds.
    if (row1 >= 3 && row2 >= 3) {
      return { suit: 'H', confidence: 0.7 }
    }

    return { suit: 'D', confidence: 0.65 }
  }

  // Clubs tend to have a heavier lower lobe area than spades.
  if (row4 >= 3) {
    return { suit: 'C', confidence: 0.65 }
  }

  return { suit: 'S', confidence: 0.68 }
}

export function recognizeCardsFromCorners(
  imageData: ImageData,
  cornerDetections: CardCornerDetection[],
): RecognizedCard[] {
  const cards: RecognizedCard[] = []

  for (const corner of cornerDetections) {
    if (!corner.visible) {
      continue
    }

    const { dark, redDark, width, height } = extractBinaryMask(imageData, corner.bounds)
    const rankResult = recognizeRank(dark, width, height)
    const suitResult = recognizeSuit(dark, redDark, width, height)

    let suit: CardSuit = suitResult.suit
    let suitConfidence = suitResult.confidence

    if (suit === '?') {
      if (corner.suitHint === 'red') {
        suit = 'H'
        suitConfidence = Math.max(suitConfidence, 0.45)
      } else if (corner.suitHint === 'black') {
        suit = 'S'
        suitConfidence = Math.max(suitConfidence, 0.45)
      }
    }

    const confidence = Math.max(0, Math.min(1, (rankResult.confidence + suitConfidence) / 2))

    cards.push({
      seat: corner.seat,
      index: corner.index,
      rank: rankResult.rank,
      suit,
      confidence,
      token: `${rankResult.rank}${suit}`,
    })
  }

  return cards
}
