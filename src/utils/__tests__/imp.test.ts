import { describe, expect, it } from 'vitest'
import { diffToImp, roundDatumToNearest10, scoreBoard } from '../imp'

describe('imp utilities', () => {
  it('rounds datum to nearest 10', () => {
    expect(roundDatumToNearest10(334)).toBe(330)
    expect(roundDatumToNearest10(336)).toBe(340)
  })

  it('maps diff to IMP using WBF thresholds', () => {
    expect(diffToImp(0)).toBe(0)
    expect(diffToImp(20)).toBe(1)
    expect(diffToImp(50)).toBe(2)
    expect(diffToImp(-90)).toBe(-3)
  })

  it('caps IMP at 24', () => {
    expect(diffToImp(9999)).toBe(24)
    expect(diffToImp(-9999)).toBe(-24)
  })

  it('scores board from actual score and datum', () => {
    expect(scoreBoard(620, 614)).toEqual({
      datumRounded: 610,
      diff: 10,
      imp: 0,
    })

    expect(scoreBoard(-420, 330)).toEqual({
      datumRounded: 330,
      diff: -750,
      imp: -13,
    })
  })
})
