import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type Theme = "dark" | "light" | "system"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  setTheme: () => {},
  isDark: true,
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem("jellyreader_theme")
    return (stored as Theme) || "dark"
  })

  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    const isDarkTheme =
      theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setIsDark(isDarkTheme)
    root.classList.toggle("dark", isDarkTheme)
    root.style.colorScheme = isDarkTheme ? "dark" : "light"
  }, [theme])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    localStorage.setItem("jellyreader_theme", newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
