import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionUser } from '@/lib/session'

async function getUser() {
  const session = await getIronSession<SessionUser>(cookies(), sessionOptions)
  return session.user ?? null
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 })

  const msg = await prisma.message.findFirst({
    where: {
      id: params.id,
      OR: [
        { isBroadcast: true },
        ...(user.branchCode ? [{ targetBranch: { code: user.branchCode } }] : []),
      ],
    },
    include: {
      targetBranch: { select: { name: true, code: true } },
      createdBy:    { select: { name: true, email: true } },
    },
  })

  if (!msg) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  return NextResponse.json(msg)
}
