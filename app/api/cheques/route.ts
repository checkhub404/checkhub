import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const where = status ? { status: status as any } : {}
  const cheques = await prisma.cheque.findMany({
    where,
    include: { student: true, branch: true },
    orderBy: { dueDate: 'asc' },
  })
  return NextResponse.json(cheques)
}
