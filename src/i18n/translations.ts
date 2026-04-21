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
  | 'score.diff'

export const translations: Record<Language, Record<TranslationKey, string>> = {
  da: {
    'app.badge': 'Polsk Rubber',
    'app.heading': 'Board Scoring',
    'app.intro':
      'Indtast kontrakt, sårbarhed og doblinger, og sammenlign faktisk resultat med HCP-datum i IMP.',
    'app.offlineNote':
      'Manuel scoring virker offline. AI handscan kraever internet.',
    'steps.one': 'Kontrakt + melder.',
    'steps.two': 'Sårbarhed, doblinger, HCP.',
    'steps.three': 'Datum, diff, IMP.',
    'theme.light': 'Lys tilstand',
    'theme.dark': 'Mork tilstand',
    'section.boardEntry': 'Board indtastning',
    'section.boardResult': 'Board resultat',
    'schema.label': 'Datum-skema',
    'schema.modern': 'Moderne',
    'schema.classic': 'Klassisk',
    'field.contract': 'Kontrakt (fx 4H, 3NT)',
    'field.declarer': 'Melder',
    'field.result': 'Resultat (i forhold til kontrakt)',
    'field.vulnerability': 'Saarbarhed',
    'field.doubled': 'Doble',
    'field.manualHcp': 'Manuel melder-HCP (0-40)',
    'seat.north': 'Nord',
    'seat.east': 'Ost',
    'seat.south': 'Syd',
    'seat.west': 'Vest',
    'vul.none': 'Ingen',
    'vul.ns': 'NS',
    'vul.ew': 'OV',
    'vul.both': 'Begge',
    'doubled.undoubled': 'Uden dobling',
    'error.invalidHcp': 'Melder-HCP skal vaere et heltal mellem 0 og 40.',
    'error.scoringFailed': 'Scoringen kunne ikke beregnes.',
    'score.imp': 'IMP',
    'score.declaringSide': 'Melder-side',
    'score.vulnerable': 'Saarbar',
    'score.yes': 'Ja',
    'score.no': 'Nej',
    'score.declaringHcp': 'Melder-HCP',
    'score.datum': 'Datum (raa/afrundet)',
    'score.actualNs': 'Faktisk score (NS)',
    'score.diff': 'Diff',
  },
  en: {
    'app.badge': 'Polsk Rubber',
    'app.heading': 'Board Scoring',
    'app.intro':
      'Enter contract details, apply vulnerability and doubling, and compare the actual result versus HCP datum in IMPs.',
    'app.offlineNote':
      'Manual scoring works offline. AI hand scan requires internet.',
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
    'field.declarer': 'Declarer',
    'field.result': 'Result (relative to contract)',
    'field.vulnerability': 'Vulnerability',
    'field.doubled': 'Doubled',
    'field.manualHcp': 'Manual Declaring HCP (0-40)',
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
    'score.diff': 'Diff',
  },
}
