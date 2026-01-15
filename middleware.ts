import { NextResponse } from 'next/server'
import { auth } from '@/auth'

export default auth((req) => {
  const { user } = req.auth ?? {}
  const pathname = req.nextUrl.pathname

  const isAuthRoute = pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/pending')
  const isPasswordRoute = pathname.startsWith('/password') || pathname.startsWith('/api/password')

  const hasPassword = req.cookies.get('site_auth')?.value === 'true'

  if (!hasPassword && !isPasswordRoute) {
    return NextResponse.redirect(new URL('/password', req.url))
  }

  const authEnabled = process.env.ENABLE_AUTH === 'true'
  if (authEnabled) {
    if (!req.auth && !pathname.startsWith('/api/auth') && !isAuthRoute) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    if (user?.status === 'PENDING' && !pathname.startsWith('/auth/pending')) {
      return NextResponse.redirect(new URL('/auth/pending', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!_next|api/auth|favicon.ico).*)'],
}
