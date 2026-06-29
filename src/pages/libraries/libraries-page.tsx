import { useQuery } from "@tanstack/react-query"
import { getLibraries, getResumableItems } from "@/lib/api/library"
import { getImageUrl } from "@/lib/api/client"
import { Link } from "react-router-dom"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { ComicCard } from "@/components/comic/comic-card"
import { Library, BookOpen } from "lucide-react"

export function LibrariesPage() {
  const { data: libraries, isLoading: libsLoading, error: libsError } = useQuery({
    queryKey: ["libraries"],
    queryFn: getLibraries,
  })

  const { data: resumable } = useQuery({
    queryKey: ["resumable"],
    queryFn: getResumableItems,
  })

  return (
    <div className="animate-page-enter space-y-6 p-4 pt-6">
      <div>
        <h1 className="text-2xl font-bold">Library</h1>
        <p className="text-sm text-muted-foreground">Browse your comics</p>
      </div>

      {resumable && resumable.length > 0 && (
        <section>
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="text-lg font-semibold">Continue Reading</h2>
          </div>
          <ScrollArea className="-mx-4">
            <div className="flex gap-3 px-4 pb-2">
              {resumable.slice(0, 10).map((item) => (
                <div key={item.Id} className="w-32 shrink-0">
                  <ComicCard item={item} showProgress size="sm" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Library className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-semibold">Media Libraries</h2>
        </div>
        {libsLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {libraries?.map((lib) => {
              const coverUrl = getImageUrl(lib.Id, "Thumb", { width: 400, quality: 90 })
              return (
                <Link
                  key={lib.Id}
                  to={`/library/${lib.Id}`}
                  className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all hover:border-primary/50"
                >
                  {coverUrl ? (
                    <img
                      src={coverUrl}
                      alt={lib.Name}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex aspect-[4/3] items-center justify-center bg-muted">
                      <Library className="h-8 w-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-semibold text-white drop-shadow-sm">{lib.Name}</h3>
                    {lib.ItemCount !== undefined && (
                      <p className="text-xs text-white/70">{lib.ItemCount} items</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
