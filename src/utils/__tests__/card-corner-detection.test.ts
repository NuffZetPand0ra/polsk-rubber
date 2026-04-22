import { describe, expect, it } from 'vitest'
import { detectCardCornersFromImageData } from '../card-corner-detection'

type ImageDataLike = {
  width: number
  height: number
  data: Uint8ClampedArray
}

function createBlankImageData(width: number, height: number, value: number): ImageDataLike {
  const data = new Uint8ClampedArray(width * height * 4)

  for (let i = 0; i < data.length; i += 4) {
    data[i] = value
    data[i + 1] = value
    data[i + 2] = value
    data[i + 3] = 255
  }

  return { width, height, data }
}

function paintRect(
  imageData: ImageDataLike,
  x: number,
  y: number,
  w: number,
  h: number,
  rgb: [number, number, number],
): void {
  const minX = Math.max(0, x)
  const minY = Math.max(0, y)
  const maxX = Math.min(imageData.width, x + w)
  const maxY = Math.min(imageData.height, y + h)

  for (let py = minY; py < maxY; py += 1) {
    for (let px = minX; px < maxX; px += 1) {
      const offset = (py * imageData.width + px) * 4
      imageData.data[offset] = rgb[0]
      imageData.data[offset + 1] = rgb[1]
      imageData.data[offset + 2] = rgb[2]
      imageData.data[offset + 3] = 255
    }
  }
}

describe('detectCardCornersFromImageData', () => {
  it('finds visible card corners and color hints in seat zones', () => {
    const imageData = createBlankImageData(200, 200, 245)

    // North seat first corner slot (red ink)
    paintRect(imageData, 30, 4, 10, 18, [180, 20, 20])
    // East seat first slot (black ink)
    paintRect(imageData, 188, 30, 8, 18, [20, 20, 20])

    const detections = detectCardCornersFromImageData(imageData as unknown as ImageData, 13)

    const north0 = detections.find((entry) => entry.seat === 'north' && entry.index === 0)
    const east0 = detections.find((entry) => entry.seat === 'east' && entry.index === 0)

    expect(north0?.visible).toBe(true)
    expect(north0?.suitHint).toBe('red')

    expect(east0?.visible).toBe(true)
    expect(east0?.suitHint).toBe('black')
  })
})
