import { describe, expect, it } from 'vitest'
import { impToVp, sumImps } from '../vp'

describe('impToVp', () => {
  it('returns 10-10 on 0 IMP difference', () => {
    expect(impToVp(0, 24)).toEqual([10, 10])
    expect(impToVp(0, 8)).toEqual([10, 10])
  })

  it('assigns higher VP to NS when NS wins', () => {
    const [ns, ew] = impToVp(5, 24)
    expect(ns).toBeGreaterThan(ew)
    expect(ns + ew).toBe(20)
  })

  it('assigns higher VP to EW when EW wins', () => {
    const [ns, ew] = impToVp(-5, 24)
    expect(ew).toBeGreaterThan(ns)
    expect(ns + ew).toBe(20)
  })

  it('returns 20-0 for very large differences', () => {
    expect(impToVp(100, 24)).toEqual([20, 0])
    expect(impToVp(-100, 24)).toEqual([0, 20])
  })

  it('scales correctly for shorter matches', () => {
    // 12 IMPs over 8 boards is equivalent to 24 IMPs over 24 boards → should be 20-0
    expect(impToVp(12, 8)).toEqual([20, 0])
  })

  it('VP always sums to 20', () => {
    for (const imp of [-50, -10, -3, 0, 1, 7, 15, 23, 50]) {
      const [ns, ew] = impToVp(imp, 16)
      expect(ns + ew).toBe(20)
    }
  })

  it('handles invalid boardsPerMatch gracefully', () => {
    expect(impToVp(10, 0)).toEqual([10, 10])
  })
})

describe('sumImps', () => {
  it('sums an empty list to 0', () => {
    expect(sumImps([])).toBe(0)
  })

  it('sums positive and negative IMPs', () => {
    expect(sumImps([3, -2, 5, -1])).toBe(5)
  })
})
