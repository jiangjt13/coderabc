'use client'

import { FileText, Terminal, Copy, ChevronDown, ChevronRight, Menu, X, Code } from 'lucide-react'
import { useState } from 'react'

export default function AwkTour() {
  const [activeSection, setActiveSection] = useState('installation')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'getting-started': true,
    'basic-usage': true,
    'advanced': true,
    'tips': true
  })

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
        { id: 'field-operations', title: '字段操作' },
        { id: 'pattern-matching', title: '模式匹配' },
        { id: 'built-in-variables', title: '内置变量' }
      ]
    },
    {
      id: 'advanced',
      title: '高级功能',
      children: [
        { id: 'functions', title: '内置函数' },
        { id: 'arrays', title: '数组操作' },
        { id: 'control-structures', title: '控制结构' }
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
                awk是一个强大的文本处理工具，大多数Unix/Linux系统都预装了awk。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">Linux系统</h3>
                <p className="text-sm text-muted-foreground mb-2">大多数Linux发行版都预装了awk</p>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  {"# 检查是否已安装"}<br/>
                  which awk<br/>
                  awk --version
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">macOS</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  {"# macOS 通常预装 awk"}<br/>
                  {"# 如需GNU awk (gawk)"}<br/>
                  brew install gawk
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">Windows</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  {"# 使用 WSL 或 Cygwin"}<br/>
                  {"# 或者安装 Git Bash (包含 awk)"}
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
                awk是一种编程语言，特别适合处理结构化数据和生成报告。它以模式-动作的方式工作。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">主要特性</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>字段分割</strong>：自动将输入分割为字段</li>
                <li>• <strong>模式匹配</strong>：支持正则表达式和条件匹配</li>
                <li>• <strong>内置变量</strong>：提供丰富的内置变量</li>
                <li>• <strong>数学计算</strong>：支持复杂的数学运算</li>
                <li>• <strong>字符串处理</strong>：强大的字符串操作函数</li>
                <li>• <strong>数组支持</strong>：支持关联数组</li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">基本语法</h3>
              <div className="bg-muted p-4 rounded font-mono text-sm">
                {"awk 'pattern { action }' file"}
              </div>
              <p className="text-sm text-muted-foreground">
                pattern是匹配条件，action是要执行的操作。
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
                awk的基本语法包括模式匹配和动作执行。
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">基本结构</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">打印所有行:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"awk '{ print }' file.txt"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">打印第一个字段:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"awk '{ print $1 }' file.txt"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">打印最后一个字段:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"awk '{ print $NF }' file.txt"}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">BEGIN和END</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">BEGIN块（处理前执行）:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"awk 'BEGIN { print \"开始处理\" } { print $1 }' file.txt"}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">END块（处理后执行）:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"awk '{ sum += $1 } END { print \"总和:\", sum }' file.txt"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'field-operations':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">字段操作</h2>
              <p className="text-muted-foreground mb-6">
                awk自动将输入按空格分割为字段，可以方便地操作各个字段。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">字段访问</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 打印第一个字段"}<br/>
                    awk &apos;{"{print $1}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 打印最后一个字段"}<br/>
                    awk &apos;{"{print $NF}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 打印除第一个字段外的所有字段"}<br/>
                    awk &apos;{"{$1=\"\"; print}"}&apos; file.txt
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">字段修改</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 交换第一列和第二列"}<br/>
                    awk &apos;{"{temp=$1; $1=$2; $2=temp; print}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 在每行前添加行号"}<br/>
                    awk &apos;{"{print NR, $0}"}&apos; file.txt
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'pattern-matching':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">模式匹配</h2>
              <p className="text-muted-foreground mb-6">
                awk支持正则表达式模式匹配，可以根据条件处理特定行。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">正则表达式匹配</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 匹配包含特定字符串的行"}<br/>
                    awk &apos;/pattern/ {"{print}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 匹配特定字段"}<br/>
                    awk &apos;$1 ~ /^[0-9]+$/ {"{print \"数字:\", $1}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 不匹配特定模式"}<br/>
                    awk &apos;!/pattern/ {"{print}"}&apos; file.txt
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">条件匹配</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 数值比较"}<br/>
                    {"awk '$3 > 100 {print \"大于100:\", $0}' file.txt"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 字符串比较"}<br/>
                    awk &apos;$2 == &quot;active&quot; {"{print}"}&apos; file.txt
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'built-in-variables':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">内置变量</h2>
              <p className="text-muted-foreground mb-6">
                awk提供了多个内置变量来访问文件和记录信息。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">常用内置变量</h3>
                <div className="space-y-3">
                  {[
                    { var: 'NR', desc: '当前记录号（行号）' },
                    { var: 'NF', desc: '当前记录的字段数' },
                    { var: 'FS', desc: '字段分隔符（默认空格）' },
                    { var: 'RS', desc: '记录分隔符（默认换行符）' },
                    { var: 'OFS', desc: '输出字段分隔符' },
                    { var: 'ORS', desc: '输出记录分隔符' },
                    { var: 'FILENAME', desc: '当前文件名' },
                    { var: 'FNR', desc: '当前文件中的记录号' }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded">
                      <div className="font-mono text-sm text-foreground">{item.var}</div>
                      <div className="text-xs text-muted-foreground">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">使用示例</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 显示行号和内容"}<br/>
                    awk &apos;{"{print NR \":\", $0}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 显示字段数"}<br/>
                    awk &apos;{"{print \"Line\", NR, \"has\", NF, \"fields\"}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 自定义分隔符"}<br/>
                    awk &apos;BEGIN{"{FS=\",\"}"} {"{print $1, $2}"}&apos; file.csv
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'functions':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">内置函数</h2>
              <p className="text-muted-foreground mb-6">
                awk提供了丰富的内置函数用于字符串处理、数学计算等。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">字符串函数</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# length() - 字符串长度"}<br/>
                    awk &apos;{"{print length($1)}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# substr() - 子字符串"}<br/>
                    awk &apos;{"{print substr($1, 2, 3)}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# gsub() - 全局替换"}<br/>
                    awk &apos;{"{gsub(/old/, \"new\"); print}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# toupper() / tolower() - 大小写转换"}<br/>
                    awk &apos;{"{print toupper($1)}"}&apos; file.txt
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">数学函数</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# sqrt() - 平方根"}<br/>
                    awk &apos;{"{print sqrt($1)}"}&apos; numbers.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# int() - 取整"}<br/>
                    awk &apos;{"{print int($1)}"}&apos; numbers.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# rand() - 随机数"}<br/>
                    awk &apos;BEGIN {"{print rand()}"}&apos; 
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'arrays':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">数组操作</h2>
              <p className="text-muted-foreground mb-6">
                awk支持关联数组，可以用来统计、分组和复杂数据处理。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">数组基础</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 统计每个单词出现次数"}<br/>
                    awk &apos;{"{for(i=1;i<=NF;i++) count[$i]++}"} END {"{for(word in count) print word, count[word]}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 按第一列分组求和"}<br/>
                    awk &apos;{"{sum[$1] += $2}"} END {"{for(key in sum) print key, sum[key]}"}&apos; data.txt
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">数组遍历</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 遍历数组"}<br/>
                    awk &apos;END {"{for(key in array) print key, array[key]}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 检查数组元素是否存在"}<br/>
                    awk &apos;{"{if($1 in seen) print \"重复:\", $1; seen[$1]=1}"}&apos; file.txt
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'control-structures':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">控制结构</h2>
              <p className="text-muted-foreground mb-6">
                awk支持条件语句、循环等控制结构，可以编写复杂的数据处理逻辑。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">条件语句</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# if-else 语句"}<br/>
                    awk &apos;{"{if($1 > 100) print \"大\"; else print \"小\"}"}&apos; numbers.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 多条件判断"}<br/>
                    awk &apos;{"{if($1>90) grade=\"A\"; else if($1>80) grade=\"B\"; else grade=\"C\"; print $1, grade}"}&apos; scores.txt
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">循环语句</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# for 循环"}<br/>
                    awk &apos;{"{for(i=1; i<=NF; i++) print i, $i}"}&apos; file.txt
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# while 循环"}<br/>
                    {"awk '{i=1; while(i<=NF) {print $i; i++}}' file.txt"}
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
                了解awk命令行的各种选项和参数。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">命令行选项</h3>
              <div className="space-y-3">
                {[
                  { option: '-F fs', desc: '指定字段分隔符' },
                  { option: '-v var=value', desc: '设置变量' },
                  { option: '-f script.awk', desc: '从文件读取awk脚本' },
                  { option: '-W interactive', desc: '交互模式' },
                  { option: '-W version', desc: '显示版本信息' }
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
                使用awk的一些技巧和最佳实践。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">使用技巧</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>使用BEGIN和END模式</strong>：
                      <code className="ml-2 px-1 py-0.5 bg-muted rounded text-xs">{"BEGIN {initialization} {main} END {cleanup}"}</code>
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>合理使用字段分隔符</strong>：根据数据格式选择合适的FS
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>使用NR和FNR</strong>：处理多文件时区分总行号和文件内行号
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>模式匹配优化</strong>：将最常见的模式放在前面
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">性能优化</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 避免在循环中进行复杂的正则表达式匹配</li>
                  <li>• 使用关联数组代替线性搜索</li>
                  <li>• 尽早退出处理（使用exit语句）</li>
                  <li>• 合理使用字段引用，避免不必要的字段分割</li>
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
                解决使用awk时常见的问题和错误。
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "为什么字段没有按预期分割？",
                  answer: "检查字段分隔符设置，可能需要使用-F选项或在BEGIN中设置FS变量"
                },
                {
                  question: "如何处理包含空格的字段？",
                  answer: "使用引号包围字段，或者改变字段分隔符为其他字符如逗号"
                },
                {
                  question: "为什么数值比较不正确？",
                  answer: "确保比较的是数值而不是字符串，可以使用+0强制转换为数值"
                },
                {
                  question: "如何调试复杂的awk脚本？",
                  answer: "使用print语句输出中间结果，或者将脚本分步执行"
                },
                {
                  question: "处理大文件时内存不足怎么办？",
                  answer: "避免将所有数据存储在数组中，考虑使用流式处理"
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
              <Code className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-card-foreground">awk Tour</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 hover:bg-muted rounded lg:hidden"
            >
              <X className="h-4 w-4" />
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
              <h1 className="text-xl font-bold text-foreground">awk Tour</h1>
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
