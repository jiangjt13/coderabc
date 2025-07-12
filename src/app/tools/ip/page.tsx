"use client"

import Link from 'next/link'
import { Search, Globe, Server, Network } from 'lucide-react'

export default function IPTools() {
  const ipTools = [
    {
      title: 'IP 地理位置查询',
      description: '查询IP地址的详细信息，包括地理位置、ISP、ASN等',
      icon: Search,
      href: '/tools/ip/geolocation',
      color: 'bg-blue-500',
      features: ['地理位置', 'ISP信息', 'ASN信息', '内嵌地图']
    },
    {
      title: 'IP 格式转换',
      description: '支持IPv4/IPv6与各种数值格式的相互转换',
      icon: Server,
      href: '/tools/ip/converter',
      color: 'bg-red-500',
      features: ['IPv4/IPv6', '大小端序', 'int32/uint32', '多进制转换']
    },
    {
      title: 'IP 段查询',
      description: '查询IP地址段的详细信息和范围',
      icon: Network,
      href: '/tools/ip/range',
      color: 'bg-purple-500',
      features: ['CIDR计算', 'IP范围', '子网掩码', '网络地址']
    }
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center space-x-2">
          <Globe className="h-8 w-8 text-primary" />
          <span>IP 工具集合</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          全面的IP地址工具集合，包括查询、分析、转换和网络诊断等功能
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
                  <div className="text-xs font-medium text-muted-foreground">主要功能:</div>
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
        <h2 className="text-xl font-semibold text-card-foreground mb-4">工具说明</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p><strong>IP 地理位置查询：</strong>查询任意IP地址的地理位置、运营商、ASN等详细信息，支持一键获取本机IP。</p>
          <p><strong>IP 格式转换：</strong>支持IPv4/IPv6与十进制、二进制、十六进制的相互转换，支持大小端序和有无符号整数。</p>
          <p><strong>IP 段查询：</strong>计算CIDR网段的详细信息，包括网络地址、广播地址、可用IP范围等。</p>
        </div>
      </div>
    </div>
  )
}
