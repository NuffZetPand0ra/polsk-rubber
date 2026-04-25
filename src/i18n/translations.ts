export type Language = 'da' | 'en'

export type TranslationKey =
  | 'app.badge'
  | 'app.heading'
  | 'app.intro'
  | 'app.offlineNote'
  | 'steps.one'
  | 'steps.two'
  | 'steps.three'
  | 'theme.light'
  | 'theme.dark'
  | 'section.boardEntry'
  | 'section.boardResult'
  | 'schema.label'
  | 'schema.modern'
  | 'schema.polskRubber'
  | 'schema.classic'
  | 'schema.custom'
  | 'customDatum.upload'
  | 'customDatum.useCustom'
  | 'customDatum.title'
  | 'customDatum.titlePlaceholder'
  | 'customDatum.pasteLabel'
  | 'customDatum.pastePlaceholder'
  | 'customDatum.applyText'
  | 'customDatum.hint'
  | 'customDatum.loaded'
  | 'customDatum.required'
  | 'customDatum.errorPrefix'
  | 'field.contract'
  | 'field.contractLevel'
  | 'field.contractSuit'
  | 'field.declarer'
  | 'field.result'
  | 'field.vulnerability'
  | 'field.doubled'
  | 'field.manualHcp'
  | 'seat.north'
  | 'seat.east'
  | 'seat.south'
  | 'seat.west'
  | 'vul.none'
  | 'vul.ns'
  | 'vul.ew'
  | 'vul.both'
  | 'doubled.undoubled'
  | 'error.invalidHcp'
  | 'error.scoringFailed'
  | 'score.imp'
  | 'score.declaringSide'
  | 'score.vulnerable'
  | 'score.yes'
  | 'score.no'
  | 'score.declaringHcp'
  | 'score.datum'
  | 'score.actualNs'
  | 'score.actualScore'
  | 'score.diff'
  | 'result.made'
  | 'preview.button.show'
  | 'preview.button.hide'
  | 'preview.button.open'
  | 'preview.button.close'
  | 'preview.title'
  | 'preview.description.modern'
  | 'preview.description.polskRubber'
  | 'preview.description.classic'
  | 'preview.hcp'
  | 'preview.nv'
  | 'preview.vul'
  | 'tournament.title'
  | 'tournament.new'
  | 'tournament.name'
  | 'tournament.namePlaceholder'
  | 'tournament.boardsPerMatch'
  | 'tournament.matchFormat'
  | 'tournament.format.vp'
  | 'tournament.format.carryOver'
  | 'tournament.create'
  | 'tournament.cancel'
  | 'tournament.delete'
  | 'tournament.deleteConfirm'
  | 'tournament.open'
  | 'tournament.empty'
  | 'tournament.boards'
  | 'tournament.createdAt'
  | 'tournament.lastEditedAt'
  | 'tournament.boardsPlayed'
  | 'tournament.backToList'
  | 'manuals.open'
  | 'manuals.backToHome'
  | 'manuals.title'
  | 'manuals.intro'
  | 'manuals.section.topics'
  | 'manuals.fallbackNotice'
  | 'manuals.topic.gettingStarted'
  | 'manuals.topic.scoringDatum'
  | 'manuals.topic.tournamentWorkflow'
  | 'manuals.topicDescription.gettingStarted'
  | 'manuals.topicDescription.scoringDatum'
  | 'manuals.topicDescription.tournamentWorkflow'

