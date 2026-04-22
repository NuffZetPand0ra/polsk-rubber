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
  | 'schema.classic'
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
  | 'preview.title'
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
  | 'tournament.backToList'

export const translations: Record<Language, Record<TranslationKey, string>> = {
  da: {
    'app.badge': 'Polsk Rubber',
    'app.heading': 'Spilscoring',
    'app.intro':
      'Indtast kontrakt, zonsestilling og doblinger, og sammenlign faktisk resultat med HCP-datum i IMP.',
    'app.offlineNote': 'Virker fuldt offline.',
    'steps.one': 'Kontrakt + melder.',
    'steps.two': 'Zonsestilling, doblinger, HCP.',
    'steps.three': 'Datum, diff, IMP.',
    'theme.light': 'Lys tilstand',
    'theme.dark': 'Mørk tilstand',
    'section.boardEntry': 'Spilindtastning',
    'section.boardResult': 'Spilresultat',
    'schema.label': 'Datum-skema',
    'schema.modern': 'Moderne',
    'schema.classic': 'Klassisk',
    'field.contract': 'Kontrakt (fx 4H, 3NT)',
    'field.contractLevel': 'Kontrakttrin',
    'field.contractSuit': 'Kontraktfarve',
    'field.declarer': 'Melder',
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
    'vul.both': 'Begge',
    'doubled.undoubled': 'Uden dobling',
    'error.invalidHcp': 'Melder-HCP skal være et heltal mellem 0 og 40.',
    'error.scoringFailed': 'Scoringen kunne ikke beregnes.',
    'score.imp': 'IMP',
    'score.declaringSide': 'Melder-side',
    'score.vulnerable': 'Zonestillet',
    'score.yes': 'Ja',
    'score.no': 'Nej',
    'score.declaringHcp': 'Melder-HCP',
    'score.datum': 'Datum (rå/afrundet)',
    'score.actualNs': 'Faktisk score (NS)',
    'score.actualScore': 'Faktisk score',
    'score.diff': 'Diff',
    'result.made': 'Vundet',
    'preview.button.show': 'Vis datum-skema',
    'preview.button.hide': 'Skjul datum-skema',
    'preview.title': 'Forhåndsvisning af score-skema (HCP → point)',
    'preview.hcp': 'HCP',
    'preview.nv': 'Ikke zonestillet',
    'preview.vul': 'Zonestillet',
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
    'tournament.backToList': '← Turneringer',
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
    'schema.classic': 'Classic',
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
    'preview.title': 'Score schema preview (HCP to points)',
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
    'tournament.backToList': '← Tournaments',
  },
}
