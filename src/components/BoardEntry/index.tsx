import { useEffect, useMemo, useState } from 'react'
import ScoreCard from '../ScoreCard'
import { useScoring } from '../../hooks/useScoring'
import { useTheme } from '../../hooks/useTheme'
import { useI18n } from '../../i18n/I18nProvider'
import { getDatumSchemaPreview } from '../../data/datum-table'
import type { Doubled, Tournament, Vulnerability } from '../../types'
import { getBoardVulnerability } from '../../utils/boardVul'

interface Props {
  tournament: Tournament
  onBack: () => void
}

const vulnerabilityOptions: Vulnerability[] = ['None', 'NS', 'EW', 'Both']
const contractLevels = [1, 2, 3, 4, 5, 6, 7] as const
const contractSuits = ['C', 'D', 'H', 'S', 'NT'] as const
const contractSuitLabels: Record<(typeof contractSuits)[number], string> = {
  C: '♣',
  D: '♦',
  H: '♥',
  S: '♠',
  NT: 'NT',
}

const doubledOptions: Array<{ labelKey: 'doubled.undoubled'; value: Doubled }> = [
  { labelKey: 'doubled.undoubled', value: null },
]

// Add state for board number and match tally
export default function BoardEntry({ tournament, onBack }: Props) {
  const [boardNumber, setBoardNumber] = useState(1)
  const [impTally, setImpTally] = useState(0)
  const [boardsPlayed, setBoardsPlayed] = useState(0)
  const [boardResults, setBoardResults] = useState<any[]>([])
  const datumSchema = tournament.datumSchema
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()

  const [contractLevel, setContractLevel] = useState<number>(1)
  const [contractSuit, setContractSuit] = useState<(typeof contractSuits)[number]>('C')
  const [declarer, setDeclarer] = useState<'N' | 'E' | 'S' | 'W'>('N')
  const [result, setResult] = useState(0)
  const [vulnerability, setVulnerability] = useState<Vulnerability>(getBoardVulnerability(1))
  const [doubled, setDoubled] = useState<Doubled>(null)
  const [manualHcp, setManualHcp] = useState(24)
  const [showSchemaPreview, setShowSchemaPreview] = useState(false)

  const contract = `${contractLevel}${contractSuit}`
  const maxOverTricks = 7 - contractLevel
  const maxUnderTricks = contractLevel + 6

  const resultOptions = useMemo(
    () =>
      Array.from(
        { length: maxOverTricks + maxUnderTricks + 1 },
        (_, index) => index - maxUnderTricks,
      ),
    [maxOverTricks, maxUnderTricks],
  )

  const schemaPreviewRows = useMemo(
    () => getDatumSchemaPreview(datumSchema),
    [datumSchema],
  )

  useEffect(() => {
    if (result < -maxUnderTricks || result > maxOverTricks) {
      setResult(0)
    }
  }, [maxOverTricks, maxUnderTricks, result])

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
    [
      contract,
      declarer,
      result,
      vulnerability,
      doubled,
      datumSchema,
      manualHcp,
    ],
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

  // Handler for submitting a board result and updating tally
  const handleSubmitBoard = () => {
    if (data) {
      setImpTally((prev) => prev + data.imp)
      setBoardsPlayed((prev) => prev + 1)
      setBoardNumber((prev) => {
        const next = prev + 1
        setVulnerability(getBoardVulnerability(next))
        return next
      })
      setBoardResults((prev) => [
        ...prev,
        {
          board: boardNumber,
          contract,
          declarer,
          result,
          vulnerability,
          doubled,
          imp: data.imp,
          hcp: data.declaringHcp,
          actualScore: data.actualScore,
        },
      ])
      // Reset entry fields for next board
      setContractLevel(1)
      setContractSuit('C')
      setDeclarer('N')
      setResult(0)
      setDoubled(null)
      setManualHcp(24)
    }
  }

  const boardsLeft = tournament.boardsPerMatch - boardsPlayed

  return (
    <div className="mx-auto w-full max-w-5xl p-3 pb-8 md:p-5">
      <header className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
        <div className="flex gap-4 mb-2">
          <div className="text-sm text-slate-700 dark:text-slate-200">
            <strong>{t('section.boardEntry')}</strong> — Board {boardNumber}
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-200">
            <strong>Total IMP:</strong> {impTally}
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-200">
            <strong>Boards left:</strong> {boardsLeft}
          </div>
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-1 inline-flex items-center text-xs font-semibold text-primary hover:underline"
            >
              {t('tournament.backToList')}
            </button>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{tournament.name}</p>
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
          <div className="mt-2 flex gap-2 items-center">
            <label className="text-sm text-slate-700 dark:text-slate-200">
              Board #
              <input
                type="number"
                min={1}
                max={tournament.boardsPerMatch}
                className="ml-1 w-16 rounded border border-slate-300 p-1 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                value={boardNumber}
                onChange={e => {
                  const n = Math.max(1, Math.min(Number(e.target.value), tournament.boardsPerMatch))
                  setBoardNumber(n)
                  setVulnerability(getBoardVulnerability(n))
                }}
              />
            </label>
            <span className="text-xs text-slate-500">(Vul: {vulnerability})</span>
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="rounded bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700"
              onClick={handleSubmitBoard}
              disabled={!data}
            >
              Enter Board Result
            </button>
          </div>

          {boardResults.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Board Results</h3>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">Contract</th>
                    <th className="border px-2 py-1">Declarer</th>
                    <th className="border px-2 py-1">Result</th>
                    <th className="border px-2 py-1">Vul</th>
                    <th className="border px-2 py-1">Dbl</th>
                    <th className="border px-2 py-1">IMP</th>
                  </tr>
                </thead>
                <tbody>
                  {boardResults.map((r) => (
                    <tr key={r.board}>
                      <td className="border px-2 py-1">{r.board}</td>
                      <td className="border px-2 py-1">{r.contract} ({r.hcp}HCP)</td>
                      <td className="border px-2 py-1">{r.declarer}</td>
                      <td className="border px-2 py-1">{r.result} ({r.actualScore >= 0 ? '+' : ''}{r.actualScore})</td>
                      <td className="border px-2 py-1">{r.vulnerability}</td>
                      <td className="border px-2 py-1">{r.doubled || '-'}</td>
                      <td className="border px-2 py-1">{r.imp}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-200 dark:bg-slate-900 font-bold">
                    <td className="border px-2 py-1 text-right" colSpan={6}>Total IMP</td>
                    <td className="border px-2 py-1">{boardResults.reduce((sum, r) => sum + r.imp, 0)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <p className="text-xs text-slate-500 dark:text-slate-400 md:col-span-2">
              {t('schema.label')}: {datumSchema === 'modern' ? t('schema.modern') : t('schema.classic')}
            </p>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('field.contractLevel')}
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={contractLevel}
                onChange={(event) => setContractLevel(Number(event.target.value))}
              >
                {contractLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('field.contractSuit')}
              <select
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={contractSuit}
                onChange={(event) =>
                  setContractSuit(
                    event.target.value as (typeof contractSuits)[number],
                  )
                }
              >
                {contractSuits.map((suit) => (
                  <option key={suit} value={suit}>{contractSuitLabels[suit]}</option>
                ))}
              </select>
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
              <select
                className={`mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:focus:ring-blue-900 ${
                  result < 0
                    ? 'text-red-600 dark:text-red-400'
                    : result > 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-slate-900 dark:text-slate-100'
                }`}
                value={result}
                onChange={(event) => setResult(Number(event.target.value))}
              >
                {resultOptions.map((value) => (
                  <option
                    key={value}
                    value={value}
                    style={{
                      color:
                        value < 0 ? '#dc2626' : value > 0 ? '#16a34a' : '#0f172a',
                    }}
                  >
                    {value === 0 ? t('result.made') : value > 0 ? `+${value}` : `${value}`}
                  </option>
                ))}
              </select>
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

          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowSchemaPreview((value) => !value)}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {showSchemaPreview ? t('preview.button.hide') : t('preview.button.show')}
            </button>

            {showSchemaPreview ? (
              <div className="mt-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {t('preview.title')}
                </p>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-white dark:bg-slate-900">
                      <tr className="text-left text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
                        <th className="px-3 py-2">{t('preview.hcp')}</th>
                        <th className="px-3 py-2">{t('preview.nv')}</th>
                        <th className="px-3 py-2">{t('preview.vul')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {schemaPreviewRows.map((row) => (
                        <tr key={row.hcp} className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200">
                          <td className="px-3 py-1.5 font-medium">{row.hcp}</td>
                          <td className="px-3 py-1.5">{row.nv}</td>
                          <td className="px-3 py-1.5">{row.vul}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}
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
