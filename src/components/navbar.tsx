"use client"

import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { ChevronDown, Menu, X, Wrench, FileText, Info } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/contexts/language-context"

export function Navbar() {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const toolsRef = useRef<HTMLDivElement>(null)
  const notesRef = useRef<HTMLDivElement>(null)

  // 关闭所有下拉菜单的函数
  const closeAllDropdowns = () => {
    setToolsOpen(false)
    setNotesOpen(false)
  }

  // 切换Tools菜单的函数
  const toggleTools = () => {
    if (toolsOpen) {
      // 如果Tools已经打开，直接关闭
      setToolsOpen(false)
    } else {
      // 如果Tools未打开，先确保Notes关闭，然后打开Tools
      setNotesOpen(false)
      setToolsOpen(true)
    }
  }

  // 切换Notes菜单的函数
  const toggleNotes = () => {
    if (notesOpen) {
      // 如果Notes已经打开，直接关闭
      setNotesOpen(false)
    } else {
      // 如果Notes未打开，先确保Tools关闭，然后打开Notes
      setToolsOpen(false)
      setNotesOpen(true)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      const clickedInTools = toolsRef.current?.contains(target)
      const clickedInNotes = notesRef.current?.contains(target)
      
      // 如果点击的不在任何下拉菜单内，关闭所有菜单
      if (!clickedInTools && !clickedInNotes) {
        closeAllDropdowns()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // 确保同时只能有一个菜单打开
  useEffect(() => {
    if (toolsOpen && notesOpen) {
      // 如果两个都打开了，关闭Notes（保留最后操作的Tools）
      setNotesOpen(false)
    }
  }, [toolsOpen, notesOpen])

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left */}
          <div className="flex items-center -ml-2">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white text-lg font-bold">🌐</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ToolsABC
              </span>
            </Link>
          </div>

          {/* Desktop Menu - Center */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {/* Tools Dropdown */}
            <div className="relative" ref={toolsRef}>
              <Link
                href="/tools"
                className="flex items-center space-x-1 px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200 font-medium group"
                onMouseEnter={() => {
                  setNotesOpen(false)
                  setToolsOpen(true)
                }}
              >
                <Wrench className="h-4 w-4" />
                <span>{t('nav.tools')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180' : ''}`} />
              </Link>
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-popover/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="p-2">
                    <Link
                      href="/tools/ip"
                      className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:bg-accent/80 hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                      onClick={() => closeAllDropdowns()}
                    >
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {t('nav.tools.ip')}
                    </Link>
                    <Link
                      href="/tools/json"
                      className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:bg-accent/80 hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                      onClick={() => closeAllDropdowns()}
                    >
                      <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {t('nav.tools.json')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Notes Dropdown */}
            <div className="relative" ref={notesRef}>
              <Link
                href="/notes"
                className="flex items-center space-x-1 px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200 font-medium group"
                onMouseEnter={() => {
                  setToolsOpen(false)
                  setNotesOpen(true)
                }}
              >
                <FileText className="h-4 w-4" />
                <span>{t('nav.notes')}</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${notesOpen ? 'rotate-180' : ''}`} />
              </Link>
              {notesOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-popover/95 backdrop-blur-md border border-border/50 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="p-2">
                    <Link
                      href="/notes/jq"
                      className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:bg-accent/80 hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                      onClick={() => closeAllDropdowns()}
                    >
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {t('nav.notes.jq')}
                    </Link>
                    <Link
                      href="/notes/curl"
                      className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:bg-accent/80 hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                      onClick={() => closeAllDropdowns()}
                    >
                      <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {t('nav.notes.curl')}
                    </Link>
                    <Link
                      href="/notes/sed"
                      className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:bg-accent/80 hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                      onClick={() => closeAllDropdowns()}
                    >
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {t('nav.notes.sed')}
                    </Link>
                    <Link
                      href="/notes/awk"
                      className="flex items-center px-3 py-2 text-sm text-popover-foreground hover:bg-accent/80 hover:text-accent-foreground rounded-lg transition-all duration-200 group"
                      onClick={() => closeAllDropdowns()}
                    >
                      <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                      {t('nav.notes.awk')}
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg text-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200 font-medium"
            >
              <Info className="h-4 w-4" />
              <span>{t('nav.about')}</span>
            </Link>
          </div>

          {/* Controls - Right */}
          <div className="flex items-center space-x-2">
            <div className="p-1 rounded-lg hover:bg-accent/50 transition-all duration-200">
              <LanguageToggle />
            </div>
            <div className="p-1 rounded-lg hover:bg-accent/50 transition-all duration-200">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <div className="p-1 rounded-lg hover:bg-accent/50 transition-all duration-200">
              <LanguageToggle />
            </div>
            <div className="p-1 rounded-lg hover:bg-accent/50 transition-all duration-200">
              <ThemeToggle />
            </div>
            <button
              onClick={() => {
                setIsOpen(!isOpen)
                // 打开移动菜单时关闭所有下拉菜单
                if (!isOpen) {
                  closeAllDropdowns()
                }
              }}
              className="p-2 rounded-lg text-foreground hover:text-primary hover:bg-accent/50 transition-all duration-200"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 pt-2">
            <div className="bg-accent/20 rounded-xl p-4 mx-2 backdrop-blur-sm border border-border/30">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground px-2 py-1 bg-accent/30 rounded-lg">
                    🛠️ {t('nav.tools')}
                  </div>
                  <Link
                    href="/tools/ip"
                    className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {t('nav.tools.ip')}
                  </Link>
                  <Link
                    href="/tools/json"
                    className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {t('nav.tools.json')}
                  </Link>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-muted-foreground px-2 py-1 bg-accent/30 rounded-lg">
                    📝 {t('nav.notes')}
                  </div>
                  <Link
                    href="/notes/jq"
                    className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {t('nav.notes.jq')}
                  </Link>
                  <Link
                    href="/notes/curl"
                    className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="w-2 h-2 bg-red-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {t('nav.notes.curl')}
                  </Link>
                  <Link
                    href="/notes/sed"
                    className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {t('nav.notes.sed')}
                  </Link>
                  <Link
                    href="/notes/awk"
                    className="flex items-center px-3 py-2 text-foreground hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3 group-hover:scale-125 transition-transform"></span>
                    {t('nav.notes.awk')}
                  </Link>
                </div>

                <Link
                  href="/about"
                  className="flex items-center space-x-2 px-3 py-2 text-foreground hover:text-primary hover:bg-accent/50 rounded-lg transition-all duration-200 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <Info className="h-4 w-4" />
                  <span>{t('nav.about')}</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
