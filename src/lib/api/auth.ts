import { apiRequest, setToken, setServerUrl } from "./client"
import type { AuthenticationResult } from "@/types/jellyfin"

export async function authenticate(
  serverUrl: string,
  username: string,
  password: string,
): Promise<AuthenticationResult> {
  setServerUrl(serverUrl)
  const result = await apiRequest<AuthenticationResult>(
    "/Users/AuthenticateByName",
    {
      method: "POST",
      body: JSON.stringify({
        Username: username,
        Pw: password,
      }),
    },
  )
  setToken(result.AccessToken)
  return result
}
