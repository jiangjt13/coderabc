'use client'

import { FileText, Terminal, Copy, ChevronDown, ChevronRight, Menu, X, Edit } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

export default function SedTour() {
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
    document.title = 'CoderABC - sed 流编辑器学习指南'
    return () => {
      document.title = 'CoderABC - 开发者工具与技术笔记'
    }
  }, [])

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  const tableOfContents = [
    {
      id: 'getting-started',
      title: '开始使用',
      children: [
        { id: 'installation', title: '如何安装' },
        { id: 'basic-intro', title: '基本介绍' }
      ]
    },
    {
      id: 'basic-usage',
      title: '基础用法',
      children: [
        { id: 'basic-syntax', title: '基本语法' },
        { id: 'substitution', title: '文本替换' },
        { id: 'deletion', title: '删除操作' },
        { id: 'address-ranges', title: '地址范围' }
      ]
    },
    {
      id: 'advanced',
      title: '高级功能',
      children: [
        { id: 'regex', title: '正则表达式' },
        { id: 'multiple-commands', title: '多命令操作' },
        { id: 'hold-space', title: '保持空间' }
      ]
    },
    {
      id: 'tips',
      title: '使用技巧',
      children: [
        { id: 'common-options', title: '常用选项和参数' },
        { id: 'best-practices', title: '最佳实践' },
        { id: 'troubleshooting', title: '常见问题' }
      ]
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
              <h2 className="text-2xl font-bold text-foreground mb-4">如何安装</h2>
              <p className="text-muted-foreground mb-6">
                sed（Stream Editor）是一个流编辑器，大多数Unix/Linux系统都预装了sed。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">Linux系统</h3>
                <p className="text-sm text-muted-foreground mb-2">大多数Linux发行版都预装了sed</p>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  {"# 检查是否已安装"}<br/>
                  which sed<br/>
                  sed --version
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">macOS</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  {"# macOS 通常预装 BSD sed"}<br/>
                  {"# 如需 GNU sed (功能更丰富)"}<br/>
                  brew install gnu-sed
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">Windows</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  {"# 使用 WSL 或 Git Bash"}<br/>
                  {"# 或者安装 GnuWin32"}
                </div>
              </div>
            </div>
          </div>
        )

      case 'basic-intro':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">基本介绍</h2>
              <p className="text-muted-foreground mb-6">
                sed是一个非交互式的流编辑器，主要用于批量文本处理，特别擅长文本替换和删除操作。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">主要特性</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>流处理</strong>：逐行处理文本，适合处理大文件</li>
                <li>• <strong>正则表达式</strong>：支持强大的正则表达式匹配</li>
                <li>• <strong>批量操作</strong>：可以同时处理多个文件</li>
                <li>• <strong>就地编辑</strong>：可以直接修改原文件</li>
                <li>• <strong>轻量级</strong>：占用资源少，执行效率高</li>
                <li>• <strong>脚本支持</strong>：可以编写复杂的sed脚本</li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">基本语法</h3>
              <div className="bg-muted p-4 rounded font-mono text-sm">
                {"sed [选项] '命令' [文件...]"}
              </div>
              <p className="text-sm text-muted-foreground">
                命令通常包含地址范围和操作指令。
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
                sed命令的基本结构和常用操作。
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">基本命令格式</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">打印所有行（默认行为）:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      sed &apos;&apos; file.txt
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">打印特定行:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"sed -n '1p' file.txt  # 打印第1行"}<br/>
                      {"sed -n '1,3p' file.txt  # 打印1-3行"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">替换操作:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"sed 's/old/new/' file.txt  # 替换每行第一个匹配"}<br/>
                      {"sed 's/old/new/g' file.txt  # 全局替换"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">常用选项</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded">
                    <div className="font-mono text-sm text-foreground">-n</div>
                    <div className="text-sm text-muted-foreground">静默模式，不自动打印</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded">
                    <div className="font-mono text-sm text-foreground">-i</div>
                    <div className="text-sm text-muted-foreground">就地编辑文件</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded">
                    <div className="font-mono text-sm text-foreground">-e</div>
                    <div className="text-sm text-muted-foreground">执行多个命令</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 p-3 bg-muted rounded">
                    <div className="font-mono text-sm text-foreground">-f</div>
                    <div className="text-sm text-muted-foreground">执行脚本文件</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'substitution':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">文本替换</h2>
              <p className="text-muted-foreground mb-6">
                sed最常用的功能是文本替换，支持多种替换模式。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">替换命令格式</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">基本替换</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"sed 's/old_text/new_text/' file.txt"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">只替换每行第一个匹配项</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">全局替换</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"sed 's/old_text/new_text/g' file.txt"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">替换每行所有匹配项</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">大小写不敏感替换</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"sed 's/old_text/new_text/gi' file.txt"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">i标志表示忽略大小写</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">替换特定出现次数</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"sed 's/old_text/new_text/2' file.txt"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">只替换每行第2个匹配项</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">就地修改文件</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"sed -i 's/old_text/new_text/g' file.txt"}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">直接修改原文件</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'deletion':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">删除操作</h2>
              <p className="text-muted-foreground mb-6">
                使用sed删除特定行或匹配模式的内容。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">基本删除操作</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 删除第3行"}<br/>
                    {"sed '3d' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 删除最后一行"}<br/>
                    {"sed '$d' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 删除第2到第5行"}<br/>
                    {"sed '2,5d' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 删除匹配模式的行"}<br/>
                    {"sed '/pattern/d' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 删除空行"}<br/>
                    {"sed '/^$/d' file.txt"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'address-ranges':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">地址范围</h2>
              <p className="text-muted-foreground mb-6">
                sed可以对特定行号或匹配模式的行执行操作。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">地址类型</h3>
                <div className="space-y-3">
                  {[
                    { addr: 'n', desc: '第n行' },
                    { addr: '$', desc: '最后一行' },
                    { addr: '/pattern/', desc: '匹配模式的行' },
                    { addr: 'n,m', desc: '第n行到第m行' },
                    { addr: 'n,$', desc: '第n行到最后一行' },
                    { addr: '/start/,/end/', desc: '从匹配start到匹配end的行' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="font-mono text-sm text-foreground">{item.addr}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">使用示例</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 在第5行后插入文本"}<br/>
                    {"sed '5a\\新增的行' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 替换第10到20行中的文本"}<br/>
                    {"sed '10,20s/old/new/g' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 从包含START到包含END的行进行替换"}<br/>
                    {"sed '/START/,/END/s/old/new/g' file.txt"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'regex':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">正则表达式</h2>
              <p className="text-muted-foreground mb-6">
                sed支持强大的正则表达式进行模式匹配和替换。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">基本正则表达式</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 匹配行首"}<br/>
                    {"sed 's/^/前缀: /' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 匹配行尾"}<br/>
                    {"sed 's/$/后缀/' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 匹配任意字符"}<br/>
                    {"sed 's/a.c/替换/g' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 匹配数字"}<br/>
                    {"sed 's/[0-9]/X/g' file.txt"}
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">扩展正则表达式</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 使用扩展正则表达式"}<br/>
                    {"sed -E 's/[0-9]+/NUM/g' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 匹配一个或多个"}<br/>
                    {"sed -E 's/a+/A/g' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 分组捕获"}<br/>
                    {"sed -E 's/([0-9]+)-([0-9]+)/\\2-\\1/g' file.txt"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'multiple-commands':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">多命令操作</h2>
              <p className="text-muted-foreground mb-6">
                在一次sed调用中执行多个操作命令。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">命令组合方式</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 使用 -e 选项"}<br/>
                    {"sed -e 's/old1/new1/g' -e 's/old2/new2/g' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 使用分号分隔"}<br/>
                    {"sed 's/old1/new1/g; s/old2/new2/g' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 使用脚本文件"}<br/>
                    {"sed -f script.sed file.txt"}
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">组合操作示例</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 删除空行并替换文本"}<br/>
                    {"sed '/^$/d; s/old/new/g' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 添加行号并格式化"}<br/>
                    {"sed = file.txt | sed 'N; s/\\n/: /'"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'hold-space':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">保持空间</h2>
              <p className="text-muted-foreground mb-6">
                sed的保持空间（Hold Space）用于临时存储文本，实现复杂的文本操作。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">保持空间命令</h3>
                <div className="space-y-3">
                  {[
                    { cmd: 'h', desc: '将模式空间复制到保持空间' },
                    { cmd: 'H', desc: '将模式空间追加到保持空间' },
                    { cmd: 'g', desc: '将保持空间复制到模式空间' },
                    { cmd: 'G', desc: '将保持空间追加到模式空间' },
                    { cmd: 'x', desc: '交换模式空间和保持空间' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="font-mono text-sm text-foreground">{item.cmd}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">使用示例</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 颠倒文件行序"}<br/>
                    {"sed '1!G;h;$!d' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 去除重复的连续行"}<br/>
                    {"sed '$!N; /^\\(.*\\)\\n\\1$/!P; D' file.txt"}
                  </div>
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
                了解sed命令行的各种选项和参数。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">命令行选项</h3>
              <div className="space-y-3">
                {[
                  { option: '-n', desc: '禁止自动打印模式空间' },
                  { option: '-e script', desc: '指定sed脚本' },
                  { option: '-f scriptfile', desc: '从文件读取sed脚本' },
                  { option: '-i[SUFFIX]', desc: '原地编辑文件' },
                  { option: '-r 或 -E', desc: '使用扩展正则表达式' },
                  { option: '-s', desc: '将多个文件视为独立文件' }
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
                使用sed的一些技巧和最佳实践。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">使用技巧</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>备份原文件</strong>：
                      <code className="ml-2 px-1 py-0.5 bg-muted rounded text-xs">sed -i.bak &apos;s/old/new/g&apos; file.txt</code>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>测试命令</strong>：先不用-i选项测试输出结果
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>使用合适的分隔符</strong>：当模式包含/时使用其他分隔符
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>组合多个操作</strong>：减少文件I/O次数
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">性能优化</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 使用具体的地址范围而不是处理整个文件</li>
                  <li>• 将最常见的模式放在前面</li>
                  <li>• 对于简单替换优先使用sed而不是更复杂的工具</li>
                  <li>• 使用 | cat 避免缓冲问题</li>
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
                解决使用sed时常见的问题和错误。
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "为什么sed命令在Mac上不工作？",
                  answer: "Mac的sed是BSD版本，语法略有不同。可以安装GNU sed：brew install gnu-sed"
                },
                {
                  question: "如何处理包含特殊字符的文本？",
                  answer: "使用不同的分隔符，如 s|old/path|new/path|g 而不是 s/old\\/path/new\\/path/g"
                },
                {
                  question: "为什么替换没有生效？",
                  answer: "检查正则表达式语法，确认使用了正确的转义字符"
                },
                {
                  question: "如何调试复杂的sed脚本？",
                  answer: "使用 -n 选项配合 p 命令逐步测试每个步骤"
                },
                {
                  question: "处理大文件时sed很慢怎么办？",
                  answer: "使用地址范围限制处理范围，或考虑使用流式处理工具"
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
              <Edit className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-card-foreground">sed Tour</h1>
            </div>
            {/* 目录开关按钮 */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="flex items-center space-x-1 px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded transition-colors"
              title="隐藏目录"
            >
              <FileText className="h-3 w-3" />
              <span className="hidden sm:inline">隐藏</span>
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
              <h1 className="text-xl font-bold text-foreground">sed Tour</h1>
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
