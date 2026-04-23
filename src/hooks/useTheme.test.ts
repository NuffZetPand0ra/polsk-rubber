import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useTheme } from './useTheme'

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
    vi.unstubAllGlobals()
  })

  it('uses saved theme from localStorage', () => {
    localStorage.setItem('polsk-rubber-theme', 'dark')

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(result.current.isDark).toBe(true)
  })

  it('falls back to light when matchMedia is unavailable', () => {
    localStorage.setItem('polsk-rubber-theme', 'invalid')
    vi.stubGlobal('matchMedia', undefined)

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')
    expect(result.current.isDark).toBe(false)
  })

  it('uses system dark preference when no saved setting exists', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }))

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('polsk-rubber-theme')).toBe('dark')
  })

  it('toggles theme and persists new value', () => {
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: false }))

    const { result } = renderHook(() => useTheme())

    expect(result.current.theme).toBe('light')

    act(() => {
      result.current.toggleTheme()
    })

    expect(result.current.theme).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('polsk-rubber-theme')).toBe('dark')
  })
})
