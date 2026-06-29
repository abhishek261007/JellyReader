import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryProvider } from "@/providers/query"
import { ThemeProvider } from "@/providers/theme"
import { JellyfinProvider, useJellyfin } from "@/providers/jellyfin"
import { AppShell } from "@/components/layout/app-shell"
import { LoginPage } from "@/pages/login/login-page"
import { LibrariesPage } from "@/pages/libraries/libraries-page"
import { LibraryPage } from "@/pages/library/library-page"
import { ComicPage } from "@/pages/comic/comic-page"
import { ReaderPage } from "@/pages/reader/reader-page"
import { SearchPage } from "@/pages/search/search-page"
import { ContinueReadingPage } from "@/pages/reader/continue-reading-page"
import { SettingsPage } from "@/pages/settings/settings-page"
import type { ReactNode } from "react"

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useJellyfin()
  if (!isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useJellyfin()
  if (isAuthenticated) return <Navigate to="/libraries" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route element={<AppShell />}>
        <Route
          path="/libraries"
          element={
            <ProtectedRoute>
              <LibrariesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library/:libraryId"
          element={
            <ProtectedRoute>
              <LibraryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/comic/:comicId"
          element={
            <ProtectedRoute>
              <ComicPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/continue-reading"
          element={
            <ProtectedRoute>
              <ContinueReadingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route
        path="/reader/:comicId"
        element={
          <ProtectedRoute>
            <ReaderPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <QueryProvider>
          <JellyfinProvider>
            <AppRoutes />
          </JellyfinProvider>
        </QueryProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
