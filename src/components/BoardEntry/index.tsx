import { useMemo, useState } from 'react'
import ScoreCard from '../ScoreCard'
import { useTournamentStore } from '../../store/tournament'
import { useScoring } from '../../hooks/useScoring'
import { useTheme } from '../../hooks/useTheme'
import type { Doubled, Vulnerability } from '../../types'

const vulnerabilityOptions: Vulnerability[] = ['None', 'NS', 'EW', 'Both']
const doubledOptions: Array<{ label: string; value: Doubled }> = [
  { label: 'Undoubled', value: null },
  { label: 'X', value: 'X' },
  { label: 'XX', value: 'XX' },
]

export default function BoardEntry() {
  const { datumSchema, setDatumSchema } = useTournamentStore()
  const { isDark, toggleTheme } = useTheme()

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
    <div className="mx-auto w-full max-w-5xl p-3 pb-8 md:p-5">
      <header className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Polsk Rubber</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100 md:text-4xl">Board Scoring</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 md:text-base">
              Enter contract details, apply vulnerability and doubling, and compare the actual result versus HCP datum in IMPs.
            </p>
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            aria-label="Toggle theme"
          >
            {isDark ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </header>

      <div className="mb-4 grid gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 md:grid-cols-3 md:gap-4 md:p-4">
        <p><span className="font-semibold text-primary">1.</span> Contract + declarer.</p>
        <p><span className="font-semibold text-primary">2.</span> Vul, doubles, HCP.</p>
        <p><span className="font-semibold text-primary">3.</span> Datum, diff, IMP.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-5">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">Board Entry</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-700 dark:text-slate-200">
              Datum Schema
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={datumSchema}
                onChange={(event) => setDatumSchema(event.target.value as 'modern' | 'classic')}
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              Contract (e.g. 4H, 3NT)
              <input
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={contract}
                onChange={(event) => setContract(event.target.value.toUpperCase())}
              />
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              Declarer
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={declarer}
                onChange={(event) => setDeclarer(event.target.value as 'N' | 'E' | 'S' | 'W')}
              >
                <option value="N">North</option>
                <option value="E">East</option>
                <option value="S">South</option>
                <option value="W">West</option>
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              Result (relative to contract)
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={result}
                onChange={(event) => setResult(Number(event.target.value))}
              />
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              Vulnerability
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={vulnerability}
                onChange={(event) => setVulnerability(event.target.value as Vulnerability)}
              >
                {vulnerabilityOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              Doubled
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
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

            <label className="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
              Manual Declaring HCP (0-40)
              <input
                type="number"
                min={0}
                max={40}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={manualHcp}
                onChange={(event) => setManualHcp(Number(event.target.value))}
              />
            </label>
          </div>

          {error ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>
          ) : null}
        </section>

        {data ? <ScoreCard data={data} /> : null}
      </div>
    </div>
  )
}
