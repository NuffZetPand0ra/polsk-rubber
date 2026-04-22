// Returns the vulnerability for a given board number (1-based, 1-32)
// Standard bridge pattern: 1=None, 2=NS, 3=EW, 4=Both, repeat every 4
import type { Vulnerability } from '../types'

const VULN_PATTERN: Vulnerability[] = ['None', 'NS', 'EW', 'Both']

export function getBoardVulnerability(boardNumber: number): Vulnerability {
  return VULN_PATTERN[(boardNumber - 1) % 4]
}
