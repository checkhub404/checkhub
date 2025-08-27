import { NextRequest, NextResponse } from 'next/server'

const COOKIE_NAME = 'checkhub_session'

export async function GET(req: NextRequest) {
  const raw = req.cookies.get(COOKIE_NAME)?.value
  if (!raw) return NextResponse.json({ user: null })

  try {
    const json = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'))
    return NextResponse.json({ user: json })
  } catch {
    return NextResponse.json({ user: null })
  }
}
