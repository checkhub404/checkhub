// app/api/tickets/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/tickets
 * اختیاری: ?branchId=BR-003  (یا ?branchCode=BR-003)
 * - اگر پارامتر بدی، تیکت‌های مقصد همان شعبه را برمی‌گرداند.
 * - اگر ندهی، همه تیکت‌ها برگردانده می‌شود (برای داشبورد).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const branchParam = searchParams.get('branchId') || searchParams.get('branchCode')
  const where = branchParam ? { targetBranch: { code: branchParam } } : {}
  const tickets = await prisma.ticket.findMany({
    where,
    include: { cheque: { include: { student: true } }, activities: true },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(tickets)
}

/**
 * POST /api/tickets
 * نکته: این endpoint ساده‌ترین حالت ایجاد تیکت است و انتظار دارد
 * بدنه‌ی درخواست مستقیماً همه‌ی فیلدهای لازم تیکت را بدهد.
 * (برای سناریوی ساخت تیکت همراه با دانش‌آموز/چک از /api/tickets/new استفاده کن.)
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const ticket = await prisma.ticket.create({ data: body })
  return NextResponse.json(ticket, { status: 201 })
}
