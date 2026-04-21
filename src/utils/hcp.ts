import type { Hand, Side } from '../types'

const HCP_MAP: Record<string, number> = {
  A: 4,
  K: 3,
  Q: 2,
  J: 1,
}

function normalizeRank(rank: string): string {
  return rank.trim().toUpperCase()
}

export function computeHandHcp(hand: Hand): number {
  const cards = [...hand.spades, ...hand.hearts, ...hand.diamonds, ...hand.clubs]
  return cards.reduce((total, rank) => total + (HCP_MAP[normalizeRank(rank)] ?? 0), 0)
}

export function computeDeclaringHcp(
  hands: { north: Hand; east: Hand; south: Hand; west: Hand },
  side: Side,
): number {
  if (side === 'NS') {
    return computeHandHcp(hands.north) + computeHandHcp(hands.south)
  }

  return computeHandHcp(hands.east) + computeHandHcp(hands.west)
}

export function validateManualHcp(value: number): boolean {
  return Number.isInteger(value) && value >= 0 && value <= 40
}
