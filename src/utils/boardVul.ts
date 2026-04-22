// Returns the vulnerability for a given board number (1-based, 1-32+)
// Danish 16-board cycle:
// Ingen: 1,8,11,14
// Nord-Syd: 2,5,12,15
// Øst-Vest: 3,6,9,16
// Alle: 4,7,10,13
import type { Vulnerability } from '../types'

const VULN_16_PATTERN: Vulnerability[] = [
  'None',     // 1
  'NS',       // 2
  'EW',       // 3
  'Both',     // 4
  'NS',       // 5
  'EW',       // 6
  'Both',     // 7
  'None',     // 8
  'EW',       // 9
  'Both',     // 10
  'None',     // 11
  'NS',       // 12
  'Both',     // 13
  'None',     // 14
  'NS',       // 15
  'EW',       // 16
]

export function getBoardVulnerability(boardNumber: number): Vulnerability {
  return VULN_16_PATTERN[(boardNumber - 1) % 16]
}
