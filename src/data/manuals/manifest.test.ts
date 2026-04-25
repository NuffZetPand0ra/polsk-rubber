import { describe, expect, it } from 'vitest'

import { MANUALS, resolveManual } from './manifest'

describe('manual manifest', () => {
  it('falls back to english when selected language content is missing', () => {
    const originalDa = MANUALS[0].content.da

    try {
      delete MANUALS[0].content.da
      const resolved = resolveManual('getting-started', 'da')

      expect(resolved.usedFallback).toBe(true)
      expect(resolved.renderedLanguage).toBe('en')
      expect(resolved.content).toContain('Getting Started')
    } finally {
      MANUALS[0].content.da = originalDa
    }
  })
})
