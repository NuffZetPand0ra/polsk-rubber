import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { useI18n } from '../../i18n/I18nProvider'
import { useTheme } from '../../hooks/useTheme'
import { MANUALS, resolveManual, type ManualSlug } from '../../data/manuals/manifest'

interface Props {
  onBack: () => void
}

export default function Manuals({ onBack }: Props) {
  const { language, setLanguage, t } = useI18n()
  const { isDark, toggleTheme } = useTheme()
  const [selectedManualSlug, setSelectedManualSlug] = useState<ManualSlug>('getting-started')

  const selectedManual = resolveManual(selectedManualSlug, language)

  return (
    <div className="mx-auto w-full max-w-6xl p-3 pb-8 md:p-5">
      <header className="mb-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <button
              type="button"
              onClick={onBack}
              className="mb-1 inline-flex items-center text-xs font-semibold text-primary hover:underline"
            >
              {t('manuals.backToHome')}
            </button>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900 dark:text-slate-100 md:text-4xl">
              {t('manuals.title')}
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-slate-600 dark:text-slate-300 md:text-base">
              {t('manuals.intro')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLanguage(language === 'da' ? 'en' : 'da')}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              aria-label="Toggle language"
            >
              {language === 'da' ? 'EN' : 'DA'}
            </button>
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
              aria-label="Toggle theme"
            >
              {isDark ? t('theme.light') : t('theme.dark')}
            </button>
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
            {t('manuals.section.topics')}
          </h2>
          <div className="mt-3 space-y-2">
            {MANUALS.map((manual) => {
              const isActive = manual.slug === selectedManualSlug
              return (
                <button
                  key={manual.slug}
                  type="button"
                  onClick={() => setSelectedManualSlug(manual.slug)}
                  className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                    isActive
                      ? 'border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-600 dark:bg-blue-900/30 dark:text-blue-200'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800'
                  }`}
                >
                  <p className="font-semibold">{t(manual.titleKey)}</p>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t(manual.descriptionKey)}</p>
                </button>
              )
            })}
          </div>
        </aside>

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-6">
          {selectedManual.usedFallback ? (
            <p className="mb-4 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
              {t('manuals.fallbackNotice')}
            </p>
          ) : null}

          <article className="prose prose-slate max-w-none dark:prose-invert">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedManual.content}</ReactMarkdown>
          </article>
        </section>
      </div>
    </div>
  )
}
