"use client"

import { useEffect, useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCCard } from "@/components/minecraft/ui"
import { apiRequest, type LeaderboardEntry } from "@/lib/api"
import { Trophy, Medal, Award } from "lucide-react"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadLeaderboard()

    // Setup WebSocket for real-time updates
    // const ws = new WebSocket("ws://localhost:8000/ws/leaderboard")
    const ws = new WebSocket("ws://rahul-samedavar-minetheflagbe.hf.space/ws/leaderboard")

    ws.onopen = () => {
      console.log("[v0] WebSocket connected")
      ws.send("ping")
    }

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      console.log("[v0] WebSocket message:", data)

      if (data.type === "leaderboard") {
        setLeaderboard(data.data)
      } else if (data.type === "submission") {
        // Reload leaderboard on new submission
        loadLeaderboard()
      }
    }

    ws.onerror = (error) => {
      console.error("[v0] WebSocket error:", error)
    }

    return () => {
      ws.close()
    }
  }, [])

  const loadLeaderboard = async () => {
    try {
      const data = await apiRequest<LeaderboardEntry[]>("/leaderboard")
      setLeaderboard(data)
    } catch (error) {
      console.error("Failed to load leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    if (index === 0) return <Trophy className="w-8 h-8 text-yellow-500" />
    if (index === 1) return <Medal className="w-8 h-8 text-gray-400" />
    if (index === 2) return <Award className="w-8 h-8 text-amber-700" />
    return null
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
          <Trophy className="w-12 h-12 text-yellow-500" />
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">LEADERBOARD</h1>
            <p className="text-stone-400 text-sm mt-1">Top teams competing for glory</p>
          </div>
        </div>

        <MCCard title="TOP TEAMS">
          {leaderboard.length === 0 ? (
            <div className="text-center py-12 text-stone-500">
              <p>No teams have scored yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.team_name}
                  className={`flex items-center gap-4 p-4 border-4 transition-all ${
                    index === 0
                      ? "bg-yellow-900/20 border-yellow-600"
                      : index === 1
                        ? "bg-gray-800/20 border-gray-600"
                        : index === 2
                          ? "bg-amber-900/20 border-amber-700"
                          : "bg-stone-900 border-stone-700"
                  }`}
                >
                  <div className="flex items-center justify-center w-12">
                    {getRankIcon(index) || <span className="text-2xl font-bold text-stone-500">#{index + 1}</span>}
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white font-bold text-lg">{entry.team_name}</h3>
                    <p className={`text-xs ${entry.active ? "text-green-500" : "text-red-500"}`}>
                      {entry.active ? "ACTIVE" : "INACTIVE"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl font-bold text-mc-green">{entry.score}</p>
                    <p className="text-xs text-stone-500">POINTS</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </MCCard>
      </div>
    </MCLayout>
  )
}
