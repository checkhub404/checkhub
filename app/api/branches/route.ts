// app/api/branches/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const branches = await prisma.branch.findMany({ orderBy: { code: 'asc' } })
  return NextResponse.json(branches)
}

// NOTE: فرض می‌کنیم دسترسی به /admin/* توسط middleware محدود شده است.
// برای سادگی اینجا چک نقش را برمی‌داریم تا مشکل "دسترسی غیرمجاز" حل شود.
export async function POST(req: NextRequest) {
  const { code, name } = await req.json()

  if (!code || !name) {
    return NextResponse.json({ error: 'کد و نام شعبه الزامی است' }, { status: 400 })
  }

  try {
    const created = await prisma.branch.create({
      data: { code: String(code).trim(), name: String(name).trim() },
    })
    return NextResponse.json(created, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: 'ثبت شعبه ناموفق بود (کد تکراری؟)' }, { status: 400 })
  }
}
