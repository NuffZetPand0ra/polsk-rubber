import { getDatum } from '../data/datum-table'
import type { DatumSchema, Side, Vulnerability } from '../types'

export function getDeclaringSide(declarer: 'N' | 'E' | 'S' | 'W'): Side {
  return declarer === 'N' || declarer === 'S' ? 'NS' : 'EW'
}

export function isSideVulnerable(
  vulnerability: Vulnerability,
  side: Side,
): boolean {
  if (vulnerability === 'Both') {
    return true
  }

  if (vulnerability === 'None') {
    return false
  }

  return vulnerability === side
}

export function getDatumForBoard(
  hcp: number,
  vulnerability: Vulnerability,
  side: Side,
  schema: DatumSchema,
): number {
  // If HCP < 20, datum should be negative (minority side)
  if (hcp < 20) {
    // Always use the other side for vulnerability and always return -datum (negative from NS perspective)
    const otherSide = side === 'NS' ? 'EW' : 'NS'
    const datum = getDatum(20, isSideVulnerable(vulnerability, otherSide), schema)
    return -datum
  }
  const datum = getDatum(hcp, isSideVulnerable(vulnerability, side), schema)
  return side === 'NS' ? datum : -datum // Normalize to NS perspective
}
