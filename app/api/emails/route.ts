import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()
  const { companyId, direction, subject, body: emailBody, date, cvAttached, coverLetter } = body
  if (!companyId || !direction || !subject || !emailBody) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }
  const email = await prisma.email.create({
    data: {
      companyId,
      direction,
      subject,
      body: emailBody,
      date: date ? new Date(date) : new Date(),
      cvAttached: cvAttached || false,
      coverLetter: coverLetter || null,
    },
  })
  // Update company's updatedAt
  await prisma.company.update({ where: { id: companyId }, data: { updatedAt: new Date() } })
  return NextResponse.json(email, { status: 201 })
}
