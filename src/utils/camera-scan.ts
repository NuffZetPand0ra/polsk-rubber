import type { PocketColorScan, ScanColor } from './handscan'

interface Rgb {
  r: number
  g: number
  b: number
}

const SAMPLE_POINTS: Record<keyof PocketColorScan, { x: number; y: number }> = {
  north: { x: 0.5, y: 0.2 },
  east: { x: 0.8, y: 0.5 },
  south: { x: 0.5, y: 0.8 },
  west: { x: 0.2, y: 0.5 },
}

function classifyRgbColor({ r, g, b }: Rgb): ScanColor {
  if (r > 140 && r > g * 1.35 && r > b * 1.35) {
    return 'red'
  }

  if (g > 120 && g > r * 1.2 && g > b * 1.2) {
    return 'green'
  }

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  if (r > 170 && g > 170 && b > 170 && max - min < 45) {
    return 'white'
  }

  return 'unknown'
}

function readAverageRgb(
  imageData: ImageData,
  centerX: number,
  centerY: number,
  radius: number,
): Rgb {
  const { width, height, data } = imageData

  const minX = Math.max(0, Math.floor(centerX - radius))
  const maxX = Math.min(width - 1, Math.ceil(centerX + radius))
  const minY = Math.max(0, Math.floor(centerY - radius))
  const maxY = Math.min(height - 1, Math.ceil(centerY + radius))

  let r = 0
  let g = 0
  let b = 0
  let count = 0

  for (let y = minY; y <= maxY; y += 1) {
    for (let x = minX; x <= maxX; x += 1) {
      const offset = (y * width + x) * 4
      r += data[offset]
      g += data[offset + 1]
      b += data[offset + 2]
      count += 1
    }
  }

  if (count === 0) {
    return { r: 0, g: 0, b: 0 }
  }

  return {
    r: r / count,
    g: g / count,
    b: b / count,
  }
}

export function detectPocketColorsFromImageData(imageData: ImageData): PocketColorScan {
  const radius = Math.floor(Math.min(imageData.width, imageData.height) * 0.08)

  return {
    north: classifyRgbColor(
      readAverageRgb(
        imageData,
        imageData.width * SAMPLE_POINTS.north.x,
        imageData.height * SAMPLE_POINTS.north.y,
        radius,
      ),
    ),
    east: classifyRgbColor(
      readAverageRgb(
        imageData,
        imageData.width * SAMPLE_POINTS.east.x,
        imageData.height * SAMPLE_POINTS.east.y,
        radius,
      ),
    ),
    south: classifyRgbColor(
      readAverageRgb(
        imageData,
        imageData.width * SAMPLE_POINTS.south.x,
        imageData.height * SAMPLE_POINTS.south.y,
        radius,
      ),
    ),
    west: classifyRgbColor(
      readAverageRgb(
        imageData,
        imageData.width * SAMPLE_POINTS.west.x,
        imageData.height * SAMPLE_POINTS.west.y,
        radius,
      ),
    ),
  }
}
