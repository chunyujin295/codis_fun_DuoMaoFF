import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Providers } from '@/components/Providers'

export const metadata: Metadata = {
  title: '多毛记 - 多多和毛毛的故事',
  description: '记录两只可爱小猫多多和毛毛的日常点滴',
  icons: {
    icon: '/DuoMaoFF/doc/img/icon.png',
    apple: '/DuoMaoFF/doc/img/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
