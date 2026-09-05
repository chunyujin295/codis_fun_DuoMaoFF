'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, X, ArrowUpRight } from 'lucide-react'
import { siteUrl } from '@/lib/urls'

const navItems = [
  { href: '/', label: '收藏册', no: '01' },
  { href: '/cats', label: '两位主角', no: '02' },
  { href: '/gallery', label: '影像抽屉', no: '03' },
  { href: '/timeline', label: '慢慢长大', no: '04' },
  { href: '/diary', label: '碎碎念', no: '05' },
]
export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  if (pathname.startsWith('/admin')) return null
  return (
    <header className="album-nav">
      <div className="nav-inner">
        <Link href="/" className="brand-lockup" aria-label="多毛记首页">
          <Image
            src={siteUrl('/doc/img/icon.png')}
            alt=""
            width={43}
            height={43}
            priority
          />
          <span>
            多毛记<small>DUO & MAO / LIFE ARCHIVE</small>
          </span>
        </Link>
        <nav className="desktop-links" aria-label="主导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              <sup>{item.no}</sup>
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="nav-admin" href="/admin">
          记录一笔 <ArrowUpRight size={15} />
        </Link>
        <button
          className="mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="mobile-links" aria-label="手机导航">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              aria-current={pathname === item.href ? 'page' : undefined}
            >
              {item.no} / {item.label}
            </Link>
          ))}
          <Link href="/admin" onClick={() => setOpen(false)}>
            记录一笔 ↗
          </Link>
        </nav>
      )}
    </header>
  )
}
