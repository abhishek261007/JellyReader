import { useParams, useNavigate, Link } from "react-router-dom"
import { getItemDownloadUrl, getToken } from "@/lib/api/client"
import { useEffect, useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { db, type ReadingProgress } from "@/lib/db/db"
import { ArrowLeft, ArrowRight, Settings2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type ReadingMode = "single" | "vertical"
type ReadingDirection = "ltr" | "rtl"

interface PageData {
  index: number
  url: string
  loaded: boolean
}

async function downloadAndExtractCbz(downloadUrl: string): Promise<Blob[]> {
  const { unzipSync } = await import("fflate")
  const headers: Record<string, string> = {}
  const token = getToken()
  if (token) headers["X-Emby-Token"] = token
  const response = await fetch(downloadUrl, { headers })
  if (!response.ok) throw new Error(`Download failed: ${response.status}`)
  const buffer = await response.arrayBuffer()
  const data = new Uint8Array(buffer)
  const unzipped = unzipSync(data)

  const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]
  const entries = Object.entries(unzipped)
    .filter(([name]) => imageExtensions.some((ext) => name.toLowerCase().endsWith(ext)))
    .sort(([a], [b]) => {
      const numA = parseInt(a.match(/(\d+)/)?.[1] || "0", 10)
      const numB = parseInt(b.match(/(\d+)/)?.[1] || "0", 10)
      return numA - numB
    })

  return entries.map(([name, uint8]) => {
    const ext = name.split(".").pop()?.toLowerCase() || "jpeg"
    const mime = ext === "png" ? "image/png" : ext === "webp" ? "image/webp" : ext === "avif" ? "image/avif" : ext === "gif" ? "image/gif" : "image/jpeg"
    return new Blob([uint8.buffer.slice(0)], { type: mime })
  })
}

export function ReaderPage() {
  const { comicId } = useParams<{ comicId: string }>()
  const navigate = useNavigate()
  const [pages, setPages] = useState<PageData[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<ReadingMode>("single")
  const [direction, setDirection] = useState<ReadingDirection>("ltr")
  const [showUI, setShowUI] = useState(true)
  const imageUrlRefs = useRef<string[]>([])

  useEffect(() => {
    if (!comicId) return
    let cancelled = false

    const loadComic = async () => {
      try {
        const saved = await db.readingProgress.get(comicId)
        if (saved && !cancelled) {
          setCurrentPage(saved.page)
          setMode(saved.readingMode as ReadingMode)
          setDirection(saved.readingDirection as ReadingDirection)
        }

        const downloadUrl = getItemDownloadUrl(comicId)
        if (!downloadUrl) throw new Error("No download URL available")

        const blobs = await downloadAndExtractCbz(downloadUrl)
        if (cancelled) return

        const urls = blobs.map((blob) => URL.createObjectURL(blob))
        imageUrlRefs.current = urls

        setPages(
          blobs.map((_, i) => ({
            index: i,
            url: urls[i],
            loaded: true,
          })),
        )
        setLoading(false)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load comic")
          setLoading(false)
        }
      }
    }

    loadComic()

    return () => {
      cancelled = true
      imageUrlRefs.current.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [comicId])

  const saveProgress = useCallback(
    async (page: number) => {
      if (!comicId || !pages.length) return
      const progress: ReadingProgress = {
        comicId,
        page,
        totalPages: pages.length,
        updatedAt: Date.now(),
        readingMode: mode,
        readingDirection: direction,
      }
      await db.readingProgress.put(progress)
    },
    [comicId, pages.length, mode, direction],
  )

  useEffect(() => {
    saveProgress(currentPage)
  }, [currentPage, saveProgress])

  const goToPage = useCallback(
    (page: number) => {
      const clamped = Math.max(0, Math.min(page, pages.length - 1))
      setCurrentPage(clamped)
    },
    [pages.length],
  )

  const handleContainerClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const width = rect.width
    const third = width / 3

    if (x < third) {
      if (direction === "ltr") { goToPage(currentPage - 1) } else { goToPage(currentPage + 1) }
    } else if (x > third * 2) {
      if (direction === "ltr") { goToPage(currentPage + 1) } else { goToPage(currentPage - 1) }
    }
    setShowUI(true)
  }

  const goBack = () => {
    if (document.referrer) {
      navigate(-1)
    } else {
      navigate(`/comic/${comicId}`)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading comic...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-black p-4">
        <p className="text-destructive text-center">{error}</p>
        <Button variant="outline" asChild>
          <Link to={`/comic/${comicId}`}>Back to details</Link>
        </Button>
      </div>
    )
  }

  if (mode === "vertical") {
    return (
      <div className="min-h-dvh bg-black">
        <div className="relative mx-auto max-w-3xl">
          {pages.map((page, i) => (
            <div key={i} className="w-full">
              {page.loaded ? (
                <img
                  src={page.url}
                  alt={`Page ${i + 1}`}
                  className="w-full"
                  draggable={false}
                  loading="lazy"
                />
              ) : (
                <Skeleton className="aspect-[3/4] w-full rounded-none" />
              )}
            </div>
          ))}
        </div>
        <div className={cn(
          "fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
          showUI ? "opacity-100" : "opacity-0 pointer-events-none",
        )}>
          <div className="mx-auto flex max-w-3xl items-center justify-between">
            <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm text-white/70">
              Page {currentPage + 1} of {pages.length}
            </span>
            <Button variant="ghost" size="icon" className="text-white" onClick={() => setMode("single")}>
              <Settings2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-dvh bg-black select-none">
      <div
        className="relative flex h-dvh items-center justify-center overflow-hidden"
        onClick={handleContainerClick}
      >
        {pages[currentPage]?.loaded && (
          <img
            src={pages[currentPage].url}
            alt={`Page ${currentPage + 1}`}
            className="max-h-full max-w-full object-contain"
            draggable={false}
          />
        )}

        {showUI && (
          <>
            <button
              className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-start pl-4 z-10"
              onClick={(e) => {
                e.stopPropagation()
                goToPage(direction === "ltr" ? currentPage - 1 : currentPage + 1)
              }}
            >
              {((direction === "ltr" && currentPage > 0) || (direction === "rtl" && currentPage < pages.length - 1)) && (
                <div className="rounded-full bg-background/50 p-2 backdrop-blur">
                  <ArrowLeft className="h-5 w-5 text-white" />
                </div>
              )}
            </button>

            <button
              className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-4 z-10"
              onClick={(e) => {
                e.stopPropagation()
                goToPage(direction === "ltr" ? currentPage + 1 : currentPage - 1)
              }}
            >
              {((direction === "ltr" && currentPage < pages.length - 1) || (direction === "rtl" && currentPage > 0)) && (
                <div className="rounded-full bg-background/50 p-2 backdrop-blur">
                  <ArrowRight className="h-5 w-5 text-white" />
                </div>
              )}
            </button>
          </>
        )}
      </div>

      <div className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300",
        showUI ? "opacity-100" : "opacity-0 pointer-events-none",
      )}>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" className="text-white" onClick={goBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <span className="text-sm text-white/70">{currentPage + 1} / {pages.length}</span>
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setMode("vertical")}>
            <Settings2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
        showUI ? "opacity-100" : "opacity-0 pointer-events-none",
      )}>
        <div className="mx-auto flex max-w-lg items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 text-xs shrink-0"
            onClick={() => setDirection(direction === "ltr" ? "rtl" : "ltr")}
          >
            {direction === "ltr" ? "LTR" : "RTL"}
          </Button>
          <input
            type="range"
            min={0}
            max={pages.length - 1}
            value={currentPage}
            onChange={(e) => goToPage(Number(e.target.value))}
            className="w-full accent-primary h-1"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 text-xs shrink-0"
            onClick={() => setMode(mode === "single" ? "vertical" : "single")}
          >
            {mode === "single" ? "Single" : "Scroll"}
          </Button>
        </div>
      </div>
    </div>
  )
}
