import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { searchAll } from "@/lib/api/library"
import { Input } from "@/components/ui/input"
import { ComicCard } from "@/components/comic/comic-card"
import { Search, X, Loader2 } from "lucide-react"
import { useDebounce } from "@/hooks/use-debounce"

export function SearchPage() {
  const [query, setQuery] = useState("")
  const debouncedQuery = useDebounce(query, 300)

  const { data, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => searchAll(debouncedQuery),
    enabled: debouncedQuery.length > 0,
  })

  const items = data?.Items ?? []

  return (
    <div className="animate-page-enter space-y-4 p-4 pt-6">
      <div>
        <h1 className="text-2xl font-bold">Search</h1>
        <p className="text-sm text-muted-foreground">Find comics in your library</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search comics..."
          className="pl-9 pr-9"
          autoFocus
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && debouncedQuery && items.length === 0 && (
        <p className="py-8 text-center text-muted-foreground">No results found</p>
      )}

      {items.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <ComicCard key={item.Id} item={item} />
          ))}
        </div>
      )}

      {!debouncedQuery && (
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Search className="mb-2 h-8 w-8" />
          <p className="text-sm">Type to search your library</p>
        </div>
      )}
    </div>
  )
}
