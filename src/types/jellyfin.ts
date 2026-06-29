export interface AuthenticationRequest {
  Username: string
  Pw: string
}

export interface AuthenticationResult {
  User: JellyfinUser
  AccessToken: string
}

export interface JellyfinUser {
  Id: string
  Name: string
}

export interface BaseItemDto {
  Id: string
  Name: string
  SeriesName?: string
  Type: string
  MediaType: string
  ImageTags?: Record<string, string>
  PrimaryImageTag?: string
  BackdropImageTag?: string
  Overview?: string
  ProductionYear?: number
  CommunityRating?: number
  RunTimeTicks?: number
  SeriesId?: string
  SeriesPrimaryImageTag?: string
  ParentId?: string
  IndexNumber?: number
  ParentIndexNumber?: number
  Path?: string
  MediaSources?: MediaSourceInfo[]
  UserData?: UserItemDataDto
  AlbumArtist?: string
  Artists?: string[]
  Width?: number
  Height?: number
}

export interface MediaSourceInfo {
  Id: string
  Path: string
  MIMEType?: string
}

export interface UserItemDataDto {
  IsFavorite: boolean
  PlayedPercentage?: number
  PlayCount: number
  LastPlayedDate?: string
  PlaybackPositionTicks: number
  key?: string
}

export interface LibraryOption {
  Name: string
  Id: string
  Type: string
  ImagePrimary?: string
  ItemCount?: number
}

export interface ItemsResult {
  Items: BaseItemDto[]
  TotalRecordCount: number
  StartIndex: number
}

export interface ImageUrlOptions {
  width?: number
  height?: number
  quality?: number
  fill?: boolean
}
