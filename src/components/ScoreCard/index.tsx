import type { MatchFormat, ScoreBoardOutput } from '../../types'
import { useI18n } from '../../i18n/I18nProvider'

interface ScoreCardProps {
  data: ScoreBoardOutput
  matchFormat?: MatchFormat
}

// Always show IMP from declarer's perspective
function getDeclarerImp(data: ScoreBoardOutput, declarer: 'NS' | 'EW'): number {
  return declarer === 'NS' ? data.imp : -data.imp
}

// BAM score from declarer's perspective: +1, -1, or 0
function getDeclarerBam(data: ScoreBoardOutput, declarer: 'NS' | 'EW'): 1 | -1 | 0 {
  const nsBam = data.bam as 1 | -1 | 0
  if (declarer === 'NS') return nsBam
  if (nsBam === 1) return -1
  if (nsBam === -1) return 1
  return 0
}

export default function ScoreCard({ data, matchFormat }: ScoreCardProps) {
  const { t } = useI18n()
  const declarer: 'NS' | 'EW' = data.declaringSide
  const isBam = matchFormat === 'bam'

  const declarerBam = getDeclarerBam(data, declarer)
  const bamLabel = declarerBam === 1 ? 'Win' : declarerBam === -1 ? 'Loss' : 'Tie'
  const bamScoreLabel = declarerBam > 0 ? '+1' : declarerBam < 0 ? '-1' : '0'
  const bamClass = declarerBam > 0 ? 'text-emerald-600 dark:text-emerald-400' : declarerBam < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'

  const declarerImp = getDeclarerImp(data, declarer)
  const impClass = declarerImp > 0 ? 'text-emerald-600 dark:text-emerald-400' : declarerImp < 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:sticky lg:top-5 md:p-5">
      <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 md:text-2xl">{t('section.boardResult')}</h2>

      {isBam ? (
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">BAM</p>
          <p className={`mt-2 text-5xl font-bold leading-none md:text-6xl ${bamClass}`}>
            {bamLabel}
          </p>
          <p className={`mt-1 text-lg font-semibold ${bamClass}`}>{bamScoreLabel}</p>
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 dark:border-slate-700 dark:bg-slate-800">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-700 dark:text-blue-300">{t('score.imp')}</p>
          <p className={`mt-2 text-5xl font-bold leading-none md:text-6xl ${impClass}`}>
            {declarerImp > 0 ? `+${declarerImp}` : declarerImp}
          </p>
        </div>
      )}

      <dl className="mt-4 grid grid-cols-1 gap-3 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2 md:text-base">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
          <dt className="text-slate-500 dark:text-slate-400">{t('score.declaringSide')}</dt>
          <dd className="font-semibold text-slate-900 dark:text-slate-100">{data.declaringSide}</dd>
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
          <dt className="text-slate-500 dark:text-slate-400">{t('score.actualScore')}</dt>
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
