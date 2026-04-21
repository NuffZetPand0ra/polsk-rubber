import { describe, expect, it } from 'vitest'
import { computeActualScore, computeDeclarerScore } from '../scoring'

describe('scoring utilities', () => {
  it('scores made game contracts', () => {
    expect(computeDeclarerScore('4H', 0, false, null)).toBe(420)
    expect(computeDeclarerScore('3NT', 1, true, null)).toBe(630)
  })

  it('scores doubled and redoubled contracts', () => {
    expect(computeDeclarerScore('4S', 0, false, 'X')).toBe(590)
    expect(computeDeclarerScore('3NT', -1, true, 'XX')).toBe(-400)
  })

  it('scores slams and undertricks', () => {
    expect(computeDeclarerScore('6NT', 0, false, null)).toBe(990)
    expect(computeDeclarerScore('2S', -2, false, null)).toBe(-100)
  })

  it('normalizes score to NS perspective', () => {
    expect(computeActualScore('4H', 0, 'NS', null, 'NS')).toBe(620)
    expect(computeActualScore('4H', 0, 'EW', null, 'EW')).toBe(-620)
  })

  it('throws for invalid contract shape', () => {
    expect(() => computeDeclarerScore('8H', 0, false, null)).toThrowError(
      /Contract must be one of 1C-7NT/,
    )
  })
})
