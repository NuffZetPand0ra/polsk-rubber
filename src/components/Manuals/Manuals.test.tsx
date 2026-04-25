import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'

import Manuals from './index'
import { I18nProvider } from '../../i18n/I18nProvider'

function renderManuals() {
  return render(
    <I18nProvider>
      <Manuals onBack={() => undefined} />
    </I18nProvider>,
  )
}

describe('Manuals', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders manuals page and default document for english language', () => {
    localStorage.setItem('polsk-rubber-language', 'en')
    renderManuals()

    expect(screen.getByRole('heading', { name: 'User Manuals' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Getting Started' })).toBeInTheDocument()
  })

  it('switches document when selecting a different topic', () => {
    localStorage.setItem('polsk-rubber-language', 'en')
    renderManuals()

    fireEvent.click(screen.getByRole('button', { name: /Scoring and Datum/i }))

    expect(screen.getByRole('heading', { name: 'Scoring and Datum' })).toBeInTheDocument()
    expect(screen.getByText(/The app calculates IMP from the difference/i)).toBeInTheDocument()
  })
})
