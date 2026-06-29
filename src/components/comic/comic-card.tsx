import { Link } from "react-router-dom"
import { getImageUrl } from "@/lib/api/client"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BaseItemDto } from "@/types/jellyfin"

interface ComicCardProps {
  item: BaseItemDto
  showProgress?: boolean
  size?: "sm" | "md" | "lg"
}

export function ComicCard({ item, showProgress, size = "md" }: ComicCardProps) {
  const coverUrl = item.PrimaryImageTag
    ? getImageUrl(item.Id, "Primary", { width: size === "lg" ? 400 : 300, quality: 90 })
    : null

  const progress = item.UserData?.PlayedPercentage

  return (
    <Link
      to={`/comic/${item.Id}`}
      className="group block space-y-1.5"
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg bg-muted",
          size === "sm" && "aspect-[3/4]",
          size === "md" && "aspect-[3/4]",
          size === "lg" && "aspect-[3/4]",
        )}
      >
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={item.Name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm p-2 text-center">
            {item.Name}
          </div>
        )}
        {item.UserData?.IsFavorite && (
          <div className="absolute top-1.5 right-1.5">
            <Heart className="h-4 w-4 fill-primary text-primary" />
          </div>
        )}
        {showProgress && progress !== undefined && progress > 0 && progress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/50">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
      <div className="space-y-0.5 px-0.5">
        <p className="line-clamp-1 text-sm font-medium leading-tight">{item.Name}</p>
        {item.SeriesName && (
          <p className="line-clamp-1 text-xs text-muted-foreground">{item.SeriesName}</p>
        )}
      </div>
    </Link>
  )
}
