import { describe, expect, it } from 'vitest'
import {
  getVulnerabilityFromBoardNumber,
  inferVulnerability,
  inferVulnerabilityFromPocketColors,
} from '../handscan'

describe('inferVulnerabilityFromPocketColors', () => {
  it('detects None with green/white non-vulnerable colors', () => {
    const result = inferVulnerabilityFromPocketColors({
      north: 'green',
      east: 'white',
      south: 'green',
      west: 'white',
    })

    expect(result.vulnerability).toBe('None')
    expect(result.confidence).toBe(1)
  })

  it('detects NS vulnerable', () => {
    const result = inferVulnerabilityFromPocketColors({
      north: 'red',
      east: 'green',
      south: 'red',
      west: 'white',
    })

    expect(result.vulnerability).toBe('NS')
    expect(result.confidence).toBe(1)
  })

  it('detects EW vulnerable', () => {
    const result = inferVulnerabilityFromPocketColors({
      north: 'white',
      east: 'red',
      south: 'green',
      west: 'red',
    })

    expect(result.vulnerability).toBe('EW')
    expect(result.confidence).toBe(1)
  })

  it('detects Both vulnerable', () => {
    const result = inferVulnerabilityFromPocketColors({
      north: 'red',
      east: 'red',
      south: 'red',
      west: 'red',
    })

    expect(result.vulnerability).toBe('Both')
    expect(result.confidence).toBe(1)
  })

  it('returns no inference for contradictory rows', () => {
    const result = inferVulnerabilityFromPocketColors({
      north: 'red',
      east: 'green',
      south: 'white',
      west: 'red',
    })

    expect(result.vulnerability).toBeNull()
    expect(result.confidence).toBe(0)
    expect(result.notes).toContain('North/South colors disagree.')
  })

  it('returns best-effort with partial data', () => {
    const result = inferVulnerabilityFromPocketColors({
      north: 'red',
      east: 'unknown',
      south: 'red',
      west: 'unknown',
    })

    expect(result.vulnerability).toBe('NS')
    expect(result.confidence).toBe(0.6)
  })
})

describe('getVulnerabilityFromBoardNumber', () => {
  it('maps board numbers using the 16-board cycle', () => {
    expect(getVulnerabilityFromBoardNumber(1)).toBe('None')
    expect(getVulnerabilityFromBoardNumber(2)).toBe('NS')
    expect(getVulnerabilityFromBoardNumber(3)).toBe('EW')
    expect(getVulnerabilityFromBoardNumber(4)).toBe('Both')
    expect(getVulnerabilityFromBoardNumber(17)).toBe('None')
  })

  it('returns null for invalid board numbers', () => {
    expect(getVulnerabilityFromBoardNumber(0)).toBeNull()
    expect(getVulnerabilityFromBoardNumber(-2)).toBeNull()
    expect(getVulnerabilityFromBoardNumber(1.5)).toBeNull()
  })
})

describe('inferVulnerability', () => {
  it('uses board number as fallback when color scan is inconclusive', () => {
    const result = inferVulnerability(
      {
        north: 'unknown',
        east: 'unknown',
        south: 'unknown',
        west: 'unknown',
      },
      3,
    )

    expect(result.vulnerability).toBe('EW')
    expect(result.confidence).toBe(0.75)
  })

  it('prefers board number when color and board number conflict', () => {
    const result = inferVulnerability(
      {
        north: 'red',
        east: 'green',
        south: 'red',
        west: 'white',
      },
      3,
    )

    expect(result.vulnerability).toBe('EW')
    expect(result.confidence).toBe(0.5)
    expect(result.notes.join(' ')).toContain('preferring board number')
  })
})
