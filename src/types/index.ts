export type Seat = 'N' | 'E' | 'S' | 'W'

export type Side = 'NS' | 'EW'

export type Vulnerability = 'None' | 'NS' | 'EW' | 'Both'

export type DatumSchema = 'modern' | 'classic'

export type Doubled = 'X' | 'XX' | null

export type Suit = 'S' | 'H' | 'D' | 'C' | 'NT'

export interface Hand {
  spades: string[]
  hearts: string[]
  diamonds: string[]
  clubs: string[]
}

export interface BoardResult {
  declarer: Seat
  contract: string
  doubled: Doubled
  result: number
  declaring_side: Side
  declaring_hcp: number
  actual_score: number
  datum: number
  imp_score: number
}

export interface Board {
  id: string
  session_id: string
  board_number: number
  dealer: Seat
  vulnerability: Vulnerability
  hands?: {
    north: Hand
    east: Hand
    south: Hand
    west: Hand
  }
  result?: BoardResult
}

export interface Session {
  id: string
  tournament_id: string
  name: string
  played_at: string
  boards: Board[]
}

export interface Player {
  id: string
  name: string
  tournament_id: string
}

/** How the match score is aggregated across boards. */
export type MatchFormat = 'vp' | 'carry-over'

/**
 * A single scored board within a match.
 * Mirrors BoardResult but is self-contained (no separate Board record needed).
 */
export interface MatchBoard {
  boardNumber: number
  vulnerability: Vulnerability
  declarer: Seat
  contract: string
  doubled: Doubled
  result: number
  declaringSide: Side
  declaringHcp: number
  /** Raw bridge score from NS perspective */
  actualScore: number
  /** Datum used (raw, before rounding) */
  datum: number
  /** IMP score for this board (NS perspective, negative = EW won) */
  imp: number
}

/**
 * A single head-to-head match between two pairs.
 * Boards are entered one at a time.
 */
export interface Match {
  id: string
  tournamentId: string
  round: number
  nsPair: string
  ewPair: string
  /** Boards played so far */
  boards: MatchBoard[]
  /** Total IMPs (NS perspective). Computed, stored for quick access. */
  totalImp: number
  /**
   * VP result once all boards are played.
   * [nsVP, ewVP] — only set when boards.length === tournament.boardsPerMatch
   */
  vpResult: [number, number] | null
  playedAt: string
}

/**
 * Top-level tournament configuration.
 */
export interface Tournament {
  id: string
  name: string
  /** How many boards are played per match */
  boardsPerMatch: number
  matchFormat: MatchFormat
  datumSchema: DatumSchema
  createdAt: string
  players: Player[]
  sessions: Session[]
}

// ...existing code...

export interface ScoreBoardInput {
  contract: string
  doubled: Doubled
  result: number
  declarer: Seat
  vulnerability: Vulnerability
  schema: DatumSchema
  manualDeclaringHcp?: number
}

export interface ScoreBoardOutput {
  declaringSide: Side
  declaringVulnerable: boolean
  declaringHcp: number
  datumRaw: number
  datumRounded: number
  actualScore: number
  diff: number
  imp: number
}
