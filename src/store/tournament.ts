import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { impToVp, sumImps } from '../utils/vp'
import type { DatumSchema, Match, MatchBoard, MatchFormat, Tournament } from '../types'

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function recomputeMatch(match: Match, boardsPerMatch: number): Match {
  const totalImp = sumImps(match.boards.map((b) => b.imp))
  const isComplete = match.boards.length >= boardsPerMatch
  const vpResult: Match['vpResult'] = isComplete ? impToVp(totalImp, boardsPerMatch) : null
  return { ...match, totalImp, vpResult }
}

// ---------------------------------------------------------------------------
// state shape
// ---------------------------------------------------------------------------

interface TournamentState {
  /** Legacy single-schema preference kept for the scoring widget */
  datumSchema: DatumSchema
  setDatumSchema: (schema: DatumSchema) => void

  // --- Tournaments ---
  tournaments: Tournament[]
  activeTournamentId: string | null

  createTournament: (opts: {
    name: string
    boardsPerMatch: number
    matchFormat: MatchFormat
    datumSchema: DatumSchema
    customDatumSlug?: string
  }) => Tournament

  updateTournament: (id: string, changes: Partial<Pick<Tournament, 'name' | 'boardsPerMatch' | 'matchFormat' | 'datumSchema' | 'customDatumSlug'>>) => void

  deleteTournament: (id: string) => void

  setActiveTournament: (id: string | null) => void

  // --- Matches ---
  matches: Match[]

  createMatch: (opts: {
    tournamentId: string
    round: number
    nsPair: string
    ewPair: string
  }) => Match

  addBoard: (matchId: string, board: MatchBoard) => void

  /** Replace a board at a given boardNumber (for corrections). */
  updateBoard: (matchId: string, boardNumber: number, board: MatchBoard) => void

  deleteMatch: (matchId: string) => void
}

// ---------------------------------------------------------------------------
// store
// ---------------------------------------------------------------------------

export const useTournamentStore = create<TournamentState>()(
  persist(
    (set, get) => ({
      datumSchema: 'modern',
      setDatumSchema: (datumSchema) => set({ datumSchema }),

      tournaments: [],
      activeTournamentId: null,

      createTournament: (opts) => {
        const tournament: Tournament = {
          id: uid(),
          name: opts.name,
          boardsPerMatch: opts.boardsPerMatch,
          matchFormat: opts.matchFormat,
          datumSchema: opts.datumSchema,
          customDatumSlug: opts.customDatumSlug,
          createdAt: new Date().toISOString(),
          players: [],
          sessions: [],
        }
        set((state) => ({ tournaments: [...state.tournaments, tournament] }))
        return tournament
      },

      updateTournament: (id, changes) => {
        set((state) => ({
          tournaments: state.tournaments.map((t) =>
            t.id === id ? { ...t, ...changes } : t,
          ),
        }))
      },

      deleteTournament: (id) => {
        set((state) => ({
          tournaments: state.tournaments.filter((t) => t.id !== id),
          matches: state.matches.filter((m) => m.tournamentId !== id),
          activeTournamentId:
            state.activeTournamentId === id ? null : state.activeTournamentId,
        }))
      },

      setActiveTournament: (id) => set({ activeTournamentId: id }),

      matches: [],

      createMatch: (opts) => {
        const match: Match = {
          id: uid(),
          tournamentId: opts.tournamentId,
          round: opts.round,
          nsPair: opts.nsPair,
          ewPair: opts.ewPair,
          boards: [],
          totalImp: 0,
          vpResult: null,
          playedAt: new Date().toISOString(),
        }
        set((state) => ({ matches: [...state.matches, match] }))
        return match
      },

      addBoard: (matchId, board) => {
        const { matches, tournaments } = get()
        const match = matches.find((m) => m.id === matchId)
        if (!match) return
        const tournament = tournaments.find((t) => t.id === match.tournamentId)
        const boardsPerMatch = tournament?.boardsPerMatch ?? 8

        const updated = recomputeMatch(
          { ...match, boards: [...match.boards, board] },
          boardsPerMatch,
        )

        set((state) => ({
          matches: state.matches.map((m) => (m.id === matchId ? updated : m)),
        }))
      },

      updateBoard: (matchId, boardNumber, board) => {
        const { matches, tournaments } = get()
        const match = matches.find((m) => m.id === matchId)
        if (!match) return
        const tournament = tournaments.find((t) => t.id === match.tournamentId)
        const boardsPerMatch = tournament?.boardsPerMatch ?? 8

        const newBoards = match.boards.map((b) =>
          b.boardNumber === boardNumber ? board : b,
        )
        const updated = recomputeMatch({ ...match, boards: newBoards }, boardsPerMatch)

        set((state) => ({
          matches: state.matches.map((m) => (m.id === matchId ? updated : m)),
        }))
      },

      deleteMatch: (matchId) => {
        set((state) => ({
          matches: state.matches.filter((m) => m.id !== matchId),
        }))
      },
    }),
    {
      name: 'polsk-rubber-tournament',
      version: 1,
    },
  ),
)

