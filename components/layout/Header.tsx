import Link from "next/link"
import { BriefcaseIcon, Settings } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-foreground hover:text-foreground/80 transition-colors">
          <BriefcaseIcon className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm tracking-tight">App Tracker</span>
        </Link>
        <Link
          href="/settings"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </Link>
      </div>
    </header>
  )
}
