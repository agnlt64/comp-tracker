"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { STATUS_LABELS, STATUS_COLORS, ALL_STATUSES } from "@/lib/types"
import type { ApplicationStatus } from "@/lib/types"
import type { Company } from "@prisma/client"
import { cn } from "@/lib/utils"

interface CompanyFormProps {
  company?: Company
}

export function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: company?.name ?? "",
    position: company?.position ?? "",
    website: company?.website ?? "",
    status: (company?.status ?? "DRAFT") as ApplicationStatus,
    notes: company?.notes ?? "",
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!form.name.trim() || !form.position.trim()) {
      setError("Company name and position are required.")
      return
    }
    setLoading(true)
    try {
      const url = company ? `/api/companies/${company.id}` : "/api/companies"
      const method = company ? "PUT" : "POST"
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to save")
      const data = await res.json()
      router.push(`/companies/${data.id}`)
      router.refresh()
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Company Name *</Label>
          <Input
            id="name"
            placeholder="Acme Corp"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            placeholder="Software Engineer"
            value={form.position}
            onChange={(e) => set("position", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            placeholder="https://example.com"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={form.status} onValueChange={(v) => set("status", v)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border", STATUS_COLORS[s])}>
                    {STATUS_LABELS[s]}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          placeholder="Any notes about this application…"
          value={form.notes}
          onChange={(e) => set("notes", e.target.value)}
          rows={3}
          className="resize-y"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex items-center gap-3 pt-1">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : company ? "Save Changes" : "Add Company"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
