"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Server, ArrowLeft, RefreshCw, Copy, Check, Info } from 'lucide-react'

interface IPv4ConversionResult {
  type: 'ipv4'
  decimal: string
  binary: string
  hexadecimal: string
  octal: string
  ipv4: string
  int32: string
  uint32: string
  bigEndian: string
  littleEndian: string
}

interface IPv6ConversionResult {
  type: 'ipv6'
  ipv6: string
  expanded: string
  compressed: string
  binary: string
  hexadecimal: string
  decimal: string
}

type ConversionResult = IPv4ConversionResult | IPv6ConversionResult

interface AggregatedResults {
  inputs: string[]
  ipv4s: string[]
  uint32s: string[]
  int32s: string[]
  bigEndians: string[]
  littleEndians: string[]
  binaries: string[]
  hexadecimals: string[]
  octals: string[]
  type: 'ipv4' | 'ipv6' | 'mixed'
  // IPv6 fields
  expandeds?: string[]
  compresseds?: string[]
  decimals?: string[]
}

export default function IPConverter() {
  const [input, setInput] = useState('')
  const [aggregatedResults, setAggregatedResults] = useState<AggregatedResults | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [inputType, setInputType] = useState<'auto' | 'ipv4' | 'ipv6' | 'decimal' | 'binary' | 'hex'>('auto')
  const [endianness, setEndianness] = useState<'big' | 'little'>('big')
  const [signedMode, setSignedMode] = useState<'signed' | 'unsigned'>('unsigned')
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (error) {
      // 降级处理
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    }
  }

  const isValidIPv4 = (ip: string): boolean => {
    const parts = ip.split('.')
    if (parts.length !== 4) return false
    return parts.every(part => {
      const num = parseInt(part)
      return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString()
    })
  }

  const isValidIPv6 = (ip: string): boolean => {
    // 简化的IPv6验证
    const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^([0-9a-fA-F]{1,4}:)*::([0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$|^::1$|^::$/
    return ipv6Regex.test(ip)
  }

  const detectInputType = (input: string): 'ipv4' | 'ipv6' | 'decimal' | 'binary' | 'hex' => {
    if (isValidIPv4(input)) return 'ipv4'
    if (isValidIPv6(input)) return 'ipv6'
    if (/^0x[0-9a-fA-F]+$/.test(input) || /^[0-9a-fA-F]+$/.test(input.replace(/[^0-9a-fA-F]/g, ''))) return 'hex'
    if (/^[01]+$/.test(input.replace(/[^01]/g, ''))) return 'binary'
    if (/^-?\d+$/.test(input)) return 'decimal'
    return 'decimal'
  }

  const ipv4ToUint32 = (ip: string): number => {
    const parts = ip.split('.').map(part => parseInt(part))
    return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0
  }

  const uint32ToIPv4 = (num: number): string => {
    return [
      (num >>> 24) & 0xFF,
      (num >>> 16) & 0xFF,
      (num >>> 8) & 0xFF,
      num & 0xFF
    ].join('.')
  }

  const int32ToUint32 = (num: number): number => {
    return num >>> 0
  }

  const uint32ToInt32 = (num: number): number => {
    return num | 0
  }

  const swapEndian = (num: number): number => {
    return ((num & 0xFF) << 24) | (((num >>> 8) & 0xFF) << 16) | (((num >>> 16) & 0xFF) << 8) | ((num >>> 24) & 0xFF)
  }

  const expandIPv6 = (ip: string): string => {
    // 简化的IPv6展开
    if (ip.includes('::')) {
      const parts = ip.split('::')
      const left = parts[0] ? parts[0].split(':') : []
      const right = parts[1] ? parts[1].split(':') : []
      const missing = 8 - left.length - right.length
      const middle = Array(missing).fill('0000')
      return [...left, ...middle, ...right].map(part => part.padStart(4, '0')).join(':')
    }
    return ip.split(':').map(part => part.padStart(4, '0')).join(':')
  }

  const compressIPv6 = (ip: string): string => {
    // 简化的IPv6压缩
    const expanded = expandIPv6(ip)
    return expanded.replace(/:0000/g, ':0').replace(/:{2,}/g, '::')
  }

  const convertIP = () => {
    if (!input.trim()) {
      setErrors(['请输入要转换的值'])
      return
    }

    const lines = input.trim().split('\n').filter(line => line.trim())
    const results: ConversionResult[] = []
    const newErrors: string[] = []

    // 先收集所有有效的转换结果
    lines.forEach((line, index) => {
      const trimmedLine = line.trim()
      if (!trimmedLine) return

      try {
        const actualType = inputType === 'auto' ? detectInputType(trimmedLine) : inputType

        if (actualType === 'ipv6') {
          if (!isValidIPv6(trimmedLine)) {
            newErrors.push(`第${index + 1}行: 请输入有效的IPv6地址`)
            return
          }

          const expanded = expandIPv6(trimmedLine)
          const compressed = compressIPv6(trimmedLine)
          
          const hexParts = expanded.split(':')
          const binaryParts = hexParts.map(part => parseInt(part, 16).toString(2).padStart(16, '0'))
          const binary = binaryParts.join('')
          const hex = hexParts.join('')
          
          let decimal = '0'
          try {
            decimal = BigInt('0x' + hex).toString()
          } catch (e) {
            decimal = 'Too large for decimal representation'
          }

          results.push({
            type: 'ipv6',
            ipv6: trimmedLine,
            expanded,
            compressed,
            binary: binary.match(/.{16}/g)?.join(':') || binary,
            hexadecimal: '0x' + hex.toUpperCase(),
            decimal
          } as IPv6ConversionResult)
        } else {
          // IPv4 处理
          let uint32Value: number

          switch (actualType) {
            case 'ipv4':
              if (!isValidIPv4(trimmedLine)) {
                newErrors.push(`第${index + 1}行: 请输入有效的IPv4地址`)
                return
              }
              uint32Value = ipv4ToUint32(trimmedLine)
              break

            case 'decimal':
              const num = parseInt(trimmedLine)
              if (isNaN(num)) {
                newErrors.push(`第${index + 1}行: 请输入有效的数字`)
                return
              }
              
              if (signedMode === 'signed') {
                uint32Value = int32ToUint32(num)
              } else {
                if (num < 0 || num > 4294967295) {
                  newErrors.push(`第${index + 1}行: 无符号32位整数范围: 0-4294967295`)
                  return
                }
                uint32Value = num
              }
              break

            case 'binary':
              const binaryStr = trimmedLine.replace(/[^01]/g, '')
              if (binaryStr.length === 0 || binaryStr.length > 32) {
                newErrors.push(`第${index + 1}行: 请输入有效的32位二进制数`)
                return
              }
              uint32Value = parseInt(binaryStr, 2)
              break

            case 'hex':
              const hexStr = trimmedLine.replace(/^0x/i, '').replace(/[^0-9a-fA-F]/g, '')
              if (hexStr.length === 0 || hexStr.length > 8) {
                newErrors.push(`第${index + 1}行: 请输入有效的32位十六进制数`)
                return
              }
              uint32Value = parseInt(hexStr, 16)
              break

            default:
              newErrors.push(`第${index + 1}行: 未知的输入类型`)
              return
          }

          if (endianness === 'little' && actualType === 'decimal') {
            uint32Value = swapEndian(uint32Value)
          }

          const binaryStr = uint32Value.toString(2).padStart(32, '0')
          const binaryFormatted = binaryStr.match(/.{8}/g)?.join('.') || binaryStr

          const int32Value = uint32ToInt32(uint32Value)
          const bigEndianValue = uint32Value
          const littleEndianValue = swapEndian(uint32Value)

          results.push({
            type: 'ipv4',
            decimal: uint32Value.toString(),
            binary: binaryFormatted,
            hexadecimal: '0x' + uint32Value.toString(16).toUpperCase().padStart(8, '0'),
            octal: '0' + uint32Value.toString(8),
            ipv4: uint32ToIPv4(uint32Value),
            int32: int32Value.toString(),
            uint32: uint32Value.toString(),
            bigEndian: bigEndianValue.toString(),
            littleEndian: littleEndianValue.toString()
          } as IPv4ConversionResult)
        }
      } catch (error) {
        newErrors.push(`第${index + 1}行: 转换失败，请检查输入格式`)
      }
    })

    // 现在聚合结果
    if (results.length > 0) {
      const ipv4Results = results.filter(r => r.type === 'ipv4') as IPv4ConversionResult[]
      const ipv6Results = results.filter(r => r.type === 'ipv6') as IPv6ConversionResult[]
      
      if (ipv4Results.length > 0 && ipv6Results.length === 0) {
        // 纯 IPv4 结果
        const aggregated: AggregatedResults = {
          inputs: lines.filter((_, index) => !newErrors.some(err => err.includes(`第${index + 1}行`))),
          ipv4s: ipv4Results.map(r => r.ipv4),
          uint32s: ipv4Results.map(r => r.uint32),
          int32s: ipv4Results.map(r => r.int32),
          bigEndians: ipv4Results.map(r => r.bigEndian),
          littleEndians: ipv4Results.map(r => r.littleEndian),
          binaries: ipv4Results.map(r => r.binary),
          hexadecimals: ipv4Results.map(r => r.hexadecimal),
          octals: ipv4Results.map(r => r.octal),
          type: 'ipv4'
        }
        setAggregatedResults(aggregated)
      } else if (ipv6Results.length > 0 && ipv4Results.length === 0) {
        // 纯 IPv6 结果
        const aggregated: AggregatedResults = {
          inputs: lines.filter((_, index) => !newErrors.some(err => err.includes(`第${index + 1}行`))),
          ipv4s: ipv6Results.map(r => r.ipv6), // 使用 ipv4s 字段存储 IPv6 地址
          uint32s: [], // IPv6 不适用
          int32s: [], // IPv6 不适用
          bigEndians: [], // IPv6 不适用
          littleEndians: [], // IPv6 不适用
          binaries: ipv6Results.map(r => r.binary),
          hexadecimals: ipv6Results.map(r => r.hexadecimal),
          octals: [], // IPv6 不适用
          expandeds: ipv6Results.map(r => r.expanded),
          compresseds: ipv6Results.map(r => r.compressed),
          decimals: ipv6Results.map(r => r.decimal),
          type: 'ipv6'
        }
        setAggregatedResults(aggregated)
      } else {
        // 混合结果 - 这种情况下可能需要分别显示
        setAggregatedResults(null)
        newErrors.push('暂不支持混合IPv4和IPv6的批量转换，请分别处理')
      }
    } else {
      setAggregatedResults(null)
    }

    setErrors(newErrors)
  }

  const getPlaceholder = () => {
    switch (inputType) {
      case 'ipv4': return '例如: 192.168.1.1'
      case 'ipv6': return '例如: 2001:db8::1 或 fe80::1'
      case 'decimal': return '例如: 3232235777'
      case 'binary': return '例如: 11000000101010000000000100000001'
      case 'hex': return '例如: C0A80101 或 0xC0A80101'
      case 'auto': return '自动检测格式，例如: 192.168.1.1 或 2001:db8::1'
      default: return ''
    }
  }

  const clearAll = () => {
    setInput('')
    setAggregatedResults(null)
    setErrors([])
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <Link 
        href="/tools/ip" 
        className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回IP工具</span>
      </Link>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-2">
          <Server className="h-8 w-8 text-primary" />
          <span>IP 格式转换</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          支持IPv4/IPv6与十进制、二进制、十六进制等格式的相互转换，支持大小端序
        </p>
      </div>

      {/* 输入控制 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-6">
          {/* 输入类型选择 */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">输入格式</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {[
                { value: 'auto', label: '自动检测' },
                { value: 'ipv4', label: 'IPv4' },
                { value: 'ipv6', label: 'IPv6' },
                { value: 'decimal', label: '十进制' },
                { value: 'binary', label: '二进制' },
                { value: 'hex', label: '十六进制' }
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setInputType(type.value as any)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                    inputType === type.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background border-border hover:bg-accent'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* 数值类型选项 */}
          {inputType === 'decimal' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">数值类型</label>
                <div className="flex gap-2">
                  {[
                    { value: 'unsigned', label: 'Unsigned (0-4294967295)' },
                    { value: 'signed', label: 'Signed (-2147483648 to 2147483647)' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setSignedMode(type.value as any)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        signedMode === type.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-accent'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">字节序</label>
                <div className="flex gap-2">
                  {[
                    { value: 'big', label: '大端序 (Big Endian)' },
                    { value: 'little', label: '小端序 (Little Endian)' }
                  ].map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setEndianness(type.value as any)}
                      className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                        endianness === type.value
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-background border-border hover:bg-accent'
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 输入框 */}
          <div className="space-y-2">
            <textarea
              placeholder={getPlaceholder() + "\n\n支持批量转换，每行一个值"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full h-32 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-vertical"
            />
            <div className="flex space-x-2">
              <button
                onClick={convertIP}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>转换</span>
              </button>
              {(input || aggregatedResults) && (
                <button
                  onClick={clearAll}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-accent text-foreground"
                >
                  清除
                </button>
              )}
            </div>
          </div>
          
          {errors.length > 0 && (
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div key={index} className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
                  {error}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 转换结果 */}
      {aggregatedResults && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
            <Server className="h-5 w-5 text-primary" />
            <span>批量转换结果 ({aggregatedResults.inputs.length} 项)</span>
          </h2>
          
          {aggregatedResults.type === 'ipv4' ? (
            <div className="space-y-4">
              {/* IPv4地址 */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">IPv4 地址</div>
                  <button
                    onClick={() => copyToClipboard(aggregatedResults.ipv4s.join('\n'), 'ipv4s')}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                  >
                    {copiedField === 'ipv4s' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                </div>
                <div className="space-y-1">
                  {aggregatedResults.ipv4s.map((ip, index) => (
                    <div key={index} className="font-mono text-lg text-foreground">{ip}</div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 无符号32位整数 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">无符号32位整数</div>
                    <button
                      onClick={() => copyToClipboard(aggregatedResults.uint32s.join('\n'), 'uint32s')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {copiedField === 'uint32s' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aggregatedResults.uint32s.map((value, index) => (
                      <div key={index} className="font-mono text-lg text-foreground">{value}</div>
                    ))}
                  </div>
                </div>

                {/* 有符号32位整数 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">有符号32位整数</div>
                    <button
                      onClick={() => copyToClipboard(aggregatedResults.int32s.join('\n'), 'int32s')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {copiedField === 'int32s' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aggregatedResults.int32s.map((value, index) => (
                      <div key={index} className="font-mono text-lg text-foreground">{value}</div>
                    ))}
                  </div>
                </div>

                {/* 大端序 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">大端序</div>
                    <button
                      onClick={() => copyToClipboard(aggregatedResults.bigEndians.join('\n'), 'bigEndians')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {copiedField === 'bigEndians' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aggregatedResults.bigEndians.map((value, index) => (
                      <div key={index} className="font-mono text-lg text-foreground">{value}</div>
                    ))}
                  </div>
                </div>

                {/* 小端序 */}
                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">小端序</div>
                    <button
                      onClick={() => copyToClipboard(aggregatedResults.littleEndians.join('\n'), 'littleEndians')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      {copiedField === 'littleEndians' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-gray-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aggregatedResults.littleEndians.map((value, index) => (
                      <div key={index} className="font-mono text-lg text-foreground">{value}</div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 二进制 */}
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">二进制</div>
                    <button
                      onClick={() => copyToClipboard(aggregatedResults.binaries.map(b => b.replace(/\./g, '')).join('\n'), 'binaries')}
                      className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg transition-colors"
                    >
                      {copiedField === 'binaries' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-orange-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aggregatedResults.binaries.map((value, index) => (
                      <div key={index} className="font-mono text-sm md:text-base text-foreground break-all">{value}</div>
                    ))}
                  </div>
                </div>

                {/* 十六进制 */}
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">十六进制</div>
                    <button
                      onClick={() => copyToClipboard(aggregatedResults.hexadecimals.join('\n'), 'hexadecimals')}
                      className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
                    >
                      {copiedField === 'hexadecimals' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-purple-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aggregatedResults.hexadecimals.map((value, index) => (
                      <div key={index} className="font-mono text-lg text-foreground">{value}</div>
                    ))}
                  </div>
                </div>

                {/* 八进制 */}
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg lg:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">八进制</div>
                    <button
                      onClick={() => copyToClipboard(aggregatedResults.octals.join('\n'), 'octals')}
                      className="p-2 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                    >
                      {copiedField === 'octals' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-green-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aggregatedResults.octals.map((value, index) => (
                      <div key={index} className="font-mono text-lg text-foreground">{value}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* IPv6 结果显示 */
            <div className="space-y-4">
              {/* IPv6地址 */}
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm text-muted-foreground">IPv6 地址</div>
                  <button
                    onClick={() => copyToClipboard(aggregatedResults.ipv4s.join('\n'), 'ipv6s')}
                    className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition-colors"
                  >
                    {copiedField === 'ipv6s' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4 text-blue-600" />
                    )}
                  </button>
                </div>
                <div className="space-y-1">
                  {aggregatedResults.ipv4s.map((ip, index) => (
                    <div key={index} className="font-mono text-lg text-foreground">{ip}</div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* 展开格式 */}
                {aggregatedResults.expandeds && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground">展开格式</div>
                      <button
                        onClick={() => copyToClipboard(aggregatedResults.expandeds!.join('\n'), 'expandeds')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {copiedField === 'expandeds' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {aggregatedResults.expandeds.map((value, index) => (
                        <div key={index} className="font-mono text-sm break-all text-foreground">{value}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 压缩格式 */}
                {aggregatedResults.compresseds && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground">压缩格式</div>
                      <button
                        onClick={() => copyToClipboard(aggregatedResults.compresseds!.join('\n'), 'compresseds')}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {copiedField === 'compresseds' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {aggregatedResults.compresseds.map((value, index) => (
                        <div key={index} className="font-mono text-sm break-all text-foreground">{value}</div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 二进制 */}
                <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg lg:col-span-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">二进制</div>
                    <button
                      onClick={() => copyToClipboard(aggregatedResults.binaries.map(b => b.replace(/:/g, '')).join('\n'), 'ipv6binaries')}
                      className="p-2 hover:bg-orange-100 dark:hover:bg-orange-900/40 rounded-lg transition-colors"
                    >
                      {copiedField === 'ipv6binaries' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-orange-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aggregatedResults.binaries.map((value, index) => (
                      <div key={index} className="font-mono text-xs break-all text-foreground">{value}</div>
                    ))}
                  </div>
                </div>

                {/* 十六进制 */}
                <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-muted-foreground">十六进制</div>
                    <button
                      onClick={() => copyToClipboard(aggregatedResults.hexadecimals.join('\n'), 'ipv6hexadecimals')}
                      className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900/40 rounded-lg transition-colors"
                    >
                      {copiedField === 'ipv6hexadecimals' ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <Copy className="h-4 w-4 text-purple-600" />
                      )}
                    </button>
                  </div>
                  <div className="space-y-1">
                    {aggregatedResults.hexadecimals.map((value, index) => (
                      <div key={index} className="font-mono text-sm break-all text-foreground">{value}</div>
                    ))}
                  </div>
                </div>

                {/* 十进制 */}
                {aggregatedResults.decimals && (
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-muted-foreground">十进制</div>
                      <button
                        onClick={() => copyToClipboard(aggregatedResults.decimals!.join('\n'), 'ipv6decimals')}
                        className="p-2 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                      >
                        {copiedField === 'ipv6decimals' ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4 text-green-600" />
                        )}
                      </button>
                    </div>
                    <div className="space-y-1">
                      {aggregatedResults.decimals.map((value, index) => (
                        <div key={index} className="font-mono text-xs break-all text-foreground">{value}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
