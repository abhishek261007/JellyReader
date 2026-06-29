import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { setServerUrl, setToken, setUserId, logout as apiLogout } from "@/lib/api/client"
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
  const [serverUrl, setServerUrlState] = useState<string | null>(() => {
    const val = localStorage.getItem("jellyreader_server")
    return val ? val.replace(/\/+$/, "") : null
  })
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem("jellyreader_token"))
  const [user, setUser] = useState<JellyfinUser | null>(() => {
    try {
      const val = localStorage.getItem("jellyreader_user")
      return val ? JSON.parse(val) : null
    } catch { return null }
  })

  useEffect(() => {
    const savedServer = localStorage.getItem("jellyreader_server")
    const savedToken = localStorage.getItem("jellyreader_token")
    const savedUser = localStorage.getItem("jellyreader_user")
    if (savedServer && savedToken && savedUser) {
      const cleaned = savedServer.replace(/\/+$/, "")
      setServerUrl(cleaned)
      setToken(savedToken)
      setUserId(JSON.parse(savedUser).Id)
    }
  }, [])

  const login = (srv: string, tkn: string, usr: JellyfinUser) => {
    setServerUrl(srv)
    setToken(tkn)
    setUserId(usr.Id)
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
