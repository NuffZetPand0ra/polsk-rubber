import { render } from '@testing-library/react'
import { fireEvent, screen } from '@testing-library/dom'
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
  players: [],
  sessions: [],
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

    // Check that the results table is present
    expect(screen.getByText(/spilresultat/i)).toBeInTheDocument()
    // Check for a result cell with -6 (use test id or table cell)
    // Fallback: check any cell with -6 exists
    const resultCells = screen.getAllByText('-6')
    expect(resultCells.length).toBeGreaterThan(0)
  })

  it('shows validation error for invalid HCP', () => {
    renderWithProviders()

    // Use test id for HCP input
    const hcpInput = screen.getByTestId('hcp-input')
    fireEvent.change(hcpInput, { target: { value: '41' } })

    // Use test id for error message
    expect(screen.getByTestId('hcp-error')).toBeInTheDocument()
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
      screen.queryByText(/score-skema/i),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /datum-skema/i }))

    expect(
      screen.getByText(/score-skema/i),
    ).toBeInTheDocument()
    // Use getAllByText for ambiguous numbers
    expect(screen.getAllByText('20').length).toBeGreaterThan(0)
    expect(screen.getAllByText('37').length).toBeGreaterThan(0)

    fireEvent.click(screen.getByRole('button', { name: /datum-skema/i }))

    expect(
      screen.queryByText(/score-skema/i),
    ).not.toBeInTheDocument()
  })
})
