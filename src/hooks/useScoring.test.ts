import { renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import * as impModule from '../utils/imp'
import { useScoring } from './useScoring'
import type { Hand } from '../types'

function hand(cards: Partial<Hand> = {}): Hand {
  return {
    spades: [],
    hearts: [],
    diamonds: [],
    clubs: [],
    ...cards,
  }
}

describe('useScoring', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns invalidHcp when manual HCP is missing or invalid', () => {
    const { result } = renderHook(() =>
      useScoring({
        contract: '1C',
        declarer: 'N',
        result: 0,
        vulnerability: 'None',
        doubled: null,
        schema: 'modern',
      }),
    )

    expect(result.current.data).toBeNull()
    expect(result.current.errorKey).toBe('invalidHcp')
    expect(result.current.errorMessage).toBeNull()
  })

  it('scores hands input and derives majority and declaring sides correctly', () => {
    const { result } = renderHook(() =>
      useScoring({
        contract: '2H',
        declarer: 'E',
        result: 1,
        vulnerability: 'EW',
        doubled: null,
        schema: 'modern',
        hands: {
          north: hand({ spades: ['A'] }),
          south: hand({ hearts: ['K'] }),
          east: hand({ spades: ['A', 'K', 'Q'], hearts: ['A', 'K'] }),
          west: hand({ diamonds: ['A', 'K'], clubs: ['A', 'K', 'Q'] }),
        },
      }),
    )

    expect(result.current.errorKey).toBeNull()
    expect(result.current.data).not.toBeNull()
    expect(result.current.data?.majoritySide).toBe('EW')
    expect(result.current.data?.declaringSide).toBe('EW')
    expect(result.current.data?.majorityHcp).toBeGreaterThan(result.current.data?.declaringHcp === undefined ? 0 : 0)
    expect(result.current.data?.actualScore).toBeLessThan(0)
  })

  it('returns scoringFailed when IMP scoring throws', () => {
    vi.spyOn(impModule, 'scoreBoard').mockImplementation(() => {
      throw new Error('boom')
    })

    const { result } = renderHook(() =>
      useScoring({
        contract: '1C',
        declarer: 'N',
        result: 0,
        vulnerability: 'None',
        doubled: null,
        schema: 'modern',
        manualDeclaringHcp: 20,
      }),
    )

    expect(result.current.data).toBeNull()
    expect(result.current.errorKey).toBe('scoringFailed')
    expect(result.current.errorMessage).toBe('boom')
  })
})