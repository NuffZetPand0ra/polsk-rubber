import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import BoardEntry from './index'

describe('BoardEntry', () => {
  it('renders a scored board using defaults', () => {
    render(<BoardEntry />)

    expect(screen.getByText('Board Result')).toBeInTheDocument()
    expect(screen.getByText('+3')).toBeInTheDocument()
  })

  it('shows validation error for invalid HCP', () => {
    render(<BoardEntry />)

    const hcpInput = screen.getByLabelText('Manual Declaring HCP (0-40)')
    fireEvent.change(hcpInput, { target: { value: '41' } })

    expect(
      screen.getByText('Declaring HCP must be an integer between 0 and 40.'),
    ).toBeInTheDocument()
  })
})
