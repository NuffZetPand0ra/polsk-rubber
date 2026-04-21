import { useMemo, useState } from 'react'
import ScoreCard from '../ScoreCard'
import { useTournamentStore } from '../../store/tournament'
import { useScoring } from '../../hooks/useScoring'
import { useTheme } from '../../hooks/useTheme'
import { useI18n } from '../../i18n/I18nProvider'
import type { Doubled, Vulnerability } from '../../types'

const vulnerabilityOptions: Vulnerability[] = ['None', 'NS', 'EW', 'Both']
const doubledOptions: Array<{ labelKey: 'doubled.undoubled'; value: Doubled }> = [
  { labelKey: 'doubled.undoubled', value: null },
]

export default function BoardEntry() {
  const { datumSchema, setDatumSchema } = useTournamentStore()
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()

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

  const { data, errorKey, errorMessage } = useScoring(scoringInput)

  const vulnerabilityLabelMap: Record<Vulnerability, string> = {
    None: t('vul.none'),
    NS: t('vul.ns'),
    EW: t('vul.ew'),
    Both: t('vul.both'),
  }

  const errorText =
    errorKey === 'invalidHcp'
      ? t('error.invalidHcp')
      : errorKey === 'scoringFailed'
        ? `${t('error.scoringFailed')} ${errorMessage ?? ''}`.trim()
        : null

  return (
    <div className="mx-auto w-full max-w-5xl p-3 pb-8 md:p-5">
      <header className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{t('app.badge')}</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100 md:text-4xl">{t('app.heading')}</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300 md:text-base">
              {t('app.intro')}
            </p>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {t('app.offlineNote')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage(language === 'da' ? 'en' : 'da')}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              aria-label="Toggle language"
            >
              {language === 'da' ? 'EN' : 'DA'}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              aria-label="Toggle theme"
            >
              {isDark ? t('theme.light') : t('theme.dark')}
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-5">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">{t('section.boardEntry')}</h2>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('schema.label')}
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={datumSchema}
                onChange={(event) => setDatumSchema(event.target.value as 'modern' | 'classic')}
              >
                <option value="modern">{t('schema.modern')}</option>
                <option value="classic">{t('schema.classic')}</option>
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('field.contract')}
              <input
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={contract}
                onChange={(event) => setContract(event.target.value.toUpperCase())}
              />
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('field.declarer')}
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={declarer}
                onChange={(event) => setDeclarer(event.target.value as 'N' | 'E' | 'S' | 'W')}
              >
                <option value="N">{t('seat.north')}</option>
                <option value="E">{t('seat.east')}</option>
                <option value="S">{t('seat.south')}</option>
                <option value="W">{t('seat.west')}</option>
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('field.result')}
              <input
                type="number"
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={result}
                onChange={(event) => setResult(Number(event.target.value))}
              />
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('field.vulnerability')}
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={vulnerability}
                onChange={(event) => setVulnerability(event.target.value as Vulnerability)}
              >
                {vulnerabilityOptions.map((option) => (
                  <option key={option} value={option}>{vulnerabilityLabelMap[option]}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('field.doubled')}
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={doubled ?? ''}
                onChange={(event) => {
                  const value = event.target.value
                  setDoubled(value === '' ? null : (value as Doubled))
                }}
              >
                {doubledOptions.map((option) => (
                  <option key={option.labelKey} value={option.value ?? ''}>{t(option.labelKey)}</option>
                ))}
                <option value="X">X</option>
                <option value="XX">XX</option>
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
              {t('field.manualHcp')}
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

          {errorText ? (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorText}</p>
          ) : null}
        </section>

        {data ? <ScoreCard data={data} /> : null}
      </div>
    </div>
  )
}
