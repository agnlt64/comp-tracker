import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const companies = await prisma.company.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      emails: {
        orderBy: { date: "desc" },
        take: 1,
      },
      _count: { select: { emails: true } },
    },
  })
  return NextResponse.json(companies)
}

export async function POST(req: Request) {
  const body = await req.json()
  const { name, position, website, status, notes } = body
  if (!name || !position) {
    return NextResponse.json({ error: "Name and position are required" }, { status: 400 })
  }
  const company = await prisma.company.create({
    data: { name, position, website: website || null, status: status || "DRAFT", notes: notes || null },
  })
  return NextResponse.json(company, { status: 201 })
}
