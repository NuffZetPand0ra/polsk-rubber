import type { DatumSchema } from '../types'

interface DatumRow {
  nv: number
  vul: number
}

interface CustomDatumStorage {
  title: string
  table: Record<number, DatumRow>
}

export interface DatumPreviewRow {
  hcp: number
  nv: number
  vul: number
}

const MODERN_TABLE: Record<number, DatumRow> = {
  20: { nv: 0, vul: 0 },
  21: { nv: 90, vul: 90 },
  22: { nv: 140, vul: 140 },
  23: { nv: 170, vul: 170 },
  24: { nv: 330, vul: 430 },
  25: { nv: 420, vul: 620 },
  26: { nv: 450, vul: 650 },
  27: { nv: 480, vul: 680 },
  28: { nv: 520, vul: 720 },
  29: { nv: 600, vul: 800 },
  30: { nv: 700, vul: 1000 },
  31: { nv: 800, vul: 1100 },
  32: { nv: 980, vul: 1370 },
  33: { nv: 1000, vul: 1390 },
  34: { nv: 1230, vul: 1430 },
  35: { nv: 1440, vul: 2140 },
  36: { nv: 1510, vul: 2210 },
  37: { nv: 2220, vul: 2980 },
}

const CLASSIC_TABLE: Record<number, DatumRow> = {
  20: { nv: 0, vul: 0 },
  21: { nv: 50, vul: 50 },
  22: { nv: 70, vul: 70 },
  23: { nv: 110, vul: 110 },
  24: { nv: 200, vul: 290 },
  25: { nv: 300, vul: 440 },
  26: { nv: 350, vul: 520 },
  27: { nv: 400, vul: 600 },
  28: { nv: 430, vul: 630 },
  29: { nv: 460, vul: 660 },
  30: { nv: 490, vul: 690 },
  31: { nv: 800, vul: 1100 },
  32: { nv: 920, vul: 1140 },
  33: { nv: 980, vul: 1370 },
  34: { nv: 1000, vul: 1390 },
  35: { nv: 1440, vul: 2140 },
  36: { nv: 1510, vul: 2210 },
  37: { nv: 2220, vul: 2980 },
}

const POLSK_RUBBER_TABLE: Record<number, DatumRow> = {
  20: { nv: 0, vul: 0 },
  21: { nv: 50, vul: 50 },
  22: { nv: 90, vul: 90 },
  23: { nv: 130, vul: 130 },
  24: { nv: 220, vul: 260 },
  25: { nv: 300, vul: 400 },
  26: { nv: 400, vul: 600 },
  27: { nv: 430, vul: 630 },
  28: { nv: 460, vul: 660 },
  29: { nv: 460, vul: 690 },
  30: { nv: 520, vul: 720 },
  31: { nv: 700, vul: 1000 },
  32: { nv: 900, vul: 1350 },
  33: { nv: 990, vul: 1440 },
  34: { nv: 1250, vul: 1800 },
  35: { nv: 1400, vul: 2100 },
  36: { nv: 1500, vul: 2200 },
}

const BUILTIN_TABLES = {
  modern: MODERN_TABLE,
  'polsk-rubber': POLSK_RUBBER_TABLE,
  classic: CLASSIC_TABLE,
} satisfies Record<Exclude<DatumSchema, 'custom'>, Record<number, DatumRow>>

export const CUSTOM_DATUM_STORAGE_KEY = 'polsk-rubber:datum:custom:v1'
export const CUSTOM_DATUM_DEFAULT_TITLE = 'Custom datum'

const TABLES: Record<DatumSchema, Record<number, DatumRow>> = {
  ...BUILTIN_TABLES,
  custom: {},
}

const MIN_HCP = 20
const MAX_HCP = 40

function getSortedHcpValues(table: Record<number, DatumRow>): number[] {
  return Object.keys(table)
    .map((key) => Number(key))
    .filter((value) => Number.isFinite(value))
    .sort((a, b) => a - b)
}

function getActiveTable(schema: DatumSchema): Record<number, DatumRow> {
  if (schema === 'custom') {
    return loadCustomDatumConfig().table
  }

  return TABLES[schema]
}

