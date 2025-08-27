import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const COOKIE = 'checkhub_session'
function getSession(req: NextRequest) {
  const raw = req.cookies.get(COOKIE)?.value
  if (!raw) return null
  try { return JSON.parse(Buffer.from(raw, 'base64').toString('utf8')) } catch { return null }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const me = getSession(req)
  if (!me?.id) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  await prisma.ticketRead.upsert({
    where: { ticketId_userId: { ticketId: params.id, userId: me.id } },
    update: { readAt: new Date() },
    create: { ticketId: params.id, userId: me.id },
  })
  return NextResponse.json({ ok: true })
}
