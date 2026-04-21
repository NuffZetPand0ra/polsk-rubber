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

export interface Tournament {
  id: string
  name: string
  created_at: string
  datum_schema: DatumSchema
  players: Player[]
  sessions: Session[]
}

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
