import Dexie, { type EntityTable } from "dexie"

export interface CachedComic {
  id: string
  name: string
  seriesName?: string
  coverUrl?: string
  totalPages: number
  pages: Blob[]
  downloadedAt: number
  size: number
}

export interface ReadingProgress {
  comicId: string
  page: number
  totalPages: number
  updatedAt: number
  readingDirection: "ltr" | "rtl"
  readingMode: "single" | "vertical"
}

export interface FavoriteRecord {
  comicId: string
  name: string
  coverUrl?: string
  addedAt: number
}

const db = new Dexie("JellyReader") as Dexie & {
  cachedComics: EntityTable<CachedComic, "id">
  readingProgress: EntityTable<ReadingProgress, "comicId">
  favorites: EntityTable<FavoriteRecord, "comicId">
}

db.version(1).stores({
  cachedComics: "id, name, downloadedAt",
  readingProgress: "comicId, updatedAt",
  favorites: "comicId, addedAt",
})

export { db }
