import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const COOKIE = 'checkhub_session'
function getSession(req: NextRequest) {
  const raw = req.cookies.get(COOKIE)?.value
  if (!raw) return null
  try { return JSON.parse(Buffer.from(raw, 'base64').toString('utf8')) } catch { return null }
}

export async function POST(req: NextRequest) {
  const session = getSession(req)
  if (!session?.id) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const { currentPassword, newPassword } = await req.json()
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: 'فیلدها کامل نیست' }, { status: 400 })
  }
  const user = await prisma.user.findUnique({ where: { id: session.id } })
  if (!user?.passwordHash) return NextResponse.json({ error: 'حساب فاقد پسورد' }, { status: 400 })

  const ok = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!ok) return NextResponse.json({ error: 'پسورد فعلی نادرست است' }, { status: 400 })

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({ where: { id: session.id }, data: { passwordHash } })
  return NextResponse.json({ ok: true })
}
