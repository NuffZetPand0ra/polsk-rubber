import {
  createContext,
  type PropsWithChildren,
  useContext,
  useMemo,
  useState,
} from 'react'
import {
  translations,
  type Language,
  type TranslationKey,
} from './translations'

const STORAGE_KEY = 'polsk-rubber-language'

interface I18nContextValue {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getInitialLanguage(): Language {
  if (typeof window === 'undefined') {
    return 'da'
  }

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (saved === 'da' || saved === 'en') {
    return saved
  }

  return 'da'
}

export function I18nProvider({ children }: PropsWithChildren) {
  const [language, setLanguageState] = useState<Language>(() =>
    getInitialLanguage(),
  )

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage)
    }
  }

  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      setLanguage,
      t: (key) => translations[language][key],
    }),
    [language],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }

  return context
}
