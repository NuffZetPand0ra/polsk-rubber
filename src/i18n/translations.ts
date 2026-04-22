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
  | 'score.diff'
  | 'result.made'
  | 'preview.button.show'
  | 'preview.button.hide'
  | 'preview.title'
  | 'preview.hcp'
  | 'preview.nv'
  | 'preview.vul'
  | 'scan.section'
  | 'scan.boardNumber'
  | 'scan.startCamera'
  | 'scan.stopCamera'
  | 'scan.capture'
  | 'scan.cameraUnsupported'
  | 'scan.cameraReady'
  | 'scan.inferenceTitle'
  | 'scan.confidence'
  | 'scan.notes'
  | 'scan.applySuggestion'
  | 'scan.detectedColors'
  | 'scan.color.red'
  | 'scan.color.green'
  | 'scan.color.white'
  | 'scan.color.unknown'
  | 'scan.cardDetection'
  | 'scan.cardsVisible'
  | 'scan.suitHints'
  | 'scan.suitHint.red'
  | 'scan.suitHint.black'
  | 'scan.suitHint.unknown'

export const translations: Record<Language, Record<TranslationKey, string>> = {
  da: {
    'app.badge': 'Polsk Rubber',
    'app.heading': 'Spilscoring',
    'app.intro':
      'Indtast kontrakt, sårbarhed og doblinger, og sammenlign faktisk resultat med HCP-datum i IMP.',
    'app.offlineNote':
      'Manuel scoring virker offline. AI handscan kræver internet.',
    'steps.one': 'Kontrakt + melder.',
    'steps.two': 'Sårbarhed, doblinger, HCP.',
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
    'field.vulnerability': 'Sårbarhed',
    'field.doubled': 'Doble',
    'field.manualHcp': 'Manuel melder-HCP (0-40)',
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
    'score.vulnerable': 'Sårbar',
    'score.yes': 'Ja',
    'score.no': 'Nej',
    'score.declaringHcp': 'Melder-HCP',
    'score.datum': 'Datum (rå/afrundet)',
    'score.actualNs': 'Faktisk score (NS)',
    'score.diff': 'Diff',
    'result.made': 'Vundet',
    'preview.button.show': 'Vis datum-skema',
    'preview.button.hide': 'Skjul datum-skema',
    'preview.title': 'Forhåndsvisning af score-skema (HCP → point)',
    'preview.hcp': 'HCP',
    'preview.nv': 'Ikke sårbar',
    'preview.vul': 'Sårbar',
    'scan.section': 'Handscan (kamera)',
    'scan.boardNumber': 'Spilnummer',
    'scan.startCamera': 'Start kamera',
    'scan.stopCamera': 'Stop kamera',
    'scan.capture': 'Tag billede og scan',
    'scan.cameraUnsupported': 'Kamera er ikke understøttet i denne browser.',
    'scan.cameraReady': 'Kamera er aktivt. Placer spilmappen og tryk scan.',
    'scan.inferenceTitle': 'Scan-resultat',
    'scan.confidence': 'Sikkerhed',
    'scan.notes': 'Noter',
    'scan.applySuggestion': 'Brug foreslået sårbarhed',
    'scan.detectedColors': 'Registrerede farver',
    'scan.color.red': 'Rød',
    'scan.color.green': 'Grøn',
    'scan.color.white': 'Hvid',
    'scan.color.unknown': 'Ukendt',
    'scan.cardDetection': 'Kortdetektion (hjørner)',
    'scan.cardsVisible': 'Synlige hjørner',
    'scan.suitHints': 'Farvehints',
    'scan.suitHint.red': 'Rød farve',
    'scan.suitHint.black': 'Sort farve',
    'scan.suitHint.unknown': 'Ukendt',
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
    'field.contractLevel': 'Contract Level',
    'field.contractSuit': 'Contract Suit',
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
    'result.made': 'Made',
    'preview.button.show': 'Preview score schema',
    'preview.button.hide': 'Hide score schema',
    'preview.title': 'Score schema preview (HCP to points)',
    'preview.hcp': 'HCP',
    'preview.nv': 'Not Vulnerable',
    'preview.vul': 'Vulnerable',
    'scan.section': 'Hand Scan (camera)',
    'scan.boardNumber': 'Board Number',
    'scan.startCamera': 'Start camera',
    'scan.stopCamera': 'Stop camera',
    'scan.capture': 'Capture and scan',
    'scan.cameraUnsupported': 'Camera is not supported in this browser.',
    'scan.cameraReady': 'Camera is active. Place the board folder and press scan.',
    'scan.inferenceTitle': 'Scan result',
    'scan.confidence': 'Confidence',
    'scan.notes': 'Notes',
    'scan.applySuggestion': 'Use suggested vulnerability',
    'scan.detectedColors': 'Detected colors',
    'scan.color.red': 'Red',
    'scan.color.green': 'Green',
    'scan.color.white': 'White',
    'scan.color.unknown': 'Unknown',
    'scan.cardDetection': 'Card detection (corners)',
    'scan.cardsVisible': 'Visible corners',
    'scan.suitHints': 'Suit hints',
    'scan.suitHint.red': 'Red suit color',
    'scan.suitHint.black': 'Black suit color',
    'scan.suitHint.unknown': 'Unknown',
  },
}
