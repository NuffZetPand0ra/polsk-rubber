export type PocketSeat = 'north' | 'east' | 'south' | 'west'

export interface CardCornerDetection {
  seat: PocketSeat
  index: number
  visible: boolean
  inkRatio: number
  suitHint: 'red' | 'black' | 'unknown'
  bounds: {
    x: number
    y: number
    width: number
    height: number
  }
}

interface Zone {
  x: number
  y: number
  width: number
  height: number
}

const POCKET_ZONES: Record<PocketSeat, Zone> = {
  north: { x: 0.18, y: 0.00, width: 0.67, height: 0.32 },
  east: { x: 0.66, y: 0.11, width: 0.34, height: 0.87 },
  south: { x: 0.075, y: 0.675, width: 0.78, height: 0.325 },
  west: { x: 0.00, y: 0.10, width: 0.36, height: 0.72 },
}

const SEAT_ORDER: PocketSeat[] = ['north', 'east', 'south', 'west']

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

function computeCornerBounds(
  seat: PocketSeat,
  index: number,
  maxCards: number,
  width: number,
  height: number,
): CardCornerDetection['bounds'] {
  const zone = POCKET_ZONES[seat]

  const zoneX = Math.floor(zone.x * width)
  const zoneY = Math.floor(zone.y * height)
  const zoneWidth = Math.floor(zone.width * width)
  const zoneHeight = Math.floor(zone.height * height)

  const cornerWidth = Math.max(8, Math.floor(zoneWidth * 0.08))
  const cornerHeight = Math.max(10, Math.floor(zoneHeight * 0.5))

  if (seat === 'north' || seat === 'south') {
    const step = zoneWidth / Math.max(1, maxCards - 1)
    const x = clamp(Math.round(zoneX + index * step), 0, Math.max(0, width - cornerWidth))
    const y = seat === 'north'
      ? clamp(zoneY, 0, Math.max(0, height - cornerHeight))
      : clamp(zoneY + zoneHeight - cornerHeight, 0, Math.max(0, height - cornerHeight))

    return { x, y, width: cornerWidth, height: cornerHeight }
  }

  const step = zoneHeight / Math.max(1, maxCards - 1)
  const x = seat === 'east'
    ? clamp(zoneX + zoneWidth - cornerWidth, 0, Math.max(0, width - cornerWidth))
    : clamp(zoneX, 0, Math.max(0, width - cornerWidth))
  const y = clamp(Math.round(zoneY + index * step), 0, Math.max(0, height - cornerHeight))

  return { x, y, width: cornerWidth, height: cornerHeight }
}

function computeInkAndColor(
  imageData: ImageData,
  bounds: CardCornerDetection['bounds'],
): {
  inkRatio: number
  suitHint: 'red' | 'black' | 'unknown'
} {
  const { width, data } = imageData
  const { x, y, height: h, width: w } = bounds

  let inkPixels = 0
  let total = 0
  let redDominantPixels = 0

  for (let py = y; py < y + h; py += 1) {
    for (let px = x; px < x + w; px += 1) {
      const offset = (py * width + px) * 4
      const r = data[offset]
      const g = data[offset + 1]
      const b = data[offset + 2]

      const brightness = (r + g + b) / 3
      total += 1

      // Assume printed indices and pips are darker than the white card background.
      if (brightness < 180) {
        inkPixels += 1

        if (r > g * 1.15 && r > b * 1.15) {
          redDominantPixels += 1
        }
      }
    }
  }

  if (total === 0 || inkPixels === 0) {
    return {
      inkRatio: 0,
      suitHint: 'unknown',
    }
  }

  const inkRatio = inkPixels / total
  const redRatio = redDominantPixels / inkPixels

  return {
    inkRatio,
    suitHint: redRatio > 0.35 ? 'red' : 'black',
  }
}

export function detectCardCornersFromImageData(
  imageData: ImageData,
  maxCards: number = 13,
): CardCornerDetection[] {
  const safeMaxCards = Math.max(1, Math.min(13, Math.floor(maxCards)))
  const detections: CardCornerDetection[] = []

  for (const seat of SEAT_ORDER) {
    for (let index = 0; index < safeMaxCards; index += 1) {
      const bounds = computeCornerBounds(
        seat,
        index,
        safeMaxCards,
        imageData.width,
        imageData.height,
      )
      const { inkRatio, suitHint } = computeInkAndColor(imageData, bounds)

      detections.push({
        seat,
        index,
        visible: inkRatio > 0.06,
        inkRatio,
        suitHint,
        bounds,
      })
    }
  }

  return detections
}
