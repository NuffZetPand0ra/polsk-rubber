import type { Language } from '../../i18n/translations'

import enGettingStarted from './en/getting-started.md?raw'
import daGettingStarted from './da/getting-started.md?raw'
import enScoringDatum from './en/scoring-datum.md?raw'
import daScoringDatum from './da/scoring-datum.md?raw'
import enTournamentWorkflow from './en/tournament-workflow.md?raw'
import daTournamentWorkflow from './da/tournament-workflow.md?raw'

export type ManualSlug = 'getting-started' | 'scoring-datum' | 'tournament-workflow'

interface ManualDefinition {
  slug: ManualSlug
  titleKey: 'manuals.topic.gettingStarted' | 'manuals.topic.scoringDatum' | 'manuals.topic.tournamentWorkflow'
  descriptionKey:
    | 'manuals.topicDescription.gettingStarted'
    | 'manuals.topicDescription.scoringDatum'
    | 'manuals.topicDescription.tournamentWorkflow'
  content: Partial<Record<Language, string>>
}

export interface ResolvedManual {
  slug: ManualSlug
  titleKey: ManualDefinition['titleKey']
  descriptionKey: ManualDefinition['descriptionKey']
  content: string
  renderedLanguage: Language
  usedFallback: boolean
}

export const MANUALS: ManualDefinition[] = [
  {
    slug: 'getting-started',
    titleKey: 'manuals.topic.gettingStarted',
    descriptionKey: 'manuals.topicDescription.gettingStarted',
    content: {
      da: daGettingStarted,
      en: enGettingStarted,
    },
  },
  {
    slug: 'scoring-datum',
    titleKey: 'manuals.topic.scoringDatum',
    descriptionKey: 'manuals.topicDescription.scoringDatum',
    content: {
      da: daScoringDatum,
      en: enScoringDatum,
    },
  },
  {
    slug: 'tournament-workflow',
    titleKey: 'manuals.topic.tournamentWorkflow',
    descriptionKey: 'manuals.topicDescription.tournamentWorkflow',
    content: {
      da: daTournamentWorkflow,
      en: enTournamentWorkflow,
    },
  },
]

export function resolveManual(slug: ManualSlug, language: Language): ResolvedManual {
  const manual = MANUALS.find((candidate) => candidate.slug === slug)
  if (!manual) {
    throw new Error(`Unknown manual slug: ${slug}`)
  }

  const localized = manual.content[language]
  if (localized) {
    return {
      slug: manual.slug,
      titleKey: manual.titleKey,
      descriptionKey: manual.descriptionKey,
      content: localized,
      renderedLanguage: language,
      usedFallback: false,
    }
  }

  const fallback = manual.content.en
  if (!fallback) {
    throw new Error(`Missing fallback manual content for slug: ${slug}`)
  }

  return {
    slug: manual.slug,
    titleKey: manual.titleKey,
    descriptionKey: manual.descriptionKey,
    content: fallback,
    renderedLanguage: 'en',
    usedFallback: true,
  }
}
