import { ScrollArea } from "@/components/ui/scroll-area"
import { EmailItem } from "./EmailItem"
import type { Email } from "@prisma/client"
import { Mail } from "lucide-react"

export function EmailThread({ emails }: { emails: Email[] }) {
  if (emails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
          <Mail className="w-5 h-5 text-muted-foreground" />
        </div>
        <p className="text-sm text-muted-foreground">No emails yet</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Add your first email to start the thread</p>
      </div>
    )
  }

  // Sorted newest→oldest from server, display as-is
  const displayEmails = emails

  return (
    <ScrollArea className="h-full">
      <div className="flex flex-col gap-6 p-4 pb-8">
        {displayEmails.map((email) => (
          <EmailItem key={email.id} email={email} />
        ))}
      </div>
    </ScrollArea>
  )
}
