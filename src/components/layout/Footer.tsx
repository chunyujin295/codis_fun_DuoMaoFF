'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Heart } from 'lucide-react'

export function Footer() {
  const pathname = usePathname()

  // Hide footer on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/DuoMaoFF/doc/img/icon.png"
                alt="多毛记 Logo"
                width={24}
                height={24}
              />
              <span className="text-lg font-serif font-bold gradient-text">多毛记</span>
            </Link>
            <p className="text-gray-500 text-sm">
              记录多多和毛毛的每一个美好瞬间
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-serif font-semibold mb-4">探索</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cats" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                  认识猫咪
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                  精选相册
                </Link>
              </li>
              <li>
                <Link href="/timeline" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                  成长时间线
                </Link>
              </li>
              <li>
                <Link href="/diary" className="text-gray-500 text-sm hover:text-primary-500 transition-colors">
                  小猫日记
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-serif font-semibold mb-4">关于</h3>
            <p className="text-gray-500 text-sm mb-4">
              这是一个记录两只可爱小猫生活点滴的网站，用镜头捕捉它们的每一个可爱瞬间。
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-400 fill-red-400" />
              <span>for 多多和毛毛</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
          <p>© {new Date().getFullYear()} 多毛记. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
