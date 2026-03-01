import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const settings = await prisma.globalSettings.findUnique({ where: { id: "singleton" } })
  return NextResponse.json(settings ?? { id: "singleton", cvFileName: null, cvFilePath: null })
}

export async function PUT(req: Request) {
  const body = await req.json()
  const settings = await prisma.globalSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...body },
    update: body,
  })
  return NextResponse.json(settings)
}
