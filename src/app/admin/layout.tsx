'use client'

import Link from 'next/link'
import NextImage from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Image,
  BookOpen,
  Cat,
  LogOut,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

const sidebarItems = [
  { href: '/admin', label: '仪表板', icon: LayoutDashboard },
  { href: '/admin/media', label: '媒体管理', icon: Image },
  { href: '/admin/diary', label: '日记管理', icon: BookOpen },
  { href: '/admin/cats', label: '猫咪管理', icon: Cat },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Redirect to login page without sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="admin-sidebar fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 z-50">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
            <NextImage
              src="/DuoMaoFF/doc/img/icon.png"
              alt="多毛记 Logo"
              width={32}
              height={32}
              priority
            />
            <span className="text-xl font-serif font-bold gradient-text">
              管理后台
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="admin-links-bottom px-4 py-4 border-t border-gray-100">
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-gray-700 text-sm mb-2"
            >
              <span>返回网站</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: '/DuoMaoFF/admin/login' })}
              className="flex items-center gap-2 px-4 py-2 text-gray-500 hover:text-red-500 text-sm w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-content ml-64 p-8">{children}</main>
    </div>
  )
}
