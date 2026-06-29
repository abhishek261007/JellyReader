import { useJellyfin } from "@/providers/jellyfin"
import { useTheme } from "@/providers/theme"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { LogOut, Moon, Sun, Monitor, Trash2 } from "lucide-react"
import { db } from "@/lib/db/db"
import { useState } from "react"

export function SettingsPage() {
  const { user, serverUrl, logout } = useJellyfin()
  const { theme, setTheme } = useTheme()
  const navigate = useNavigate()
  const [cleared, setCleared] = useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleClearCache = async () => {
    await db.cachedComics.clear()
    await db.readingProgress.clear()
    setCleared(true)
    setTimeout(() => setCleared(false), 2000)
  }

  return (
    <div className="animate-page-enter space-y-6 p-4 pt-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">App preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user?.Name}</p>
              <p className="text-xs text-muted-foreground break-all">{serverUrl}</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Appearance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={theme === "dark" ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setTheme("dark")}
          >
            <Moon className="h-4 w-4 mr-2" />
            Dark
          </Button>
          <Button
            variant={theme === "light" ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setTheme("light")}
          >
            <Sun className="h-4 w-4 mr-2" />
            Light
          </Button>
          <Button
            variant={theme === "system" ? "default" : "outline"}
            size="sm"
            className="w-full justify-start"
            onClick={() => setTheme("system")}
          >
            <Monitor className="h-4 w-4 mr-2" />
            System
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Storage</CardTitle>
          <CardDescription>Manage offline data</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={handleClearCache}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {cleared ? "Cache cleared" : "Clear local cache"}
          </Button>
        </CardContent>
      </Card>

      <div className="text-center text-xs text-muted-foreground">
        JellyReader v1.0.0
      </div>
    </div>
  )
}
