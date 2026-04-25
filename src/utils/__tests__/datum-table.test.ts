import { describe, expect, it } from 'vitest'
import {
  getDatum,
  getDatumSchemaPreview,
  hasCustomDatumTable,
  listCustomDatumSheets,
  loadCustomDatumTitle,
  parseDatumCsv,
  saveCustomDatumCsv,
} from '../../data/datum-table'

describe('custom datum csv parsing', () => {
  it('parses comma-separated rows with optional header', () => {
    const table = parseDatumCsv('HCP,non vul,vul\n24,330,430\n25,420,620')
    expect(table[24]).toEqual({ nv: 330, vul: 430 })
    expect(table[25]).toEqual({ nv: 420, vul: 620 })
  })

  it('parses semicolon-separated rows', () => {
    const table = parseDatumCsv('24;330;430\n25;420;620')
    expect(table[24]).toEqual({ nv: 330, vul: 430 })
    expect(table[25]).toEqual({ nv: 420, vul: 620 })
  })

  it('rejects duplicate HCP values', () => {
    expect(() => parseDatumCsv('24,330,430\n24,340,440')).toThrow(/duplicate hcp/i)
  })

  it('rejects HCP above 40', () => {
    expect(() => parseDatumCsv('41,330,430')).toThrow(/out of range/i)
  })
})

describe('getDatum', () => {
  it('uses nearest lower HCP when there are gaps in a schema', () => {
    localStorage.clear()
    saveCustomDatumCsv('24,330,430\n25,420,620\n27,480,680')

    expect(getDatum(26, false, 'custom')).toBe(420)
    expect(getDatum(26, true, 'custom')).toBe(620)
  })

  it('applies gap fallback behavior for built-in schemas too', () => {
    localStorage.clear()
    expect(getDatum(26, false, 'modern')).toBe(450)
    expect(getDatum(26, true, 'classic')).toBe(520)
  })

  it('returns 0 for 19 or lower HCP', () => {
    expect(getDatum(19, false, 'modern')).toBe(0)
    expect(getDatum(10, true, 'classic')).toBe(0)
  })

  it('returns modern non-vulnerable values', () => {
    expect(getDatum(24, false, 'modern')).toBe(330)
    expect(getDatum(30, false, 'modern')).toBe(700)
  })

  it('returns classic vulnerable values', () => {
    expect(getDatum(24, true, 'classic')).toBe(290)
    expect(getDatum(30, true, 'classic')).toBe(690)
  })

  it('returns polsk rubber values', () => {
    expect(getDatum(24, false, 'polsk-rubber')).toBe(220)
    expect(getDatum(32, true, 'polsk-rubber')).toBe(1350)
  })

  it('uses nearest lower row for polsk rubber gaps', () => {
    expect(getDatum(37, true, 'polsk-rubber')).toBe(2200)
    expect(getDatum(40, false, 'polsk-rubber')).toBe(1500)
  })

  it('uses highest defined row up to 40 HCP', () => {
    expect(getDatum(39, false, 'modern')).toBe(1510)
    expect(getDatum(40, true, 'classic')).toBe(2980)
  })

  it('reports whether a custom table is available and includes custom preview', () => {
    localStorage.clear()
    expect(hasCustomDatumTable()).toBe(false)

    saveCustomDatumCsv('24,330,430\n25,420,620')
    expect(hasCustomDatumTable()).toBe(true)

    const preview = getDatumSchemaPreview('custom')
    expect(preview).toEqual([
      { hcp: 24, nv: 330, vul: 430 },
      { hcp: 25, nv: 420, vul: 620 },
    ])
  })

  it('stores and loads multiple custom sheets by slug', () => {
    localStorage.clear()

    const alphaSlug = saveCustomDatumCsv('24,330,430\n25,420,620', 'Alpha Sheet')
    const betaSlug = saveCustomDatumCsv('24,220,260\n25,300,400', 'Beta Sheet')

    const sheets = listCustomDatumSheets()
    expect(sheets.map((sheet) => sheet.slug)).toContain(alphaSlug)
    expect(sheets.map((sheet) => sheet.slug)).toContain(betaSlug)

    expect(loadCustomDatumTitle(alphaSlug)).toBe('Alpha Sheet')
    expect(getDatum(25, true, 'custom', alphaSlug)).toBe(620)
    expect(getDatum(25, true, 'custom', betaSlug)).toBe(400)
  })

  it('overrides existing custom sheet when title slug matches', () => {
    localStorage.clear()

    const slugA = saveCustomDatumCsv('24,330,430\n25,420,620', 'Club Datum 2026')
    const slugB = saveCustomDatumCsv('24,100,200\n25,110,210', 'Club Datum 2026')

    expect(slugA).toBe(slugB)
    expect(getDatum(24, true, 'custom', slugA)).toBe(200)
    expect(listCustomDatumSheets()).toHaveLength(1)
  })
})
