"use client"

import { useEffect, useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCCard } from "@/components/minecraft/ui"
import { apiRequest, type Team } from "@/lib/api"
import { Users, Crown, Sword, Shield, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

export default function LobbyPage() {
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeams()

    const interval = setInterval(() => {
      loadTeams()
    }, 60000)

    return () => clearInterval(interval)
  }, [])


  const loadTeams = async () => {
    try {
      const data = await apiRequest<Team[]>("/teams")
      setTeams(data)
    } catch (error) {
      console.error("Failed to load teams:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTeamIcon = (index: number) => {
    const icons = [Crown, Sword, Shield, Zap, Users]
    const Icon = icons[index % icons.length]
    return Icon
  }

  const getTeamColor = (index: number) => {
    const colors = [
      "from-yellow-600 to-yellow-800 border-yellow-500",
      "from-red-600 to-red-800 border-red-500",
      "from-blue-600 to-blue-800 border-blue-500",
      "from-green-600 to-green-800 border-green-500",
      "from-purple-600 to-purple-800 border-purple-500",
      "from-orange-600 to-orange-800 border-orange-500",
      "from-cyan-600 to-cyan-800 border-cyan-500",
      "from-pink-600 to-pink-800 border-pink-500",
    ]
    return colors[index % colors.length]
  }

  if (loading) {
    return (
      <MCLayout>
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 bg-mc-green border-4 border-black animate-bounce" />
        </div>
      </MCLayout>
    )
  }

  return (
    <MCLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Users className="w-12 h-12 text-mc-green" />
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">TEAM LOBBY</h1>
            <p className="text-stone-400 text-sm mt-1">All teams competing in the arena</p>
          </div>
        </div>

        {teams.length === 0 ? (
          <MCCard title="NO TEAMS YET">
            <div className="text-center py-12 text-stone-500">
              <Users className="w-24 h-24 mx-auto mb-4 opacity-50" />
              <p>No teams have registered yet</p>
            </div>
          </MCCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team, index) => {
              const Icon = getTeamIcon(index)
              const colorClass = getTeamColor(index)

              return (
                <div
                  key={team.id}
                  className={cn(
                    "relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2",
                    "animate-float",
                  )}
                  style={{
                    animationDelay: `${index * 0.1}s`,
                  }}
                >
                  {/* Team Card */}
                  <div
                    className={cn(
                      "relative bg-gradient-to-br border-4 border-black p-6 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]",
                      "group-hover:shadow-[12px_12px_0_0_rgba(0,0,0,0.5)] transition-all",
                      colorClass,
                    )}
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    {/* Status Badge */}
                    <div className="absolute -top-3 -right-3 z-10">
                      <div
                        className={cn(
                          "px-3 py-1 border-2 border-black text-xs font-bold",
                          team.active ? "bg-green-500 text-white" : "bg-red-500 text-white",
                        )}
                      >
                        {team.active ? "ACTIVE" : "INACTIVE"}
                      </div>
                    </div>

                    {/* Team Icon */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        <div className="w-20 h-20 bg-black/30 border-4 border-black flex items-center justify-center group-hover:animate-bounce">
                          <Icon className="w-12 h-12 text-white" />
                        </div>
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Team Name */}
                    <h3 className="text-center text-white font-bold text-lg mb-2 text-shadow-mc break-words">
                      {team.team_name}
                    </h3>

                    {/* Score Display */}
                    <div className="bg-black/40 border-2 border-black p-3 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-300 text-xs">SCORE</span>
                        <span className="text-2xl font-bold text-yellow-400">{team.score}</span>
                      </div>
                    </div>

                    {/* Team Stats */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-black/30 border-2 border-black p-2 text-center">
                        <div className="text-stone-400">RANK</div>
                        <div className="text-white font-bold">#{index + 1}</div>
                      </div>
                      <div className="bg-black/30 border-2 border-black p-2 text-center">
                        <div className="text-stone-400">TEAM ID</div>
                        <div className="text-white font-bold">#{team.id}</div>
                      </div>
                    </div>

                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-white/30" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-white/30" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-white/30" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-white/30" />
                  </div>

                  {/* Hover shadow effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              )
            })}
          </div>
        )}

        {/* Stats Summary */}
        <MCCard title="LOBBY STATS">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-stone-900 border-2 border-stone-700 p-4 text-center">
              <div className="text-3xl font-bold text-mc-green">{teams.length}</div>
              <div className="text-stone-400 text-xs mt-1">TOTAL TEAMS</div>
            </div>
            <div className="bg-stone-900 border-2 border-stone-700 p-4 text-center">
              <div className="text-3xl font-bold text-green-500">{teams.filter((t) => t.active).length}</div>
              <div className="text-stone-400 text-xs mt-1">ACTIVE</div>
            </div>
            <div className="bg-stone-900 border-2 border-stone-700 p-4 text-center">
              <div className="text-3xl font-bold text-yellow-500">{teams.reduce((sum, t) => sum + t.score, 0)}</div>
              <div className="text-stone-400 text-xs mt-1">TOTAL POINTS</div>
            </div>
            <div className="bg-stone-900 border-2 border-stone-700 p-4 text-center">
              <div className="text-3xl font-bold text-blue-500">
                {teams.length > 0 ? Math.max(...teams.map((t) => t.score)) : 0}
              </div>
              <div className="text-stone-400 text-xs mt-1">HIGH SCORE</div>
            </div>
          </div>
        </MCCard>
      </div>
    </MCLayout>
  )
}
