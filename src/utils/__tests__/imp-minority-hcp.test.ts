import { describe, it, expect } from 'vitest'
import { scoreBoard } from '../imp'

// This test checks that when NS has 18 HCP (datum = -140), and makes 1C (+70), the IMP diff is +5 for NS

describe('IMP calculation for minority HCP contract made', () => {
  it('should give positive IMPs to declarer side when they make contract as minority HCP', () => {
    // NS has 18 HCP, datum = -140 (from majority side perspective)
    const datum = -140
    // NS makes 1C, actual score = +70 (from declarer side perspective)
    const actualScore = 70
    const { diff, imp } = scoreBoard(actualScore, datum)
    expect(diff).toBe(210)
    expect(imp).toBe(5) // Should be +5 IMPs for NS
  })
})
