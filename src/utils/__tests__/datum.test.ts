import { describe, expect, it } from 'vitest'
import { getDatumForBoard, getDeclaringSide, isSideVulnerable } from '../datum'

describe('datum helpers', () => {
  it('maps declarer seat to side', () => {
    expect(getDeclaringSide('N')).toBe('NS')
    expect(getDeclaringSide('S')).toBe('NS')
    expect(getDeclaringSide('E')).toBe('EW')
    expect(getDeclaringSide('W')).toBe('EW')
  })

  it('handles vulnerability states for both sides', () => {
    expect(isSideVulnerable('Both', 'NS')).toBe(true)
    expect(isSideVulnerable('Both', 'EW')).toBe(true)
    expect(isSideVulnerable('None', 'NS')).toBe(false)
    expect(isSideVulnerable('None', 'EW')).toBe(false)
    expect(isSideVulnerable('NS', 'NS')).toBe(true)
    expect(isSideVulnerable('NS', 'EW')).toBe(false)
    expect(isSideVulnerable('EW', 'EW')).toBe(true)
    expect(isSideVulnerable('EW', 'NS')).toBe(false)
  })

  it('returns zero datum for minority side at the 20-HCP floor', () => {
    const nsMinority = getDatumForBoard(19, 'Both', 'NS', 'modern')
    const ewMinority = getDatumForBoard(19, 'Both', 'EW', 'classic')

    expect(Math.abs(nsMinority)).toBe(0)
    expect(Math.abs(ewMinority)).toBe(0)
  })

  it('normalizes datum to NS perspective for EW declarer side', () => {
    const nsDatum = getDatumForBoard(24, 'Both', 'NS', 'modern')
    const ewDatum = getDatumForBoard(24, 'Both', 'EW', 'modern')

    expect(nsDatum).toBeGreaterThan(0)
    expect(ewDatum).toBe(-nsDatum)
  })
})
