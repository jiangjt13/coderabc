"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { MapPin, ArrowLeft, Search, Globe, Navigation, Clock, Wifi, User } from 'lucide-react'

interface GeolocationInfo {
  ip: string
  country: string
  region: string
  city: string
  latitude: number
  longitude: number
  timezone: string
  isp: string
  org: string
  as: string
  asname: string
}

export default function IPGeolocation() {
  const [ip, setIp] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<GeolocationInfo | null>(null)
  const [error, setError] = useState('')
  const [gettingMyIP, setGettingMyIP] = useState(false)

  const getMyIP = async () => {
    setGettingMyIP(true)
    try {
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      setIp(data.ip)
      // 自动查询
      handleSearch(data.ip)
    } catch (error) {
      setError('获取IP地址失败，请手动输入')
    } finally {
      setGettingMyIP(false)
    }
  }

  const handleSearch = async (targetIP?: string) => {
    const searchIP = targetIP || ip
    if (!searchIP.trim()) {
      setError('请输入有效的IP地址')
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch(`http://ip-api.com/json/${searchIP}?fields=status,message,country,regionName,city,lat,lon,timezone,isp,org,query,as`)
      const data = await response.json()
      
      if (data.status === 'success') {
        setResult({
          ip: data.query,
          country: data.country,
          region: data.regionName,
          city: data.city,
          latitude: data.lat,
          longitude: data.lon,
          timezone: data.timezone,
          isp: data.isp,
          org: data.org,
          as: data.as ? data.as.split(' ')[0] : '',
          asname: data.as ? data.as.substring(data.as.indexOf(' ') + 1) : ''
        })
      } else {
        setError(data.message || '查询失败，请检查IP地址格式')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
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
          <MapPin className="h-8 w-8 text-primary" />
          <span>IP 地理位置查询</span>
        </h1>
        <p className="text-lg text-muted-foreground">
          查询IP地址的地理位置信息，包括国家、城市、ISP、ASN等详细信息
        </p>
      </div>

      {/* 搜索框 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="space-y-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="请输入IP地址 (例如: 8.8.8.8)"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={() => handleSearch()}
              disabled={loading}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? '查询中...' : '查询'}</span>
            </button>
          </div>
          
          {/* 获取我的IP按钮 */}
          <button
            onClick={getMyIP}
            disabled={gettingMyIP}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <User className="h-4 w-4" />
            <span>{gettingMyIP ? '获取中...' : '获取我的IP地址'}</span>
          </button>
          
          {error && (
            <div className="text-red-500 text-sm bg-red-50 dark:bg-red-950/20 p-3 rounded-lg">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* 查询结果 */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左侧：信息面板 */}
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2">
              <Globe className="h-5 w-5 text-primary" />
              <span>地理位置信息</span>
            </h2>
            
            <div className="space-y-4">
              {/* 基本信息 */}
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-foreground">基本信息</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">IP地址:</span>
                    <span className="font-mono text-foreground">{result.ip}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">国家/地区:</span>
                    <span className="text-foreground">{result.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">省/州:</span>
                    <span className="text-foreground">{result.region}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">城市:</span>
                    <span className="text-foreground">{result.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">时区:</span>
                    <span className="text-foreground">{result.timezone}</span>
                  </div>
                </div>
              </div>

              {/* 网络信息 */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-lg font-medium text-foreground">网络信息</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISP:</span>
                    <span className="text-foreground">{result.isp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">组织:</span>
                    <span className="text-foreground">{result.org}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ASN:</span>
                    <span className="font-mono text-foreground">{result.as}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ASN名称:</span>
                    <span className="text-foreground">{result.asname}</span>
                  </div>
                </div>
              </div>

              {/* 坐标信息 */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h3 className="text-lg font-medium text-foreground">坐标信息</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">纬度:</span>
                    <span className="font-mono text-foreground">{result.latitude}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">经度:</span>
                    <span className="font-mono text-foreground">{result.longitude}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：内嵌地图 */}
          <div className="bg-card border border-border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-foreground flex items-center space-x-2 mb-4">
              <Navigation className="h-5 w-5 text-primary" />
              <span>地图位置</span>
            </h2>
            
            <div className="w-full h-96 rounded-lg overflow-hidden bg-muted">
              <iframe
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${result.latitude},${result.longitude}&zoom=10`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="IP地理位置地图"
                className="w-full h-full"
                onError={(e) => {
                  // 如果Google Maps嵌入失败，显示OpenStreetMap
                  const iframe = e.target as HTMLIFrameElement
                  iframe.src = `https://www.openstreetmap.org/export/embed.html?bbox=${result.longitude-0.05},${result.latitude-0.05},${result.longitude+0.05},${result.latitude+0.05}&layer=mapnik&marker=${result.latitude},${result.longitude}`
                }}
              />
            </div>
            
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => window.open(`https://www.google.com/maps?q=${result.latitude},${result.longitude}`, '_blank')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Navigation className="h-4 w-4" />
                <span>在新窗口打开地图</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
