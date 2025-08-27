// middleware.ts
import { NextRequest, NextResponse } from 'next/server'

const COOKIE = 'checkhub_session'

function readSession(req: NextRequest) {
  const raw = req.cookies.get(COOKIE)?.value
  if (!raw) return null
  try {
    const json = Buffer.from(raw, 'base64').toString('utf8')
    return JSON.parse(json) as { id: string; email: string; role: 'ADMIN'|'BRANCH'|'VIEWER'; branchCode?: string|null }
  } catch {
    return null
  }
}

// مسیرهایی که فقط با لاگین اجازه دارند
const PROTECTED_PREFIXES = ['/dashboard', '/tickets', '/branch']
// مسیرهای فقط-ادمین
const ADMIN_PREFIXES = ['/admin']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const session = readSession(req)

  // نیاز به لاگین
  if (PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
    if (!session?.id) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
  }

  // فقط ادمین
  if (ADMIN_PREFIXES.some(p => pathname.startsWith(p))) {
    if (!session?.id) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('next', pathname)
      return NextResponse.redirect(url)
    }
    if (session.role !== 'ADMIN') {
      const url = req.nextUrl.clone()
      url.pathname = '/'
      url.searchParams.set('forbidden', '1')
      return NextResponse.redirect(url)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/tickets/:path*',
    '/branch/:path*',
    '/admin/:path*',
  ],
}
