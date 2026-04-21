import type { ScoreBoardOutput } from '../../types'
import { useI18n } from '../../i18n/I18nProvider'

interface ScoreCardProps {
  data: ScoreBoardOutput
}

export default function ScoreCard({ data }: ScoreCardProps) {
  const { t } = useI18n()
  const impClass = data.imp > 0 ? 'text-emerald-600 dark:text-emerald-400' : data.imp < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:sticky lg:top-5 md:p-5">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">{t('section.boardResult')}</h2>

      <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-slate-700 dark:bg-slate-800">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">{t('score.imp')}</p>
        <p className={`mt-2 text-5xl font-bold leading-none md:text-6xl ${impClass}`}>
          {data.imp > 0 ? `+${data.imp}` : data.imp}
        </p>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2 md:text-base">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-slate-500 dark:text-slate-400">{t('score.declaringSide')}</dt>
          <dd className="font-semibold text-slate-900 dark:text-slate-100">{data.declaringSide}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-slate-500 dark:text-slate-400">{t('score.vulnerable')}</dt>
          <dd className="font-semibold text-slate-900 dark:text-slate-100">{data.declaringVulnerable ? t('score.yes') : t('score.no')}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-slate-500 dark:text-slate-400">{t('score.declaringHcp')}</dt>
          <dd className="font-semibold text-slate-900 dark:text-slate-100">{data.declaringHcp}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-slate-500 dark:text-slate-400">{t('score.datum')}</dt>
          <dd className="font-semibold text-slate-900 dark:text-slate-100">{data.datumRaw} / {data.datumRounded}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-slate-500 dark:text-slate-400">{t('score.actualNs')}</dt>
          <dd className="font-semibold text-slate-900 dark:text-slate-100">{data.actualScore}</dd>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-slate-500 dark:text-slate-400">{t('score.diff')}</dt>
          <dd className="font-semibold text-slate-900 dark:text-slate-100">{data.diff}</dd>
        </div>
      </dl>
    </section>
  )
}
