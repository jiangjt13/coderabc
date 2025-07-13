'use client'

import { FileText, Terminal, Copy, ChevronDown, ChevronRight, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

export default function JQTour() {
  const { language, t } = useLanguage()
  const [activeSection, setActiveSection] = useState('installation')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'getting-started': true,
    'basic-usage': true,
    'advanced': true,
    'tips': true
  })

  // 动态更新页面标题
  useEffect(() => {
    document.title = `CoderABC - ${t('jq.page.title')}`
    return () => {
      document.title = 'CoderABC - 开发者工具与技术笔记'
    }
  }, [language, t])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const tableOfContents = [
    {
      id: 'getting-started',
      title: t('jq.getting.started'),
      children: [
        { id: 'installation', title: t('jq.installation') },
        { id: 'basic-intro', title: t('jq.basic.intro') }
      ]
    },
    {
      id: 'basic-usage',
      title: t('jq.basic.usage'),
      children: [
        { id: 'basic-syntax', title: t('jq.basic.syntax') },
        { id: 'field-access', title: t('jq.field.access') },
        { id: 'array-operations', title: t('jq.array.operations') },
        { id: 'filtering', title: t('jq.filtering') }
      ]
    },
    {
      id: 'advanced',
      title: t('jq.advanced'),
      children: [
        { id: 'complex-queries', title: t('jq.complex.queries') },
        { id: 'data-transformation', title: t('jq.data.transform') },
        { id: 'functions', title: t('jq.functions') }
      ]
    },
    {
      id: 'tips',
      title: t('jq.tips'),
      children: [
        { id: 'common-options', title: t('jq.common.patterns') },
        { id: 'best-practices', title: t('jq.performance') },
        { id: 'troubleshooting', title: t('jq.debugging') }
      ]
    }
  ]

  const examples = [
    {
      title: '基本用法',
      description: '提取JSON中的字段',
      input: '{"name": "张三", "age": 30}',
      command: 'jq \'.name\'',
      output: '"张三"'
    },
    {
      title: '数组操作',
      description: '获取数组中的所有元素',
      input: '[{"name": "张三"}, {"name": "李四"}]',
      command: 'jq \'.[].name\'',
      output: '"张三"\n"李四"'
    },
    {
      title: '条件过滤',
      description: '根据条件过滤数组元素',
      input: '[{"name": "张三", "age": 30}, {"name": "李四", "age": 25}]',
      command: 'jq \'.[] | select(.age > 28)\'',
      output: '{"name": "张三", "age": 30}'
    },
    {
      title: '字段映射',
      description: '提取并重组数据结构',
      input: '{"user": {"name": "张三", "email": "zhang@example.com"}}',
      command: 'jq \'{username: .user.name, contact: .user.email}\'',
      output: '{"username": "张三", "contact": "zhang@example.com"}'
    }
  ]

  const commands = [
    {
      command: 'jq \'.\'',
      description: '格式化JSON输出'
    },
    {
      command: 'jq \'.field\'',
      description: '提取指定字段'
    },
    {
      command: 'jq \'.field[]\'',
      description: '展开数组中的所有元素'
    },
    {
      command: 'jq \'.[0]\'',
    },
    {
      command: 'jq \'length\'',
      description: '获取数组或对象长度'
    },
    {
      command: 'jq \'keys\'',
      description: '获取对象的所有键'
    },
    {
      command: 'jq \'map(.field)\'',
      description: '映射数组中每个元素的指定字段'
    },
    {
      command: 'jq \'select(.field == "value")\'',
      description: '根据条件选择元素'
    },
    {
      command: 'jq \'sort_by(.field)\'',
      description: '按指定字段排序'
    },
    {
      command: 'jq \'group_by(.field)\'',
      description: '按指定字段分组'
    }
  ]

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(err => {
        console.error('Failed to copy text: ', err)
      })
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'installation':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{t('jq.installation')}</h2>
              <p className="text-muted-foreground mb-6">
                {language === 'zh' ? 'jq是一个轻量级的命令行JSON处理器，支持多种操作系统的安装。' : 'jq is a lightweight command-line JSON processor that supports installation on multiple operating systems.'}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">Ubuntu/Debian</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  sudo apt-get update && sudo apt-get install jq
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">CentOS/RHEL/Fedora</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  sudo yum install jq  # 或 sudo dnf install jq
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">macOS</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  brew install jq
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">Windows</h3>
                <div className="space-y-2">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    # 使用Chocolatey<br/>
                    choco install jq
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    # 或使用Scoop<br/>
                    scoop install jq
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'basic-intro':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">{t('jq.basic.intro')}</h2>
              <p className="text-muted-foreground mb-6">
                {language === 'zh' ? 'jq是一个强大的命令行工具，专门用于处理JSON数据。它可以解析、过滤、映射和转换结构化数据。' : 'jq is a powerful command-line tool specifically designed for processing JSON data. It can parse, filter, map and transform structured data.'}
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">{language === 'zh' ? '主要特性' : 'Key Features'}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>轻量级</strong>：单一可执行文件，无外部依赖</li>
                <li>• <strong>强大的过滤功能</strong>：支持复杂的查询表达式</li>
                <li>• <strong>数据转换</strong>：可以重构和格式化JSON数据</li>
                <li>• <strong>管道支持</strong>：与其他命令行工具完美配合</li>
                <li>• <strong>丰富的内置函数</strong>：支持数学、字符串、数组等操作</li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">基本语法</h3>
              <div className="bg-muted p-4 rounded font-mono text-sm">
                {"jq [选项] <过滤器> [文件...]"}
              </div>
              <p className="text-sm text-muted-foreground">
                其中过滤器是jq表达式，用于指定如何处理JSON数据。
              </p>
            </div>
          </div>
        )

      case 'basic-syntax':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">基本语法</h2>
              <p className="text-muted-foreground mb-6">
                了解jq的基本语法是使用这个工具的第一步。
              </p>
            </div>
            
            <div className="space-y-6">
              {examples.slice(0, 2).map((example, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6 space-y-4">
                  <h3 className="text-lg font-semibold text-card-foreground">{example.title}</h3>
                  <p className="text-muted-foreground">{example.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">输入数据:</div>
                      <div className="bg-muted p-3 rounded font-mono text-sm relative">
                        {example.input}
                        <button
                          onClick={() => copyToClipboard(example.input)}
                          className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">命令:</div>
                      <div className="bg-primary/10 p-3 rounded font-mono text-sm relative">
                        {example.command}
                        <button
                          onClick={() => copyToClipboard(example.command)}
                          className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">输出:</div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded font-mono text-sm whitespace-pre-line">
                        {example.output}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'field-access':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">字段访问</h2>
              <p className="text-muted-foreground mb-6">
                学习如何访问JSON对象中的字段和嵌套数据。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">常用字段访问语法</h3>
                <div className="space-y-3">
                  {[
                    { syntax: '.', desc: '输出整个JSON对象（格式化）' },
                    { syntax: '.field', desc: '访问顶级字段' },
                    { syntax: '.field.subfield', desc: '访问嵌套字段' },
                    { syntax: '.["field name"]', desc: '访问包含特殊字符的字段' },
                    { syntax: '.field?', desc: '安全访问（字段不存在时返回null）' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="font-mono text-sm text-foreground">{item.syntax}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'array-operations':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">数组操作</h2>
              <p className="text-muted-foreground mb-6">
                jq提供了丰富的数组操作功能，可以轻松处理JSON数组。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              {examples.slice(1, 2).map((example, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-card-foreground">{example.title}</h3>
                  <p className="text-muted-foreground">{example.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">输入数据:</div>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        {example.input}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">命令:</div>
                      <div className="bg-primary/10 p-3 rounded font-mono text-sm">
                        {example.command}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">输出:</div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded font-mono text-sm whitespace-pre-line">
                        {example.output}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">数组操作语法</h3>
              <div className="space-y-3">
                {[
                  { syntax: '.[]', desc: '迭代数组中的每个元素' },
                  { syntax: '.[0]', desc: '获取第一个元素' },
                  { syntax: '.[-1]', desc: '获取最后一个元素' },
                  { syntax: '.[1:3]', desc: '获取索引1到2的元素（切片）' },
                  { syntax: 'length', desc: '获取数组长度' },
                  { syntax: 'reverse', desc: '反转数组' },
                  { syntax: 'sort', desc: '对数组排序' },
                  { syntax: 'unique', desc: '去重' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                    <div className="font-mono text-sm text-foreground">{item.syntax}</div>
                    <div className="text-xs text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'filtering':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">条件过滤</h2>
              <p className="text-muted-foreground mb-6">
                使用select函数和条件表达式来过滤JSON数据。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              {examples.slice(2, 3).map((example, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-card-foreground">{example.title}</h3>
                  <p className="text-muted-foreground">{example.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">输入数据:</div>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        {example.input}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">命令:</div>
                      <div className="bg-primary/10 p-3 rounded font-mono text-sm">
                        {example.command}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">输出:</div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded font-mono text-sm whitespace-pre-line">
                        {example.output}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'complex-queries':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">复杂查询</h2>
              <p className="text-muted-foreground mb-6">
                学习如何构建复杂的jq查询表达式。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">管道操作</h3>
                <p className="text-muted-foreground mb-4">
                  使用管道符 | 可以将多个操作链接起来：
                </p>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  {"jq '.users[] | select(.age > 18) | .name'"}
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">条件表达式</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 三元运算符"}<br/>
                    {'if .age >= 18 then "adult" else "minor" end'}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 多条件判断"}<br/>
                    {'if .score >= 90 then "A" elif .score >= 80 then "B" else "C" end'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'data-transformation':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">数据转换</h2>
              <p className="text-muted-foreground mb-6">
                学习如何使用jq转换和重构JSON数据结构。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              {examples.slice(3, 4).map((example, index) => (
                <div key={index} className="space-y-4">
                  <h3 className="text-lg font-semibold text-card-foreground">{example.title}</h3>
                  <p className="text-muted-foreground">{example.description}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">输入数据:</div>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        {example.input}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">命令:</div>
                      <div className="bg-primary/10 p-3 rounded font-mono text-sm">
                        {example.command}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-muted-foreground mb-2">输出:</div>
                      <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded font-mono text-sm whitespace-pre-line">
                        {example.output}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case 'functions':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">内置函数</h2>
              <p className="text-muted-foreground mb-6">
                jq提供了丰富的内置函数来处理各种数据操作。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">常用内置函数</h3>
                <div className="grid grid-cols-1 gap-3">
                  {commands.map((cmd, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="font-mono text-sm text-foreground">{cmd.command}</div>
                      <div className="text-xs text-muted-foreground">{cmd.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 'common-options':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">常用选项和参数</h2>
              <p className="text-muted-foreground mb-6">
                了解jq命令行的各种选项和参数。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">命令行选项</h3>
              <div className="space-y-3">
                {[
                  { option: '-r, --raw-output', desc: '输出原始字符串，不包含JSON引号' },
                  { option: '-c, --compact-output', desc: '紧凑输出，不格式化' },
                  { option: '-n, --null-input', desc: '不读取输入，使用null作为输入' },
                  { option: '-e, --exit-status', desc: '根据输出设置退出状态' },
                  { option: '-s, --slurp', desc: '将整个输入流读取为一个大数组' },
                  { option: '-S, --sort-keys', desc: '对输出的对象键进行排序' },
                  { option: '--tab', desc: '使用制表符缩进' },
                  { option: '--arg name value', desc: '设置变量' },
                  { option: '--argjson name value', desc: '设置JSON变量' }
                ].map((item, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 p-3 bg-muted rounded">
                    <div className="font-mono text-sm text-foreground">{item.option}</div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 'best-practices':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">最佳实践</h2>
              <p className="text-muted-foreground mb-6">
                使用jq的一些技巧和最佳实践。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">使用技巧</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>使用管道符连接操作</strong>：
                      <code className="ml-2 px-1 py-0.5 bg-muted rounded text-xs">jq &apos;.data[] | select(.active) | .name&apos;</code>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>使用 -r 输出纯文本</strong>：避免JSON字符串的引号
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>使用 -c 压缩输出</strong>：当不需要格式化时节省空间
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>使用 --arg 传递变量</strong>：
                      <code className="ml-2 px-1 py-0.5 bg-muted rounded text-xs">jq --arg name &quot;张三&quot; &apos;.[] | select(.name == $name)&apos;</code>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>使用 -s 处理多个JSON对象</strong>：将多个输入合并为数组
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">性能优化</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 尽早过滤数据，减少后续处理的数据量</li>
                  <li>• 使用流式处理处理大文件</li>
                  <li>• 避免在循环中使用复杂的表达式</li>
                  <li>• 合理使用索引而不是遍历整个数组</li>
                </ul>
              </div>
            </div>
          </div>
        )

      case 'troubleshooting':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">常见问题</h2>
              <p className="text-muted-foreground mb-6">
                解决使用jq时常见的问题和错误。
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "如何处理包含空格或特殊字符的字段名？",
                  answer: "使用方括号语法：.['field name'] 或 .\"field-name\""
                },
                {
                  question: "为什么我的输出包含引号？",
                  answer: "使用 -r 选项输出原始文本：jq -r '.field'"
                },
                {
                  question: "如何处理可能不存在的字段？",
                  answer: "使用安全访问操作符：.field? 或使用 // 提供默认值：.field // \"default\""
                },
                {
                  question: "如何处理嵌套很深的JSON？",
                  answer: "使用递归下降操作符：.. 可以递归访问所有层级"
                },
                {
                  question: "如何调试复杂的jq表达式？",
                  answer: "使用 debug 函数或拆分表达式逐步测试每个部分"
                }
              ].map((faq, index) => (
                <div key={index} className="bg-card border border-border rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return <div>选择一个主题开始学习</div>
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* 侧边栏 */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden border-r border-border bg-card`}>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-card-foreground">{t('jq.tour.title')}</h1>
            </div>
            {/* 目录开关按钮 */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              title={t('jq.hide.toc')}
            >
              <FileText className="h-3 w-3" />
              <span className="hidden sm:inline">{language === 'zh' ? '隐藏' : 'Hide'}</span>
            </button>
          </div>
          
          <nav className="space-y-1">
            {tableOfContents.map((section) => (
              <div key={section.id}>
                <button
                  onClick={() => toggleSection(section.id)}
                  className="flex items-center justify-between w-full p-2 text-left hover:bg-muted rounded text-sm font-medium"
                >
                  <span>{section.title}</span>
                  {expandedSections[section.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                
                {expandedSections[section.id] && (
                  <div className="ml-4 space-y-1">
                    {section.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => setActiveSection(child.id)}
                        className={`block w-full p-2 text-left text-sm rounded hover:bg-muted ${
                          activeSection === child.id 
                            ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                            : 'text-muted-foreground'
                        }`}
                      >
                        {child.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 顶部工具栏 */}
        <div className="border-b border-border bg-card p-4">
          <div className="flex items-center space-x-4">
            {!sidebarOpen && (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 hover:bg-muted rounded"
              >
                <Menu className="h-4 w-4" />
              </button>
            )}
            <div className="flex items-center space-x-2">
              <Terminal className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-bold text-foreground">{t('jq.tour.title')}</h1>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
