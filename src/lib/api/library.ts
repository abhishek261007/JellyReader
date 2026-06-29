import { apiRequest, getImageUrl } from "./client"
import type { LibraryOption, ItemsResult, BaseItemDto } from "@/types/jellyfin"

export async function getLibraries(): Promise<LibraryOption[]> {
  const data = await apiRequest<{ Items: LibraryOption[] }>("/Library/MediaFolders")
  return (data.Items || []).filter(
    (lib) => lib.Type === "books" || lib.Type === "comics" || lib.Type === "other",
  )
}

export async function getLibraryItems(
  libraryId: string,
  params: {
    startIndex?: number
    limit?: number
    sortBy?: string
    sortOrder?: string
    searchTerm?: string
    parentId?: string
  } = {},
): Promise<ItemsResult> {
  const searchParams = new URLSearchParams()
  searchParams.set("ParentId", libraryId)
  searchParams.set("Recursive", "true")
  searchParams.set("IncludeItemTypes", "Book")
  searchParams.set("Fields", "Overview,Path,UserData,BasicSyncInfo,MediaSources")
  searchParams.set("ImageTypeLimit", "1")
  searchParams.set("EnableImageTypes", "Primary,Backdrop,Thumb")
  if (params.startIndex) searchParams.set("StartIndex", String(params.startIndex))
  if (params.limit) searchParams.set("Limit", String(params.limit))
  if (params.sortBy) searchParams.set("SortBy", params.sortBy)
  if (params.sortOrder) searchParams.set("SortOrder", params.sortOrder)
  if (params.searchTerm) searchParams.set("SearchTerm", params.searchTerm)
  if (params.parentId) searchParams.set("ParentId", params.parentId)

  return apiRequest<ItemsResult>(`/Items?${searchParams.toString()}`)
}

export async function getItem(itemId: string): Promise<BaseItemDto> {
  return apiRequest<BaseItemDto>(
    `/Users/me/Items/${itemId}`,
  )
}

export async function getContinueReading(): Promise<BaseItemDto[]> {
  const params = new URLSearchParams()
  params.set("Limit", "20")
  params.set("Recursive", "true")
  params.set("IncludeItemTypes", "Book")
  params.set("SortBy", "DatePlayed")
  params.set("SortOrder", "Descending")
  params.set("Filters", "IsPlayed")
  params.set("Fields", "Overview,Path,UserData,MediaSources")
  const data = await apiRequest<ItemsResult>(`/Items?${params.toString()}`)
  return data.Items || []
}

export async function getResumableItems(): Promise<BaseItemDto[]> {
  const params = new URLSearchParams()
  params.set("Limit", "20")
  params.set("Recursive", "true")
  params.set("IncludeItemTypes", "Book")
  params.set("SortBy", "DatePlayed")
  params.set("SortOrder", "Descending")
  params.set("Filters", "IsResumable")
  params.set("Fields", "Overview,Path,UserData,MediaSources")
  const data = await apiRequest<ItemsResult>(`/Users/me/Items?${params.toString()}`)
  return data.Items || []
}

export async function searchAll(
  query: string,
  limit = 30,
): Promise<ItemsResult> {
  const params = new URLSearchParams()
  params.set("SearchTerm", query)
  params.set("IncludeItemTypes", "Book")
  params.set("Fields", "Overview,Path,UserData,MediaSources")
  params.set("Recursive", "true")
  params.set("Limit", String(limit))
  return apiRequest<ItemsResult>(`/Items?${params.toString()}`)
}

export function getLibraryImageUrl(libraryId: string): string | null {
  return getImageUrl(libraryId, "Thumb")
}

export async function markFavorite(itemId: string, isFavorite: boolean): Promise<void> {
  if (isFavorite) {
    await apiRequest(`/Users/me/FavoriteItems/${itemId}`, { method: "POST" })
  } else {
    await apiRequest(`/Users/me/FavoriteItems/${itemId}`, { method: "DELETE" })
  }
}

export async function getFavoriteItems(): Promise<BaseItemDto[]> {
  const params = new URLSearchParams()
  params.set("Limit", "100")
  params.set("Recursive", "true")
  params.set("IncludeItemTypes", "Book")
  params.set("Fields", "Overview,Path,UserData,MediaSources")
  params.set("Filters", "IsFavorite")
  const data = await apiRequest<ItemsResult>(`/Items?${params.toString()}`)
  return data.Items || []
}
