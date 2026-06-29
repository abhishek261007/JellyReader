import { NavLink } from "react-router-dom"
import { Library, Search, BookOpen, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { to: "/libraries", label: "Library", icon: Library },
  { to: "/search", label: "Search", icon: Search },
  { to: "/continue-reading", label: "Reading", icon: BookOpen },
  { to: "/settings", label: "Settings", icon: Settings },
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-around px-2">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 text-xs font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )
            }
          >
            <Icon className="h-5 w-5" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
