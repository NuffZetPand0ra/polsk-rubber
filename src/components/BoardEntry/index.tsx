import { useMemo, useState } from 'react'
import ScoreCard from '../ScoreCard'
import { useTournamentStore } from '../../store/tournament'
import { useScoring } from '../../hooks/useScoring'
import type { Doubled, Vulnerability } from '../../types'

const vulnerabilityOptions: Vulnerability[] = ['None', 'NS', 'EW', 'Both']
const doubledOptions: Array<{ label: string; value: Doubled }> = [
  { label: 'Undoubled', value: null },
  { label: 'X', value: 'X' },
  { label: 'XX', value: 'XX' },
]

export default function BoardEntry() {
  const { datumSchema, setDatumSchema } = useTournamentStore()

  const [contract, setContract] = useState('4H')
  const [declarer, setDeclarer] = useState<'N' | 'E' | 'S' | 'W'>('N')
  const [result, setResult] = useState(0)
  const [vulnerability, setVulnerability] = useState<Vulnerability>('None')
  const [doubled, setDoubled] = useState<Doubled>(null)
  const [manualHcp, setManualHcp] = useState(24)

  const scoringInput = useMemo(
    () => ({
      contract,
      declarer,
      result,
      vulnerability,
      doubled,
      schema: datumSchema,
      manualDeclaringHcp: manualHcp,
    }),
    [contract, declarer, result, vulnerability, doubled, datumSchema, manualHcp],
  )

  const { data, error } = useScoring(scoringInput)

  return (
    <div className="mx-auto w-full max-w-5xl p-4 md:p-8">
      <div className="mb-6 rounded-2xl border border-amber-300/30 bg-stone-900/70 p-6">
        <h1 className="font-serif text-4xl text-amber-50 md:text-5xl">Polsk Rubber Bridge</h1>
        <p className="mt-2 text-stone-300">Single-board scoring MVP with HCP datum and WBF IMP conversion.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-stone-700 bg-stone-900/70 p-5 shadow-lg shadow-black/30">
          <h2 className="font-serif text-2xl text-amber-100">Board Entry</h2>

          <div className="mt-4 grid gap-4">
            <label className="text-sm text-stone-300">
              Datum Schema
              <select
                className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 p-2 text-stone-100"
                value={datumSchema}
                onChange={(event) => setDatumSchema(event.target.value as 'modern' | 'classic')}
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
              </select>
            </label>

            <label className="text-sm text-stone-300">
              Contract (e.g. 4H, 3NT)
              <input
                className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 p-2 text-stone-100"
                value={contract}
                onChange={(event) => setContract(event.target.value.toUpperCase())}
              />
            </label>

            <label className="text-sm text-stone-300">
              Declarer
              <select
                className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 p-2 text-stone-100"
                value={declarer}
                onChange={(event) => setDeclarer(event.target.value as 'N' | 'E' | 'S' | 'W')}
              >
                <option value="N">North</option>
                <option value="E">East</option>
                <option value="S">South</option>
                <option value="W">West</option>
              </select>
            </label>

            <label className="text-sm text-stone-300">
              Result (relative to contract)
              <input
                type="number"
                className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 p-2 text-stone-100"
                value={result}
                onChange={(event) => setResult(Number(event.target.value))}
              />
            </label>

            <label className="text-sm text-stone-300">
              Vulnerability
              <select
                className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 p-2 text-stone-100"
                value={vulnerability}
                onChange={(event) => setVulnerability(event.target.value as Vulnerability)}
              >
                {vulnerabilityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-stone-300">
              Doubled
              <select
                className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 p-2 text-stone-100"
                value={doubled ?? ''}
                onChange={(event) => {
                  const value = event.target.value
                  setDoubled(value === '' ? null : (value as Doubled))
                }}
              >
                {doubledOptions.map((option) => (
                  <option key={option.label} value={option.value ?? ''}>{option.label}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-stone-300">
              Manual Declaring HCP (0-40)
              <input
                type="number"
                min={0}
                max={40}
                className="mt-1 w-full rounded-lg border border-stone-600 bg-stone-800 p-2 text-stone-100"
                value={manualHcp}
                onChange={(event) => setManualHcp(Number(event.target.value))}
              />
            </label>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>
          ) : null}
        </section>

        {data ? <ScoreCard data={data} /> : null}
      </div>
    </div>
  )
}
