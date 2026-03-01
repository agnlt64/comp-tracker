import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({
    where: { id },
    include: { emails: { orderBy: { date: "desc" } } },
  })
  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(company)
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const { name, position, website, status, notes } = body
  const company = await prisma.company.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(position !== undefined && { position }),
      ...(website !== undefined && { website: website || null }),
      ...(status !== undefined && { status }),
      ...(notes !== undefined && { notes: notes || null }),
    },
  })
  return NextResponse.json(company)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.company.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
