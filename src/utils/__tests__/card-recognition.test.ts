import { describe, expect, it } from 'vitest'
import { recognizeCardsFromCorners } from '../card-recognition'
import type { CardCornerDetection } from '../card-corner-detection'

type ImageDataLike = {
  width: number
  height: number
  data: Uint8ClampedArray
}

function createImage(width: number, height: number, gray: number): ImageDataLike {
  const data = new Uint8ClampedArray(width * height * 4)

  for (let i = 0; i < data.length; i += 4) {
    data[i] = gray
    data[i + 1] = gray
    data[i + 2] = gray
    data[i + 3] = 255
  }

  return { width, height, data }
}

function paintPixel(image: ImageDataLike, x: number, y: number, rgb: [number, number, number]): void {
  const offset = (y * image.width + x) * 4
  image.data[offset] = rgb[0]
  image.data[offset + 1] = rgb[1]
  image.data[offset + 2] = rgb[2]
  image.data[offset + 3] = 255
}

function paintBitmap(
  image: ImageDataLike,
  rect: { x: number; y: number; width: number; height: number },
  bitmap: string[],
  rgb: [number, number, number],
): void {
  const rows = bitmap.length
  const cols = bitmap[0].length

  for (let gy = 0; gy < rows; gy += 1) {
    for (let gx = 0; gx < cols; gx += 1) {
      if (bitmap[gy][gx] !== '1') {
        continue
      }

      const startX = Math.floor(rect.x + (gx * rect.width) / cols)
      const endX = Math.floor(rect.x + ((gx + 1) * rect.width) / cols)
      const startY = Math.floor(rect.y + (gy * rect.height) / rows)
      const endY = Math.floor(rect.y + ((gy + 1) * rect.height) / rows)

      for (let y = startY; y < Math.max(startY + 1, endY); y += 1) {
        for (let x = startX; x < Math.max(startX + 1, endX); x += 1) {
          paintPixel(image, x, y, rgb)
        }
      }
    }
  }
}

describe('recognizeCardsFromCorners', () => {
  it('recognizes a red ace-like corner as AH', () => {
    const image = createImage(100, 100, 245)

    const corner: CardCornerDetection = {
      seat: 'north',
      index: 0,
      visible: true,
      inkRatio: 0.4,
      suitHint: 'red',
      bounds: { x: 10, y: 10, width: 20, height: 30 },
    }

    const rankBitmap = ['01110', '10001', '10001', '11111', '10001', '10001', '10001']
    const heartBitmap = ['01010', '11111', '11111', '01110', '00100']

    paintBitmap(
      image,
      { x: 10, y: 10, width: 14, height: 18 },
      rankBitmap,
      [20, 20, 20],
    )

    paintBitmap(
      image,
      { x: 12, y: 26, width: 14, height: 13 },
      heartBitmap,
      [185, 20, 20],
    )

    const cards = recognizeCardsFromCorners(image as unknown as ImageData, [corner])

    expect(cards).toHaveLength(1)
    expect(cards[0].rank).toBe('A')
    expect(cards[0].suit).toBe('H')
    expect(cards[0].token).toBe('AH')
    expect(cards[0].confidence).toBeGreaterThan(0.5)
  })

  it('ignores non-visible corners', () => {
    const image = createImage(80, 80, 245)

    const corner: CardCornerDetection = {
      seat: 'east',
      index: 2,
      visible: false,
      inkRatio: 0.01,
      suitHint: 'unknown',
      bounds: { x: 20, y: 20, width: 15, height: 20 },
    }

    const cards = recognizeCardsFromCorners(image as unknown as ImageData, [corner])
    expect(cards).toHaveLength(0)
  })

  it('reads suit from lower symbol zone when rank is above it', () => {
    const image = createImage(120, 120, 245)

    const corner: CardCornerDetection = {
      seat: 'south',
      index: 1,
      visible: true,
      inkRatio: 0.35,
      suitHint: 'black',
      bounds: { x: 20, y: 20, width: 24, height: 34 },
    }

    // Rank-like dark block in upper area.
    paintBitmap(
      image,
      { x: 20, y: 20, width: 16, height: 16 },
      ['11111', '00010', '00010', '00010', '00010', '00010', '00010'],
      [20, 20, 20],
    )

    // Suit-like club-ish blob in lower area.
    paintBitmap(
      image,
      { x: 24, y: 38, width: 14, height: 14 },
      ['00100', '01110', '11111', '01110', '00100'],
      [20, 20, 20],
    )

    const cards = recognizeCardsFromCorners(image as unknown as ImageData, [corner])

    expect(cards).toHaveLength(1)
    expect(cards[0].suit).toMatch(/S|C/)
    expect(cards[0].confidence).toBeGreaterThan(0.45)
  })
})
