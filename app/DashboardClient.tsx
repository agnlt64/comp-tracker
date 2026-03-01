"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CompanyCard } from "@/components/companies/CompanyCard"
import { ALL_STATUSES, STATUS_LABELS, STATUS_COLORS } from "@/lib/types"
import type { ApplicationStatus } from "@/lib/types"
import type { Company, Email } from "@prisma/client"
import { cn } from "@/lib/utils"

type CompanyWithMeta = Company & {
  emails: Email[]
  _count: { emails: number }
}

export function DashboardClient({ companies }: { companies: CompanyWithMeta[] }) {
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | "ALL">("ALL")

  const filtered = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.position.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === "ALL" || c.status === filterStatus
      return matchesSearch && matchesStatus
    })
  }, [companies, search, filterStatus])

  return (
    <div>
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search companies or positions…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          <SlidersHorizontal className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
          <button
            onClick={() => setFilterStatus("ALL")}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
              filterStatus === "ALL"
                ? "bg-foreground text-background border-foreground"
                : "text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
            )}
          >
            All
          </button>
          {ALL_STATUSES.map((s) => {
            const count = companies.filter((c) => c.status === s).length
            if (count === 0) return null
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? "ALL" : s)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium border transition-colors",
                  filterStatus === s
                    ? STATUS_COLORS[s]
                    : "text-muted-foreground border-border/60 hover:border-border hover:text-foreground"
                )}
              >
                {STATUS_LABELS[s]} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          {companies.length === 0 ? (
            <div>
              <p className="text-base font-medium mb-1">No applications yet</p>
              <p className="text-sm">Click &quot;Add Company&quot; to get started</p>
            </div>
          ) : (
            <p className="text-sm">No companies match your search</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  )
}
