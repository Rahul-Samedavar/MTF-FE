"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCCard, MCButton, MCInput, MCAlert } from "@/components/minecraft/ui"
import { apiRequest, getAdminToken, adminLogin, type Team, type Log, type Problem } from "@/lib/api"
import { Terminal, Users, Flag, Settings, Trash2, RefreshCw, Shield } from "lucide-react"
import { stat } from "fs"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [activeTab, setActiveTab] = useState<"dashboard" | "teams" | "problems">("dashboard")
  const [teams, setTeams] = useState<Team[]>([])
  const [logs, setLogs] = useState<Log[]>([])
  const [problems, setProblems] = useState<Problem[]>([])
  const [stats, setStats] = useState({ teams: 0, flags: 0, problems: 0 })
  useEffect(() => {
    const token = getAdminToken()
    if (token) {
      setIsAuthenticated(true)
      fetchData()
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await adminLogin(password)
      setIsAuthenticated(true)
      fetchData()
    } catch (err) {
      setError("ACCESS DENIED: Invalid credentials")
    } finally {
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      const teamsData = await apiRequest<Team[]>("/admin/teams", { admin: true })
      const logs = await apiRequest<Log[]>("/admin/logs", { admin: true })
      // const teamsData = await apiRequest<Team[]>("/admin/teams", { admin: true })
      setTeams(teamsData)
      setLogs(logs)
  
      setStats({
        teams: teamsData.length,
        flags: teamsData.reduce((acc, t) => acc + t.score / 100, 0), // Rough estimate
        problems: 5, // Hardcoded for now
      })
    } catch (err) {
      console.error("Failed to fetch admin data", err)
    }
  }

  const handleDeleteTeam = async (teamId: number) => {
    if (!confirm("Are you sure you want to ban this player?")) return
    try {
      // await apiRequest(`/admin/teams/${teamId}`, { method: "DELETE", admin: true })
      setTeams(teams.filter((t) => t.id !== teamId))
    } catch (err) {
      alert("Failed to delete team")
    }
  }

  if (!isAuthenticated) {
    return (
      <MCLayout>
        <div className="max-w-md mx-auto mt-20">
          <MCCard title="OP ACCESS REQUIRED" className="border-purple-900 bg-stone-900">
            <div className="flex justify-center mb-6">
              <Shield className="w-16 h-16 text-purple-500 animate-pulse" />
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <MCInput
                label="Command Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
              />
              {error && <MCAlert type="error">{error}</MCAlert>}
              <MCButton
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-600 border-purple-900"
                disabled={loading}
              >
                {loading ? "AUTHENTICATING..." : "ACCESS CONSOLE"}
              </MCButton>
            </form>
          </MCCard>
        </div>
      </MCLayout>
    )
  }

  return (
    <MCLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-minecraft text-white text-shadow-mc flex items-center gap-3">
            <Terminal className="w-8 h-8 text-purple-400" />
            MINETHEFLAG CONSOLE
          </h1>
          <div className="flex gap-2">
            <MCButton
              variant={activeTab === "dashboard" ? "default" : "stone"}
              onClick={() => setActiveTab("dashboard")}
              className="text-sm"
            >
              Dashboard
            </MCButton>
            <MCButton
              variant={activeTab === "teams" ? "default" : "stone"}
              onClick={() => setActiveTab("teams")}
              className="text-sm"
            >
              Players
            </MCButton>
            <MCButton
              variant={activeTab === "problems" ? "default" : "stone"}
              onClick={() => setActiveTab("problems")}
              className="text-sm"
            >
              Quests
            </MCButton>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MCCard className="bg-blue-900/50 border-blue-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-800 border-2 border-black">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-blue-200 font-minecraft text-sm">TOTAL TEAMS</p>
                  <p className="text-3xl text-white font-minecraft text-shadow-mc">{stats.teams}</p>
                </div>
              </div>
            </MCCard>
            <MCCard className="bg-green-900/50 border-green-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-800 border-2 border-black">
                  <Flag className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-green-200 font-minecraft text-sm">FLAGS CAPTURED</p>
                  <p className="text-3xl text-white font-minecraft text-shadow-mc">{stats.flags}</p>
                </div>
              </div>
            </MCCard>
            <MCCard className="bg-purple-900/50 border-purple-800">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-800 border-2 border-black">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div>
                  <p className="text-purple-200 font-minecraft text-sm">ACTIVE QUESTS</p>
                  <p className="text-3xl text-white font-minecraft text-shadow-mc">{stats.problems}</p>
                </div>
              </div>
            </MCCard>

            <div className="col-span-full">
              <MCCard title="SYSTEM LOGS" className="bg-black/80 font-mono text-sm h-64 overflow-y-auto">
                <div className="space-y-1 text-green-400">
                  {logs.map((log: Log, id) => (
                    <p key={id} style={{color: log.level == "error" ? 'red': "green"}}>[{log.timestamp}] {log.message}</p>
                  ))}
                  <p className="animate-pulse">_</p>
                </div>
              </MCCard>
            </div>
          </div>
        )}

        {activeTab === "teams" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <MCButton onClick={fetchData} variant="stone" className="text-xs">
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </MCButton>
            </div>
            <div className="grid gap-4">
              {teams.map((team) => (
                <div key={team.id} className="bg-stone-800 border-2 border-black p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-stone-700 border-2 border-black flex items-center justify-center">
                      <span className="font-minecraft text-xl text-stone-400">#</span>
                    </div>
                    <div>
                      <h3 className="text-white font-minecraft">{team.team_name}</h3>
                      <p className="text-stone-400 text-xs">
                        Leader: {team.usn_lead} | Score: {team.score}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-2 py-1 text-xs border-2 border-black ${team.active ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}
                    >
                      {team.active ? "ONLINE" : "OFFLINE"}
                    </div>
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="p-2 bg-red-600 border-2 border-black hover:bg-red-500 text-white"
                      title="Ban Player"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {teams.length === 0 && (
                <div className="text-center py-10 text-stone-500 font-minecraft">NO PLAYERS FOUND</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "problems" && (
          <div className="text-center py-20">
            <p className="text-stone-400 font-minecraft mb-4">QUEST MANAGEMENT COMING SOON</p>
            <MCButton variant="stone" disabled>
              CREATE NEW QUEST
            </MCButton>
          </div>
        )}
      </div>
    </MCLayout>
  )
}
