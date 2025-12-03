// API Client for the CTF Backend

const API_BASE = "https://rahul-samedavar-minetheflagbe.hf.space"
// const API_BASE = "http://localhost:8000"

export const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("ctf_token")
  }
  return null
}

export const setAuthToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ctf_token", token)
  }
}

export const removeAuthToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ctf_token")
  }
}

export const getAdminToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("ctf_admin_token")
  }
  return null
}

export const setAdminToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("ctf_admin_token", token)
  }
}

export const removeAdminToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("ctf_admin_token")
  }
}

type RequestOptions = RequestInit & {
  token?: string
  admin?: boolean
}

export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, admin, headers, ...rest } = options

  const authToken = token || (admin ? getAdminToken() : getAuthToken())

  const config: RequestInit = {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: "Unknown error" }))
    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
  }

  // Handle empty responses (like 204)
  if (response.status === 204) {
    return {} as T
  }

  return response.json()
}

// Types based on API docs
export interface Member {
  id: number
  name: string
  usn: string
  team_id?: number
}

export interface TeamCreateOut{
  team_id: number
  team_name:string
}

export interface Team {
  id: number
  team_name: string
  usn_lead: string
  score: number
  active: boolean
  members?: Member[]
}
export interface Log {
  level: string
  message: string
  data?: string
  timestamp: string
  
}

// "level": l.level, "message": l.message, "data": l.data, "timestamp": l.timestamp})

export interface Problem {
  id: number
  title: string
}

export interface LeaderboardEntry {
  team_name: string
  score: number
  active: boolean
}

// Admin types and endpoints
export interface AdminStats {
  total_teams: number
  total_problems: number
  total_flags: number
  active_teams: number
}

export const adminLogin = async (password: string) => {
  // This would typically be a real endpoint
  // For now we'll simulate it or use a specific endpoint if available
  // Assuming there's an endpoint or we just set the token if password matches a hardcoded one for demo
  // But better to try a real request if possible.
  // Since I don't have the backend code, I'll assume a /admin/login endpoint exists or I'll just set a dummy token for the UI demo.

  // Mocking for the UI demo as requested "all these endpoints are available" but I don't know the specific admin login one.
  // I'll try to hit /admin/login
  try {
    const res = await apiRequest<{ access_token: string }>("/admin/login", {
      method: "POST",
      body: JSON.stringify({ 'username': 'rahul','password':password }),
    })
    setAdminToken(res.access_token)
    return true
  } catch (e) {
    console.error("Admin login failed", e)
    // Fallback for demo if backend isn't actually running this specific endpoint
    // if (password === "admin") {
    //   setAdminToken("demo-admin-token")
    //   return true
    // }
    return false
  }
}
