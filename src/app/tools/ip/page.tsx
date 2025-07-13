"use client"

import Link from 'next/link'
import { Search, Globe, Server, Network } from 'lucide-react'
import { useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

export default function IPTools() {
  const { language, t } = useLanguage()
  
  // 动态更新页面标题
  useEffect(() => {
    document.title = `CoderABC - ${t('ip.tools.page.title')}`
    return () => {
      document.title = 'CoderABC - 开发者工具与技术笔记'
    }
  }, [language, t])
  
  const ipTools = [
    {
      title: t('ip.geolocation.title'),
      description: t('ip.geolocation.description'),
      icon: Search,
      href: '/tools/ip/geolocation',
      color: 'bg-blue-500',
      features: [t('ip.geolocation.features.location'), t('ip.geolocation.features.isp'), t('ip.geolocation.features.asn'), t('ip.geolocation.features.map')]
    },
    {
      title: t('ip.converter.title'),
      description: t('ip.converter.description'),
      icon: Server,
      href: '/tools/ip/converter',
      color: 'bg-red-500',
      features: [t('ip.converter.features.ipv4'), t('ip.converter.features.endian'), t('ip.converter.features.int32'), t('ip.converter.features.base')]
    },
    {
      title: t('ip.range.title'),
      description: t('ip.range.description'),
      icon: Network,
      href: '/tools/ip/range',
      color: 'bg-purple-500',
      features: [t('ip.range.features.cidr'), t('ip.range.features.range'), t('ip.range.features.mask'), t('ip.range.features.network')]
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-2">
          <Globe className="h-8 w-8 text-primary" />
          <span>{t('ip.tools.title')}</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          {t('ip.tools.description')}
        </p>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ipTools.map((tool, index) => {
          const Icon = tool.icon
          return (
            <Link
              key={index}
              href={tool.href}
              className="group block bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="space-y-4">
                {/* Icon and Title */}
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${tool.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {tool.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground">
                  {tool.description}
                </p>

                {/* Features */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground">{language === 'zh' ? '主要功能:' : 'Key Features:'}</div>
                  <div className="flex flex-wrap gap-1">
                    {tool.features.map((feature, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Arrow indicator */}
                <div className="flex justify-end">
                  <div className="text-primary group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* 使用说明 */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h2 className="text-xl font-semibold text-card-foreground mb-4">{language === 'zh' ? '工具说明' : 'Tool Description'}</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><strong>{t('ip.geolocation.title')}：</strong>{language === 'zh' ? '查询任意IP地址的地理位置、运营商、ASN等详细信息，支持一键获取本机IP。' : 'Query the geographic location, ISP, ASN and other detailed information of any IP address, supporting one-click local IP detection.'}</p>
          <p><strong>{t('ip.converter.title')}：</strong>{language === 'zh' ? '支持IPv4/IPv6与十进制、二进制、十六进制的相互转换，支持大小端序和有无符号整数。' : 'Support mutual conversion between IPv4/IPv6 and decimal, binary, hexadecimal formats, supporting endianness and signed/unsigned integers.'}</p>
          <p><strong>{t('ip.range.title')}：</strong>{language === 'zh' ? '计算CIDR网段的详细信息，包括网络地址、广播地址、可用IP范围等。' : 'Calculate detailed information of CIDR network segments, including network address, broadcast address, available IP range, etc.'}</p>
        </div>
      </div>
    </div>
  )
}
