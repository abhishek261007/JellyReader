import { useQuery } from "@tanstack/react-query"
import { getResumableItems } from "@/lib/api/library"
import { ComicCard } from "@/components/comic/comic-card"
import { Skeleton } from "@/components/ui/skeleton"
import { BookOpen } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export function ContinueReadingPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["resumable"],
    queryFn: getResumableItems,
  })

  const items = data ?? []

  return (
    <div className="animate-page-enter space-y-4 p-4 pt-6">
      <div className="flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h1 className="text-2xl font-bold">Continue Reading</h1>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <ComicCard key={item.Id} item={item} showProgress />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <BookOpen className="mb-2 h-8 w-8" />
          <p className="text-sm mb-4">No comics in progress</p>
          <Button variant="outline" asChild>
            <Link to="/libraries">Browse Library</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
