import { WBF_IMP_THRESHOLDS } from '../data/imp-table'

export function roundDatumToNearest10(value: number): number {
  return Math.round(value / 10) * 10
}

export function diffToImp(diff: number): number {
  const absoluteDiff = Math.abs(diff)
  let imp = 0

  for (const threshold of WBF_IMP_THRESHOLDS) {
    if (absoluteDiff < threshold) {
      break
    }

    imp += 1
  }

  if (imp > 24) {
    imp = 24
  }

  return diff >= 0 ? imp : -imp
}

export function impToBam(imp: number): 1 | -1 | 0 {
  if (imp > 0) return 1
  if (imp < 0) return -1
  return 0
}

export function scoreBoard(actualScore: number, datum: number): {
  datumRounded: number
  diff: number
  imp: number
} {
  const datumRounded = roundDatumToNearest10(datum)
  const diff = actualScore - datumRounded

  return {
    datumRounded,
    diff,
    imp: diffToImp(diff),
  }
}
