"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, Upload, CheckCircle, Trash2 } from "lucide-react"

interface SettingsClientProps {
  currentCvFileName: string | null
  currentCvFilePath: string | null
}

export function SettingsClient({ currentCvFileName, currentCvFilePath }: SettingsClientProps) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string | null>(currentCvFileName)
  const [filePath, setFilePath] = useState<string | null>(currentCvFilePath)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    const fd = new FormData()
    fd.append("file", selectedFile)
    const res = await fetch("/api/upload/cv", { method: "POST", body: fd })
    if (res.ok) {
      const data = await res.json()
      setFileName(data.cvFileName)
      setFilePath(data.cvFilePath)
      setSelectedFile(null)
      if (fileRef.current) fileRef.current.value = ""
      router.refresh()
    }
    setUploading(false)
  }

  async function handleRemove() {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cvFileName: null, cvFilePath: null }),
    })
    setFileName(null)
    setFilePath(null)
    router.refresh()
  }

  return (
    <div className="space-y-8">
      {/* CV Section */}
      <div>
        <h2 className="text-base font-medium mb-1">Curriculum Vitae</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload your CV once — it will be available to attach to any sent email.
        </p>
        <Separator className="mb-5 opacity-50" />

        {fileName ? (
          <div className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-card">
            <div className="w-10 h-10 rounded-lg bg-green-500/15 flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{fileName}</p>
              {filePath && (
                <a
                  href={filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline"
                >
                  Preview
                </a>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
              onClick={handleRemove}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-border transition-colors cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium mb-1">Upload your CV</p>
            <p className="text-xs text-muted-foreground">PDF, DOC, or DOCX</p>
          </div>
        )}

        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        />

        {selectedFile && (
          <div className="mt-3 flex items-center gap-3">
            <p className="text-sm text-muted-foreground flex-1 truncate">
              Selected: <span className="text-foreground">{selectedFile.name}</span>
            </p>
            <Button size="sm" onClick={handleUpload} disabled={uploading} className="gap-1.5 shrink-0">
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Uploading…" : "Upload"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => { setSelectedFile(null); if (fileRef.current) fileRef.current.value = "" }}
            >
              Cancel
            </Button>
          </div>
        )}

        {!fileName && !selectedFile && (
          <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={() => fileRef.current?.click()}>
            <Upload className="w-3.5 h-3.5" />
            Choose File
          </Button>
        )}
      </div>
    </div>
  )
}
