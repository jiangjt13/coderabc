import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { LanguageProvider } from '@/contexts/language-context'
import { Navbar } from '@/components/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'CoderABC - 开发者工具与技术笔记',
  description: '面向开发者和技术爱好者的在线工具与知识笔记集合网站，提供实用的开发工具和命令行技术文档',
  keywords: '开发者工具,在线工具,技术笔记,命令行工具,编程教程,CoderABC',
  authors: [{ name: 'CoderABC' }],
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
  openGraph: {
    title: 'CoderABC - 开发者工具与技术笔记',
    description: '面向开发者和技术爱好者的在线工具与知识笔记集合网站',
    type: 'website',
    locale: 'zh_CN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh" suppressHydrationWarning>
      <body className={inter.className}>
        <LanguageProvider>
          <ThemeProvider
            defaultTheme="system"
            storageKey="toolsabc-theme"
          >
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
