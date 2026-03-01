import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/Header"
import { DashboardClient } from "./DashboardClient"
import { prisma } from "@/lib/prisma"
import { STATUS_LABELS } from "@/lib/types"
import type { ApplicationStatus } from "@/lib/types"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const companies = await prisma.company.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      emails: { orderBy: { date: "desc" }, take: 1 },
      _count: { select: { emails: true } },
    },
  })

  const statusCounts = companies.reduce<Record<string, number>>((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1
    return acc
  }, {})

  const activeStatuses = Object.entries(statusCounts).filter(([, n]) => n > 0)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold">Applications</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {companies.length} {companies.length === 1 ? "company" : "companies"} tracked
            </p>
          </div>
          <Button asChild size="sm" className="gap-1.5">
            <Link href="/companies/new">
              <Plus className="w-4 h-4" />
              Add Company
            </Link>
          </Button>
        </div>

        {activeStatuses.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {activeStatuses.map(([status, count]) => (
              <span key={status} className="text-xs text-muted-foreground bg-muted/50 border border-border/40 px-2.5 py-1 rounded-full">
                {STATUS_LABELS[status as ApplicationStatus]}: <span className="font-semibold text-foreground">{count}</span>
              </span>
            ))}
          </div>
        )}

        <DashboardClient companies={companies} />
      </main>
    </div>
  )
}
