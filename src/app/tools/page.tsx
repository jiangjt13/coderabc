'use client'

import Link from 'next/link'
import { Globe, Code2 } from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'
import { useEffect } from 'react'

export default function ToolsPage() {
  const { t } = useLanguage()

  // 动态更新页面标题
  useEffect(() => {
    document.title = 'CoderABC - 在线工具'
    return () => {
      document.title = 'CoderABC - 开发者工具与技术笔记'
    }
  }, [])
  
  const tools = [
    {
      title: t('home.tools.ip.title'),
      description: t('home.tools.ip.desc'),
      href: '/tools/ip',
      icon: Globe,
    },
    {
      title: t('home.tools.json.title'),
      description: t('home.tools.json.desc'),
      href: '/tools/json',
      icon: Code2,
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-foreground">{t('tools.title')}</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          {t('tools.subtitle')}
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => {
          const Icon = tool.icon
          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block p-8 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105 hover:border-primary/50"
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground group-hover:text-primary transition-colors">
                  {tool.title}
                </h3>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                {tool.description}
              </p>
              <div className="mt-4 text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                {t('tools.explore')} →
              </div>
            </Link>
          )
        })}
        
        {/* Coming Soon Card */}
        <div className="p-8 bg-card border border-border border-dashed rounded-xl">
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 rounded-xl bg-muted">
              <div className="h-8 w-8 bg-muted-foreground/20 rounded"></div>
            </div>
            <h3 className="text-xl font-semibold text-muted-foreground">
              {t('tools.coming-soon')}
            </h3>
          </div>
          <p className="text-muted-foreground leading-relaxed">
            {t('tools.coming-soon.desc')}
          </p>
        </div>
      </div>
    </div>
  )
}
