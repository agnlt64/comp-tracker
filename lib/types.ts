import type { Company, Email, ApplicationStatus, EmailDirection } from "@prisma/client"

export type { ApplicationStatus, EmailDirection }

export type CompanyWithEmails = Company & {
  emails: Email[]
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  DRAFT: "Draft",
  APPLIED: "Applied",
  WAITING: "Waiting",
  NEED_TO_REPLY: "Need to Reply",
  INTERVIEW: "Interview",
  REJECTED: "Rejected",
  OFFER: "Offer",
  ACCEPTED: "Accepted",
}

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  DRAFT: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  APPLIED: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  WAITING: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  NEED_TO_REPLY: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  INTERVIEW: "bg-violet-500/15 text-violet-400 border-violet-500/20",
  REJECTED: "bg-red-500/15 text-red-400 border-red-500/20",
  OFFER: "bg-green-500/15 text-green-400 border-green-500/20",
  ACCEPTED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
}

export const ALL_STATUSES = Object.keys(STATUS_LABELS) as ApplicationStatus[]
