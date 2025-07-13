'use client'

import { FileText, Terminal, Copy, ChevronDown, ChevronRight, Menu, X, Globe } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'

export default function CurlTour() {
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
    document.title = `CoderABC - ${t('curl.page.title')}`
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
      title: t('curl.getting.started'),
      children: [
        { id: 'installation', title: t('curl.installation') },
        { id: 'basic-intro', title: t('curl.basic.intro') }
      ]
    },
    {
      id: 'basic-usage',
      title: t('curl.basic.usage'),
      children: [
        { id: 'basic-requests', title: t('curl.get.requests') },
        { id: 'http-methods', title: 'HTTP Methods' },
        { id: 'headers', title: t('curl.headers') },
        { id: 'data-sending', title: t('curl.data.sending') }
      ]
    },
    {
      id: 'advanced',
      title: t('curl.advanced'),
      children: [
        { id: 'file-operations', title: t('curl.file.operations') },
        { id: 'authentication', title: t('curl.authentication') },
        { id: 'cookies', title: 'Cookies' },
        { id: 'ssl-tls', title: 'SSL/TLS' }
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
                curl是一个功能强大的命令行工具，用于传输数据，支持多种协议。大多数Linux发行版和macOS都预装了curl。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">Ubuntu/Debian</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  sudo apt-get update && sudo apt-get install curl
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">CentOS/RHEL/Fedora</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  sudo yum install curl  # 或 sudo dnf install curl
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">macOS</h3>
                <div className="bg-muted p-3 rounded font-mono text-sm">
                  # macOS 通常预装 curl<br/>
                  # 如需更新版本可使用 Homebrew<br/>
                  brew install curl
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-semibold text-card-foreground mb-2">Windows</h3>
                <div className="space-y-2">
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# Windows 10+ 内置 curl"}
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm">
                    {"# 或使用 Chocolatey 安装"}<br/>
                    choco install curl
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
              <h2 className="text-2xl font-bold text-foreground mb-4">基本介绍</h2>
              <p className="text-muted-foreground mb-6">
                curl (Client URL) 是一个命令行工具，用于在客户端和服务器之间传输数据。支持HTTP、HTTPS、FTP等多种协议。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">主要特性</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• <strong>多协议支持</strong>：HTTP、HTTPS、FTP、SFTP、SCP等</li>
                <li>• <strong>灵活的数据传输</strong>：支持上传和下载文件</li>
                <li>• <strong>身份验证</strong>：支持多种认证方式</li>
                <li>• <strong>代理支持</strong>：可通过代理服务器访问</li>
                <li>• <strong>SSL/TLS支持</strong>：安全数据传输</li>
                <li>• <strong>Cookie处理</strong>：自动处理和存储Cookie</li>
              </ul>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-card-foreground">基本语法</h3>
              <div className="bg-muted p-4 rounded font-mono text-sm">
                curl [选项] [URL...]
              </div>
              <p className="text-sm text-muted-foreground">
                URL是要访问的目标地址，选项用于指定请求的各种参数。
              </p>
            </div>
          </div>
        )

      case 'basic-requests':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">基本请求</h2>
              <p className="text-muted-foreground mb-6">
                学习如何使用curl发送最基本的HTTP请求。
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">简单GET请求</h3>
                <p className="text-muted-foreground">获取网页内容或API数据</p>
                
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">基本用法:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm relative">
                      curl https://api.github.com/users/octocat
                      <button
                        onClick={() => copyToClipboard('curl https://api.github.com/users/octocat')}
                        className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">显示响应头:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm relative">
                      curl -i https://api.github.com/users/octocat
                      <button
                        onClick={() => copyToClipboard('curl -i https://api.github.com/users/octocat')}
                        className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">只显示响应头:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm relative">
                      curl -I https://api.github.com/users/octocat
                      <button
                        onClick={() => copyToClipboard('curl -I https://api.github.com/users/octocat')}
                        className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                      >
                        <Copy className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">查看详细信息</h3>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">显示详细过程:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      curl -v https://httpbin.org/get
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-2">静默模式（不显示进度）:</div>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      curl -s https://httpbin.org/get
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'http-methods':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">HTTP方法</h2>
              <p className="text-muted-foreground mb-6">
                curl支持所有常用的HTTP方法，用于不同类型的API操作。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">常用HTTP方法</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">GET - 获取数据</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      curl -X GET https://jsonplaceholder.typicode.com/posts/1
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">POST - 创建数据</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"curl -X POST -H \"Content-Type: application/json\" \\\n  -d '{\"title\":\"新文章\",\"body\":\"文章内容\"}' \\\n  https://jsonplaceholder.typicode.com/posts"}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">PUT - 更新数据</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"curl -X PUT -H \"Content-Type: application/json\" \\\n  -d '{\"id\":1,\"title\":\"更新文章\"}' \\\n  https://jsonplaceholder.typicode.com/posts/1"}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">DELETE - 删除数据</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      curl -X DELETE https://jsonplaceholder.typicode.com/posts/1
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">PATCH - 部分更新</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"curl -X PATCH -H \"Content-Type: application/json\" \\\n  -d '{\"title\":\"修改标题\"}' \\\n  https://jsonplaceholder.typicode.com/posts/1"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'headers':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">请求头设置</h2>
              <p className="text-muted-foreground mb-6">
                学习如何设置和管理HTTP请求头。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">常用请求头</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Content-Type</h4>
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        {"# JSON 数据"}<br/>
                        {'curl -H "Content-Type: application/json"'}
                      </div>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        {"# 表单数据"}<br/>
                        {'curl -H "Content-Type: application/x-www-form-urlencoded"'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Authorization</h4>
                    <div className="space-y-2">
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        {"# Bearer Token"}<br/>
                        {'curl -H "Authorization: Bearer your_token_here"'}
                      </div>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        {"# API Key"}<br/>
                        {'curl -H "X-API-Key: your_api_key_here"'}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">User-Agent</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {'curl -H "User-Agent: MyApp/1.0"'}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">多个请求头</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"curl -H \"Content-Type: application/json\" \\\n  -H \"Authorization: Bearer token\" \\\n  -H \"User-Agent: MyApp/1.0\""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'data-sending':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">发送数据</h2>
              <p className="text-muted-foreground mb-6">
                学习如何使用curl发送各种类型的数据。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">数据发送方式</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">JSON 数据</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"curl -X POST \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"name\":\"张三\",\"age\":30}' \\\n  https://httpbin.org/post"}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">表单数据</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"curl -X POST \\\n  -d \"name=张三&age=30\" \\\n  https://httpbin.org/post"}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">从文件读取数据</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"curl -X POST \\\n  -H \"Content-Type: application/json\" \\\n  -d @data.json \\\n  https://httpbin.org/post"}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">文件上传</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"curl -X POST \\\n  -F \"file=@/path/to/file.txt\" \\\n  -F \"description=文件描述\" \\\n  https://httpbin.org/post"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'file-operations':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">文件操作</h2>
              <p className="text-muted-foreground mb-6">
                使用curl进行文件下载、上传和管理。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">文件下载</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">下载到文件</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"# 指定文件名"}<br/>
                      curl -o filename.zip https://example.com/file.zip
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">保持远程文件名</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      curl -O https://example.com/file.zip
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">断点续传</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      curl -C - -O https://example.com/largefile.zip
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground mb-2">限制下载速度</h4>
                    <div className="bg-muted p-3 rounded font-mono text-sm">
                      {"# 限制为 100KB/s"}<br/>
                      curl --limit-rate 100k -O https://example.com/file.zip
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'authentication':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">身份验证</h2>
              <p className="text-muted-foreground mb-6">
                curl支持多种身份验证方式，包括基本认证、Bearer Token等。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">基本认证 (Basic Auth)</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 用户名密码认证"}<br/>
                    curl -u username:password https://api.example.com/data
                    <button
                      onClick={() => copyToClipboard('curl -u username:password https://api.example.com/data')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 交互式输入密码"}<br/>
                    curl -u username https://api.example.com/data
                    <button
                      onClick={() => copyToClipboard('curl -u username https://api.example.com/data')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">Bearer Token认证</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    curl -H &quot;Authorization: Bearer your_token_here&quot; https://api.example.com/data
                    <button
                      onClick={() => copyToClipboard('curl -H "Authorization: Bearer your_token_here" https://api.example.com/data')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">API Key认证</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 通过请求头传递"}<br/>
                    curl -H &quot;X-API-Key: your_api_key&quot; https://api.example.com/data
                    <button
                      onClick={() => copyToClipboard('curl -H "X-API-Key: your_api_key" https://api.example.com/data')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 通过查询参数传递"}<br/>
                    curl &quot;https://api.example.com/data?api_key=your_api_key&quot;
                    <button
                      onClick={() => copyToClipboard('curl "https://api.example.com/data?api_key=your_api_key"')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'cookies':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Cookie处理</h2>
              <p className="text-muted-foreground mb-6">
                curl可以自动处理Cookie，包括保存、发送和管理Cookie。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">保存和使用Cookie</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 保存Cookie到文件"}<br/>
                    curl -c cookies.txt https://example.com/login
                    <button
                      onClick={() => copyToClipboard('curl -c cookies.txt https://example.com/login')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 从文件读取Cookie"}<br/>
                    curl -b cookies.txt https://example.com/dashboard
                    <button
                      onClick={() => copyToClipboard('curl -b cookies.txt https://example.com/dashboard')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 同时保存和读取Cookie"}<br/>
                    curl -b cookies.txt -c cookies.txt https://example.com/action
                    <button
                      onClick={() => copyToClipboard('curl -b cookies.txt -c cookies.txt https://example.com/action')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">手动设置Cookie</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 设置单个Cookie"}<br/>
                    curl -b &quot;sessionid=abc123&quot; https://example.com/api
                    <button
                      onClick={() => copyToClipboard('curl -b "sessionid=abc123" https://example.com/api')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 设置多个Cookie"}<br/>
                    curl -b &quot;sessionid=abc123; userid=456&quot; https://example.com/api
                    <button
                      onClick={() => copyToClipboard('curl -b "sessionid=abc123; userid=456" https://example.com/api')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'ssl-tls':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">SSL/TLS设置</h2>
              <p className="text-muted-foreground mb-6">
                配置curl的SSL/TLS选项，处理证书验证和安全连接。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">证书验证</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 跳过SSL证书验证 (不安全，仅用于测试)"}<br/>
                    curl -k https://self-signed.badssl.com/
                    <button
                      onClick={() => copyToClipboard('curl -k https://self-signed.badssl.com/')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 指定CA证书文件"}<br/>
                    curl --cacert /path/to/cert.pem https://example.com
                    <button
                      onClick={() => copyToClipboard('curl --cacert /path/to/cert.pem https://example.com')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 客户端证书认证"}<br/>
                    curl --cert client.pem --key client.key https://example.com
                    <button
                      onClick={() => copyToClipboard('curl --cert client.pem --key client.key https://example.com')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">TLS版本设置</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 指定最低TLS版本"}<br/>
                    curl --tlsv1.2 https://example.com
                    <button
                      onClick={() => copyToClipboard('curl --tlsv1.2 https://example.com')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 指定最高TLS版本"}<br/>
                    curl --tls-max 1.2 https://example.com
                    <button
                      onClick={() => copyToClipboard('curl --tls-max 1.2 https://example.com')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-semibold text-card-foreground mb-4">SSL调试</h3>
                <div className="space-y-3">
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 显示详细SSL信息"}<br/>
                    curl -v https://example.com
                    <button
                      onClick={() => copyToClipboard('curl -v https://example.com')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="bg-muted p-3 rounded font-mono text-sm relative">
                    {"# 显示证书信息"}<br/>
                    curl --cert-status https://example.com
                    <button
                      onClick={() => copyToClipboard('curl --cert-status https://example.com')}
                      className="absolute top-2 right-2 p-1 hover:bg-background rounded"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
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
                curl的常用命令行选项和参数详解。
              </p>
            </div>
            
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-card-foreground mb-4">基本选项</h3>
              <div className="space-y-3">
                {[
                  { option: '-X, --request', desc: '指定HTTP请求方法' },
                  { option: '-H, --header', desc: '添加HTTP请求头' },
                  { option: '-d, --data', desc: '发送POST数据' },
                  { option: '-o, --output', desc: '将输出写入文件' },
                  { option: '-O, --remote-name', desc: '使用远程文件名保存' },
                  { option: '-i, --include', desc: '在输出中包含响应头' },
                  { option: '-I, --head', desc: '仅获取文档头信息' },
                  { option: '-v, --verbose', desc: '详细模式，显示通信过程' },
                  { option: '-s, --silent', desc: '静默模式，不显示进度' },
                  { option: '-f, --fail', desc: 'HTTP错误时静默失败' },
                  { option: '-L, --location', desc: '跟随重定向' },
                  { option: '-k, --insecure', desc: '允许不安全的SSL连接' },
                  { option: '-u, --user', desc: '设置用户名和密码' },
                  { option: '-b, --cookie', desc: '发送cookie' },
                  { option: '-c, --cookie-jar', desc: '保存cookie到文件' }
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
                使用curl的一些最佳实践和技巧。
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">实用技巧</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>使用配置文件</strong>：将常用选项保存到 ~/.curlrc 文件
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>测试API</strong>：使用 httpbin.org 等服务测试请求
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>保存输出</strong>：使用 -w 选项输出格式化信息
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>环境变量</strong>：使用环境变量存储敏感信息如API密钥
                    </div>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-primary mt-1">•</span>
                    <div>
                      <strong>脚本化</strong>：在shell脚本中使用curl进行自动化操作
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                <h3 className="text-lg font-semibold text-card-foreground">安全考虑</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 在生产环境中验证SSL证书（避免使用-k选项）</li>
                  <li>• 使用环境变量或配置文件存储敏感数据</li>
                  <li>• 定期更新curl版本以获得安全修复</li>
                  <li>• 小心处理重定向，使用-L选项时要谨慎</li>
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
                解决使用curl时常见的问题和错误。
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                {
                  question: "SSL证书验证失败怎么办？",
                  answer: "可以使用 -k 选项跳过验证（仅测试），或者使用 --cacert 指定CA证书文件。"
                },
                {
                  question: "如何调试curl请求？",
                  answer: "使用 -v 选项查看详细信息，或使用 --trace-ascii file 将详细信息保存到文件。"
                },
                {
                  question: "为什么请求被重定向？",
                  answer: "服务器返回3xx状态码，使用 -L 选项自动跟随重定向，或检查 Location 响应头。"
                },
                {
                  question: "上传大文件时如何显示进度？",
                  answer: "curl默认显示进度条，可以使用 --progress-bar 显示简单进度条。"
                },
                {
                  question: "如何处理特殊字符？",
                  answer: "在shell中使用单引号包围参数，或使用 --data-urlencode 自动编码。"
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
              <Globe className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-bold text-card-foreground">curl Tour</h1>
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
              <h1 className="text-xl font-bold text-foreground">curl Tour</h1>
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
