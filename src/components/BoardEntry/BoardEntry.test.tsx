import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BoardEntry from './index'
import { I18nProvider } from '../../i18n/I18nProvider'
import type { Tournament } from '../../types'

const mockTournament: Tournament = {
  id: 'test-1',
  name: 'Test Turnering',
  boardsPerMatch: 8,
  matchFormat: 'vp',
  datumSchema: 'modern',
  createdAt: new Date().toISOString(),
}

function renderWithProviders() {
  return render(
    <I18nProvider>
      <BoardEntry tournament={mockTournament} onBack={() => undefined} />
    </I18nProvider>,
  )
}

describe('BoardEntry', () => {
  it('renders a scored board using defaults', () => {
    renderWithProviders()

    expect(screen.getByText('Spilresultat')).toBeInTheDocument()
    expect(screen.getByText('+3', { selector: 'p' })).toBeInTheDocument()
  })

  it('shows validation error for invalid HCP', () => {
    renderWithProviders()

    const hcpInput = screen.getByLabelText('Manuel melder-HCP (0-40)')
    fireEvent.change(hcpInput, { target: { value: '41' } })

    expect(
      screen.getByText('Melder-HCP skal være et heltal mellem 0 og 40.'),
    ).toBeInTheDocument()
  })

  it('limits result choices by contract level', () => {
    renderWithProviders()

    const levelSelect = screen.getByLabelText('Kontrakttrin')
    fireEvent.change(levelSelect, { target: { value: '2' } })

    const resultSelect = screen.getByLabelText('Resultat (i forhold til kontrakt)')
    expect(resultSelect).toHaveTextContent('-8')
    expect(resultSelect).toHaveTextContent('+5')
    expect(resultSelect).not.toHaveTextContent('-10')
    expect(resultSelect).not.toHaveTextContent('+6')
  })

  it('toggles schema preview table', () => {
    renderWithProviders()

    expect(
      screen.queryByText('Forhåndsvisning af score-skema (HCP → point)'),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Vis datum-skema' }))

    expect(
      screen.getByText('Forhåndsvisning af score-skema (HCP → point)'),
    ).toBeInTheDocument()
    expect(screen.getByText('20')).toBeInTheDocument()
    expect(screen.getByText('37')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Skjul datum-skema' }))

    expect(
      screen.queryByText('Forhåndsvisning af score-skema (HCP → point)'),
    ).not.toBeInTheDocument()
  })
})
