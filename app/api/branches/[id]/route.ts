// app/api/branches/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  if (!id) return NextResponse.json({ error: 'شناسه نامعتبر' }, { status: 400 })

  const url = new URL(req.url)
  const force = url.searchParams.get('force') === '1' || url.searchParams.get('force') === 'true'

  const branch = await prisma.branch.findUnique({ where: { id } })
  if (!branch) return NextResponse.json({ error: 'شعبه یافت نشد' }, { status: 404 })

  // اگر force نیست، فقط وجود وابستگی‌ها را چک کن و خطای راهنما بده
  if (!force) {
    const [
      usersCount,
      studentsCount,
      chequesCount,
      ticketsAsSource,
      ticketsAsTarget,
    ] = await Promise.all([
      prisma.user.count({ where: { branchId: id } }),
      prisma.student.count({ where: { branchId: id } }),
      prisma.cheque.count({ where: { branchId: id } }),
      prisma.ticket.count({ where: { sourceBranchId: id } }),
      prisma.ticket.count({ where: { targetBranchId: id } }),
    ])

    const ticketsCount = ticketsAsSource + ticketsAsTarget
    if (usersCount + studentsCount + chequesCount + ticketsCount > 0) {
      return NextResponse.json({
        error: 'حذف شعبه ناموفق بود؛ رکوردهای دیگر متصل هستند. برای حذف اجباری دوباره اقدام کنید.',
        details: { usersCount, studentsCount, chequesCount, ticketsCount },
        requireForce: true
      }, { status: 409 })
    }

    // بدون وابستگی → حذف مستقیم
    await prisma.branch.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  }

  // حالت force: همهٔ وابستگی‌ها را پاک/خنثی کن و بعد شعبه را حذف کن
  try {
    await prisma.$transaction(async (tx) => {
      // فهرست تیکت‌هایی که این شعبه به عنوان مبدأ یا مقصد دارد
      const tickets = await tx.ticket.findMany({
        where: {
          OR: [{ sourceBranchId: id }, { targetBranchId: id }],
        },
        select: { id: true }
      })
      const ticketIds = tickets.map(t => t.id)

      if (ticketIds.length) {
        // وابستگی‌های تیکت‌ها
        // TicketRead (اگر داری)
        try {
          // @ts-ignore: model may or may not exist in some setups
          await tx.ticketRead.deleteMany({ where: { ticketId: { in: ticketIds } } })
        } catch {}

        await tx.activity.deleteMany({ where: { ticketId: { in: ticketIds } } })
        await tx.attachment.deleteMany({ where: { ticketId: { in: ticketIds } } })
        await tx.ticket.deleteMany({ where: { id: { in: ticketIds } } })
      }

      // چک‌ها و دانش‌آموزان این شعبه
      await tx.cheque.deleteMany({ where: { branchId: id } })
      await tx.student.deleteMany({ where: { branchId: id } })

      // کاربرانی که branchId این شعبه را دارند → branchId را null کن (حذف نکنیم)
      await tx.user.updateMany({
        where: { branchId: id },
        data: { branchId: null }
      })

      // در نهایت حذف خود شعبه
      await tx.branch.delete({ where: { id } })
    })

    return NextResponse.json({ ok: true, forced: true })
  } catch (e: any) {
    return NextResponse.json(
      { error: 'حذف اجباری ناموفق بود. وابستگی‌های پایگاه‌داده اجازه نمی‌دهند.', detail: e?.message },
      { status: 400 }
    )
  }
}
