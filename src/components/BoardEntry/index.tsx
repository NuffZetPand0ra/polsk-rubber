import { useEffect, useMemo, useRef, useState } from 'react'
import ScoreCard from '../ScoreCard'
import { useTournamentStore } from '../../store/tournament'
import { useScoring } from '../../hooks/useScoring'
import { useTheme } from '../../hooks/useTheme'
import { useI18n } from '../../i18n/I18nProvider'
import { getDatumSchemaPreview } from '../../data/datum-table'
import { detectPocketColorsFromImageData } from '../../utils/camera-scan'
import { inferVulnerability } from '../../utils/handscan'
import { detectCardCornersFromImageData } from '../../utils/card-corner-detection'
import type { Doubled, Vulnerability } from '../../types'

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

export default function BoardEntry() {
  const { datumSchema, setDatumSchema } = useTournamentStore()
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()

  const [contractLevel, setContractLevel] = useState<number>(4)
  const [contractSuit, setContractSuit] = useState<(typeof contractSuits)[number]>('H')
  const [declarer, setDeclarer] = useState<'N' | 'E' | 'S' | 'W'>('N')
  const [result, setResult] = useState(0)
  const [vulnerability, setVulnerability] = useState<Vulnerability>('None')
  const [doubled, setDoubled] = useState<Doubled>(null)
  const [manualHcp, setManualHcp] = useState(24)
  const [showSchemaPreview, setShowSchemaPreview] = useState(false)
  const [boardNumber, setBoardNumber] = useState(1)
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [scanResult, setScanResult] = useState<ReturnType<typeof inferVulnerability> | null>(null)
  const [detectedColors, setDetectedColors] = useState<ReturnType<typeof detectPocketColorsFromImageData> | null>(null)
  const [visibleCornersBySeat, setVisibleCornersBySeat] = useState<Record<'north' | 'east' | 'south' | 'west', number> | null>(null)
  const [seatSuitHints, setSeatSuitHints] = useState<Record<'north' | 'east' | 'south' | 'west', 'red' | 'black' | 'unknown'> | null>(null)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

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

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        for (const track of streamRef.current.getTracks()) {
          track.stop()
        }

        streamRef.current = null
      }
    }
  }, [])

  const startCamera = async (): Promise<void> => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(t('scan.cameraUnsupported'))
      return
    }

    try {
      setCameraError(null)
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })

      streamRef.current = stream
      const videoElement = videoRef.current

      if (!videoElement) {
        setCameraError(t('scan.cameraUnsupported'))
        return
      }

      videoElement.srcObject = stream
      await videoElement.play()
      setIsCameraActive(true)
    } catch (error) {
      const message = error instanceof Error ? ` ${error.message}` : ''
      setCameraError(`${t('scan.cameraUnsupported')}${message}`.trim())
    }
  }

  const stopCamera = (): void => {
    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop()
      }

      streamRef.current = null
    }

    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.srcObject = null
    }

    setIsCameraActive(false)
  }

  const captureAndScan = (): void => {
    const videoElement = videoRef.current
    const canvasElement = canvasRef.current

    if (!videoElement || !canvasElement || !isCameraActive) {
      return
    }

    const width = videoElement.videoWidth || 640
    const height = videoElement.videoHeight || 480

    canvasElement.width = width
    canvasElement.height = height

    const context = canvasElement.getContext('2d')

    if (!context) {
      setCameraError(t('scan.cameraUnsupported'))
      return
    }

    context.drawImage(videoElement, 0, 0, width, height)
    const imageData = context.getImageData(0, 0, width, height)
    const colors = detectPocketColorsFromImageData(imageData)
    const inference = inferVulnerability(colors, boardNumber)
    const cornerDetections = detectCardCornersFromImageData(imageData, 13)

    const visibleCorners = {
      north: 0,
      east: 0,
      south: 0,
      west: 0,
    }

    const suitVotes: Record<'north' | 'east' | 'south' | 'west', { red: number; black: number }> = {
      north: { red: 0, black: 0 },
      east: { red: 0, black: 0 },
      south: { red: 0, black: 0 },
      west: { red: 0, black: 0 },
    }

    for (const entry of cornerDetections) {
      if (entry.visible) {
        visibleCorners[entry.seat] += 1
      }

      if (entry.suitHint === 'red') {
        suitVotes[entry.seat].red += 1
      }

      if (entry.suitHint === 'black') {
        suitVotes[entry.seat].black += 1
      }
    }

    const seatHints: Record<'north' | 'east' | 'south' | 'west', 'red' | 'black' | 'unknown'> = {
      north: suitVotes.north.red === suitVotes.north.black ? 'unknown' : suitVotes.north.red > suitVotes.north.black ? 'red' : 'black',
      east: suitVotes.east.red === suitVotes.east.black ? 'unknown' : suitVotes.east.red > suitVotes.east.black ? 'red' : 'black',
      south: suitVotes.south.red === suitVotes.south.black ? 'unknown' : suitVotes.south.red > suitVotes.south.black ? 'red' : 'black',
      west: suitVotes.west.red === suitVotes.west.black ? 'unknown' : suitVotes.west.red > suitVotes.west.black ? 'red' : 'black',
    }

    setDetectedColors(colors)
    setScanResult(inference)
    setVisibleCornersBySeat(visibleCorners)
    setSeatSuitHints(seatHints)
  }

  const colorLabel = (color: 'red' | 'green' | 'white' | 'unknown'): string => {
    if (color === 'red') {
      return t('scan.color.red')
    }

    if (color === 'green') {
      return t('scan.color.green')
    }

    if (color === 'white') {
      return t('scan.color.white')
    }

    return t('scan.color.unknown')
  }

  const suitHintLabel = (hint: 'red' | 'black' | 'unknown'): string => {
    if (hint === 'red') {
      return t('scan.suitHint.red')
    }

    if (hint === 'black') {
      return t('scan.suitHint.black')
    }

    return t('scan.suitHint.unknown')
  }

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

            <label className="text-sm text-slate-700 dark:text-slate-200 md:col-span-2">
              {t('scan.boardNumber')}
              <input
                type="number"
                min={1}
                step={1}
                className="mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900"
                value={boardNumber}
                onChange={(event) => setBoardNumber(Math.max(1, Number(event.target.value) || 1))}
              />
            </label>
          </div>

          <div className="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t('scan.section')}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              {!isCameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                >
                  {t('scan.startCamera')}
                </button>
              ) : null}

              {isCameraActive ? (
                <>
                  <button
                    type="button"
                    onClick={captureAndScan}
                    className="inline-flex items-center rounded-lg border border-blue-300 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 shadow-sm hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-200 dark:hover:bg-blue-900/30"
                  >
                    {t('scan.capture')}
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    {t('scan.stopCamera')}
                  </button>
                </>
              ) : null}
            </div>

            {isCameraActive ? (
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">{t('scan.cameraReady')}</p>
            ) : null}

            {cameraError ? (
              <p className="mt-2 rounded-lg border border-red-200 bg-red-50 p-2 text-xs text-red-700">{cameraError}</p>
            ) : null}

            <div className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
              <video
                ref={videoRef}
                className="h-48 w-full object-cover"
                autoPlay
                playsInline
                muted
              />
            </div>
            <canvas ref={canvasRef} className="hidden" />

            {scanResult ? (
              <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                <p className="font-semibold text-slate-900 dark:text-slate-100">{t('scan.inferenceTitle')}</p>
                <p className="mt-1 text-slate-700 dark:text-slate-200">
                  {t('field.vulnerability')}: {scanResult.vulnerability ? vulnerabilityLabelMap[scanResult.vulnerability] : t('scan.color.unknown')}
                </p>
                <p className="text-slate-600 dark:text-slate-300">
                  {t('scan.confidence')}: {Math.round(scanResult.confidence * 100)}%
                </p>

                {detectedColors ? (
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {t('scan.detectedColors')}: {t('seat.north')} {colorLabel(detectedColors.north)}, {t('seat.east')} {colorLabel(detectedColors.east)}, {t('seat.south')} {colorLabel(detectedColors.south)}, {t('seat.west')} {colorLabel(detectedColors.west)}
                  </p>
                ) : null}

                {scanResult.notes.length > 0 ? (
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                    {t('scan.notes')}: {scanResult.notes.join(' ')}
                  </p>
                ) : null}

                {visibleCornersBySeat && seatSuitHints ? (
                  <div className="mt-2 rounded-md border border-slate-200 bg-slate-50 p-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                    <p className="font-semibold">{t('scan.cardDetection')}</p>
                    <p>
                      {t('scan.cardsVisible')}: {t('seat.north')} {visibleCornersBySeat.north}, {t('seat.east')} {visibleCornersBySeat.east}, {t('seat.south')} {visibleCornersBySeat.south}, {t('seat.west')} {visibleCornersBySeat.west}
                    </p>
                    <p>
                      {t('scan.suitHints')}: {t('seat.north')} {suitHintLabel(seatSuitHints.north)}, {t('seat.east')} {suitHintLabel(seatSuitHints.east)}, {t('seat.south')} {suitHintLabel(seatSuitHints.south)}, {t('seat.west')} {suitHintLabel(seatSuitHints.west)}
                    </p>
                  </div>
                ) : null}

                {scanResult.vulnerability && scanResult.vulnerability !== vulnerability ? (
                  <button
                    type="button"
                    onClick={() => setVulnerability(scanResult.vulnerability as Vulnerability)}
                    className="mt-2 inline-flex items-center rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700 shadow-sm hover:bg-emerald-100 dark:border-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200 dark:hover:bg-emerald-900/30"
                  >
                    {t('scan.applySuggestion')}
                  </button>
                ) : null}
              </div>
            ) : null}
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
