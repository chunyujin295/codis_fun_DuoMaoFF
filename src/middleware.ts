import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { BASE_PATH } from '@/lib/urls'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname.replace(
    new RegExp('^' + BASE_PATH + '(?=/|$)'),
    ''
  )
  if (pathname === '/admin/login') return NextResponse.next()
  const protectedPage = pathname === '/admin' || pathname.startsWith('/admin/')
  const mutation =
    pathname.startsWith('/api/') &&
    !['GET', 'HEAD', 'OPTIONS'].includes(request.method)
  if (!protectedPage && !mutation) return NextResponse.next()
  if (await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET }))
    return NextResponse.next()
  if (mutation)
    return NextResponse.json(
      { success: false, error: '请先登录管理员账号' },
      { status: 401 }
    )
  return NextResponse.redirect(new URL(BASE_PATH + '/admin/login', request.url))
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/media/:path*',
    '/api/cats/:path*',
    '/api/diary/:path*',
  ],
}
