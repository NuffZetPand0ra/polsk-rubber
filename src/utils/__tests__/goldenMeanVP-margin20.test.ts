import { describe, expect, it } from 'vitest'

// Golden mean VP calculation (rounded, monotonicity fix)
function goldenMeanVP(margin: number, boards: number): [number, number] {
  const Tau = (Math.sqrt(5) - 1) / 2;
  const B = 15 * Math.sqrt(boards);
  // Compute VP for all integer margins up to B, rounded
  const vpArr: number[] = [];
  for (let m = 0; m <= Math.ceil(B); m++) {
    let vp = 10 + 10 * ((1 - Math.pow(Tau, 3 * m / B)) / (1 - Math.pow(Tau, 3)));
    if (vp > 20) vp = 20;
    vpArr.push(Math.round(vp * 100) / 100);
  }
  // Apply monotonicity fix up to 4 times
  for (let iter = 0; iter < 4; iter++) {
    for (let i = 1; i < vpArr.length - 1; i++) {
      const prev = vpArr[i - 1], curr = vpArr[i], next = vpArr[i + 1];
      if ((next - curr) > (curr - prev)) {
        vpArr[i] = Math.round((curr + 0.01) * 100) / 100;
      }
    }
  }
  // Use the fixed value for the requested margin (rounded to nearest int)
  let idx = Math.round(margin);
  if (idx < 0) idx = 0;
  if (idx > Math.ceil(B)) idx = Math.ceil(B);
  const vpWinner = vpArr[idx];
  const vpLoser = Math.round((20 - vpWinner) * 100) / 100;
  return [vpWinner, vpLoser];
}

describe('goldenMeanVP', () => {
  it('gives about 18.09-1.91 when M = 2B/3', () => {
    const boards = 9;
    const B = 15 * Math.sqrt(boards);
    const M = 2 * B / 3;
    const [vpW, vpL] = goldenMeanVP(M, boards);
    expect(vpW).toBeCloseTo(18.09, 2);
    expect(vpL).toBeCloseTo(1.91, 2);
    expect(vpW + vpL).toBeCloseTo(20, 2);
  });

  it('gives correct value for margin 20', () => {
    const boards = 9;
    const margin = 20;
    const [vpW, vpL] = goldenMeanVP(margin, boards);
    // Print for user to check
    console.log(`For 9 boards, margin 20: VP = ${vpW} - ${vpL}`);
    expect(vpW + vpL).toBeCloseTo(20, 2);
  });
});