export function parseDatumCsv(text: string): Record<number, DatumRow> {
  const table: Record<number, DatumRow> = {}
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

  if (lines.length === 0) {
    throw new Error('No datum rows found.')
  }

  lines.forEach((line, index) => {
    const columns = line.split(/[;,]/).map((column) => column.trim())

    if (columns.length < 3) {
      throw new Error(`Invalid row ${index + 1}: expected HCP, non vul, vul.`)
    }

    const [hcpRaw, nvRaw, vulRaw] = columns
    const hcp = Number(hcpRaw)
    const nv = Number(nvRaw)
    const vul = Number(vulRaw)

    if (index === 0 && (!Number.isFinite(hcp) || !Number.isFinite(nv) || !Number.isFinite(vul))) {
      return
    }

    if (!Number.isInteger(hcp) || !Number.isFinite(nv) || !Number.isFinite(vul)) {
      throw new Error(`Invalid numeric values in row ${index + 1}.`)
    }

    if (hcp < 0 || hcp > MAX_HCP) {
      throw new Error(`HCP ${hcp} is out of range (0-${MAX_HCP}).`)
    }

    if (table[hcp]) {
      throw new Error(`Duplicate HCP value: ${hcp}.`)
    }

    table[hcp] = { nv, vul }
  })

  if (Object.keys(table).length === 0) {
    throw new Error('No datum rows found.')
  }

  return table
}

export function saveCustomDatumTable(table: Record<number, DatumRow>): void {
  const existing = loadCustomDatumConfig()
  const payload: CustomDatumStorage = {
    title: existing.title || CUSTOM_DATUM_DEFAULT_TITLE,
    table,
  }
  localStorage.setItem(CUSTOM_DATUM_STORAGE_KEY, JSON.stringify(payload))
}

export function saveCustomDatumCsv(text: string, title?: string): void {
  const parsed = parseDatumCsv(text)
  const payload: CustomDatumStorage = {
    title: (title?.trim() || loadCustomDatumTitle() || CUSTOM_DATUM_DEFAULT_TITLE),
    table: parsed,
  }
  localStorage.setItem(CUSTOM_DATUM_STORAGE_KEY, JSON.stringify(payload))
}

export function loadCustomDatumConfig(): CustomDatumStorage {
  const raw = localStorage.getItem(CUSTOM_DATUM_STORAGE_KEY)
  if (!raw) {
    return { title: '', table: {} }
  }

  try {
    const parsed = JSON.parse(raw) as unknown

    // Backward compatibility: old format stored only the table object.
    const legacyTable = (parsed as Record<string, DatumRow>)
    const maybeConfig = parsed as Partial<CustomDatumStorage>
    const rawTable =
      maybeConfig && typeof maybeConfig === 'object' && maybeConfig.table
        ? maybeConfig.table
        : legacyTable

    const entries = Object.entries(rawTable ?? {})
    const normalized: Record<number, DatumRow> = {}

    for (const [hcpRaw, row] of entries) {
      const hcp = Number(hcpRaw)
      if (!Number.isInteger(hcp) || !row || !Number.isFinite(row.nv) || !Number.isFinite(row.vul)) {
        return { title: '', table: {} }
      }
      normalized[hcp] = { nv: row.nv, vul: row.vul }
    }

    const title =
      maybeConfig && typeof maybeConfig.title === 'string' && maybeConfig.title.trim()
        ? maybeConfig.title.trim()
        : ''

    return { title, table: normalized }
  } catch {
    return { title: '', table: {} }
  }
}

export function loadCustomDatumTable(): Record<number, DatumRow> {
  return loadCustomDatumConfig().table
}

export function loadCustomDatumTitle(): string {
  return loadCustomDatumConfig().title || CUSTOM_DATUM_DEFAULT_TITLE
}

export function hasCustomDatumTable(): boolean {
  return getSortedHcpValues(loadCustomDatumConfig().table).length > 0
}

export function getDatumSchemaPreview(schema: DatumSchema = 'modern'): DatumPreviewRow[] {
  const table = getActiveTable(schema)
  const hcpValues = getSortedHcpValues(table)

  return hcpValues.map((hcp) => {
    const row = table[hcp]
    return {
      hcp,
      nv: row.nv,
      vul: row.vul,
    }
  })
}

export function getDatum(
  hcp: number,
  vul: boolean,
  schema: DatumSchema = 'modern',
): number {
  if (hcp <= 19) {
    return 0
  }

  const table = getActiveTable(schema)
  const hcpValues = getSortedHcpValues(table)
  if (hcpValues.length === 0) {
    throw new Error('No datum rows are configured for selected schema.')
  }

  const normalizedHcp = Math.max(MIN_HCP, Math.min(MAX_HCP, hcp))
  const fallbackHcp = hcpValues[0]
  const selectedHcp = hcpValues.reduce(
    (best, candidate) => (candidate <= normalizedHcp ? candidate : best),
    fallbackHcp,
  )

  const row = table[selectedHcp]
  return vul ? row.vul : row.nv
}
