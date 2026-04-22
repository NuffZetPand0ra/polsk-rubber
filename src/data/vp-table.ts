/**
 * WBF Victory Point scale for a 24-board match.
 * Index i corresponds to net IMP difference i → [winnerVP, loserVP].
 * Differences above the last entry use the maximum (20–0).
 *
 * Source: WBF Laws and Regulations, VP schedule for 24-board matches.
 */
export const WBF_VP_24: ReadonlyArray<readonly [number, number]> = [
  [10, 10], // 0
  [11, 9],  // 1
  [11, 9],  // 2
  [12, 8],  // 3
  [12, 8],  // 4
  [13, 7],  // 5
  [13, 7],  // 6
  [14, 6],  // 7-8 (same step)
  [14, 6],
  [15, 5],  // 9-10
  [15, 5],
  [16, 4],  // 11-12
  [16, 4],
  [17, 3],  // 13-14
  [17, 3],
  [18, 2],  // 15-17
  [18, 2],
  [18, 2],
  [19, 1],  // 18-22
  [19, 1],
  [19, 1],
  [19, 1],
  [19, 1],
  [20, 0],  // 23+
]
