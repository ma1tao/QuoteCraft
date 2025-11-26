import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import zh from './locales/zh.json'
import en from './locales/en.json'

const STORAGE_KEY = 'qs-lang'
const saved = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
const lng = saved || 'zh'

i18n.use(initReactI18next).init({
  resources: { zh: { common: zh }, en: { common: en } },
  lng,
  fallbackLng: 'zh',
  ns: ['common'],
  defaultNS: 'common',
  interpolation: { escapeValue: false }
})

export const setLanguage = (lang: 'zh' | 'en') => {
  i18n.changeLanguage(lang)
  if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, lang)
}

export default i18n

