import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTicks(ticks: number): string {
  const totalMinutes = Math.floor(ticks / 600000000)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  if (hours > 0) return `${hours}h ${minutes}m`
  return `${minutes}m`
}

export function formatPlaybackPosition(ticks: number): string {
  const totalSeconds = Math.floor(ticks / 10000000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function getProgressPercent(ticks: number, totalTicks: number): number {
  if (!totalTicks) return 0
  return Math.min(100, Math.round((ticks / totalTicks) * 100))
}
