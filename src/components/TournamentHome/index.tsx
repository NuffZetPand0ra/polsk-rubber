import { useState } from 'react'
import { useTournamentStore } from '../../store/tournament'
import { useTheme } from '../../hooks/useTheme'
import { useI18n } from '../../i18n/I18nProvider'
import type { DatumSchema, MatchFormat, Tournament } from '../../types'

const BOARDS_OPTIONS = [8, 10, 12, 16, 20, 24, 28, 32] as const

interface Props {
  onOpen: (tournament: Tournament) => void
  justPlay?: () => void
}

export default function TournamentHome(props: Props) {
  const { onOpen, justPlay } = props
  const { tournaments, createTournament, deleteTournament } = useTournamentStore()
  const { isDark, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useI18n()

  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [boardsPerMatch, setBoardsPerMatch] = useState<number>(8)
  const [matchFormat, setMatchFormat] = useState<MatchFormat>('vp')
  const [datumSchema, setDatumSchema] = useState<DatumSchema>('modern')

  const handleCreate = () => {
    const trimmed = name.trim()
    if (!trimmed) return
    const t2 = createTournament({ name: trimmed, boardsPerMatch, matchFormat, datumSchema })
    setName('')
    setBoardsPerMatch(8)
    setMatchFormat('vp')
    setDatumSchema('modern')
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
        <div className="mb-3 flex justify-end">
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
              <select
                className={selectClass}
                value={datumSchema}
                onChange={(e) => setDatumSchema(e.target.value as DatumSchema)}
              >
                <option value="modern">{t('schema.modern')}</option>
                <option value="classic">{t('schema.classic')}</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex gap-2">
            <button
              type="button"
              onClick={handleCreate}
              disabled={!name.trim()}
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
                    · {tournament.datumSchema === 'modern' ? t('schema.modern') : t('schema.classic')}
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
    </div>
  )
}
