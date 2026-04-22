// Golden mean VP calculation
function goldenMeanVP(margin: number, boards: number): [number, number] {
  const Tau = (Math.sqrt(5) - 1) / 2;
  const B = 15 * Math.sqrt(boards);
  // Compute VP for all integer margins up to B, rounded
  const vpArr: number[] = [];
  for (let m = 0; m <= Math.ceil(B); m++) {
    let vp = 10 + 10 * ((1 - Math.pow(Tau, 3 * m / B)) / (1 - Math.pow(Tau, 3)));
    if (vp > 20) vp = 20;
    vpArr.push(Math.round(vp * 100) / 100);
  }
  // Apply monotonicity fix up to 4 times
  for (let iter = 0; iter < 4; iter++) {
    for (let i = 1; i < vpArr.length - 1; i++) {
      const prev = vpArr[i - 1], curr = vpArr[i], next = vpArr[i + 1];
      if ((next - curr) > (curr - prev)) {
        vpArr[i] = Math.round((curr + 0.01) * 100) / 100;
      }
    }
  }
  // Use the fixed value for the requested margin (rounded to nearest int)
  let idx = Math.round(margin);
  if (idx < 0) idx = 0;
  if (idx > Math.ceil(B)) idx = Math.ceil(B);
  let vpWinner = vpArr[idx];
  let vpLoser = Math.round((20 - vpWinner) * 100) / 100;
  // If sum is 19.99, add 0.01 to winner
  if (Math.abs(vpWinner + vpLoser - 19.99) < 0.0001) {
    vpWinner = Math.round((vpWinner + 0.01) * 100) / 100;
    vpLoser = Math.round((20 - vpWinner) * 100) / 100;
  }
  return [vpWinner, vpLoser];
}



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
  // Modal state for end-of-tournament popup
  const [showEndPopup, setShowEndPopup] = useState(false);
  // Local state for boardsPerMatch to allow extension without mutating props
  const [boardsPerMatch, setBoardsPerMatch] = useState(tournament.boardsPerMatch);
    // Helper: get board entry by number
    const getBoardEntry = (n: number) => {
      return boardResults.find((r: any) => r.board === n) || null;
    };
  const sectionId = 'main' // Placeholder for future section support
  const [boardResults, setBoardResults] = useState<any[]>(() => {
    const key = `boardResults:${tournament.id}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return parsed[sectionId] || []
      } catch {}
    }
    return []
  })
  const [boardNumber, setBoardNumber] = useState(() => {
    const key = `boardResults:${tournament.id}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const results = parsed[sectionId] || []
        if (results.length > 0) {
          const lastBoard = Math.max(...results.map((r: any) => r.board))
          // If all boards are played, suggest last played board (n), else n+1
          if (results.length >= tournament.boardsPerMatch) {
            return lastBoard;
          } else {
            return lastBoard + 1;
          }
        }
      } catch {}
    }
    return 1;
  })
  const datumSchema = tournament.datumSchema
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()

  // Derived values for tally and boards played
  const boardsPlayed = boardResults.length
  const impTally = boardResults.reduce((sum: number, r: any) => sum + r.imp, 0)

  const [contractLevel, setContractLevel] = useState<number>(1)
  const [contractSuit, setContractSuit] = useState<(typeof contractSuits)[number]>('C')
  const [declarer, setDeclarer] = useState<'N' | 'E' | 'S' | 'W'>('N')
  const [result, setResult] = useState(0)
  const [vulnerability, setVulnerability] = useState<Vulnerability>(getBoardVulnerability(1))
  const [doubled, setDoubled] = useState<Doubled>(null)
  const [manualHcp, setManualHcp] = useState(20)
    // When boardNumber changes, prefill all inputs from boardResults/localStorage
    useEffect(() => {
      const entry = getBoardEntry(boardNumber);
      if (entry) {
        setContractLevel(Number(entry.contract[0]) || 1);
        setContractSuit(entry.contract.slice(1) || 'C');
        setDeclarer(entry.declarer || 'N');
        setResult(entry.result ?? 0);
        setVulnerability(entry.vulnerability || getBoardVulnerability(boardNumber));
        setDoubled(entry.doubled ?? null);
        setManualHcp(entry.hcp ?? 20);
      } else {
        setContractLevel(1);
        setContractSuit('C');
        setDeclarer('N');
        setResult(0);
        setVulnerability(getBoardVulnerability(boardNumber));
        setDoubled(null);
        setManualHcp(20);
      }
    }, [boardNumber, boardResults]);
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


  // Load boardResults from localStorage on mount and set next board number
  useEffect(() => {
    const key = `boardResults:${tournament.id}`
    const stored = localStorage.getItem(key)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        const results = parsed[sectionId] || []
        setBoardResults(results)
        if (results.length > 0) {
          const lastBoard = Math.max(...results.map((r: any) => r.board))
          // If all boards are played, suggest last played board (n), else n+1
          if (results.length >= tournament.boardsPerMatch) {
            setBoardNumber(lastBoard);
          } else {
            setBoardNumber(lastBoard + 1);
          }
        }
      } catch {}
    }
  }, [tournament.id, sectionId, tournament.boardsPerMatch])

  // Save boardResults to localStorage whenever it changes
  useEffect(() => {
    const key = `boardResults:${tournament.id}`
    const toStore = { [sectionId]: boardResults }
    localStorage.setItem(key, JSON.stringify(toStore))
  }, [boardResults, tournament.id])

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
      setBoardResults((prev) => {
        // Remove any existing entry for this board number
        const filtered = prev.filter((r: any) => r.board !== boardNumber)
        const updated = [
          ...filtered,
          {
            board: boardNumber,
            contract,
            declarer,
            result,
            vulnerability,
            doubled,
            imp: data.imp,
            hcp: manualHcp, // Always store N/S HCP input
            actualScore: data.actualScore,
          },
        ]
        // Sort by board number ascending
        updated.sort((a, b) => a.board - b.board)
        // If all boards are played after this entry, show popup
        if (updated.length === boardsPerMatch) {
          setShowEndPopup(true);
        }
        return updated
      })

      // Find the next unplayed board number (prefer next higher, else lowest)
      const playedBoards = boardResults.map((r: any) => r.board);
      let nextBoard = null;
      // Try to find the next higher unplayed board
      for (let i = boardNumber + 1; i <= boardsPerMatch; i++) {
        if (!playedBoards.includes(i)) {
          nextBoard = i;
          break;
        }
      }
      // If none higher, find the lowest unplayed board
      if (nextBoard === null) {
        for (let i = 1; i < boardNumber; i++) {
          if (!playedBoards.includes(i)) {
            nextBoard = i;
            break;
          }
        }
      }
      // If all boards are played, stay on current board
      if (nextBoard === null) {
        // Do not advance
      } else {
        setBoardNumber(nextBoard);
        setVulnerability(getBoardVulnerability(nextBoard));
        // Reset entry fields for next board
        setContractLevel(1)
        setContractSuit('C')
        setDeclarer('N')
        setResult(0)
        setDoubled(null)
        setManualHcp(20);
      }
    }
  }
  // Handler for extending tournament
  const handleExtendTournament = () => {
    setBoardsPerMatch(9999);
    setShowEndPopup(false);
    // Find next unplayed board
    let next = 1;
    while (boardResults.some((r: any) => r.board === next)) next++;
    setBoardNumber(next);
    setVulnerability(getBoardVulnerability(next));
    setContractLevel(1);
    setContractSuit('C');
    setDeclarer('N');
    setResult(0);
    setDoubled(null);
    setManualHcp(20);
  };

  // Handler for going back (corrections)
  const handleGoBack = () => {
    setShowEndPopup(false);
  };

  // Handler for going back to tournaments
  const handleBackToTournaments = () => {
    setShowEndPopup(false);
    onBack();
  };
  // Calculate VP using golden mean formula
  const [vpNS, vpEW] = goldenMeanVP(Math.abs(impTally), boardsPerMatch);
  const vpLabel = impTally >= 0 ? `${vpNS} - ${vpEW}` : `${vpEW} - ${vpNS}`;

  const boardsLeft = boardsPerMatch - boardsPlayed

  return (
    <div className="mx-auto w-full max-w-5xl p-3 pb-8 md:p-5">
      {/* End of tournament popup/modal */}
      {showEndPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-6 max-w-lg w-full">
            <h2 className="text-2xl font-bold mb-2">Tournament Complete</h2>
            <div className="mb-2">Total IMPs: <strong>{impTally}</strong></div>
            <div className="mb-2">Victory Points: <strong>{vpLabel}</strong></div>
            <div className="mb-4">
              <h3 className="font-semibold mb-1">Results Table</h3>
              <table className="min-w-full border text-sm">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border px-2 py-1">#</th>
                    <th className="border px-2 py-1">N/S HCP</th>
                    <th className="border px-2 py-1">Contract</th>
                    <th className="border px-2 py-1">Declarer</th>
                    <th className="border px-2 py-1">Result</th>
                    <th className="border px-2 py-1">Vul</th>
                    <th className="border px-2 py-1">Dbl</th>
                    <th className="border px-2 py-1">IMP</th>
                  </tr>
                </thead>
                <tbody>
                  {boardResults.map((r: any) => (
                    <tr key={r.board}>
                      <td className="border px-2 py-1">{r.board}</td>
                      <td className="border px-2 py-1">{r.hcp}</td>
                      <td className="border px-2 py-1">{r.contract}</td>
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
                    <td className="border px-2 py-1 text-right" colSpan={7}>Total IMP</td>
                    <td className="border px-2 py-1">{impTally}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded font-semibold" onClick={handleBackToTournaments}>Back to Tournaments</button>
              <button className="bg-green-600 text-white px-4 py-2 rounded font-semibold" onClick={handleExtendTournament}>Extend Tournament</button>
              <button className="bg-gray-400 text-white px-4 py-2 rounded font-semibold" onClick={handleGoBack}>Go Back</button>
            </div>
          </div>
        </div>
      )}
      <header className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
        <div className="flex gap-4 mb-2">
          <div className="text-sm text-slate-700 dark:text-slate-200">
            <strong>{t('section.boardEntry')}</strong> — Board {boardNumber}
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-200">
            <strong>Total IMP:</strong> {impTally}
          </div>
          <div className="text-sm text-slate-700 dark:text-slate-200">
            <strong>Victory Points:</strong> {vpLabel}
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
                max={boardsPerMatch === 9999 ? undefined : boardsPerMatch}
                className="ml-1 w-16 rounded border border-slate-300 p-1 text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                value={boardNumber === null ? '' : boardNumber}
                onChange={e => {
                  const val = e.target.value;
                  if (val === '') {
                    setBoardNumber(null as any); // allow empty
                  } else {
                    let n = Number(val);
                    if (boardsPerMatch === 9999) {
                      n = Math.max(1, n);
                    } else {
                      n = Math.max(1, Math.min(n, boardsPerMatch));
                    }
                    setBoardNumber(n);
                  }
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
                    <th className="border px-2 py-1">N/S HCP</th>
                    <th className="border px-2 py-1">Contract</th>
                    <th className="border px-2 py-1">Declarer</th>
                    <th className="border px-2 py-1">Result</th>
                    <th className="border px-2 py-1">Vul</th>
                    <th className="border px-2 py-1">Dbl</th>
                    <th className="border px-2 py-1">IMP</th>
                  </tr>
                </thead>
                <tbody>
                  {boardResults.map((r: any) => (
                    <tr key={r.board}>
                      <td className="border px-2 py-1">{r.board}</td>
                      <td className="border px-2 py-1">{r.hcp}</td>
                      <td className="border px-2 py-1">{r.contract}</td>
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
                    <td className="border px-2 py-1 text-right" colSpan={7}>Total IMP</td>
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
                data-testid="hcp-input"
                type="number"
                min={0}
                max={40}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={manualHcp === null ? '' : manualHcp}
                onChange={event => {
                  const val = event.target.value;
                  if (val === '') {
                    setManualHcp(null as any); // allow empty
                  } else {
                    setManualHcp(Number(val));
                  }
                }}
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
            <p data-testid="hcp-error" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{errorText}</p>
          ) : null}
        </section>

        {data ? <ScoreCard data={data} /> : null}
      </div>
    </div>
  );
}
