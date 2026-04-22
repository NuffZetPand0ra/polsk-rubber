import { WBF_VP_24 } from '../data/vp-table'

/**
 * Convert a net IMP difference to a [winner VP, loser VP] pair using the
 * WBF scale, scaled to the actual match length.
 *
 * The WBF approach: scale the observed net IMP difference by (24 / boardsPerMatch)
 * to get the equivalent 24-board IMP difference, then look up the VP table.
 *
 * @param netImp  Net IMP result from the perspective of one side (may be negative).
 * @param boardsPerMatch  Number of boards in the match (e.g. 8, 12, 16, 24).
 * @returns [nsVP, ewVP] summing to 20.
 */
export function impToVp(netImp: number, boardsPerMatch: number): [number, number] {
  if (boardsPerMatch <= 0) {
    return [10, 10]
  }

  // Scale to 24-board equivalent
  const scaledDiff = Math.abs(netImp) * (24 / boardsPerMatch)
  const index = Math.min(Math.floor(scaledDiff), WBF_VP_24.length - 1)
  const [highVP, lowVP] = WBF_VP_24[index]

  // netImp is NS perspective: positive = NS wins
  if (netImp >= 0) {
    return [highVP, lowVP]
  }

  return [lowVP, highVP]
}

/**
 * Compute running total IMP from a list of per-board IMP values (NS perspective).
 */
export function sumImps(imps: number[]): number {
  return imps.reduce((acc, v) => acc + v, 0)
}
