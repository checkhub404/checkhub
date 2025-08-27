import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.json()

  // ورودی‌های ضروری
  const targetBranchCode = String(body?.targetBranchCode || '').trim()
  const studentCode = String(body?.studentCode || '').trim()
  const fullName = String(body?.fullName || '').trim()
  const grade = String(body?.grade || '')
  const guardian = String(body?.guardian || '')
  const phone = String(body?.phone || '')
  const sayadiId = body?.sayadiId ? String(body.sayadiId) : null
  const bank = String(body?.bank || '')
  const accountNo = String(body?.accountNo || '')
  const amount = Number(body?.amount || 0)
  const dueDate = body?.dueDate ? new Date(body.dueDate) : null
  const title = String(body?.title || '').trim()
  const description = String(body?.description || '').trim()
  const priority = String(body?.priority || 'MEDIUM')
  const status = 'OPEN'

  if (!targetBranchCode || !studentCode || !fullName || !amount || !dueDate || !title) {
    return NextResponse.json({ error: 'فیلدهای الزامی ناقص است' }, { status: 400 })
  }

  try {
    // مقصد باید موجود باشد
    const target = await prisma.branch.findUnique({ where: { code: targetBranchCode } })
    if (!target) {
      return NextResponse.json({ error: 'کُد شعبه مقصد نامعتبر است' }, { status: 400 })
    }

    // ✅ مبدأ همیشه CENTER است؛ اگر نبود می‌سازیم
    const source = await prisma.branch.upsert({
      where: { code: 'CENTER' },
      update: {},
      create: { code: 'CENTER', name: 'مرکز حسابداری' },
    })

    // دانش‌آموز (به مقصد وابسته است)
    const student = await prisma.student.upsert({
      where: { code: studentCode },
      update: { fullName, grade, guardian, phone, branchId: target.id },
      create: { code: studentCode, fullName, grade, guardian, phone, branchId: target.id },
    })

    // چک
    const cheque = await prisma.cheque.create({
      data: {
        sayadiId: sayadiId || undefined,
        bank, accountNo,
        amount,
        dueDate,
        status: 'PENDING',
        studentId: student.id,
        branchId: target.id,
      },
    })

    // ایجادکننده (فعلاً ثابت؛ بعداً با سشن جایگزین می‌کنیم)
    const admin = await prisma.user.upsert({
      where: { email: 'finance@example.com' },
      update: {},
      create: { email: 'finance@example.com', name: 'مدیر مالی', role: 'ADMIN' },
    })

    // تیکت
    const ticket = await prisma.ticket.create({
      data: {
        title, description, priority, status,
        chequeId: cheque.id,
        sourceBranchId: source.id,   // ⬅️ مبدأ = CENTER
        targetBranchId: target.id,   // ⬅️ مقصد = شعبه انتخابی
        createdById: admin.id,
      },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'failed' }, { status: 500 })
  }
}
