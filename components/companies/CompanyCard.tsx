import Link from "next/link"
import { Mail, Calendar } from "lucide-react"
import { StatusBadge } from "./StatusBadge"
import type { Company, Email } from "@prisma/client"

type CompanyWithMeta = Company & {
  emails: Email[]
  _count: { emails: number }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date))
}

export function CompanyCard({ company }: { company: CompanyWithMeta }) {
  const latestEmail = company.emails[0]

  return (
    <Link href={`/companies/${company.id}`} className="block group">
      <div className="rounded-xl border border-border/60 bg-card hover:border-border hover:bg-card/80 transition-all duration-200 p-5 h-full flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
              {company.name}
            </h3>
            <p className="text-sm text-muted-foreground truncate mt-0.5">{company.position}</p>
          </div>
          <StatusBadge status={company.status} className="shrink-0 mt-0.5" />
        </div>

        {latestEmail && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {latestEmail.subject}: {latestEmail.body.slice(0, 100)}
            {latestEmail.body.length > 100 ? "…" : ""}
          </p>
        )}

        <div className="flex items-center gap-3 mt-auto text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" />
            {company._count.emails} email{company._count.emails !== 1 ? "s" : ""}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(company.updatedAt)}
          </span>
        </div>
      </div>
    </Link>
  )
}
