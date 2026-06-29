import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { setServerUrl, setToken, logout as apiLogout } from "@/lib/api/client"
import type { JellyfinUser } from "@/types/jellyfin"

interface JellyfinContextType {
  serverUrl: string | null
  token: string | null
  user: JellyfinUser | null
  isAuthenticated: boolean
  login: (serverUrl: string, token: string, user: JellyfinUser) => void
  logout: () => void
}

const JellyfinContext = createContext<JellyfinContextType>({
  serverUrl: null,
  token: null,
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
})

export function JellyfinProvider({ children }: { children: ReactNode }) {
  const [serverUrl, setServerUrlState] = useState<string | null>(null)
  const [token, setTokenState] = useState<string | null>(null)
  const [user, setUser] = useState<JellyfinUser | null>(null)

  useEffect(() => {
    const savedServer = localStorage.getItem("jellyreader_server")
    const savedToken = localStorage.getItem("jellyreader_token")
    const savedUser = localStorage.getItem("jellyreader_user")
    if (savedServer && savedToken && savedUser) {
      setServerUrl(savedServer)
      setToken(savedToken)
      setServerUrlState(savedServer)
      setTokenState(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (srv: string, tkn: string, usr: JellyfinUser) => {
    setServerUrl(srv)
    setToken(tkn)
    setServerUrlState(srv)
    setTokenState(tkn)
    setUser(usr)
    localStorage.setItem("jellyreader_server", srv)
    localStorage.setItem("jellyreader_token", tkn)
    localStorage.setItem("jellyreader_user", JSON.stringify(usr))
  }

  const logout = () => {
    apiLogout()
    setServerUrlState(null)
    setTokenState(null)
    setUser(null)
  }

  return (
    <JellyfinContext.Provider
      value={{
        serverUrl,
        token,
        user,
        isAuthenticated: !!token && !!serverUrl,
        login,
        logout,
      }}
    >
      {children}
    </JellyfinContext.Provider>
  )
}

export function useJellyfin() {
  return useContext(JellyfinContext)
}
