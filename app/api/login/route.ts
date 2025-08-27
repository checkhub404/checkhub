import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const COOKIE_NAME = 'checkhub_session'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'ایمیل و پسورد لازم است' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { branch: true },
    })
    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'کاربر/پسورد نادرست' }, { status: 401 })
    }

    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return NextResponse.json({ error: 'کاربر/پسورد نادرست' }, { status: 401 })

    // محتوای سشن که در کوکی ذخیره می‌کنیم (حداقل‌ها)
    const sessionPayload = {
      id: user.id,
      email: user.email,
      role: user.role,                       // 'ADMIN' | 'BRANCH' | 'VIEWER'
      branchCode: user.branch?.code ?? null, // برای نقش BRANCH
    }

    const res = NextResponse.json({ ok: true, user: sessionPayload })
    // ست‌کردن کوکی HttpOnly
    res.cookies.set({
      name: COOKIE_NAME,
      value: Buffer.from(JSON.stringify(sessionPayload)).toString('base64'),
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // در تولید: true
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 روز
    })
    return res
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Login failed' }, { status: 500 })
  }
}
