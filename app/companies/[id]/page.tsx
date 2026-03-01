import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/Header"
import { StatusSelect } from "@/components/companies/StatusSelect"
import { EmailThread } from "@/components/emails/EmailThread"
import { AddEmailDialog } from "@/components/emails/AddEmailDialog"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function CompanyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [company, settings] = await Promise.all([
    prisma.company.findUnique({
      where: { id },
      include: { emails: { orderBy: { date: "desc" } } },
    }),
    prisma.globalSettings.findUnique({ where: { id: "singleton" } }),
  ])

  if (!company) notFound()

  const hasCv = !!settings?.cvFileName

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-8 flex flex-col gap-6">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          All Applications
        </Link>

        {/* Company header */}
        <div className="rounded-xl border border-border/60 bg-card p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold tracking-tight">{company.name}</h1>
              <p className="text-muted-foreground mt-1">{company.position}</p>
              {company.website && (
                <a
                  href={company.website.startsWith("http") ? company.website : `https://${company.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline mt-1.5"
                >
                  {company.website.replace(/^https?:\/\//, "")}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusSelect companyId={company.id} currentStatus={company.status} />
              <Button asChild variant="ghost" size="icon" className="h-8 w-8">
                <Link href={`/companies/${company.id}/edit`}>
                  <Pencil className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>

          {company.notes && (
            <>
              <Separator className="my-4 opacity-50" />
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{company.notes}</p>
            </>
          )}
        </div>

        {/* Email thread */}
        <div className="rounded-xl border border-border/60 bg-card flex flex-col flex-1 min-h-[400px]">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40">
            <div className="flex items-center gap-2">
              <h2 className="font-medium text-sm">Email Thread</h2>
              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                {company.emails.length}
              </span>
            </div>
            <AddEmailDialog companyId={company.id} hasCv={hasCv} />
          </div>
          <div className="flex-1">
            <EmailThread emails={company.emails} />
          </div>
        </div>
      </main>
    </div>
  )
}
