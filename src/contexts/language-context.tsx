'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Language = 'zh' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

interface LanguageProviderProps {
  children: ReactNode
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('zh')

  // 从localStorage加载语言设置
  useEffect(() => {
    const savedLanguage = localStorage.getItem('toolsabc-language') as Language
    if (savedLanguage && ['zh', 'en'].includes(savedLanguage)) {
      setLanguage(savedLanguage)
    }
  }, [])

  // 保存语言设置到localStorage
  useEffect(() => {
    localStorage.setItem('toolsabc-language', language)
    // 更新HTML的lang属性
    document.documentElement.lang = language
  }, [language])

  // 翻译函数
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

// 翻译文本配置
const translations: Record<Language, Record<string, string>> = {
  zh: {
    // 导航栏
    'nav.tools': 'Tools',
    'nav.notes': 'Notes',
    'nav.about': 'About',
    'nav.tools.ip': 'IP Tools',
    'nav.tools.ip.desc': 'IP地址查询与分析工具',
    'nav.tools.json': 'JSON Tools',
    'nav.tools.json.desc': 'JSON数据格式化、验证与压缩',
    'nav.notes.jq': 'jq',
    'nav.notes.jq.desc': '命令行JSON处理工具',
    'nav.notes.curl': 'curl',
    'nav.notes.curl.desc': '数据传输工具',
    'nav.notes.sed': 'sed',
    'nav.notes.sed.desc': '流编辑器',
    'nav.notes.awk': 'awk',
    'nav.notes.awk.desc': '文本处理工具',
    
    // 首页
    'home.title': 'CoderABC - 开发者工具集合',
    'home.subtitle': '面向开发者和技术爱好者的在线工具与知识笔记集合网站，致力于提供高效、实用、简洁的在线服务',
    'home.tools.title': '🛠 在线工具',
    'home.tools.subtitle': '高效实用的开发工具',
    'home.tools.ip.title': 'IP Tools',
    'home.tools.ip.desc': 'IP地址查询、格式转换和分析工具',
    'home.tools.json.title': 'JSON Tools',
    'home.tools.json.desc': 'JSON数据格式化、验证与压缩工具',
    'home.notes.title': '📝 技术笔记',
    'home.notes.subtitle': '实用的命令行工具指南',
    'home.notes.jq.title': 'jq Tour',
    'home.notes.jq.desc': '命令行JSON处理工具使用指南',
    'home.notes.curl.title': 'curl Tour', 
    'home.notes.curl.desc': '数据传输工具使用指南',
    'home.notes.sed.title': 'sed Tour',
    'home.notes.sed.desc': '流编辑器使用指南',
    'home.notes.awk.title': 'awk Tour',
    'home.notes.awk.desc': '文本处理工具使用指南',
    'home.button.explore': '开始探索',
    
    // Tools页面
    'tools.title': '🛠 在线工具',
    'tools.subtitle': '高效实用的开发工具集合，帮助您提升工作效率，简化日常开发任务',
    'tools.explore': '立即使用',
    'tools.coming-soon': '更多工具',
    'tools.coming-soon.desc': '我们正在开发更多实用工具，敬请期待！',
    
    // Notes页面
    'notes.title': '📝 技术笔记',
    'notes.subtitle': '实用的命令行工具学习指南，帮助您掌握强大的文本处理和数据操作技能',
    'notes.start-learning': '开始学习',
    'notes.about.title': '关于技术笔记',
    'notes.about.what': '这里有什么？',
    'notes.about.what.desc': '我们提供常用命令行工具的详细使用指南，包括语法说明、实际示例和最佳实践，帮助您快速上手并精通这些工具。',
    'notes.about.why': '为什么学习？',
    'notes.about.why.desc': '掌握这些命令行工具可以大大提升您的工作效率，无论是数据处理、文本操作还是系统管理，都能让您事半功倍。',
    'notes.about.tip': '提示：每个工具都提供了从基础到高级的完整学习路径，建议按顺序学习。',
    
    // About页面
    'about.title': '关于 CoderABC',
    'about.subtitle': '面向开发者和技术爱好者的在线工具与知识笔记集合',
    'about.intro.title': '项目简介',
    'about.intro.desc1': 'CoderABC 是一个专为开发者和技术爱好者打造的在线工具与知识笔记集合网站。我们致力于提供高效、实用、简洁的在线服务，帮助开发者提高工作效率。',
    'about.intro.desc2': '网站包含多种实用工具，如IP查询、JSON格式化等，同时提供了常用命令行工具的使用笔记，如jq、curl、sed、awk等。所有功能都经过精心设计，确保在各种设备上都能良好运行。',
    'about.features.title': '功能列表',
    'about.features.tools.title': '🛠 在线工具',
    'about.features.tools.ip': 'IP Tools - IP地址查询与分析工具',
    'about.features.tools.json': 'JSON Tools - JSON数据格式化、验证与压缩',
    'about.features.tools.more': '更多工具正在开发中...',
    'about.features.notes.title': '📝 技术笔记',
    'about.features.notes.jq': 'jq - 命令行JSON处理工具使用指南',
    'about.features.notes.curl': 'curl - 数据传输工具使用指南',
    'about.features.notes.sed': 'sed - 流编辑器使用指南',
    'about.features.notes.awk': 'awk - 文本处理工具使用指南',
    'about.features.notes.more': '更多笔记正在完善中...',
    'about.made': 'Made with',
    'about.team': 'by CoderABC Team',
    'about.visit': '访问地址:',
  },
  en: {
    // Navigation
    'nav.tools': 'Tools',
    'nav.notes': 'Notes',
    'nav.about': 'About',
    'nav.tools.ip': 'IP Tools',
    'nav.tools.ip.desc': 'IP address query and analysis tools',
    'nav.tools.json': 'JSON Tools',
    'nav.tools.json.desc': 'JSON data formatting, validation and compression',
    'nav.notes.jq': 'jq',
    'nav.notes.jq.desc': 'Command-line JSON processor',
    'nav.notes.curl': 'curl',
    'nav.notes.curl.desc': 'Data transfer tool',
    'nav.notes.sed': 'sed',
    'nav.notes.sed.desc': 'Stream editor',
    'nav.notes.awk': 'awk',
    'nav.notes.awk.desc': 'Text processing tool',
    
    // Home
    'home.title': 'CoderABC - Developer Tools Collection',
    'home.subtitle': 'Online tools and knowledge notes collection website for developers and tech enthusiasts, committed to providing efficient, practical, and simple online services',
    'home.tools.title': '🛠 Online Tools',
    'home.tools.subtitle': 'Efficient and practical development tools',
    'home.tools.ip.title': 'IP Tools',
    'home.tools.ip.desc': 'IP address query, format conversion and analysis tools',
    'home.tools.json.title': 'JSON Tools',
    'home.tools.json.desc': 'JSON data formatting, validation and compression tools',
    'home.notes.title': '📝 Technical Notes',
    'home.notes.subtitle': 'Practical command-line tools guide',
    'home.notes.jq.title': 'jq Tour',
    'home.notes.jq.desc': 'Command-line JSON processor usage guide',
    'home.notes.curl.title': 'curl Tour',
    'home.notes.curl.desc': 'Data transfer tool usage guide',
    'home.notes.sed.title': 'sed Tour',
    'home.notes.sed.desc': 'Stream editor usage guide',
    'home.notes.awk.title': 'awk Tour',
    'home.notes.awk.desc': 'Text processing tool usage guide',
    'home.button.explore': 'Start Exploring',
    
    // Tools页面
    'tools.title': '🛠 Online Tools',
    'tools.subtitle': 'Efficient and practical development tools collection to help you improve work efficiency and simplify daily development tasks',
    'tools.explore': 'Use Now',
    'tools.coming-soon': 'More Tools',
    'tools.coming-soon.desc': 'We are developing more practical tools, stay tuned!',
    
    // Notes页面
    'notes.title': '📝 Technical Notes',
    'notes.subtitle': 'Practical command-line tool learning guides to help you master powerful text processing and data manipulation skills',
    'notes.start-learning': 'Start Learning',
    'notes.about.title': 'About Technical Notes',
    'notes.about.what': 'What\'s here?',
    'notes.about.what.desc': 'We provide detailed usage guides for common command-line tools, including syntax explanations, practical examples, and best practices to help you quickly get started and master these tools.',
    'notes.about.why': 'Why learn?',
    'notes.about.why.desc': 'Mastering these command-line tools can greatly improve your work efficiency, whether it\'s data processing, text operations, or system management, you can achieve twice the result with half the effort.',
    'notes.about.tip': 'Tip: Each tool provides a complete learning path from basic to advanced, it is recommended to learn in order.',
    
    // About page
    'about.title': 'About CoderABC',
    'about.subtitle': 'Online tools and knowledge notes collection for developers and tech enthusiasts',
    'about.intro.title': 'Project Introduction',
    'about.intro.desc1': 'CoderABC is an online tools and knowledge notes collection website designed for developers and tech enthusiasts. We are committed to providing efficient, practical, and simple online services to help developers improve work efficiency.',
    'about.intro.desc2': 'The website includes various practical tools such as IP query, JSON formatting, etc., and also provides usage notes for common command-line tools like jq, curl, sed, awk, etc. All features are carefully designed to ensure good performance on various devices.',
    'about.features.title': 'Feature List',
    'about.features.tools.title': '🛠 Online Tools',
    'about.features.tools.ip': 'IP Tools - IP address query and analysis tools',
    'about.features.tools.json': 'JSON Tools - JSON data formatting, validation and compression',
    'about.features.tools.more': 'More tools are under development...',
    'about.features.notes.title': '📝 Technical Notes',
    'about.features.notes.jq': 'jq - Command-line JSON processor usage guide',
    'about.features.notes.curl': 'curl - Data transfer tool usage guide',
    'about.features.notes.sed': 'sed - Stream editor usage guide',
    'about.features.notes.awk': 'awk - Text processing tool usage guide',
    'about.features.notes.more': 'More notes are being improved...',
    'about.made': 'Made with',
    'about.team': 'by CoderABC Team',
    'about.visit': 'Visit:',
  }
}
