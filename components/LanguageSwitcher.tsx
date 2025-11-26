import React from 'react'
import { useTranslation } from 'react-i18next'
import { setLanguage } from '../i18n'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const current = i18n.language === 'en' ? 'English' : '中文'
  return (
    <div className="relative">
      <button
        aria-label="Language"
        onClick={() => setOpen(v => !v)}
        className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-full text-sm font-semibold flex items-center gap-2 transition-colors px-4 py-2"
      >
        <Globe size={16} />
        <span className="hidden sm:inline">{current}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 bg-neutral-800 border border-white/10 rounded-lg shadow-xl p-2 w-36 z-50">
          <button
            onClick={() => { setLanguage('zh'); setOpen(false) }}
            className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-md transition-colors"
          >中文</button>
          <button
            onClick={() => { setLanguage('en'); setOpen(false) }}
            className="w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-white/5 rounded-md transition-colors"
          >English</button>
        </div>
      )}
    </div>
  )
}

