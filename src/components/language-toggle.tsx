'use client'

import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh')
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center space-x-1 p-2 rounded-lg text-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200"
      title={language === 'zh' ? '切换到英文' : 'Switch to Chinese'}
    >
      <Globe className="h-4 w-4" />
      <span className="text-sm font-medium">
        {language === 'zh' ? '中' : 'EN'}
      </span>
    </button>
  )
}
