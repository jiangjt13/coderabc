'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export default function About() {
  const { t } = useLanguage()
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground">{t('about.title')}</h1>
        <p className="text-xl text-muted-foreground">
          {t('about.subtitle')}
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-card-foreground">{t('about.intro.title')}</h2>
          <p className="text-muted-foreground leading-relaxed">
            {t('about.intro.desc1')}
          </p>
          <p className="text-muted-foreground leading-relaxed">
            {t('about.intro.desc2')}
          </p>
        </div>

        <div className="border-t border-border pt-6 space-y-4">
          <h2 className="text-2xl font-semibold text-card-foreground">{t('about.features.title')}</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-card-foreground mb-2">{t('about.features.tools.title')}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• {t('about.features.tools.ip')}</li>
                <li>• {t('about.features.tools.json')}</li>
                <li>• {t('about.features.tools.more')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-card-foreground mb-2">{t('about.features.notes.title')}</h3>
              <ul className="space-y-1 text-sm text-muted-foreground ml-4">
                <li>• {t('about.features.notes.jq')}</li>
                <li>• {t('about.features.notes.curl')}</li>
                <li>• {t('about.features.notes.sed')}</li>
                <li>• {t('about.features.notes.awk')}</li>
                <li>• {t('about.features.notes.more')}</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <span>{t('about.made')}</span>
            <Heart className="h-4 w-4 text-red-500" />
            <span>{t('about.team')}</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {t('about.visit')} <Link href="https://redherringai.com" className="text-primary hover:underline">redherringai.com</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
