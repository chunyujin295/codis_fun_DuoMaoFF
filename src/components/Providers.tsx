'use client'
import { SessionProvider } from 'next-auth/react'
import { MotionConfig } from 'framer-motion'
import { BASE_PATH } from '@/lib/urls'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath={BASE_PATH + '/api/auth'}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </SessionProvider>
  )
}
