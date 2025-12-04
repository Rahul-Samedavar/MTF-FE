"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MCButton, MCCard, MCInput, MCLabel } from "@/components/minecraft/ui"
import { ProceduralBackground } from "@/components/minecraft/background"
import { MCAlert } from "@/components/minecraft/alert"
import { apiRequest, setAuthToken } from "@/lib/api"
import { toast } from "sonner"
import { MCLayout } from "@/components/minecraft/layout"

export default function HomePage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Login state
  const [loginUSN, setLoginUSN] = useState("")
  const [loginPassword, setLoginPassword] = useState("")

  // Register state
  const [name, setName] = useState("")
  const [usn, setUSN] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append("username", loginUSN)
      formData.append("password", loginPassword)

      // const response = await fetch("http://localhost:8000/member/token", {
      const response = await fetch("https://rahul-samedavar-minetheflagbe.hf.space/member/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
        credentials: "include"
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      setAuthToken(data.access_token)
      toast.success("Login successful!")
      router.push("/team")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await apiRequest("/member/register", {
        method: "POST",
        body: JSON.stringify({ name, usn, password }),
      })

      toast.success("Registration successful! Please login.")
      setIsLogin(true)
      setLoginUSN(usn)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
          <MCLayout>
    <div className="min-h-screen flex items-center justify-center p-4 relative">
  

      <ProceduralBackground />

      <div className="w-full max-w-md z-10">
        <div className="text-center mb-8 animate-bounce">
          <div className="inline-block">
            <div className="w-20 h-20 bg-mc-green border-4 border-black mx-auto mb-4 shadow-lg" />
            <img src="logo.png" alt="Mine The Flag" />
            {/* <h1 className="text-4xl font-bold text-white text-shadow-mc tracking-widest">
              <span className="text-mc-green">MINE</span>THE<span className="text-mc-gold">FLAG</span>
            </h1> */}
            {/* <p className="text-yellow-400 text-xs mt-2 tracking-wider">HackerRank X Codechef Club of GIT</p>
            <p className="text-stone-400 text-xs mt-1 tracking-wider">CODING CONTEST</p> */}
          </div>
        </div>

        <MCCard title={isLogin ? "LOGIN" : "REGISTER"}>
          {error && <MCAlert type="error" message={error} className="mb-4" />}

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <MCLabel>USN</MCLabel>
                <MCInput
                  type="text"
                  value={loginUSN}
                  onChange={(e) => setLoginUSN(e.target.value)}
                  placeholder="Enter your USN"
                  required
                />
              </div>

              <div>
                <MCLabel>Password</MCLabel>
                <MCInput
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Enter password"
                  required
                />
              </div>

              <MCButton type="submit" variant="success" className="w-full" disabled={loading}>
                {loading ? "LOADING..." : "LOGIN"}
              </MCButton>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <MCLabel>Name</MCLabel>
                <MCInput
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <MCLabel>USN</MCLabel>
                <MCInput
                  type="text"
                  value={usn}
                  onChange={(e) => setUSN(e.target.value)}
                  placeholder="Enter your USN"
                  required
                />
              </div>

              <div>
                <MCLabel>Password</MCLabel>
                <MCInput
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create password"
                  required
                />
              </div>

              <MCButton type="submit" variant="success" className="w-full" disabled={loading}>
                {loading ? "LOADING..." : "REGISTER"}
              </MCButton>
            </form>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError("")
              }}
              className="text-stone-400 hover:text-mc-green text-xs underline transition-colors"
            >
              {isLogin ? "Need an account? Register" : "Have an account? Login"}
            </button>
          </div>
        </MCCard>

        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/admin")}
            className="text-stone-600 hover:text-stone-400 text-xs transition-colors"
          >
            Admin Access
          </button>
        </div>
      </div>
    </div>
      </MCLayout>
  )
}
