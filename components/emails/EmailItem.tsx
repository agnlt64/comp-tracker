"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, Trash2, Paperclip, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Email } from "@prisma/client"
import { cn } from "@/lib/utils"

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

export function EmailItem({ email }: { email: Email }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const isSent = email.direction === "SENT"
  const isLong = email.body.length > 300

  async function handleDelete() {
    if (!confirm("Delete this email?")) return
    setDeleting(true)
    await fetch(`/api/emails/${email.id}`, { method: "DELETE" })
    router.refresh()
  }

  return (
    <div className={cn("flex gap-3", isSent ? "flex-row-reverse" : "flex-row")}>
      {/* Avatar dot */}
      <div className={cn(
        "w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold mt-1",
        isSent ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
      )}>
        {isSent ? "Y" : "C"}
      </div>

      <div className={cn("max-w-[80%] min-w-0", isSent ? "items-end" : "items-start", "flex flex-col gap-1")}>
        {/* Header */}
        <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", isSent && "flex-row-reverse")}>
          <span className="font-medium">{isSent ? "You" : "Company"}</span>
          <span>·</span>
          <span>{formatDateTime(email.date)}</span>
        </div>

        {/* Bubble */}
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed border w-full",
          isSent
            ? "bg-primary/10 border-primary/20 rounded-tr-sm"
            : "bg-muted/50 border-border/60 rounded-tl-sm"
        )}>
          <p className="font-semibold mb-1 text-foreground">{email.subject}</p>

          <div className={cn("text-muted-foreground whitespace-pre-wrap", !expanded && isLong && "line-clamp-4")}>
            {email.body}
          </div>

          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-primary mt-1.5 hover:underline"
            >
              {expanded ? <><ChevronUp className="w-3 h-3" />Show less</> : <><ChevronDown className="w-3 h-3" />Show more</>}
            </button>
          )}

          {/* Attachments */}
          {(email.cvAttached || email.coverLetter) && (
            <>
              <Separator className="my-2.5 opacity-30" />
              <div className="flex flex-wrap gap-2">
                {email.cvAttached && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-500/15 text-blue-400 border border-blue-500/20">
                    <Paperclip className="w-3 h-3" /> CV
                  </span>
                )}
                {email.coverLetter && (
                  <button
                    onClick={() => setShowCoverLetter(!showCoverLetter)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-violet-500/15 text-violet-400 border border-violet-500/20 hover:bg-violet-500/25 transition-colors"
                  >
                    <FileText className="w-3 h-3" />
                    Cover Letter
                    {showCoverLetter ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                )}
              </div>
              {showCoverLetter && email.coverLetter && (
                <div className="mt-2.5 p-3 rounded-lg bg-background/50 border border-border/40 text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {email.coverLetter}
                </div>
              )}
            </>
          )}
        </div>

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
