import { describe, expect, it } from 'vitest'
import { getDatum } from '../../data/datum-table'

describe('getDatum', () => {
  it('returns 0 for 19 or lower HCP', () => {
    expect(getDatum(19, false, 'modern')).toBe(0)
    expect(getDatum(10, true, 'classic')).toBe(0)
  })

  it('returns modern non-vulnerable values', () => {
    expect(getDatum(24, false, 'modern')).toBe(330)
    expect(getDatum(30, false, 'modern')).toBe(700)
  })

  it('returns classic vulnerable values', () => {
    expect(getDatum(24, true, 'classic')).toBe(290)
    expect(getDatum(30, true, 'classic')).toBe(690)
  })

  it('caps high HCP to 37+', () => {
    expect(getDatum(39, false, 'modern')).toBe(2220)
    expect(getDatum(50, true, 'classic')).toBe(2980)
  })
})
