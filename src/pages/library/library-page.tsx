import { useParams, Link } from "react-router-dom"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getLibraryItems } from "@/lib/api/library"
import { ComicCard } from "@/components/comic/comic-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, Loader2 } from "lucide-react"
import { useEffect, useRef } from "react"

export function LibraryPage() {
  const { libraryId } = useParams<{ libraryId: string }>()
  const loadMoreRef = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["library-items", libraryId],
    queryFn: ({ pageParam = 0 }) =>
      getLibraryItems(libraryId!, { startIndex: pageParam, limit: 50, sortBy: "SortName", sortOrder: "Ascending" }),
    getNextPageParam: (lastPage, allPages) => {
      const total = lastPage.TotalRecordCount
      const loaded = allPages.reduce((acc, p) => acc + p.Items.length, 0)
      return loaded < total ? loaded : undefined
    },
    initialPageParam: 0,
    enabled: !!libraryId,
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      { threshold: 0.1 },
    )
    if (loadMoreRef.current) observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const items = data?.pages.flatMap((p) => p.Items) ?? []

  return (
    <div className="animate-page-enter space-y-4 p-4 pt-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/libraries">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl font-bold">Library</h1>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => (
              <ComicCard key={item.Id} item={item} showProgress />
            ))}
          </div>
          {items.length === 0 && (
            <p className="py-12 text-center text-muted-foreground">No comics found</p>
          )}
          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetchingNextPage && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
          </div>
        </>
      )}
    </div>
  )
}
