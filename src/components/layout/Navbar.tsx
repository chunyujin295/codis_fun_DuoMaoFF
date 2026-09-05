'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { href: '/', label: '首页' },
  { href: '/cats', label: '猫咪' },
  { href: '/gallery', label: '相册' },
  { href: '/timeline', label: '时间线' },
  { href: '/diary', label: '日记' },
]

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Hide navbar on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/DuoMaoFF/doc/img/icon.png"
              alt="多毛记 Logo"
              width={32}
              height={32}
              className="transition-transform group-hover:rotate-12"
              priority
            />
            <span className="text-xl font-serif font-bold gradient-text">多毛记</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary-500 ${
                  pathname === item.href
                    ? 'text-primary-500'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              管理
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block py-2 text-base font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-primary-500'
                    : 'text-gray-600 hover:text-primary-500'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/admin"
              className="block py-2 text-base font-medium text-gray-400 hover:text-gray-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              管理
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
