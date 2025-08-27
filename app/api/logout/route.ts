import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'checkhub_session'

export async function POST(_req: NextRequest) {
  const res = NextResponse.json({ ok: true })
  res.cookies.set({
    name: COOKIE_NAME,
    value: '',
    path: '/',
    maxAge: 0,
  })
  return res
}
