import { render, renderHook, screen } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, describe, expect, it } from 'vitest'
import { I18nProvider, useI18n } from './I18nProvider'

function LanguageProbe() {
  const { language, setLanguage, t } = useI18n()

  return (
    <>
      <div>{language}</div>
      <div>{t('section.boardResult')}</div>
      <button type="button" onClick={() => setLanguage(language === 'da' ? 'en' : 'da')}>
        toggle
      </button>
    </>
  )
}

describe('I18nProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to Danish when no saved language exists', () => {
    render(
      <I18nProvider>
        <LanguageProbe />
      </I18nProvider>,
    )

    expect(screen.getByText('da')).toBeInTheDocument()
    expect(screen.getByText('Spilresultat')).toBeInTheDocument()
  })

  it('restores saved language from localStorage and persists updates', () => {
    localStorage.setItem('polsk-rubber-language', 'en')

    render(
      <I18nProvider>
        <LanguageProbe />
      </I18nProvider>,
    )

    expect(screen.getByText('en')).toBeInTheDocument()
    expect(screen.getByText('Board Result')).toBeInTheDocument()

    act(() => {
      screen.getByRole('button', { name: 'toggle' }).click()
    })

    expect(localStorage.getItem('polsk-rubber-language')).toBe('da')
    expect(screen.getByText('Spilresultat')).toBeInTheDocument()
  })

  it('falls back to Danish for invalid saved values', () => {
    localStorage.setItem('polsk-rubber-language', 'fr')

    render(
      <I18nProvider>
        <LanguageProbe />
      </I18nProvider>,
    )

    expect(screen.getByText('da')).toBeInTheDocument()
  })

  it('throws when useI18n is used outside the provider', () => {
    expect(() => renderHook(() => useI18n())).toThrowError(
      /useI18n must be used within I18nProvider/,
    )
  })
})