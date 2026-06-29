import type { ImageUrlOptions } from "@/types/jellyfin"

const CLIENT_NAME = "JellyReader"
const CLIENT_VERSION = "1.0.0"
const DEVICE_NAME = "Browser"
const DEVICE_ID = "jellyreader-web"

let _serverUrl: string | null = null
let _token: string | null = null

export function getServerUrl(): string | null {
  return _serverUrl
}

export function setServerUrl(url: string): void {
  _serverUrl = url.replace(/\/+$/, "")
}

export function getToken(): string | null {
  return _token
}

export function setToken(token: string | null): void {
  _token = token
}

export function getHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "X-Emby-Client": CLIENT_NAME,
    "X-Emby-Client-Version": CLIENT_VERSION,
    "X-Emby-Device-Name": DEVICE_NAME,
    "X-Emby-Device-Id": DEVICE_ID,
  }
  if (_token) {
    headers["X-Emby-Token"] = _token
  }
  return headers
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  if (!_serverUrl) throw new Error("Server URL not set")
  const url = `${_serverUrl}${path}`
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
  if (!response.ok) {
    const text = await response.text().catch(() => "")
    throw new Error(`API error ${response.status}: ${text}`)
  }
  return response.json()
}

export function getImageUrl(
  itemId: string,
  imageType: string = "Primary",
  options: ImageUrlOptions = {},
): string | null {
  if (!_serverUrl) return null
  const params = new URLSearchParams()
  if (options.width) params.set("width", String(options.width))
  if (options.height) params.set("height", String(options.height))
  if (options.quality) params.set("quality", String(options.quality))
  if (options.fill) params.set("fill", "true")
  const query = params.toString()
  return `${_serverUrl}/Items/${itemId}/Images/${imageType}${query ? `?${query}` : ""}`
}

export function getItemDownloadUrl(itemId: string): string | null {
  if (!_serverUrl) return null
  return `${_serverUrl}/Items/${itemId}/Download`
}

export function logout(): void {
  _token = null
  localStorage.removeItem("jellyreader_server")
  localStorage.removeItem("jellyreader_token")
  localStorage.removeItem("jellyreader_user")
}
