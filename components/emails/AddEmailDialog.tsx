"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

interface AddEmailDialogProps {
  companyId: string
  hasCv: boolean
}

function nowLocalISO() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export function AddEmailDialog({ companyId, hasCv }: AddEmailDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [direction, setDirection] = useState<"SENT" | "RECEIVED">("SENT")
  const [form, setForm] = useState({
    subject: "",
    body: "",
    date: nowLocalISO(),
    cvAttached: false,
    coverLetter: "",
  })

  function set(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function resetForm() {
    setForm({ subject: "", body: "", date: nowLocalISO(), cvAttached: false, coverLetter: "" })
    setDirection("SENT")
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch("/api/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          direction,
          subject: form.subject,
          body: form.body,
          date: new Date(form.date).toISOString(),
          cvAttached: direction === "SENT" ? form.cvAttached : false,
          coverLetter: direction === "SENT" && form.coverLetter ? form.coverLetter : null,
        }),
      })
      setOpen(false)
      resetForm()
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm() }}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="w-4 h-4" />
          Add Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Email</DialogTitle>
        </DialogHeader>

        {/* Direction toggle */}
        <div className="flex rounded-lg bg-muted p-1 gap-1">
          {(["SENT", "RECEIVED"] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDirection(d)}
              className={`flex-1 py-1.5 text-sm rounded-md font-medium transition-colors ${
                direction === d
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {d === "SENT" ? "Sent by me" : "Received from them"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                placeholder="Application for Software Engineer role"
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Date & Time</Label>
              <Input
                id="date"
                type="datetime-local"
                value={form.date}
                onChange={(e) => set("date", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="body">Email Body *</Label>
            <Textarea
              id="body"
              placeholder="Paste the email content here…"
              value={form.body}
              onChange={(e) => set("body", e.target.value)}
              rows={7}
              className="resize-y"
              required
            />
          </div>

          {direction === "SENT" && (
            <>
              <Separator />
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Attachments</p>

                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.cvAttached}
                    onChange={(e) => set("cvAttached", e.target.checked)}
                    disabled={!hasCv}
                    className="rounded"
                  />
                  <span className={`text-sm ${!hasCv ? "text-muted-foreground/50" : "text-foreground"}`}>
                    Attach CV
                    {!hasCv && (
                      <span className="text-xs text-muted-foreground/50 ml-1.5">
                        (upload your CV in <a href="/settings" className="underline">Settings</a> first)
                      </span>
                    )}
                  </span>
                </label>

                <div className="space-y-1.5">
                  <Label htmlFor="coverLetter">Cover Letter (optional)</Label>
                  <Textarea
                    id="coverLetter"
                    placeholder="Paste your cover letter content here…"
                    value={form.coverLetter}
                    onChange={(e) => set("coverLetter", e.target.value)}
                    rows={5}
                    className="resize-y"
                  />
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving…" : "Add Email"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
