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
  return getDatum(hcp, isSideVulnerable(vulnerability, side), schema)
}
