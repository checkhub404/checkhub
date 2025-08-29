// app/api/messages/[id]/read/route.ts
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { cookies } from "next/headers"
import { getIronSession } from "iron-session"
import { sessionOptions, type SessionUser } from "@/lib/session"

async function getUser() {
  const session = await getIronSession<SessionUser>(cookies(), sessionOptions)
  return session.user ?? null
}

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const me = await getUser()
  if (!me) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 })

  await prisma.messageRead.upsert({
    where: { messageId_userId: { messageId: params.id, userId: me.id } },
    update: {},
    create: { messageId: params.id, userId: me.id }
  })

  return NextResponse.json({ ok: true })
}
