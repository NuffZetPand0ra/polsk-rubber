import type { ScoreBoardOutput } from '../../types'

interface ScoreCardProps {
  data: ScoreBoardOutput
}

export default function ScoreCard({ data }: ScoreCardProps) {
  const impClass = data.imp > 0 ? 'text-emerald-300' : data.imp < 0 ? 'text-rose-300' : 'text-stone-200'

  return (
    <section className="rounded-2xl border border-stone-700 bg-stone-900/70 p-5 shadow-lg shadow-black/30">
      <h2 className="font-serif text-2xl text-amber-100">Board Result</h2>
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm text-stone-200 md:text-base">
        <div>
          <dt className="text-stone-400">Declaring Side</dt>
          <dd className="font-semibold">{data.declaringSide}</dd>
        </div>
        <div>
          <dt className="text-stone-400">Vulnerable</dt>
          <dd className="font-semibold">{data.declaringVulnerable ? 'Yes' : 'No'}</dd>
        </div>
        <div>
          <dt className="text-stone-400">Declaring HCP</dt>
          <dd className="font-semibold">{data.declaringHcp}</dd>
        </div>
        <div>
          <dt className="text-stone-400">Datum (raw/rounded)</dt>
          <dd className="font-semibold">{data.datumRaw} / {data.datumRounded}</dd>
        </div>
        <div>
          <dt className="text-stone-400">Actual Score (NS)</dt>
          <dd className="font-semibold">{data.actualScore}</dd>
        </div>
        <div>
          <dt className="text-stone-400">Diff</dt>
          <dd className="font-semibold">{data.diff}</dd>
        </div>
      </dl>
      <p className="mt-6 text-lg text-stone-300">IMP</p>
      <p className={`text-5xl font-bold ${impClass}`}>{data.imp > 0 ? `+${data.imp}` : data.imp}</p>
    </section>
  )
}
