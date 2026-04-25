import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { impToVp, sumImps } from '../utils/vp'
import type { DatumSchema, Match, MatchBoard, MatchFormat, Tournament } from '../types'

const BOARD_RESULTS_PREFIX = 'boardResults:'
const BOARD_RESULTS_RESERVED_IDS = new Set(['just-play'])

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function cleanupOrphanedBoardResultsStorage(tournaments: Tournament[]): void {
  if (!hasLocalStorage()) {
    return
  }

  const validTournamentIds = new Set(tournaments.map((tournament) => tournament.id))

  for (let index = window.localStorage.length - 1; index >= 0; index--) {
    const key = window.localStorage.key(index)
    if (!key || !key.startsWith(BOARD_RESULTS_PREFIX)) {
      continue
    }

    const tournamentId = key.slice(BOARD_RESULTS_PREFIX.length)
    if (BOARD_RESULTS_RESERVED_IDS.has(tournamentId)) {
      continue
    }

    if (!validTournamentIds.has(tournamentId)) {
      window.localStorage.removeItem(key)
    }
  }
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

        if (hasLocalStorage()) {
          window.localStorage.removeItem(`${BOARD_RESULTS_PREFIX}${id}`)
        }

        cleanupOrphanedBoardResultsStorage(get().tournaments)
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
      onRehydrateStorage: () => (state) => {
        if (state) {
          cleanupOrphanedBoardResultsStorage(state.tournaments)
        }
      },
    },
  ),
)

