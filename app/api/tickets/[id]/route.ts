import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const COOKIE = 'checkhub_session'
function getSession(req: NextRequest) {
  const raw = req.cookies.get(COOKIE)?.value
  if (!raw) return null
  try { return JSON.parse(Buffer.from(raw, 'base64').toString('utf8')) } catch { return null }
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const ticket = await prisma.ticket.findUnique({
    where: { id: params.id },
    include: {
      cheque: { include: { student: true, branch: true } },
      sourceBranch: true,
      targetBranch: true,
      createdBy: true,
      assignee: true,
      activities: { orderBy: { createdAt: 'desc' } },
      attachments: true,
      // ⬅️ توجه: اسم رابطه در اسکیما "reads" است (نه TicketRead)
      reads: { include: { user: true }, orderBy: { readAt: 'desc' } },
    },
  })
  if (!ticket) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  return NextResponse.json(ticket)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = getSession(req)
  if (!session?.id || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 })
  }
  await prisma.ticket.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
