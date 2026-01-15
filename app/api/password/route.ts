import { NextResponse } from 'next/server'

const PASSWORD = 'ehrdashboard25'

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const input = body?.password

  if (!input || input !== PASSWORD) {
    return NextResponse.json({ message: 'Incorrect password.' }, { status: 401 })
  }

  const response = NextResponse.json({ ok: true })
  response.cookies.set('site_auth', 'true', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return response
}
