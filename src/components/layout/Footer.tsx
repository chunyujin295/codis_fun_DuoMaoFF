'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { siteUrl } from '@/lib/urls'
export function Footer() {
  if (usePathname().startsWith('/admin')) return null
  return (
    <footer className="album-footer">
      <div className="footer-top">
        <p>
          没什么大事。
          <br />
          <span>只是很爱它们。</span>
        </p>
        <Image
          src={siteUrl('/doc/img/icon.png')}
          alt="多毛记猫爪印章"
          width={112}
          height={112}
        />
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} 多毛记 · 私人猫咪收藏册</span>
        <span>MADE OF LITTLE, FURRY MOMENTS.</span>
        <Link href="/admin">铲屎官入口 ↗</Link>
      </div>
    </footer>
  )
}
