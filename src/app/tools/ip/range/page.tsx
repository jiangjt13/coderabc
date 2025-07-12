"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Network, ArrowLeft, Search, Calculator, Info } from 'lucide-react'

interface IPRangeInfo {
  network: string
  broadcast: string
  firstHost: string
  lastHost: string
  totalHosts: number
  subnetMask: string
  wildcardMask: string
  cidr: string
  binarySubnet: string
}

export default function IPRange() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<IPRangeInfo | null>(null)
  const [error, setError] = useState('')

  const calculateIPRange = () => {
    if (!input.trim()) {
      setError('请输入IP地址和CIDR (例如: 192.168.1.0/24)')
      return
    }

    try {
      const [ip, cidrStr] = input.split('/')
      const cidr = parseInt(cidrStr)

      if (!ip || isNaN(cidr) || cidr < 0 || cidr > 32) {
        setError('请输入有效的CIDR格式 (例如: 192.168.1.0/24)')
        return
      }

      // 验证IP格式
      const ipParts = ip.split('.').map(part => parseInt(part))
      if (ipParts.length !== 4 || ipParts.some(part => isNaN(part) || part < 0 || part > 255)) {
        setError('请输入有效的IP地址')
        return
      }

      // 计算子网掩码
      const subnetMask = (0xFFFFFFFF << (32 - cidr)) >>> 0
      const subnetMaskStr = [
        (subnetMask >>> 24) & 0xFF,
        (subnetMask >>> 16) & 0xFF,
        (subnetMask >>> 8) & 0xFF,
        subnetMask & 0xFF
      ].join('.')

      // 计算通配符掩码
      const wildcardMask = (~subnetMask) >>> 0
      const wildcardMaskStr = [
        (wildcardMask >>> 24) & 0xFF,
        (wildcardMask >>> 16) & 0xFF,
        (wildcardMask >>> 8) & 0xFF,
        wildcardMask & 0xFF
      ].join('.')

      // 将IP转换为数字
      const ipNum = (ipParts[0] << 24) | (ipParts[1] << 16) | (ipParts[2] << 8) | ipParts[3]
      
      // 计算网络地址
      const networkNum = (ipNum & subnetMask) >>> 0
      const networkStr = [
        (networkNum >>> 24) & 0xFF,
        (networkNum >>> 16) & 0xFF,
        (networkNum >>> 8) & 0xFF,
        networkNum & 0xFF
      ].join('.')

      // 计算广播地址
      const broadcastNum = (networkNum | wildcardMask) >>> 0
      const broadcastStr = [
        (broadcastNum >>> 24) & 0xFF,
        (broadcastNum >>> 16) & 0xFF,
        (broadcastNum >>> 8) & 0xFF,
        broadcastNum & 0xFF
      ].join('.')

      // 计算第一个和最后一个主机地址
      const firstHostNum = networkNum + 1
      const lastHostNum = broadcastNum - 1
      
      const firstHostStr = [
        (firstHostNum >>> 24) & 0xFF,
        (firstHostNum >>> 16) & 0xFF,
        (firstHostNum >>> 8) & 0xFF,
        firstHostNum & 0xFF
      ].join('.')

      const lastHostStr = [
        (lastHostNum >>> 24) & 0xFF,
        (lastHostNum >>> 16) & 0xFF,
        (lastHostNum >>> 8) & 0xFF,
        lastHostNum & 0xFF
      ].join('.')

      // 计算主机数量
      const totalHosts = Math.pow(2, 32 - cidr) - 2

      // 子网掩码的二进制表示
      const binarySubnet = subnetMask.toString(2).padStart(32, '0').match(/.{8}/g)?.join('.') || ''

      setResult({
        network: networkStr,
        broadcast: broadcastStr,
        firstHost: firstHostStr,
        lastHost: lastHostStr,
        totalHosts,
        subnetMask: subnetMaskStr,
        wildcardMask: wildcardMaskStr,
        cidr: `/${cidr}`,
        binarySubnet
      })
      setError('')
    } catch (error) {
      setError('计算错误，请检查输入格式')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link 
        href="/tools/ip" 
        className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回IP工具</span>
      </Link>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-2">
          <Network className="h-8 w-8 text-primary" />
          <span>IP 分段查询</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          计算IP网段的范围、子网掩码、主机数量等网络信息
        </p>
      </div>

      {/* 输入框 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="请输入IP地址和CIDR (例如: 192.168.1.0/24)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && calculateIPRange()}
            />
            <button
              onClick={calculateIPRange}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center space-x-2"
            >
              <Calculator className="h-4 w-4" />
              <span>计算</span>
            </button>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-4 w-4 mt-0.5 text-blue-500" />
              <div>
                <p><strong>使用说明:</strong></p>
                <p>• 输入格式: IP地址/子网位数 (如 192.168.1.0/24)</p>
                <p>• CIDR值范围: 0-32 (如 /24 表示前24位为网络位)</p>
                <p>• 示例: 10.0.0.0/8, 172.16.0.0/16, 192.168.0.0/24</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 计算结果 */}
      {result && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-6">
          <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
            <Network className="h-5 w-5 text-primary" />
            <span>网络信息</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 网络地址信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">网络地址</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">网络地址:</span>
                  <span className="font-mono text-foreground">{result.network}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">广播地址:</span>
                  <span className="font-mono text-foreground">{result.broadcast}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">第一个主机:</span>
                  <span className="font-mono text-foreground">{result.firstHost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">最后一个主机:</span>
                  <span className="font-mono text-foreground">{result.lastHost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">主机数量:</span>
                  <span className="font-mono text-foreground">{result.totalHosts.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 子网掩码信息 */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">掩码信息</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CIDR:</span>
                  <span className="font-mono text-foreground">{result.cidr}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">子网掩码:</span>
                  <span className="font-mono text-foreground">{result.subnetMask}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">通配符掩码:</span>
                  <span className="font-mono text-foreground">{result.wildcardMask}</span>
                </div>
                <div className="flex flex-col space-y-1">
                  <span className="text-muted-foreground">二进制掩码:</span>
                  <span className="font-mono text-xs text-foreground break-all">{result.binarySubnet}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
