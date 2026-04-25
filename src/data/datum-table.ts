import type { DatumSchema } from '../types'

interface DatumRow {
  nv: number
  vul: number
}

interface CustomDatumStorage {
  slug: string
  title: string
  table: Record<number, DatumRow>
  updatedAt: string
}

interface CustomDatumLibraryStorage {
  activeSlug: string
  sheets: Record<string, Omit<CustomDatumStorage, 'slug'>>
}

export interface CustomDatumSheetSummary {
  slug: string
  title: string
  updatedAt: string
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
  37: { nv: 1510, vul: 2210 },
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
export const CUSTOM_DATUM_LIBRARY_STORAGE_KEY = 'polsk-rubber:datum:custom-library:v2'
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

function slugifyCustomDatumTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  return slug || 'custom-datum'
}

function normalizeDatumTable(rawTable: unknown): Record<number, DatumRow> {
  const entries = Object.entries((rawTable ?? {}) as Record<string, DatumRow>)
  const normalized: Record<number, DatumRow> = {}

  for (const [hcpRaw, row] of entries) {
    const hcp = Number(hcpRaw)
    if (!Number.isInteger(hcp) || !row || !Number.isFinite(row.nv) || !Number.isFinite(row.vul)) {
      return {}
    }
    normalized[hcp] = { nv: row.nv, vul: row.vul }
  }

  return normalized
}

function loadCustomDatumLibraryConfig(): CustomDatumLibraryStorage {
  const raw = localStorage.getItem(CUSTOM_DATUM_LIBRARY_STORAGE_KEY)
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<CustomDatumLibraryStorage>
      const parsedSheets = parsed?.sheets ?? {}
      const normalizedSheets: CustomDatumLibraryStorage['sheets'] = {}

      for (const [slug, sheet] of Object.entries(parsedSheets)) {
        if (!sheet || typeof sheet.title !== 'string') {
          continue
        }

        const table = normalizeDatumTable(sheet.table)
        if (getSortedHcpValues(table).length === 0) {
          continue
        }

        normalizedSheets[slug] = {
          title: sheet.title.trim() || CUSTOM_DATUM_DEFAULT_TITLE,
          table,
          updatedAt:
            typeof sheet.updatedAt === 'string' && sheet.updatedAt.trim().length > 0
              ? sheet.updatedAt
              : new Date(0).toISOString(),
        }
      }

      const activeSlug =
        typeof parsed.activeSlug === 'string' && normalizedSheets[parsed.activeSlug]
          ? parsed.activeSlug
          : Object.keys(normalizedSheets)[0] ?? ''

      return {
        activeSlug,
        sheets: normalizedSheets,
      }
    } catch {
      // fall through to legacy migration
    }
  }

  const legacyRaw = localStorage.getItem(CUSTOM_DATUM_STORAGE_KEY)
  if (!legacyRaw) {
    return { activeSlug: '', sheets: {} }
  }

  try {
    const parsed = JSON.parse(legacyRaw) as unknown
    const maybeConfig = parsed as Partial<CustomDatumStorage>
    const title =
      maybeConfig && typeof maybeConfig.title === 'string' && maybeConfig.title.trim()
        ? maybeConfig.title.trim()
        : CUSTOM_DATUM_DEFAULT_TITLE

    const rawTable =
      maybeConfig && typeof maybeConfig === 'object' && maybeConfig.table
        ? maybeConfig.table
        : (parsed as Record<string, DatumRow>)

    const table = normalizeDatumTable(rawTable)
    if (getSortedHcpValues(table).length === 0) {
      return { activeSlug: '', sheets: {} }
    }

    const slug = slugifyCustomDatumTitle(title)
    const migrated: CustomDatumLibraryStorage = {
      activeSlug: slug,
      sheets: {
        [slug]: {
          title,
          table,
          updatedAt: new Date().toISOString(),
        },
      },
    }

    localStorage.setItem(CUSTOM_DATUM_LIBRARY_STORAGE_KEY, JSON.stringify(migrated))
    return migrated
  } catch {
    return { activeSlug: '', sheets: {} }
  }
}

function saveCustomDatumLibraryConfig(config: CustomDatumLibraryStorage): void {
  localStorage.setItem(CUSTOM_DATUM_LIBRARY_STORAGE_KEY, JSON.stringify(config))
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

export function listCustomDatumSheets(): CustomDatumSheetSummary[] {
  const config = loadCustomDatumLibraryConfig()
  return Object.entries(config.sheets)
    .map(([slug, sheet]) => ({
      slug,
      title: sheet.title,
      updatedAt: sheet.updatedAt,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
}

export function saveCustomDatumTable(table: Record<number, DatumRow>, title?: string): string {
  const config = loadCustomDatumLibraryConfig()
  const normalizedTitle = title?.trim() || config.sheets[config.activeSlug]?.title || CUSTOM_DATUM_DEFAULT_TITLE
  const slug = slugifyCustomDatumTitle(normalizedTitle)

  config.sheets[slug] = {
    title: normalizedTitle,
    table,
    updatedAt: new Date().toISOString(),
  }
  config.activeSlug = slug

  saveCustomDatumLibraryConfig(config)
  return slug
}

export function saveCustomDatumCsv(text: string, title?: string): string {
  const parsed = parseDatumCsv(text)
  return saveCustomDatumTable(parsed, title)
}

export function loadCustomDatumConfig(customSlug?: string): CustomDatumStorage {
  const config = loadCustomDatumLibraryConfig()
  const slug = customSlug && config.sheets[customSlug] ? customSlug : config.activeSlug
  const sheet = slug ? config.sheets[slug] : null

  if (!sheet) {
    return {
      slug: '',
      title: '',
      table: {},
      updatedAt: '',
    }
  }

  return {
    slug,
    title: sheet.title,
    table: sheet.table,
    updatedAt: sheet.updatedAt,
  }
}

export function loadCustomDatumTable(customSlug?: string): Record<number, DatumRow> {
  return loadCustomDatumConfig(customSlug).table
}

export function loadCustomDatumCsvText(customSlug?: string): string {
  const table = loadCustomDatumTable(customSlug)
  const hcpValues = getSortedHcpValues(table)

  return hcpValues
    .map((hcp) => {
      const row = table[hcp]
      return `${hcp},${row.nv},${row.vul}`
    })
    .join('\n')
}

export function loadCustomDatumTitle(customSlug?: string): string {
  return loadCustomDatumConfig(customSlug).title || CUSTOM_DATUM_DEFAULT_TITLE
}

export function hasCustomDatumTable(customSlug?: string): boolean {
  return getSortedHcpValues(loadCustomDatumConfig(customSlug).table).length > 0
}

export function getDatumSchemaPreview(schema: DatumSchema = 'modern', customSlug?: string): DatumPreviewRow[] {
  const table = schema === 'custom' ? loadCustomDatumTable(customSlug) : getActiveTable(schema)
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
  customSlug?: string,
): number {
  if (hcp <= 19) {
    return 0
  }

  const table = schema === 'custom' ? loadCustomDatumTable(customSlug) : getActiveTable(schema)
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
