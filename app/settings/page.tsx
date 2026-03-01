import { Header } from "@/components/layout/Header"
import { SettingsClient } from "./SettingsClient"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function SettingsPage() {
  const settings = await prisma.globalSettings.findUnique({ where: { id: "singleton" } })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-8">
        <h1 className="text-xl font-semibold mb-1">Settings</h1>
        <p className="text-sm text-muted-foreground mb-8">Manage your global CV and preferences</p>
        <SettingsClient currentCvFileName={settings?.cvFileName ?? null} currentCvFilePath={settings?.cvFilePath ?? null} />
      </main>
    </div>
  )
}
