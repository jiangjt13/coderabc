"use client"

import { useState, useRef, useCallback, useEffect } from 'react'
import { 
  Code2, Check, X, Copy, Minimize, Upload, Download, 
  Search, Settings, Database, RefreshCw, Link, MousePointer,
  ChevronDown, ChevronRight
} from 'lucide-react'
import { useLanguage } from '@/contexts/language-context'

interface IndentOption {
  label: string
  value: string
  type: 'space' | 'tab'
  size?: number
}

interface JsonNode {
  path: string
  key: string
  value: any
  type: string
  expanded: boolean
  jqPath: string
}

export default function JSONTools() {
  const { language, t } = useLanguage()
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'format' | 'minify' | 'validate' | 'yaml' | 'jsonpath' | 'mock' | 'tree'>('format')
  const [yamlInput, setYamlInput] = useState('')
  const [yamlMode, setYamlMode] = useState<'json2yaml' | 'yaml2json'>('json2yaml')
  const [jsonPathQuery, setJsonPathQuery] = useState('$')
  const [jsonPathResult, setJsonPathResult] = useState('')
  const [selectedPath, setSelectedPath] = useState('')
  const [selectedJqPath, setSelectedJqPath] = useState('')
  const [indentOption, setIndentOption] = useState<IndentOption>({ label: '2 空格', value: '  ', type: 'space', size: 2 })
  const [urlInput, setUrlInput] = useState('')
  const [schemaInput, setSchemaInput] = useState('')
  const [mockData, setMockData] = useState('')
  const [jsonTree, setJsonTree] = useState<JsonNode[]>([])
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set())
  const [parsedJsonData, setParsedJsonData] = useState<any>(null) // 保存解析后的JSON数据
  const fileInputRef = useRef<HTMLInputElement>(null)

  const indentOptions: IndentOption[] = [
    { label: '2 空格', value: '  ', type: 'space', size: 2 },
    { label: '4 空格', value: '    ', type: 'space', size: 4 },
    { label: 'Tab', value: '\t', type: 'tab' }
  ]

  // 动态更新页面标题
  useEffect(() => {
    document.title = `CoderABC - ${t('json.tools.page.title')}`
    return () => {
      document.title = 'CoderABC - 开发者工具与技术笔记'
    }
  }, [language, t])

  // 简单的JSON到YAML转换 - 修复数组缩进问题
  const jsonToYamlSimple = (obj: any, indent = 0): string => {
    const spaces = '  '.repeat(indent)
    
    if (obj === null) return 'null'
    if (typeof obj === 'boolean') return obj.toString()
    if (typeof obj === 'number') return obj.toString()
    if (typeof obj === 'string') {
      if (obj.includes('\n') || obj.includes(':') || obj.includes('#')) {
        return `"${obj.replace(/"/g, '\\"')}"`
      }
      return obj
    }
    
    if (Array.isArray(obj)) {
      if (obj.length === 0) return '[]'
      return obj.map(item => {
        if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
          // 对象类型的数组元素，需要特殊处理缩进
          const entries = Object.entries(item)
          if (entries.length === 0) return `${spaces}- {}`
          
          const lines = entries.map(([key, value], index) => {
            const valueStr = jsonToYamlSimple(value, indent + 1)
            const prefix = index === 0 ? `${spaces}- ` : `${spaces}  `
            
            if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
              return `${prefix}${key}:\n${valueStr}`
            } else if (Array.isArray(value) && value.length > 0) {
              return `${prefix}${key}:\n${valueStr}`
            } else {
              return `${prefix}${key}: ${valueStr}`
            }
          })
          return lines.join('\n')
        } else {
          const itemValue = jsonToYamlSimple(item, indent + 1)
          return `${spaces}- ${itemValue}`
        }
      }).join('\n')
    }
    
    if (typeof obj === 'object') {
      const entries = Object.entries(obj)
      if (entries.length === 0) return '{}'
      return entries.map(([key, value]) => {
        const valueStr = jsonToYamlSimple(value, indent + 1)
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          return `${spaces}${key}:\n${valueStr}`
        } else if (Array.isArray(value) && value.length > 0) {
          return `${spaces}${key}:\n${valueStr}`
        } else {
          return `${spaces}${key}: ${valueStr}`
        }
      }).join('\n')
    }
    
    return String(obj)
  }

  // 简单的YAML到JSON转换
  const yamlToJsonSimple = (yamlStr: string): any => {
    const lines = yamlStr.split('\n').filter(line => line.trim() && !line.trim().startsWith('#'))
    const result: any = {}
    const stack: any[] = [result]
    
    for (const line of lines) {
      const indent = line.length - line.trimStart().length
      const trimmed = line.trim()
      
      if (trimmed.startsWith('- ')) {
        const value = trimmed.substring(2).trim()
        const parent = stack[stack.length - 1]
        if (!Array.isArray(parent)) {
          const lastKey = Object.keys(parent).pop()
          if (lastKey) parent[lastKey] = []
        }
        const arr = Array.isArray(parent) ? parent : parent[Object.keys(parent).pop()!]
        arr.push(parseYamlValue(value))
      } else if (trimmed.includes(':')) {
        const colonIndex = trimmed.indexOf(':')
        const key = trimmed.substring(0, colonIndex).trim()
        const value = trimmed.substring(colonIndex + 1).trim()
        
        while (stack.length > Math.floor(indent / 2) + 1) {
          stack.pop()
        }
        
        const parent = stack[stack.length - 1]
        if (value === '') {
          parent[key] = {}
          stack.push(parent[key])
        } else {
          parent[key] = parseYamlValue(value)
        }
      }
    }
    
    return result
  }

  const parseYamlValue = (value: string): any => {
    if (value === 'null') return null
    if (value === 'true') return true
    if (value === 'false') return false
    if (value.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1).replace(/\\"/g, '"')
    }
    if (!isNaN(Number(value))) return Number(value)
    return value
  }

  // JSONPath 简单实现
  const executeJsonPath = (obj: any, path: string): any => {
    try {
      if (path === '$') return obj
      
      const parts = path.replace(/^\$\.?/, '').split(/\.|\[|\]/).filter(Boolean)
      let result = obj
      
      for (const part of parts) {
        if (Array.isArray(result)) {
          const index = parseInt(part)
          if (!isNaN(index)) {
            result = result[index]
          }
        } else if (typeof result === 'object' && result !== null) {
          result = result[part]
        } else {
          return undefined
        }
      }
      
      return result
    } catch (error) {
      throw new Error(`JSONPath查询失败: ${error}`)
    }
  }

  const buildJsonTree = useCallback((obj: any, parentPath = '$', parentKey = 'root'): JsonNode[] => {
    const nodes: JsonNode[] = []
    
    if (typeof obj === 'object' && obj !== null) {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          const path = `${parentPath}[${index}]`
          const jqPath = parentPath === '$' ? `$[${index}]` : `${parentPath}[${index}]`
          const type = Array.isArray(item) ? 'array' : typeof item === 'object' && item !== null ? 'object' : typeof item
          
          nodes.push({
            path,
            key: `[${index}]`,
            value: item,
            type,
            expanded: expandedNodes.has(path),
            jqPath
          })
          
          // 递归构建子节点（如果该节点被展开）
          if ((typeof item === 'object' && item !== null) && expandedNodes.has(path)) {
            nodes.push(...buildJsonTree(item, path, `[${index}]`))
          }
        })
      } else {
        Object.entries(obj).forEach(([key, value]) => {
          const path = parentPath === '$' ? `$.${key}` : `${parentPath}.${key}`
          const jqPath = parentPath === '$' ? `$.${key}` : `${parentPath}.${key}`
          const type = Array.isArray(value) ? 'array' : typeof value === 'object' && value !== null ? 'object' : typeof value
          
          nodes.push({
            path,
            key,
            value,
            type,
            expanded: expandedNodes.has(path),
            jqPath
          })
          
          // 递归构建子节点（如果该节点被展开）
          if ((typeof value === 'object' && value !== null) && expandedNodes.has(path)) {
            nodes.push(...buildJsonTree(value, path, key))
          }
        })
      }
    }
    
    return nodes
  }, [expandedNodes])

  // 监听展开状态变化，重新构建树
  useEffect(() => {
    if (parsedJsonData) {
      setJsonTree(buildJsonTree(parsedJsonData))
    }
  }, [expandedNodes, parsedJsonData, buildJsonTree])

  const formatJSON = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, indentOption.value)
      setOutput(formatted)
      setIsValid(true)
      setError('')
      setParsedJsonData(parsed) // 保存解析后的数据
      setJsonTree(buildJsonTree(parsed))
    } catch (err) {
      setError(`JSON 格式错误: ${(err as Error).message}`)
      setIsValid(false)
      setOutput('')
      setParsedJsonData(null)
      setJsonTree([])
    }
  }

  const minifyJSON = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setIsValid(true)
      setError('')
    } catch (err) {
      setError(`JSON 格式错误: ${(err as Error).message}`)
      setIsValid(false)
      setOutput('')
    }
  }

  const validateJSON = () => {
    try {
      const parsed = JSON.parse(input)
      setIsValid(true)
      setError('')
      setOutput('✅ JSON 格式正确')
      setParsedJsonData(parsed) // 保存解析后的数据
      setJsonTree(buildJsonTree(parsed))
    } catch (err) {
      setError(`JSON 格式错误: ${(err as Error).message}`)
      setIsValid(false)
      setOutput('')
      setParsedJsonData(null)
      setJsonTree([])
    }
  }

  const jsonToYaml = () => {
    try {
      const parsed = JSON.parse(input)
      const yamlStr = jsonToYamlSimple(parsed)
      setOutput(yamlStr)
      setIsValid(true)
      setError('')
    } catch (err) {
      setError(`转换失败: ${(err as Error).message}`)
      setIsValid(false)
      setOutput('')
    }
  }

  const yamlToJson = () => {
    try {
      const parsed = yamlToJsonSimple(yamlInput)
      const jsonStr = JSON.stringify(parsed, null, indentOption.value)
      setOutput(jsonStr)
      setIsValid(true)
      setError('')
    } catch (err) {
      setError(`YAML 格式错误: ${(err as Error).message}`)
      setIsValid(false)
      setOutput('')
    }
  }

  const executeJsonPathQuery = () => {
    try {
      const parsed = JSON.parse(input)
      const result = executeJsonPath(parsed, jsonPathQuery)
      setJsonPathResult(JSON.stringify(result, null, indentOption.value))
      setError('')
    } catch (err) {
      setError(`JSONPath 查询错误: ${(err as Error).message}`)
      setJsonPathResult('')
    }
  }

  const generateMockData = () => {
    try {
      const schema = JSON.parse(schemaInput)
      const generateFromSchema = (schema: any): any => {
        if (schema.type === 'string') {
          return schema.example || schema.default || 'sample string'
        } else if (schema.type === 'number' || schema.type === 'integer') {
          return schema.example || schema.default || (schema.minimum || 0) + Math.floor(Math.random() * 100)
        } else if (schema.type === 'boolean') {
          return schema.example !== undefined ? schema.example : (schema.default !== undefined ? schema.default : true)
        } else if (schema.type === 'array') {
          const itemsSchema = schema.items || { type: 'string' }
          const length = schema.minItems || 1
          return Array.from({ length }, () => generateFromSchema(itemsSchema))
        } else if (schema.type === 'object') {
          const obj: any = {}
          if (schema.properties) {
            Object.entries(schema.properties).forEach(([key, propSchema]: [string, any]) => {
              obj[key] = generateFromSchema(propSchema)
            })
          }
          return obj
        } else if (schema.enum) {
          return schema.enum[Math.floor(Math.random() * schema.enum.length)]
        }
        return null
      }
      
      const mock = generateFromSchema(schema)
      setMockData(JSON.stringify(mock, null, indentOption.value))
      setError('')
    } catch (err) {
      setError(`Schema 错误或生成失败: ${(err as Error).message}`)
      setMockData('')
    }
  }

  const loadFromUrl = async () => {
    try {
      const response = await fetch(urlInput)
      const data = await response.json()
      setInput(JSON.stringify(data, null, indentOption.value))
      setError('')
    } catch (err) {
      setError(`URL 加载失败: ${(err as Error).message}`)
    }
  }

  const loadFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setInput(content)
      }
      reader.readAsText(file)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch (err) {
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
  }

  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const selectJsonNode = (node: JsonNode) => {
    setSelectedPath(node.path)
    setSelectedJqPath(node.jqPath)
    setJsonPathQuery(node.path)
  }

  const toggleNodeExpansion = (path: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedNodes(newExpanded)
  }

  const renderJsonTree = (nodes: JsonNode[]) => {
    // 过滤显示的节点：只显示根节点和已展开节点的直接子节点
    const visibleNodes = nodes.filter(node => {
      // 第一层节点总是显示（例如 $.ip, $.city, $.items 等）
      if (node.path.match(/^\$\.[^.\[]+$/) || node.path.match(/^\$\[\d+\]$/)) {
        return true // 第一层节点总是显示
      }
      
      // 对于更深层的节点，检查父节点是否已展开
      // 例如: $.items[0].name 的父节点是 $.items[0]
      // 例如: $.items[0] 的父节点是 $.items
      let parentPath = ''
      
      if (node.path.includes('[') && node.path.includes(']')) {
        // 处理包含数组索引的路径
        if (node.path.match(/\]\.[^.\[]+$/)) {
          // 如果是数组元素的属性，例如 $.items[0].name -> $.items[0]
          parentPath = node.path.replace(/\.[^.\[]+$/, '')
        } else if (node.path.match(/\[\d+\]$/)) {
          // 如果是数组元素，例如 $.items[0] -> $.items
          parentPath = node.path.replace(/\[\d+\]$/, '')
        }
      } else {
        // 处理普通对象属性路径
        const lastDotIndex = node.path.lastIndexOf('.')
        if (lastDotIndex > 0) {
          parentPath = node.path.substring(0, lastDotIndex)
        }
      }
      
      return expandedNodes.has(parentPath)
    })

    return visibleNodes.map((node) => {
      const hasChildren = typeof node.value === 'object' && node.value !== null
      const isExpanded = expandedNodes.has(node.path)
      const nodeLevel = node.path.split(/[\.\[]/).length - 1

      return (
        <div
          key={node.path}
          className={`flex items-center py-1 px-2 hover:bg-accent cursor-pointer ${
            selectedPath === node.path ? 'bg-blue-100 dark:bg-blue-900/30' : ''
          }`}
          style={{ paddingLeft: `${nodeLevel * 20 + 8}px` }}
          onClick={() => selectJsonNode(node)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleNodeExpansion(node.path)
              }}
              className="mr-1 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          
          <span className="text-blue-600 dark:text-blue-400 font-mono text-sm mr-2">
            {node.key}:
          </span>
          
          <span className={`text-sm font-mono ${
            node.type === 'string' ? 'text-green-600 dark:text-green-400' :
            node.type === 'number' ? 'text-purple-600 dark:text-purple-400' :
            node.type === 'boolean' ? 'text-orange-600 dark:text-orange-400' :
            node.type === 'object' ? 'text-gray-600 dark:text-gray-400' :
            node.type === 'array' ? 'text-gray-600 dark:text-gray-400' :
            'text-gray-800 dark:text-gray-200'
          }`}>
            {hasChildren 
              ? `{${node.type === 'array' ? `Array(${node.value.length})` : `Object`}}`
              : JSON.stringify(node.value)
            }
          </span>
        </div>
      )
    })
  }

  const processInput = () => {
    switch (mode) {
      case 'format': formatJSON(); break
      case 'minify': minifyJSON(); break
      case 'validate': validateJSON(); break
      case 'yaml': 
        if (yamlMode === 'json2yaml') {
          jsonToYaml()
        } else {
          yamlToJson()
        }
        break
      case 'tree': formatJSON(); break // 树形视图模式也需要先格式化JSON
      default: break
    }
  }

  const clearAll = () => {
    setInput('')
    setOutput('')
    setYamlInput('')
    setJsonPathQuery('$')
    setJsonPathResult('')
    setSchemaInput('')
    setMockData('')
    setError('')
    setIsValid(null)
    setJsonTree([])
    setSelectedPath('')
    setSelectedJqPath('')
    setExpandedNodes(new Set())
    setParsedJsonData(null) // 清除解析后的数据
    setYamlMode('json2yaml')
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-2">
          <Code2 className="h-8 w-8 text-primary" />
          <span>{t('json.tools.title')}</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          {t('json.tools.description')}
        </p>
      </div>

      {/* 工具模式选择 */}
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {[
            { key: 'format', label: '格式化', icon: Code2 },
            { key: 'minify', label: '压缩', icon: Minimize },
            { key: 'validate', label: '验证', icon: Check },
            { key: 'yaml', label: 'YAML转换', icon: RefreshCw },
            { key: 'jsonpath', label: 'JSONPath查询', icon: Search },
            { key: 'tree', label: 'JSON树形视图', icon: MousePointer },
            { key: 'mock', label: 'Mock生成', icon: Database }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setMode(key as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                mode === key
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background border-border hover:bg-accent'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* 格式化时的缩进选择 */}
        {mode === 'format' && (
          <div className="flex items-center space-x-4 mb-4">
            <label className="text-sm font-medium">缩进方式:</label>
            <select
              value={indentOptions.findIndex(opt => opt.value === indentOption.value)}
              onChange={(e) => setIndentOption(indentOptions[parseInt(e.target.value)])}
              className="px-2 py-1 border border-border rounded bg-background text-foreground"
            >
              {indentOptions.map((option, index) => (
                <option key={index} value={index}>{option.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* 状态指示器 */}
        {isValid !== null && (
          <div className={`mb-4 flex items-center space-x-2 text-sm ${
            isValid ? 'text-green-600' : 'text-red-600'
          }`}>
            {isValid ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
            <span>{isValid ? 'JSON 格式正确' : '格式错误'}</span>
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="text-red-700 dark:text-red-300 text-sm">{error}</div>
          </div>
        )}

        {/* 导入导出按钮 */}
        <div className="flex items-center space-x-2 mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={loadFromFile}
              accept=".json,.txt"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center space-x-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-900/50"
            >
              <Upload className="h-3 w-3" />
              <span className="text-xs">导入文件</span>
            </button>
            <button
              onClick={() => downloadFile(output, 'processed.json')}
              disabled={!output}
              className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50 disabled:opacity-50"
            >
              <Download className="h-3 w-3" />
              <span className="text-xs">下载结果</span>
            </button>
            <button
              onClick={clearAll}
              className="flex items-center space-x-1 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded hover:bg-red-200 dark:hover:bg-red-900/50"
            >
              <X className="h-3 w-3" />
              <span className="text-xs">清除</span>
            </button>
        </div>

        {/* URL 输入 */}
        <div className="flex space-x-2 mb-4">
          <input
            type="url"
            placeholder="从URL加载JSON (例如: https://api.example.com/data)"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={loadFromUrl}
            disabled={!urlInput}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <Link className="h-4 w-4" />
            <span>加载</span>
          </button>
        </div>
      </div>

      {/* 主要内容区域 - 左右对称布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：输入区域 */}
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">
              {mode === 'yaml' && yamlMode === 'yaml2json' ? 'YAML 输入' :
               mode === 'mock' ? 'JSON Schema 输入' :
               'JSON 输入'}
            </h3>
            <div className="flex items-center space-x-2">
              {/* YAML模式选择器 */}
              {mode === 'yaml' && (
                <select
                  value={yamlMode}
                  onChange={(e) => setYamlMode(e.target.value as any)}
                  className="px-2 py-1 text-sm border border-border rounded bg-background"
                >
                  <option value="json2yaml">JSON → YAML</option>
                  <option value="yaml2json">YAML → JSON</option>
                </select>
              )}
              <button
                onClick={() => copyToClipboard(mode === 'yaml' && yamlMode === 'yaml2json' ? yamlInput : mode === 'mock' ? schemaInput : input)}
                className="p-1 hover:bg-accent rounded"
                title="复制输入内容"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          {/* 根据模式显示不同的输入框 */}
          {mode === 'yaml' && yamlMode === 'yaml2json' ? (
            <textarea
              value={yamlInput}
              onChange={(e) => setYamlInput(e.target.value)}
              placeholder="在此输入YAML数据进行转换..."
              className="w-full h-80 px-3 py-2 font-mono text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          ) : mode === 'mock' ? (
            <textarea
              value={schemaInput}
              onChange={(e) => setSchemaInput(e.target.value)}
              placeholder={`输入JSON Schema，例如:
{
  "type": "object",
  "properties": {
    "name": {"type": "string", "example": "张三"},
    "age": {"type": "number", "minimum": 18},
    "active": {"type": "boolean"},
    "tags": {
      "type": "array",
      "items": {"type": "string"}
    }
  }
}`}
              className="w-full h-80 px-3 py-2 font-mono text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          ) : (
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="在此输入您的JSON数据..."
              className="w-full h-80 px-3 py-2 font-mono text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          )}

          {/* JSONPath查询控制面板 */}
          {mode === 'jsonpath' && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-foreground">JSONPath 查询表达式</label>
              </div>
              <input
                type="text"
                value={jsonPathQuery}
                onChange={(e) => setJsonPathQuery(e.target.value)}
                placeholder="例如: $.data[0].name"
                className="w-full px-3 py-2 font-mono text-sm border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {selectedJqPath && (
                <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                  <span className="text-muted-foreground">选中路径: </span>
                  <span className="font-mono text-blue-600 dark:text-blue-400">{selectedJqPath}</span>
                </div>
              )}
            </div>
          )}

          {/* 操作按钮 - 在左侧底部 */}
          <div className="mt-4 flex justify-center">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  if (mode === 'yaml' && yamlMode === 'yaml2json') {
                    yamlToJson()
                  } else if (mode === 'mock') {
                    generateMockData()
                  } else if (mode === 'tree') {
                    formatJSON() // 树形视图需要先解析JSON
                  } else if (mode === 'jsonpath') {
                    executeJsonPathQuery() // JSONPath模式调用查询函数
                  } else {
                    processInput()
                  }
                }}
                disabled={mode === 'yaml' && yamlMode === 'yaml2json' ? !yamlInput.trim() : mode === 'mock' ? !schemaInput.trim() : !input.trim()}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
              >
                <Code2 className="h-4 w-4" />
                <span>
                  {mode === 'format' ? '格式化' :
                   mode === 'minify' ? '压缩' :
                   mode === 'validate' ? '验证' :
                   mode === 'yaml' ? (yamlMode === 'json2yaml' ? 'JSON → YAML' : 'YAML → JSON') :
                   mode === 'jsonpath' ? '执行查询' :
                   mode === 'tree' ? '构建树形视图' :
                   mode === 'mock' ? '生成Mock数据' :
                   '处理'
                  }
                </span>
              </button>

              {/* JSONPath查询按钮 - 移除重复按钮 */}
            </div>
          </div>
        </div>

        {/* 右侧：输出区域 */}
        <div className="bg-card border border-border rounded-lg p-4">
          {/* JSON树形视图 - 仅在tree模式显示 */}
          {mode === 'tree' ? (
            jsonTree.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground flex items-center space-x-2">
                    <MousePointer className="h-4 w-4" />
                    <span>JSON 树形视图</span>
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setExpandedNodes(new Set(jsonTree.map(n => n.path)))}
                      className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded"
                    >
                      全部展开
                    </button>
                    <button
                      onClick={() => setExpandedNodes(new Set())}
                      className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded"
                    >
                      全部折叠
                    </button>
                  </div>
                </div>
                <div className="h-80 overflow-y-auto border border-border rounded">
                  {renderJsonTree(jsonTree)}
                </div>
                {selectedPath && (
                  <div className="mt-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                    <div className="text-muted-foreground">选中节点: <span className="font-mono text-blue-600 dark:text-blue-400">{selectedPath}</span></div>
                    <div className="text-muted-foreground">JQ表达式: <span className="font-mono text-green-600 dark:text-green-400">{selectedJqPath}</span></div>
                  </div>
                )}
              </>
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <MousePointer className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-lg mb-2">JSON 树形视图</p>
                  <p className="text-sm">在左侧输入有效的JSON数据，然后点击&quot;构建树形视图&quot;按钮</p>
                </div>
              </div>
            )
          ) : mode === 'jsonpath' ? (
            /* JSONPath查询结果 */
            jsonPathResult ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">查询结果</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(jsonPathResult)}
                      className="p-1 hover:bg-accent rounded"
                      title="复制查询结果"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => downloadFile(jsonPathResult, 'query-result.json')}
                      className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
                    >
                      <Download className="h-3 w-3" />
                      <span className="text-xs">下载</span>
                    </button>
                  </div>
                </div>
                <textarea
                  value={jsonPathResult}
                  readOnly
                  className="w-full h-80 px-3 py-2 font-mono text-sm border border-border rounded-lg bg-muted text-foreground resize-none"
                />
              </>
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                执行JSONPath查询后结果将在这里显示
              </div>
            )
          ) : (
            /* 其他模式的主要输出结果 */
            (output || mockData) ? (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    {mode === 'yaml' ? 
                      (yamlMode === 'json2yaml' ? 'YAML 输出' : 'JSON 输出') :
                     mode === 'mock' ? '生成的Mock数据' :
                     '处理结果'}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(output || mockData)}
                      className="p-1 hover:bg-accent rounded"
                      title="复制输出内容"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => downloadFile(output || mockData, mode === 'yaml' && yamlMode === 'json2yaml' ? 'output.yaml' : 'output.json')}
                      className="flex items-center space-x-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded hover:bg-green-200 dark:hover:bg-green-900/50"
                    >
                      <Download className="h-3 w-3" />
                      <span className="text-xs">下载</span>
                    </button>
                  </div>
                </div>
                <textarea
                  value={mode === 'mock' ? mockData : output}
                  readOnly
                  className="w-full h-80 px-3 py-2 font-mono text-sm border border-border rounded-lg bg-muted text-foreground resize-none"
                />
              </>
            ) : (
              <div className="h-96 flex items-center justify-center text-muted-foreground">
                处理结果将在这里显示
              </div>
            )
          )}
        </div>
      </div>

      {/* 功能说明 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">功能说明</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <h3 className="font-medium text-foreground mb-2">🎨 格式化 & 压缩</h3>
            <p>美化JSON格式，支持自定义缩进(2/4空格或Tab)，或压缩去除空白字符</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">🔄 YAML 转换</h3>
            <p>JSON与YAML格式的双向转换，支持下拉菜单选择转换方向，修复数组缩进问题</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">🔍 JSONPath 查询</h3>
            <p>支持JSONPath表达式查询，点击树形视图节点自动生成查询路径</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">🌳 独立树形视图</h3>
            <p>专门的JSON树形视图模式，支持数组展开，展开/折叠功能，可视化JSON结构</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">📁 文件 & URL</h3>
            <p>支持从本地文件或远程URL加载JSON数据，支持导出处理结果</p>
          </div>
          <div>
            <h3 className="font-medium text-foreground mb-2">🎲 Mock 生成</h3>
            <p>左侧输入JSON Schema，右侧显示生成的mock数据，支持各种数据类型</p>
          </div>
        </div>
      </div>
    </div>
  )
}
