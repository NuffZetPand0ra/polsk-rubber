import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { I18nProvider } from '../../i18n/I18nProvider'
import type { ScoreBoardOutput } from '../../types'
import ScoreCard from './index'

function renderScoreCard(data: ScoreBoardOutput) {
  return render(
    <I18nProvider>
      <ScoreCard data={data} />
    </I18nProvider>,
  )
}

describe('ScoreCard', () => {
  it('shows positive IMP from NS declarer perspective', () => {
    renderScoreCard({
      majoritySide: 'NS',
      majorityHcp: 24,
      declaringSide: 'NS',
      declaringHcp: 24,
      datumRaw: 330,
      datumRounded: 330,
      actualScore: 420,
      diff: 90,
      imp: 3,
      bam: 1,
    })

    expect(screen.getByText('+3')).toBeInTheDocument()
    expect(screen.getByText('NS')).toBeInTheDocument()
  })

  it('flips IMP sign for EW declarer perspective', () => {
    renderScoreCard({
      majoritySide: 'EW',
      majorityHcp: 26,
      declaringSide: 'EW',
      declaringHcp: 26,
      datumRaw: -450,
      datumRounded: -450,
      actualScore: -620,
      diff: -170,
      imp: -5,
      bam: -1,
    })

    expect(screen.getByText('+5')).toBeInTheDocument()
    expect(screen.getByText('EW')).toBeInTheDocument()
  })

  it('shows zero IMP without a plus sign', () => {
    renderScoreCard({
      majoritySide: 'NS',
      majorityHcp: 20,
      declaringSide: 'NS',
      declaringHcp: 20,
      datumRaw: 0,
      datumRounded: 0,
      actualScore: 0,
      diff: 0,
      imp: 0,
      bam: 0,
    })

    expect(screen.queryByText('+0')).not.toBeInTheDocument()
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
  })
})