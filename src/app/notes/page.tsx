'use client'

import Link from 'next/link'
import { FileText } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export default function NotesPage() {
  const { t } = useLanguage()
  
  const notes = [
    {
      title: t('home.notes.jq.title'),
      description: t('home.notes.jq.desc'),
      href: '/notes/jq',
      color: 'bg-yellow-500',
    },
    {
      title: t('home.notes.curl.title'),
      description: t('home.notes.curl.desc'),
      href: '/notes/curl',
      color: 'bg-red-500',
    },
    {
      title: t('home.notes.sed.title'),
      description: t('home.notes.sed.desc'),
      href: '/notes/sed',
      color: 'bg-purple-500',
    },
    {
      title: t('home.notes.awk.title'),
      description: t('home.notes.awk.desc'),
      href: '/notes/awk',
      color: 'bg-orange-500',
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">{t('notes.title')}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('notes.subtitle')}
        </p>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {notes.map((note) => (
          <Link
            key={note.href}
            href={note.href}
            className="group block p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50"
          >
            <div className="flex items-center space-x-4 mb-4">
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors relative">
                <FileText className="h-8 w-8 text-primary" />
                <div className={`absolute -top-1 -right-1 w-4 h-4 ${note.color} rounded-full`}></div>
              </div>
              <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                {note.title}
              </h3>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {note.description}
            </p>
            <div className="mt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              {t('notes.start-learning')} →
            </div>
          </Link>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-card border border-border rounded-xl p-8 mt-12">
        <h2 className="text-2xl font-semibold text-card-foreground mb-4">{t('notes.about.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-muted-foreground">
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">{t('notes.about.what')}</h3>
            <p className="leading-relaxed">
              {t('notes.about.what.desc')}
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground mb-2">{t('notes.about.why')}</h3>
            <p className="leading-relaxed">
              {t('notes.about.why.desc')}
            </p>
          </div>
        </div>
        <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <p className="text-sm text-muted-foreground">
            💡 {t('notes.about.tip')}
          </p>
        </div>
      </div>
    </div>
  )
}
