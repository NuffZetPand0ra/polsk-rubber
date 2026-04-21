import { create } from 'zustand'
import type { DatumSchema } from '../types'

interface TournamentState {
  datumSchema: DatumSchema
  setDatumSchema: (schema: DatumSchema) => void
}

export const useTournamentStore = create<TournamentState>((set) => ({
  datumSchema: 'modern',
  setDatumSchema: (datumSchema) => set({ datumSchema }),
}))
