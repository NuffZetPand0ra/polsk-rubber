import type { DatumSchema } from '../types'

interface DatumRow {
  nv: number
  vul: number
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

const TABLES: Record<DatumSchema, Record<number, DatumRow>> = {
  modern: MODERN_TABLE,
  classic: CLASSIC_TABLE,
}

const MIN_HCP = 20
const MAX_HCP = 37

export function getDatumSchemaPreview(schema: DatumSchema = 'modern'): DatumPreviewRow[] {
  const table = TABLES[schema]

  return Array.from({ length: MAX_HCP - MIN_HCP + 1 }, (_, index) => {
    const hcp = MIN_HCP + index
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

  const normalizedHcp = Math.max(MIN_HCP, Math.min(MAX_HCP, hcp))
  const row = TABLES[schema][normalizedHcp]
  return vul ? row.vul : row.nv
}
