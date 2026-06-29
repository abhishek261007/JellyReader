import { Outlet } from "react-router-dom"
import { BottomNav } from "./bottom-nav"
import { useJellyfin } from "@/providers/jellyfin"

export function AppShell() {
  const { isAuthenticated } = useJellyfin()

  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      {isAuthenticated && <BottomNav />}
    </div>
  )
}
