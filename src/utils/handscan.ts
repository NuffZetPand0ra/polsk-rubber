import type { Seat, Vulnerability } from '../types'

export type ScanColor = 'red' | 'green' | 'white' | 'unknown'

export interface PocketColorScan {
  north: ScanColor
  east: ScanColor
  south: ScanColor
  west: ScanColor
}

export interface HandscanInference {
  vulnerability: Vulnerability | null
  confidence: number
  notes: string[]
}

const BOARD_VULNERABILITY_CYCLE: Vulnerability[] = [
  'None',
  'NS',
  'EW',
  'Both',
  'NS',
  'EW',
  'Both',
  'None',
  'EW',
  'Both',
  'None',
  'NS',
  'Both',
  'None',
  'NS',
  'EW',
]

const SEAT_KEYS: Seat[] = ['N', 'E', 'S', 'W']

function seatToKey(seat: Seat): keyof PocketColorScan {
  if (seat === 'N') {
    return 'north'
  }

  if (seat === 'E') {
    return 'east'
  }

  if (seat === 'S') {
    return 'south'
  }

  return 'west'
}

function isNonVulnerableColor(color: ScanColor): boolean {
  return color === 'green' || color === 'white'
}

function vulnerableStateBySeat(scan: PocketColorScan): Record<Seat, boolean | null> {
  const result = {} as Record<Seat, boolean | null>

  for (const seat of SEAT_KEYS) {
    const color = scan[seatToKey(seat)]

    if (color === 'red') {
      result[seat] = true
      continue
    }

    if (isNonVulnerableColor(color)) {
      result[seat] = false
      continue
    }

    result[seat] = null
  }

  return result
}

function rowConsistent(a: boolean | null, b: boolean | null): boolean {
  return a == null || b == null || a === b
}

export function getVulnerabilityFromBoardNumber(
  boardNumber: number,
): Vulnerability | null {
  if (!Number.isInteger(boardNumber) || boardNumber <= 0) {
    return null
  }

  const index = (boardNumber - 1) % BOARD_VULNERABILITY_CYCLE.length
  return BOARD_VULNERABILITY_CYCLE[index]
}

export function inferVulnerabilityFromPocketColors(scan: PocketColorScan): HandscanInference {
  const bySeat = vulnerableStateBySeat(scan)
  const nsConsistent = rowConsistent(bySeat.N, bySeat.S)
  const ewConsistent = rowConsistent(bySeat.E, bySeat.W)

  const notes: string[] = []

  if (!nsConsistent) {
    notes.push('North/South colors disagree.')
  }

  if (!ewConsistent) {
    notes.push('East/West colors disagree.')
  }

  if (!nsConsistent || !ewConsistent) {
    return {
      vulnerability: null,
      confidence: 0,
      notes,
    }
  }

  const ns = bySeat.N ?? bySeat.S
  const ew = bySeat.E ?? bySeat.W

  if (ns == null && ew == null) {
    notes.push('Not enough color data to infer vulnerability.')
    return {
      vulnerability: null,
      confidence: 0,
      notes,
    }
  }

  if (ns != null && ew != null) {
    return {
      vulnerability: ns && ew ? 'Both' : ns ? 'NS' : ew ? 'EW' : 'None',
      confidence: 1,
      notes,
    }
  }

  notes.push('One partnership could not be read from the scan.')

  // If one side is known and the other unread, keep a best-effort guess.
  if (ns === true) {
    return {
      vulnerability: 'NS',
      confidence: 0.6,
      notes,
    }
  }

  if (ns === false) {
    return {
      vulnerability: 'None',
      confidence: 0.6,
      notes,
    }
  }

  if (ew === true) {
    return {
      vulnerability: 'EW',
      confidence: 0.6,
      notes,
    }
  }

  return {
    vulnerability: 'None',
    confidence: 0.6,
    notes,
  }
}

export function inferVulnerability(
  scan: PocketColorScan,
  boardNumber?: number,
): HandscanInference {
  const colorInference = inferVulnerabilityFromPocketColors(scan)

  if (boardNumber == null) {
    return colorInference
  }

  const boardInference = getVulnerabilityFromBoardNumber(boardNumber)

  if (boardInference == null) {
    return {
      ...colorInference,
      notes: [...colorInference.notes, 'Board number is invalid for vulnerability lookup.'],
    }
  }

  if (colorInference.vulnerability == null) {
    return {
      vulnerability: boardInference,
      confidence: 0.75,
      notes: [...colorInference.notes, 'Using board number vulnerability as fallback.'],
    }
  }

  if (colorInference.vulnerability === boardInference) {
    return {
      vulnerability: colorInference.vulnerability,
      confidence: 1,
      notes: colorInference.notes,
    }
  }

  return {
    vulnerability: boardInference,
    confidence: 0.5,
    notes: [
      ...colorInference.notes,
      `Color scan (${colorInference.vulnerability}) conflicts with board number (${boardInference}); preferring board number.`,
    ],
  }
}
