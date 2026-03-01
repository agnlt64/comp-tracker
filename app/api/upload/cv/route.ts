import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get("file") as File | null
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 })

  const uploadDir = path.join(process.cwd(), "public", "uploads", "cv")
  await mkdir(uploadDir, { recursive: true })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, "_")
  const filePath = path.join(uploadDir, filename)
  await writeFile(filePath, buffer)

  await prisma.globalSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", cvFileName: file.name, cvFilePath: `/uploads/cv/${filename}` },
    update: { cvFileName: file.name, cvFilePath: `/uploads/cv/${filename}` },
  })

  return NextResponse.json({ cvFileName: file.name, cvFilePath: `/uploads/cv/${filename}` })
}
