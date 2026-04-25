import { useMemo, useState, type ChangeEvent } from 'react'
import { useTournamentStore } from '../../store/tournament'
import { useTheme } from '../../hooks/useTheme'
import { useI18n } from '../../i18n/I18nProvider'
import {
  CUSTOM_DATUM_DEFAULT_TITLE,
  getDatumSchemaPreview,
  hasCustomDatumTable,
  listCustomDatumSheets,
  loadCustomDatumTitle,
  saveCustomDatumCsv,
} from '../../data/datum-table'
import type { DatumSchema, MatchFormat, Tournament } from '../../types'

const BOARDS_OPTIONS = [8, 10, 12, 16, 20, 24, 28, 32] as const

interface Props {
  onOpen: (tournament: Tournament) => void
  justPlay?: () => void
  onOpenManuals?: () => void
}

export default function TournamentHome(props: Props) {
  const { onOpen, justPlay, onOpenManuals } = props
  const { tournaments, createTournament, deleteTournament } = useTournamentStore()
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [boardsPerMatch, setBoardsPerMatch] = useState<number>(8)
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('vp')
  const [datumSchema, setDatumSchema] = useState<Exclude<DatumSchema, 'custom'>>('modern')
  const [useCustomDatum, setUseCustomDatum] = useState(false)
  const [customDatumTitle, setCustomDatumTitle] = useState(loadCustomDatumTitle())
  const [customDatumText, setCustomDatumText] = useState('')
  const [customDatumMessage, setCustomDatumMessage] = useState<string | null>(null)
  const [customDatumMessageKind, setCustomDatumMessageKind] = useState<'success' | 'error' | null>(null)
  const [showSchemaPreview, setShowSchemaPreview] = useState(false)
  const [customSheetsVersion, setCustomSheetsVersion] = useState(0)

  const customDatumSheets = useMemo(
    () => listCustomDatumSheets(),
    [customSheetsVersion],
  )
  const defaultCustomDatumSlug = customDatumSheets[0]?.slug ?? ''
  const [selectedCustomDatumSlug, setSelectedCustomDatumSlug] = useState(defaultCustomDatumSlug)

  const customDatumAvailable = hasCustomDatumTable(selectedCustomDatumSlug || undefined)
  const schemaPreviewRows = getDatumSchemaPreview(datumSchema)

  const schemaPreviewDescription =
    datumSchema === 'modern'
      ? t('preview.description.modern')
      : datumSchema === 'polsk-rubber'
        ? t('preview.description.polskRubber')
        : t('preview.description.classic')

  const loadCustomDatumFromText = () => {
    try {
      const title = customDatumTitle.trim() || CUSTOM_DATUM_DEFAULT_TITLE
      const savedSlug = saveCustomDatumCsv(customDatumText, title)
      setCustomSheetsVersion((prev) => prev + 1)
      setSelectedCustomDatumSlug(savedSlug)
      setCustomDatumTitle(title)
      setCustomDatumMessage(t('customDatum.loaded'))
      setCustomDatumMessageKind('success')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setCustomDatumMessage(`${t('customDatum.errorPrefix')} ${message}`)
      setCustomDatumMessageKind('error')
    }
  }

  const handleCustomDatumUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    try {
      const text = await file.text()
      const title = customDatumTitle.trim() || CUSTOM_DATUM_DEFAULT_TITLE
      const savedSlug = saveCustomDatumCsv(text, title)
      setCustomSheetsVersion((prev) => prev + 1)
      setSelectedCustomDatumSlug(savedSlug)
      setCustomDatumTitle(title)
      setCustomDatumMessage(t('customDatum.loaded'))
      setCustomDatumMessageKind('success')
      setCustomDatumText(text)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      setCustomDatumMessage(`${t('customDatum.errorPrefix')} ${message}`)
      setCustomDatumMessageKind('error')
    }

    event.target.value = ''
  }

  const handleCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const activeCustomDatumSlug = selectedCustomDatumSlug || defaultCustomDatumSlug
    if (useCustomDatum && (!activeCustomDatumSlug || !hasCustomDatumTable(activeCustomDatumSlug))) return
    const selectedSchema: DatumSchema = useCustomDatum ? 'custom' : datumSchema
    const t2 = createTournament({
      name: trimmed,
      boardsPerMatch,
      matchFormat,
      datumSchema: selectedSchema,
      customDatumSlug: useCustomDatum ? activeCustomDatumSlug : undefined,
    })
    setName('')
    setBoardsPerMatch(8)
    setMatchFormat('vp')
    setDatumSchema('modern')
    setUseCustomDatum(false)
    setSelectedCustomDatumSlug(defaultCustomDatumSlug)
    setShowForm(false)
    onOpen(t2)
  }

  const handleDelete = (tournament: Tournament) => {
    if (window.confirm(t('tournament.deleteConfirm'))) {
      deleteTournament(tournament.id)
    }
  }

  const inputClass =
    'mt-1 block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-blue-900'

  const selectClass = inputClass

  // Remove local justPlay state, use prop instead
  return (
    <div className="mx-auto w-full max-w-2xl p-3 pb-8 md:p-5">
      <header className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
        <div className="mb-3 flex justify-end gap-2">
          {onOpenManuals ? (
            <button
              type="button"
              onClick={onOpenManuals}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {t('manuals.open')}
            </button>
          ) : null}
          {justPlay && (
            <button
              type="button"
              onClick={justPlay}
              className="inline-flex items-center rounded-lg border border-green-300 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 shadow-sm hover:bg-green-100 dark:border-green-700 dark:bg-green-900/20 dark:text-green-200 dark:hover:bg-green-900/30"
            >
              🎲 Just Play
            </button>
          )}
        </div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
              {t('app.badge')}
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100 md:text-4xl">
              {t('tournament.title')}
            </h1>
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

      {/* New tournament form */}
      {showForm ? (
        <section className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            {t('tournament.new')}
          </h2>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-slate-700 dark:text-slate-200 sm:col-span-2">
              {t('tournament.name')}
              <input
                type="text"
                className={inputClass}
                placeholder={t('tournament.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                autoFocus
              />
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('tournament.boardsPerMatch')}
              <select
                className={selectClass}
                value={boardsPerMatch}
                onChange={(e) => setBoardsPerMatch(Number(e.target.value))}
              >
                {BOARDS_OPTIONS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('tournament.matchFormat')}
              <select
                className={selectClass}
                value={matchFormat}
                onChange={(e) => setMatchFormat(e.target.value as MatchFormat)}
              >
                <option value="vp">{t('tournament.format.vp')}</option>
                <option value="carry-over">{t('tournament.format.carryOver')}</option>
              </select>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200">
              {t('schema.label')}
              <div className="mt-1 flex items-center gap-2">
                <select
                  className={`${selectClass} mt-0 ${useCustomDatum ? 'cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500' : ''}`}
                  value={datumSchema}
                  onChange={(e) => setDatumSchema(e.target.value as Exclude<DatumSchema, 'custom'>)}
                  disabled={useCustomDatum}
                >
                  <option value="modern">{t('schema.modern')}</option>
                  <option value="polsk-rubber">{t('schema.polskRubber')}</option>
                  <option value="classic">{t('schema.classic')}</option>
                </select>
                <button
                  type="button"
                  onClick={() => setShowSchemaPreview(true)}
                  disabled={useCustomDatum}
                  className="inline-flex shrink-0 items-center rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700 dark:disabled:bg-slate-700 dark:disabled:text-slate-500"
                >
                  {t('preview.button.open')}
                </button>
              </div>
            </label>

            <label className="text-sm text-slate-700 dark:text-slate-200 sm:col-span-2">
              <input
                type="checkbox"
                checked={useCustomDatum}
                onChange={(event) => setUseCustomDatum(event.target.checked)}
                className="mr-2 h-4 w-4 align-middle"
              />
              {t('customDatum.useCustom')}
            </label>

            {useCustomDatum ? (
              <div className="sm:col-span-2">
                {customDatumSheets.length > 0 ? (
                  <label className="text-sm text-slate-700 dark:text-slate-200">
                    {t('customDatum.savedSheets')}
                    <select
                      className={selectClass}
                      value={selectedCustomDatumSlug || customDatumSheets[0]?.slug || ''}
                      onChange={(event) => {
                        const slug = event.target.value
                        setSelectedCustomDatumSlug(slug)
                        setCustomDatumTitle(loadCustomDatumTitle(slug))
                      }}
                    >
                      {customDatumSheets.map((sheet) => (
                        <option key={sheet.slug} value={sheet.slug}>
                          {sheet.title}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
                <label className="text-sm text-slate-700 dark:text-slate-200">
                  {t('customDatum.title')}
                  <input
                    type="text"
                    className={inputClass}
                    value={customDatumTitle}
                    onChange={(event) => setCustomDatumTitle(event.target.value)}
                    placeholder={t('customDatum.titlePlaceholder')}
                  />
                </label>
                <label className="text-sm text-slate-700 dark:text-slate-200">
                  {t('customDatum.upload')}
                  <input
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    className={inputClass}
                    onChange={handleCustomDatumUpload}
                  />
                </label>
                <label className="mt-3 block text-sm text-slate-700 dark:text-slate-200">
                  {t('customDatum.pasteLabel')}
                  <textarea
                    className={`${inputClass} min-h-28`}
                    placeholder={t('customDatum.pastePlaceholder')}
                    value={customDatumText}
                    onChange={(event) => setCustomDatumText(event.target.value)}
                  />
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={loadCustomDatumFromText}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    {t('customDatum.applyText')}
                  </button>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{t('customDatum.hint')}</p>
                </div>
                {!customDatumAvailable ? (
                  <p className="mt-1 text-xs text-red-600 dark:text-red-400">{t('customDatum.required')}</p>
                ) : null}
                {customDatumMessage ? (
                  <p className={`mt-1 text-xs ${
                    customDatumMessageKind === 'error'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-emerald-700 dark:text-emerald-300'
                  }`}>
                    {customDatumMessage}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={!name.trim() || (useCustomDatum && !customDatumAvailable)}
              className="inline-flex items-center rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-100 disabled:opacity-40 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-200 dark:hover:bg-blue-900/30"
            >
              {t('tournament.create')}
            </button>
            <button
              type="button"
              onClick={() => { setShowForm(false); setName('') }}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              {t('tournament.cancel')}
            </button>
          </div>
        </section>
      ) : (
        <div className="mb-4">
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center rounded-lg border border-blue-300 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm hover:bg-blue-100 dark:border-blue-700 dark:bg-blue-900/20 dark:text-blue-200 dark:hover:bg-blue-900/30"
          >
            + {t('tournament.new')}
          </button>
        </div>
      )}

      {/* Tournament list */}
      <section className="rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        {tournaments.length === 0 ? (
          <p className="p-6 text-sm text-slate-500 dark:text-slate-400">
            {t('tournament.empty')}
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {tournaments.map((tournament) => (
              <li key={tournament.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
                    {tournament.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {tournament.boardsPerMatch} {t('tournament.boards')} ·{' '}
                    {tournament.matchFormat === 'vp'
                      ? t('tournament.format.vp')
                      : t('tournament.format.carryOver')}{' '}
                    · {tournament.datumSchema === 'modern'
                      ? t('schema.modern')
                      : tournament.datumSchema === 'polsk-rubber'
                        ? t('schema.polskRubber')
                        : tournament.datumSchema === 'classic'
                        ? t('schema.classic')
                        : t('schema.custom')}
                  </p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => onOpen(tournament)}
                    className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
                  >
                    {t('tournament.open')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tournament)}
                    className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 shadow-sm hover:bg-red-100 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/30"
                  >
                    {t('tournament.delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {showSchemaPreview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-3">
          <div className="w-full max-w-lg rounded-xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{t('preview.title')}</h3>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">{schemaPreviewDescription}</p>
            </div>
            <div className="max-h-72 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800">
                  <tr className="text-left text-xs uppercase tracking-wide text-slate-600 dark:text-slate-300">
                    <th className="px-4 py-2">{t('preview.hcp')}</th>
                    <th className="px-4 py-2">{t('preview.nv')}</th>
                    <th className="px-4 py-2">{t('preview.vul')}</th>
                  </tr>
                </thead>
                <tbody>
                  {schemaPreviewRows.map((row) => (
                    <tr key={row.hcp} className="border-t border-slate-100 text-slate-700 dark:border-slate-800 dark:text-slate-200">
                      <td className="px-4 py-2 font-medium">{row.hcp}</td>
                      <td className="px-4 py-2">{row.nv}</td>
                      <td className="px-4 py-2">{row.vul}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end border-t border-slate-200 px-4 py-3 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setShowSchemaPreview(false)}
                className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              >
                {t('preview.button.close')}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
