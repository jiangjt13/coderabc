'use client'

import Link from 'next/link'
import { Wrench, FileText, Globe, Code2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

export default function Home() {
  const { t } = useLanguage()
  
  const tools = [
    {
      title: t('home.tools.ip.title'),
      description: t('home.tools.ip.desc'),
      href: '/tools/ip',
      icon: Globe,
      category: 'tools'
    },
    {
      title: t('home.tools.json.title'),
      description: t('home.tools.json.desc'),
      href: '/tools/json',
      icon: Code2,
      category: 'tools'
    }
  ]

  const notes = [
    {
      title: t('home.notes.jq.title'),
      description: t('home.notes.jq.desc'),
      href: '/notes/jq',
      icon: FileText,
      category: 'notes'
    },
    {
      title: t('home.notes.curl.title'),
      description: t('home.notes.curl.desc'),
      href: '/notes/curl',
      icon: FileText,
      category: 'notes'
    },
    {
      title: t('home.notes.sed.title'),
      description: t('home.notes.sed.desc'),
      href: '/notes/sed',
      icon: FileText,
      category: 'notes'
    },
    {
      title: t('home.notes.awk.title'),
      description: t('home.notes.awk.desc'),
      href: '/notes/awk',
      icon: FileText,
      category: 'notes'
    }
  ]

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">
          {t('home.title')}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t('home.subtitle')}
        </p>
      </div>

      {/* Tools Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2">
          <Wrench className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">{t('home.tools.title')}</h2>
        </div>
        <p className="text-muted-foreground">{t('home.tools.subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="group block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {tool.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {tool.description}
                </p>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Notes Section */}
      <section className="space-y-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-semibold text-foreground">{t('home.notes.title')}</h2>
        </div>
        <p className="text-muted-foreground">{t('home.notes.subtitle')}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {notes.map((note) => {
            const Icon = note.icon
            return (
              <Link
                key={note.href}
                href={note.href}
                className="group block p-6 bg-card border border-border rounded-lg hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Icon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                    {note.title}
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  {note.description}
                </p>
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}
