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
  if (!session?.id || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
  }

  const { email, name, role, branchCode, password } = await req.json()
  if (!email || !role || !password) return NextResponse.json({ error: 'فیلدها ناقص است' }, { status: 400 })

  let branchId: string | undefined = undefined
  if (role === 'BRANCH') {
    if (!branchCode) return NextResponse.json({ error: 'برای نقش BRANCH، کُد شعبه لازم است' }, { status: 400 })
    const br = await prisma.branch.findUnique({ where: { code: branchCode } })
    if (!br) return NextResponse.json({ error: 'کُد شعبه نامعتبر است' }, { status: 400 })
    branchId = br.id
  }

  const passwordHash = await bcrypt.hash(password, 10)
  try {
    const user = await prisma.user.create({
      data: { email, name, role, branchId, passwordHash }
    })
    return NextResponse.json({ ok: true, user })
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}
