import { render } from '@testing-library/react'
import { fireEvent, screen } from '@testing-library/dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
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

function renderBoardEntry(
  tournament: Tournament = mockTournament,
  onBack: () => void = () => undefined,
) {
  return render(
    <I18nProvider>
      <BoardEntry tournament={tournament} onBack={onBack} />
    </I18nProvider>,
  )
}

describe('BoardEntry', () => {
  beforeEach(() => {
    localStorage.clear()
  })

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

  it('moves to next board after submitting when tournament is not complete', () => {
    const twoBoardTournament: Tournament = {
      ...mockTournament,
      id: 'two-boards',
      boardsPerMatch: 2,
    }

    renderBoardEntry(twoBoardTournament)

    fireEvent.click(screen.getByRole('button', { name: /enter board result/i }))

    expect(screen.getByText(/board 2/i)).toBeInTheDocument()
  })

  it('shows completion popup and can dismiss it', () => {
    const oneBoardTournament: Tournament = {
      ...mockTournament,
      id: 'one-board',
      boardsPerMatch: 1,
    }

    renderBoardEntry(oneBoardTournament)

    fireEvent.click(screen.getByRole('button', { name: /enter board result/i }))
    expect(screen.getByText(/tournament complete/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /go back/i }))
    expect(screen.queryByText(/tournament complete/i)).not.toBeInTheDocument()
  })

  it('uses popup actions for extending and backing to tournaments', () => {
    const oneBoardTournament: Tournament = {
      ...mockTournament,
      id: 'one-board-actions',
      boardsPerMatch: 1,
    }
    const onBack = vi.fn()

    renderBoardEntry(oneBoardTournament, onBack)

    fireEvent.click(screen.getByRole('button', { name: /enter board result/i }))
    fireEvent.click(screen.getByRole('button', { name: /back to tournaments/i }))
    expect(onBack).toHaveBeenCalledTimes(1)

    fireEvent.click(screen.getByRole('button', { name: /enter board result/i }))
    fireEvent.click(screen.getByRole('button', { name: /extend tournament/i }))
    expect(screen.queryByText(/tournament complete/i)).not.toBeInTheDocument()
    expect(screen.getByDisplayValue('2')).toBeInTheDocument()
  })

  it('restores existing board result from localStorage for completed tournament', () => {
    const storedTournament: Tournament = {
      ...mockTournament,
      id: 'stored-complete',
      boardsPerMatch: 1,
    }

    localStorage.setItem(
      'boardResults:stored-complete',
      JSON.stringify({
        main: [
          {
            board: 1,
            contract: '4H',
            declarer: 'N',
            result: 1,
            vulnerability: 'NS',
            doubled: null,
            imp: 8,
            hcp: 24,
            actualScore: 650,
          },
        ],
      }),
    )

    renderBoardEntry(storedTournament)

    expect(screen.getByText(/board 1/i)).toBeInTheDocument()
    expect(screen.getByText(/board results/i)).toBeInTheDocument()
    expect(screen.getByText('4H')).toBeInTheDocument()
  })

  it('ignores invalid localStorage payloads', () => {
    const invalidStoredTournament: Tournament = {
      ...mockTournament,
      id: 'stored-invalid',
      boardsPerMatch: 8,
    }

    localStorage.setItem('boardResults:stored-invalid', '{invalid json')

    renderBoardEntry(invalidStoredTournament)

    expect(screen.getByText(/board 1/i)).toBeInTheDocument()
    expect(screen.queryByText(/board results/i)).not.toBeInTheDocument()
  })

  it('clamps and clears board number input', () => {
    const twoBoardTournament: Tournament = {
      ...mockTournament,
      id: 'board-clamp',
      boardsPerMatch: 2,
    }

    renderBoardEntry(twoBoardTournament)

    const boardInput = screen.getByLabelText('Board #')
    const submitButton = screen.getByRole('button', { name: /enter board result/i })

    fireEvent.change(boardInput, { target: { value: '9' } })
    expect(boardInput).toHaveValue(2)

    fireEvent.change(boardInput, { target: { value: '0' } })
    expect(boardInput).toHaveValue(1)

    fireEvent.change(boardInput, { target: { value: '' } })
    expect(submitButton).toBeDisabled()
  })

  it('restores stored board values when switching to an existing board and resets on a new board', () => {
    const tournament: Tournament = {
      ...mockTournament,
      id: 'switch-boards',
      boardsPerMatch: 3,
    }

    localStorage.setItem(
      'boardResults:switch-boards',
      JSON.stringify({
        main: [
          {
            board: 1,
            contract: '4H',
            declarer: 'S',
            result: 1,
            vulnerability: 'NS',
            doubled: 'X',
            imp: 9,
            hcp: 24,
            actualScore: 690,
          },
        ],
      }),
    )

    renderBoardEntry(tournament)

    expect(screen.getByDisplayValue('2')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Board #'), { target: { value: '1' } })
    expect(screen.getByDisplayValue('4')).toBeInTheDocument()
    expect(screen.getByDisplayValue('♥')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Syd')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('NS')).toBeInTheDocument()
    expect(screen.getByDisplayValue('X')).toBeInTheDocument()
    expect(screen.getByDisplayValue('24')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Board #'), { target: { value: '3' } })
    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('♣')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Nord')).toBeInTheDocument()
    expect(screen.getByDisplayValue('20')).toBeInTheDocument()
  })

  it('toggles language and theme controls', () => {
    renderBoardEntry()

    fireEvent.click(screen.getByRole('button', { name: /toggle language/i }))
    expect(screen.getByRole('heading', { name: 'Board Result' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /toggle theme/i })).toHaveTextContent(/dark mode/i)

    fireEvent.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('resets result when contract level makes the selected value invalid', () => {
    renderBoardEntry()

    fireEvent.change(screen.getByLabelText('Resultat (i forhold til kontrakt)'), {
      target: { value: '6' },
    })
    expect(screen.getByDisplayValue('+6')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText('Kontrakttrin'), { target: { value: '7' } })
    expect(screen.getByDisplayValue('Vundet')).toBeInTheDocument()
  })

  it('loads an existing board when board number is clicked in results table', () => {
    const tournament: Tournament = {
      ...mockTournament,
      id: 'click-board-load',
      boardsPerMatch: 3,
    }

    localStorage.setItem(
      'boardResults:click-board-load',
      JSON.stringify({
        main: [
          {
            board: 1,
            contract: '4H',
            declarer: 'S',
            result: 1,
            vulnerability: 'NS',
            doubled: 'X',
            imp: 9,
            hcp: 24,
            actualScore: 690,
          },
        ],
      }),
    )

    renderBoardEntry(tournament)

    fireEvent.click(screen.getByRole('button', { name: '1' }))

    expect(screen.getByDisplayValue('1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('4')).toBeInTheDocument()
    expect(screen.getByDisplayValue('♥')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Syd')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+1')).toBeInTheDocument()
    expect(screen.getByDisplayValue('X')).toBeInTheDocument()
    expect(screen.getByDisplayValue('24')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete result/i })).toBeInTheDocument()
  })

  it('deletes selected board result and resets form while keeping board number', () => {
    const tournament: Tournament = {
      ...mockTournament,
      id: 'delete-board-result',
      boardsPerMatch: 3,
    }

    localStorage.setItem(
      'boardResults:delete-board-result',
      JSON.stringify({
        main: [
          {
            board: 1,
            contract: '4H',
            declarer: 'S',
            result: 1,
            vulnerability: 'NS',
            doubled: 'X',
            imp: 9,
            hcp: 24,
            actualScore: 690,
          },
        ],
      }),
    )

    renderBoardEntry(tournament)

    fireEvent.click(screen.getByRole('button', { name: '1' }))
    fireEvent.click(screen.getByRole('button', { name: /delete result/i }))

    expect(screen.queryByText(/board results/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText('Board #')).toHaveValue(1)
    expect(screen.getByDisplayValue('♣')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Nord')).toBeInTheDocument()
    expect(screen.getByDisplayValue('20')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /delete result/i })).not.toBeInTheDocument()
  })
})
