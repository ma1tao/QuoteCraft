import React from 'react'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { I18nextProvider } from 'react-i18next'
import App from '../App'

describe('语言切换与持久化', () => {
  beforeEach(() => {
    cleanup()
    localStorage.clear()
    vi.resetModules()
  })

  it('默认显示中文', async () => {
    const { default: i18n } = await import('../i18n')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    expect(screen.getByText('保存')).toBeInTheDocument()
    expect(screen.getByText('文本')).toBeInTheDocument()
  })

  it('切换为英文后文案实时更新', async () => {
    const { default: i18n } = await import('../i18n')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    const switchBtn = screen.getByRole('button', { name: 'Language' })
    fireEvent.click(switchBtn)
    const enBtn = screen.getByText('English')
    fireEvent.click(enBtn)
    expect(screen.getByText('Save')).toBeInTheDocument()
    expect(localStorage.getItem('qs-lang')).toBe('en')
  })

  it('从本地存储恢复用户语言偏好', async () => {
    localStorage.setItem('qs-lang', 'en')
    const { default: i18n } = await import('../i18n')
    render(
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    )
    expect(screen.getByText('Save')).toBeInTheDocument()
  })
})

