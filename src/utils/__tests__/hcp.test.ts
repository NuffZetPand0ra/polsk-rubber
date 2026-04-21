import { describe, expect, it } from 'vitest'
import type { Hand } from '../../types'
import { computeDeclaringHcp, computeHandHcp, validateManualHcp } from '../hcp'

const exampleHand: Hand = {
  spades: ['A', 'K', '7'],
  hearts: ['Q', 'J', '4'],
  diamonds: ['T', '3', '2'],
  clubs: ['9', '8', '6', '5'],
}

describe('hcp utilities', () => {
  it('computes hand HCP using 4-3-2-1', () => {
    expect(computeHandHcp(exampleHand)).toBe(10)
  })

  it('computes declaring side HCP for NS and EW', () => {
    const hands = {
      north: exampleHand,
      south: { ...exampleHand, spades: ['A'] },
      east: { ...exampleHand, hearts: ['K'] },
      west: { ...exampleHand, clubs: ['Q'] },
    }

    expect(computeDeclaringHcp(hands, 'NS')).toBe(17)
    expect(computeDeclaringHcp(hands, 'EW')).toBe(22)
  })

  it('validates manual HCP bounds', () => {
    expect(validateManualHcp(0)).toBe(true)
    expect(validateManualHcp(40)).toBe(true)
    expect(validateManualHcp(-1)).toBe(false)
    expect(validateManualHcp(41)).toBe(false)
    expect(validateManualHcp(19.5)).toBe(false)
  })
})
