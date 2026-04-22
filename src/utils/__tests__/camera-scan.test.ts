import { describe, expect, it } from 'vitest'
import { detectPocketColorsFromImageData } from '../camera-scan'

type ImageDataLike = {
  width: number
  height: number
  data: Uint8ClampedArray
}

function createUniformImageData(width: number, height: number, rgba: [number, number, number, number]): ImageDataLike {
  const data = new Uint8ClampedArray(width * height * 4)

  for (let i = 0; i < data.length; i += 4) {
    data[i] = rgba[0]
    data[i + 1] = rgba[1]
    data[i + 2] = rgba[2]
    data[i + 3] = rgba[3]
  }

  return {
    width,
    height,
    data,
  }
}

function paintRect(
  imageData: ImageDataLike,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  rgba: [number, number, number, number],
): void {
  const { width, data } = imageData

  for (let y = startY; y < endY; y += 1) {
    for (let x = startX; x < endX; x += 1) {
      const offset = (y * width + x) * 4
      data[offset] = rgba[0]
      data[offset + 1] = rgba[1]
      data[offset + 2] = rgba[2]
      data[offset + 3] = rgba[3]
    }
  }
}

describe('detectPocketColorsFromImageData', () => {
  it('extracts expected seat colors from sampled regions', () => {
    const imageData = createUniformImageData(100, 100, [40, 40, 40, 255])

    // North
    paintRect(imageData, 40, 10, 60, 30, [220, 20, 20, 255])
    // East
    paintRect(imageData, 70, 40, 90, 60, [20, 190, 20, 255])
    // South
    paintRect(imageData, 40, 70, 60, 90, [230, 230, 230, 255])
    // West
    paintRect(imageData, 10, 40, 30, 60, [35, 35, 35, 255])

    const scan = detectPocketColorsFromImageData(imageData as unknown as ImageData)

    expect(scan).toEqual({
      north: 'red',
      east: 'green',
      south: 'white',
      west: 'unknown',
    })
  })
})
