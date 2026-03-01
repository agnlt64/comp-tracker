import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/Header"
import { CompanyForm } from "@/components/companies/CompanyForm"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function EditCompanyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({ where: { id } })
  if (!company) notFound()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        <Link
          href={`/companies/${company.id}`}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {company.name}
        </Link>
        <h1 className="text-xl font-semibold mb-6">Edit Company</h1>
        <CompanyForm company={company} />
      </main>
    </div>
  )
}
