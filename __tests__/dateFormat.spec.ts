import { describe, it, expect } from 'vitest'
import { formatDate } from '../components/CardPreview'
import { DateFormat } from '../types'

describe('formatDate', () => {
  const d = new Date(2025, 10, 28)

  it('formats ISO YYYY-MM-DD', () => {
    expect(formatDate(d, DateFormat.ISO_YYYY_MM_DD, 'en')).toBe('2025-11-28')
  })

  it('formats MM/DD/YYYY', () => {
    expect(formatDate(d, DateFormat.MM_DD_YYYY, 'en')).toBe('11/28/2025')
  })

  it('formats DD/MM/YYYY', () => {
    expect(formatDate(d, DateFormat.DD_MM_YYYY, 'en')).toBe('28/11/2025')
  })

  it('formats Chinese YYYY年MM月DD日', () => {
    expect(formatDate(d, DateFormat.CN_YYYY_MM_DD, 'zh')).toBe('2025年11月28日')
  })

  it('formats Chinese weekday style in zh', () => {
    expect(formatDate(d, DateFormat.CN_WEEKDAY_YYYY_MM_DD, 'zh')).toBe('星期五，2025年11月28日')
  })

  it('formats weekday style fallback in en', () => {
    expect(formatDate(d, DateFormat.CN_WEEKDAY_YYYY_MM_DD, 'en')).toBe('Friday, 2025-11-28')
  })
})