export const translations: Record<Language, Record<TranslationKey, string>> = {
  da: {
    'app.badge': 'Polsk Rubber',
    'app.heading': 'Spilscoring',
    'app.intro':
      'Indtast kontrakt, zonsestilling og doblinger, og sammenlign faktisk resultat med HCP-datum i IMP.',
    'app.offlineNote': 'Virker fuldt offline.',
    'steps.one': 'Kontrakt + Spilfører.',
    'steps.two': 'Zonsestilling, doblinger, HCP.',
    'steps.three': 'Datum, diff, IMP.',
    'theme.light': 'Lys tilstand',
    'theme.dark': 'Mørk tilstand',
    'section.boardEntry': 'Spilindtastning',
    'section.boardResult': 'Spilresultat',
    'schema.label': 'Datum-skema',
    'schema.modern': 'Moderne',
    'schema.polskRubber': 'Polsk Rubber',
    'schema.classic': 'Klassisk',
    'schema.custom': 'Brugerdefineret',
    'customDatum.upload': 'Upload datum-fil (CSV/TXT)',
    'customDatum.useCustom': 'Brug brugerdefineret datum-format',
    'customDatum.title': 'Titel for brugerdefineret datum',
    'customDatum.titlePlaceholder': 'Fx Klub Datum 2026',
    'customDatum.pasteLabel': 'Eller indsat datum-tekst',
    'customDatum.pastePlaceholder': 'HCP, non vul, vul\n20,0,0\n21,90,90',
    'customDatum.applyText': 'Gem indsatte datum-data',
    'customDatum.hint': 'Kolonner: HCP, non vul, vul. Komma eller semikolon. Header er valgfri.',
    'customDatum.loaded': 'Brugerdefineret datum-skema er indlæst.',
    'customDatum.required': 'Upload eller indsæt et gyldigt brugerdefineret datum-skema for at fortsætte.',
    'customDatum.errorPrefix': 'Kunne ikke indlæse datum-skema:',
    'field.contract': 'Kontrakt (fx 4H, 3NT)',
    'field.contractLevel': 'Kontrakttrin',
    'field.contractSuit': 'Kontraktfarve',
    'field.declarer': 'Spilfører',
    'field.result': 'Resultat (i forhold til kontrakt)',
    'field.vulnerability': 'Zonsestilling',
    'field.doubled': 'Doble',
    'field.manualHcp': 'N/S HCP (0-40)',
    'seat.north': 'Nord',
    'seat.east': 'Øst',
    'seat.south': 'Syd',
    'seat.west': 'Vest',
    'vul.none': 'Ingen',
    'vul.ns': 'NS',
    'vul.ew': 'ØV',
    'vul.both': 'Alle',
    'doubled.undoubled': 'Uden dobling',
    'error.invalidHcp': 'Spilfører-HCP skal være et heltal mellem 0 og 40.',
    'error.scoringFailed': 'Scoringen kunne ikke beregnes.',
    'score.imp': 'IMP',
    'score.declaringSide': 'Spilfører-side',
    'score.vulnerable': 'Zonestillet',
    'score.yes': 'Ja',
    'score.no': 'Nej',
    'score.declaringHcp': 'Spilfører-HCP',
    'score.datum': 'Datum (rå/afrundet)',
    'score.actualNs': 'Faktisk score (NS)',
    'score.actualScore': 'Faktisk score',
    'score.diff': 'Diff',
    'result.made': 'Vundet',
    'preview.button.show': 'Vis datum-skema',
    'preview.button.hide': 'Skjul datum-skema',
    'preview.button.open': 'Forhåndsvis',
    'preview.button.close': 'Luk',
    'preview.title': 'Forhåndsvisning af score-skema (HCP → point)',
    'preview.description.modern': 'Moderne skema med fokus på sammenhængende progression fra delkontrakter til udgange og slam.',
    'preview.description.polskRubber': 'Polsk Rubber-skema med de faste klubværdier for HCP-intervaller.',
    'preview.description.classic': 'Klassisk skema med den traditionelle datumskala.',
    'preview.hcp': 'HCP',
    'preview.nv': 'UZ',
    'preview.vul': 'IZ',
    'tournament.title': 'Turneringer',
    'tournament.new': 'Ny turnering',
    'tournament.name': 'Navn',
    'tournament.namePlaceholder': 'Fx Klubmesterskab 2026',
    'tournament.boardsPerMatch': 'Spil pr. kamp',
    'tournament.matchFormat': 'Kampformat',
    'tournament.format.vp': 'Kamppoint (VP)',
    'tournament.format.carryOver': 'Carry-over IMP',
    'tournament.create': 'Opret turnering',
    'tournament.cancel': 'Annuller',
    'tournament.delete': 'Slet',
    'tournament.deleteConfirm': 'Er du sikker på, at du vil slette denne turnering og alle dens kampe?',
    'tournament.open': 'Åbn',
    'tournament.empty': 'Ingen turneringer endnu. Opret en for at komme i gang.',
    'tournament.boards': 'spil/kamp',
    'tournament.createdAt': 'Oprettet',
    'tournament.lastEditedAt': 'Senest redigeret',
    'tournament.boardsPlayed': 'Spillede spil',
    'tournament.backToList': '← Turneringer',
    'manuals.open': 'Manualer',
    'manuals.backToHome': '← Tilbage til turneringer',
    'manuals.title': 'Brugermanualer',
    'manuals.intro': 'Læs vejledninger om opsætning, scoring og turneringsflow. Indhold vises på aktuelt sprog med engelsk fallback ved manglende oversættelse.',
    'manuals.section.topics': 'Emner',
    'manuals.fallbackNotice': 'Denne manual findes ikke på aktuelt sprog endnu. Viser engelsk version.',
    'manuals.topic.gettingStarted': 'Kom i gang',
    'manuals.topic.scoringDatum': 'Scoring og datum',
    'manuals.topic.tournamentWorkflow': 'Turnerings-workflow',
    'manuals.topicDescription.gettingStarted': 'Oversigt over de vigtigste funktioner og hurtig opstart.',
    'manuals.topicDescription.scoringDatum': 'Forklaring af datum-opslag, diff og IMP-beregning.',
    'manuals.topicDescription.tournamentWorkflow': 'Trinvis guide fra oprettelse til afslutning af turnering.',
  },
  en: {
    'app.badge': 'Polsk Rubber',
    'app.heading': 'Board Scoring',
    'app.intro':
      'Enter contract details, apply vulnerability and doubling, and compare the actual result versus HCP datum in IMPs.',
    'app.offlineNote': 'Works fully offline.',
    'steps.one': 'Contract + declarer.',
    'steps.two': 'Vul, doubles, HCP.',
    'steps.three': 'Datum, diff, IMP.',
    'theme.light': 'Light mode',
    'theme.dark': 'Dark mode',
    'section.boardEntry': 'Board Entry',
    'section.boardResult': 'Board Result',
    'schema.label': 'Datum Schema',
    'schema.modern': 'Modern',
    'schema.polskRubber': 'Polsk Rubber',
    'schema.classic': 'Classic',
    'schema.custom': 'Custom',
    'customDatum.upload': 'Upload datum file (CSV/TXT)',
    'customDatum.useCustom': 'Use custom datum format',
    'customDatum.title': 'Custom datum title',
    'customDatum.titlePlaceholder': 'e.g. Club Datum 2026',
    'customDatum.pasteLabel': 'Or paste datum text',
    'customDatum.pastePlaceholder': 'HCP, non vul, vul\n20,0,0\n21,90,90',
    'customDatum.applyText': 'Save pasted datum data',
    'customDatum.hint': 'Columns: HCP, non vul, vul. Comma or semicolon. Header optional.',
    'customDatum.loaded': 'Custom datum schema loaded.',
    'customDatum.required': 'Upload or paste a valid custom datum schema to continue.',
    'customDatum.errorPrefix': 'Could not load datum schema:',
    'field.contract': 'Contract (e.g. 4H, 3NT)',
    'field.contractLevel': 'Contract Level',
    'field.contractSuit': 'Contract Suit',
    'field.declarer': 'Declarer',
    'field.result': 'Result (relative to contract)',
    'field.vulnerability': 'Vulnerability',
    'field.doubled': 'Doubled',
    'field.manualHcp': 'N/S HCP (0-40)',
    'seat.north': 'North',
    'seat.east': 'East',
    'seat.south': 'South',
    'seat.west': 'West',
    'vul.none': 'None',
    'vul.ns': 'NS',
    'vul.ew': 'EW',
    'vul.both': 'Both',
    'doubled.undoubled': 'Undoubled',
    'error.invalidHcp': 'Declaring HCP must be an integer between 0 and 40.',
    'error.scoringFailed': 'Unable to calculate score.',
    'score.imp': 'IMP',
    'score.declaringSide': 'Declaring Side',
    'score.vulnerable': 'Vulnerable',
    'score.yes': 'Yes',
    'score.no': 'No',
    'score.declaringHcp': 'Declaring HCP',
    'score.datum': 'Datum (raw/rounded)',
    'score.actualNs': 'Actual Score (NS)',
    'score.actualScore': 'Actual Score',
    'score.diff': 'Diff',
    'result.made': 'Made',
    'preview.button.show': 'Preview score schema',
    'preview.button.hide': 'Hide score schema',
    'preview.button.open': 'Preview',
    'preview.button.close': 'Close',
    'preview.title': 'Score schema preview (HCP to points)',
    'preview.description.modern': 'Modern schema tuned for smooth progression from part-scores to game and slam contracts.',
    'preview.description.polskRubber': 'Polsk Rubber schema using the fixed club values across HCP intervals.',
    'preview.description.classic': 'Classic schema based on the traditional datum scale.',
    'preview.hcp': 'HCP',
    'preview.nv': 'Not Vulnerable',
    'preview.vul': 'Vulnerable',
    'tournament.title': 'Tournaments',
    'tournament.new': 'New Tournament',
    'tournament.name': 'Name',
    'tournament.namePlaceholder': 'e.g. Club Championship 2026',
    'tournament.boardsPerMatch': 'Boards per match',
    'tournament.matchFormat': 'Match format',
    'tournament.format.vp': 'Victory Points (VP)',
    'tournament.format.carryOver': 'Carry-over IMP',
    'tournament.create': 'Create tournament',
    'tournament.cancel': 'Cancel',
    'tournament.delete': 'Delete',
    'tournament.deleteConfirm': 'Are you sure you want to delete this tournament and all its matches?',
    'tournament.open': 'Open',
    'tournament.empty': 'No tournaments yet. Create one to get started.',
    'tournament.boards': 'boards/match',
    'tournament.createdAt': 'Created',
    'tournament.lastEditedAt': 'Last edited',
    'tournament.boardsPlayed': 'Boards played',
    'tournament.backToList': '← Tournaments',
    'manuals.open': 'Manuals',
    'manuals.backToHome': '← Back to tournaments',
    'manuals.title': 'User Manuals',
    'manuals.intro': 'Read guides for setup, scoring, and tournament workflow. Content follows your selected language with English fallback when translation is missing.',
    'manuals.section.topics': 'Topics',
    'manuals.fallbackNotice': 'This manual is not available in your selected language yet. Showing English fallback.',
    'manuals.topic.gettingStarted': 'Getting Started',
    'manuals.topic.scoringDatum': 'Scoring and Datum',
    'manuals.topic.tournamentWorkflow': 'Tournament Workflow',
    'manuals.topicDescription.gettingStarted': 'Overview of key features and quick startup path.',
    'manuals.topicDescription.scoringDatum': 'How datum lookup, diff, and IMP conversion work.',
    'manuals.topicDescription.tournamentWorkflow': 'Step-by-step guide from creation to completion.',
  },
}
