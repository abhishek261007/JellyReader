import { useParams, useNavigate, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { getItem, markFavorite } from "@/lib/api/library"
import { getImageUrl, getItemDownloadUrl } from "@/lib/api/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowLeft, BookOpen, Heart, Download } from "lucide-react"
import { cn } from "@/lib/utils"

export function ComicPage() {
  const { comicId } = useParams<{ comicId: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: item, isLoading } = useQuery({
    queryKey: ["item", comicId],
    queryFn: () => getItem(comicId!),
    enabled: !!comicId,
  })

  const favMutation = useMutation({
    mutationFn: () => markFavorite(comicId!, !item?.UserData?.IsFavorite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item", comicId] })
    },
  })

  const coverUrl = item?.PrimaryImageTag
    ? getImageUrl(item.Id, "Primary", { width: 600, quality: 95 })
    : null

  const downloadUrl = comicId ? getItemDownloadUrl(comicId) : null

  const isFavorite = item?.UserData?.IsFavorite ?? false

  return (
    <div className="animate-page-enter min-h-dvh bg-black">
      {isLoading ? (
        <div className="p-4 space-y-4">
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-full" />
        </div>
      ) : item ? (
        <>
          <div className="relative">
            {coverUrl ? (
              <img src={coverUrl} alt={item.Name} className="aspect-[3/4] w-full object-cover opacity-60" />
            ) : (
              <div className="aspect-[3/4] w-full bg-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <Button variant="ghost" size="icon" className="absolute top-4 left-4 text-white" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              <h1 className="text-2xl font-bold text-white drop-shadow-sm">{item.Name}</h1>
              {item.SeriesName && (
                <p className="text-sm text-white/70">{item.SeriesName}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {item.ProductionYear && (
                  <Badge variant="secondary">{item.ProductionYear}</Badge>
                )}
                {item.CommunityRating && (
                  <Badge variant="secondary">★ {item.CommunityRating.toFixed(1)}</Badge>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4 p-4">
            <div className="flex gap-2">
              <Button className="flex-1" onClick={() => navigate(`/reader/${comicId}`)}>
                <BookOpen className="h-4 w-4 mr-2" />
                {item.UserData?.PlayedPercentage && item.UserData.PlayedPercentage > 0
                  ? "Continue Reading"
                  : "Start Reading"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => favMutation.mutate()}
                className={cn(isFavorite && "border-primary text-primary")}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-primary")} />
              </Button>
              {downloadUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={downloadUrl} download>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>

            {item.Overview && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Synopsis</h3>
                <p className="text-sm leading-relaxed">{item.Overview}</p>
              </div>
            )}

            {item.MediaSources?.[0] && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">File</h3>
                <p className="text-xs text-muted-foreground break-all">{item.MediaSources[0].Path}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-muted-foreground">Comic not found</p>
          <Button variant="link" asChild>
            <Link to="/libraries">Back to Library</Link>
          </Button>
        </div>
      )}
    </div>
  )
}
