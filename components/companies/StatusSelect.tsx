"use client"

import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATUS_LABELS, STATUS_COLORS, ALL_STATUSES } from "@/lib/types"
import type { ApplicationStatus } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StatusSelectProps {
  companyId: string
  currentStatus: ApplicationStatus
}

export function StatusSelect({ companyId, currentStatus }: StatusSelectProps) {
  const router = useRouter()

  async function handleChange(newStatus: string) {
    await fetch(`/api/companies/${companyId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
  }

  return (
    <Select defaultValue={currentStatus} onValueChange={handleChange}>
      <SelectTrigger className="w-auto h-7 text-xs border-0 bg-transparent p-0 shadow-none focus:ring-0 gap-1.5">
        <SelectValue>
          <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", STATUS_COLORS[currentStatus])}>
            {STATUS_LABELS[currentStatus]}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {ALL_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", STATUS_COLORS[status])}>
              {STATUS_LABELS[status]}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
