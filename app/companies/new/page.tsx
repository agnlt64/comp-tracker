import { Header } from "@/components/layout/Header"
import { CompanyForm } from "@/components/companies/CompanyForm"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewCompanyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <h1 className="text-xl font-semibold mb-6">Add Company</h1>
        <CompanyForm />
      </main>
    </div>
  )
}
