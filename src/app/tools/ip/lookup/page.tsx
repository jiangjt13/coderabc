"use client"

import { useState } from 'react'
import { Search, MapPin, Globe, Server, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function IPLookup() {
  const [ip, setIp] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const queryIP = async () => {
    if (!ip.trim()) return
    
    setLoading(true)
    try {
      // 使用免费的IP查询API
      const response = await fetch(`https://ipapi.co/${ip}/json/`)
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('IP查询失败:', error)
      setResult({ error: '查询失败，请检查IP地址格式' })
    } finally {
      setLoading(false)
    }
  }

  const getCurrentIP = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      setIp(data.ip)
      setResult(data)
    } catch (error) {
      console.error('获取当前IP失败:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Back Button */}
      <Link 
        href="/tools/ip" 
        className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>返回IP工具</span>
      </Link>

      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-2">
          <Search className="h-8 w-8 text-primary" />
          <span>IP 地址查询</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          查询 IP 地址信息，包括地理位置、ISP、时区等详细信息
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-6">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-card-foreground">
            IP 地址
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              placeholder="请输入IP地址，如: 8.8.8.8"
              className="flex-1 px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              onKeyPress={(e) => e.key === 'Enter' && queryIP()}
            />
            <button
              onClick={queryIP}
              disabled={loading || !ip.trim()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? '查询中...' : '查询'}</span>
            </button>
          </div>
          <button
            onClick={getCurrentIP}
            disabled={loading}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <MapPin className="h-4 w-4" />
            <span>{loading ? '获取中...' : '获取我的IP'}</span>
          </button>
        </div>

        {result && (
          <div className="border-t border-border pt-6">
            {result.error ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4">
                <p className="text-destructive">{result.error}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground flex items-center space-x-2">
                  <Server className="h-5 w-5 text-primary" />
                  <span>查询结果</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">IP 地址</div>
                    <div className="text-foreground font-mono">{result.ip}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">版本</div>
                    <div className="text-foreground">{result.version || 'IPv4'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">城市</div>
                    <div className="text-foreground">{result.city || '未知'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">地区</div>
                    <div className="text-foreground">{result.region || '未知'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">国家</div>
                    <div className="text-foreground">{result.country_name || '未知'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">国家代码</div>
                    <div className="text-foreground">{result.country_code || '未知'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">ISP</div>
                    <div className="text-foreground">{result.org || '未知'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">时区</div>
                    <div className="text-foreground">{result.timezone || '未知'}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">经纬度</div>
                    <div className="text-foreground">
                      {result.latitude && result.longitude 
                        ? `${result.latitude}, ${result.longitude}` 
                        : '未知'
                      }
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-muted-foreground">邮编</div>
                    <div className="text-foreground">{result.postal || '未知'}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold text-card-foreground">使用说明</h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• 输入任意有效的IPv4或IPv6地址进行查询</li>
          <li>• 点击&quot;获取我的IP&quot;可以查询当前设备的公网IP信息</li>
          <li>• 查询结果包括地理位置、ISP、时区等详细信息</li>
          <li>• 支持域名解析，可以输入域名进行查询</li>
        </ul>
      </div>
    </div>
  )
}
