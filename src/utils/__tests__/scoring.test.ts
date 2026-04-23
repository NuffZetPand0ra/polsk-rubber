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
    expect(computeDeclarerScore('2C', 2, true, 'XX')).toBe(1560)
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
    expect(() => computeDeclarerScore(' 2nt ', 0, false, null)).not.toThrow()
  })

  it('covers non-vulnerable doubled undertrick ladder', () => {
    expect(computeDeclarerScore('4H', -1, false, 'X')).toBe(-100)
    expect(computeDeclarerScore('4H', -3, false, 'X')).toBe(-500)
    expect(computeDeclarerScore('4H', -4, false, 'X')).toBe(-800)
  })

  it('normalizes declarer score for both sides', () => {
    expect(computeActualScore('2S', -2, 'None', null, 'NS')).toBe(-100)
    expect(computeActualScore('2S', -2, 'None', null, 'EW')).toBe(100)
  })
})
