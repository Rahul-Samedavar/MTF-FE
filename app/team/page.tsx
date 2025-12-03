"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCButton, MCCard, MCInput, MCLabel } from "@/components/minecraft/ui"
import { apiRequest, getAuthToken, type Member, type Team, type TeamCreateOut } from "@/lib/api"
import { toast } from "sonner"
import { Users, Crown, UserPlus } from "lucide-react"

export default function TeamPage() {
  const [loading, setLoading] = useState(true)
  const [currentMember, setCurrentMember] = useState<Member | null>(null)
  const [team, setTeam] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<Member[]>([])
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showJoinTeam, setShowJoinTeam] = useState(false)

  // Form states
  const [teamName, setTeamName] = useState("")
  const [joinTeamName, setJoinTeamName] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const token = getAuthToken()
      if (!token) return

      // Decode token to get member info
      const payload = JSON.parse(atob(token.split(".")[1]))
      const memberUSN = payload.sub

      // Get member details
      const members: Member[] = await apiRequest("/members")
      const member = members.find((m) => m.usn === memberUSN)
      setCurrentMember(member || null)

      // If member has a team, load team details
      if (member?.team_id) {
        const teamData: Team = await apiRequest(`/team/${member.team_id}`)
        setTeam(teamData)

        const membersData: Member[] = await apiRequest(`/team/${member.team_id}/members`)
        setTeamMembers(membersData)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentMember) return

    try {
      let res: TeamCreateOut = await apiRequest("/team/create", {
        method: "POST",
        body: JSON.stringify({
          team_name: teamName,
          usn_lead: currentMember.usn,
        }),
      })

      if (res.team_id == -1){
        toast.error("Team name taken. choose different team or join the other one.");
        return;
      }



      toast.success("Team created successfully!")
      setShowCreateTeam(false)
      setTeamName("")
      loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create team")
    }
  }

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentMember) return

    try {
      await apiRequest("/team/join", {
        method: "POST",
        body: JSON.stringify({
          team_name: joinTeamName,
          usn: currentMember.usn,
        }),
      })

      toast.success("Joined team successfully!")
      setShowJoinTeam(false)
      setJoinTeamName("")
      loadData()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to join team")
    }
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
            <h1 className="text-3xl font-bold text-white text-shadow-mc">TEAM MANAGEMENT</h1>
            <p className="text-stone-400 text-sm mt-1">Create or join a team to compete</p>
          </div>
        </div>

        {currentMember && !team && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Create Team */}
            <MCCard title="CREATE TEAM">
              {!showCreateTeam ? (
                <div className="text-center py-8">
                  <Crown className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                  <p className="text-stone-400 text-sm mb-4">Start your own team</p>
                  <MCButton variant="success" onClick={() => setShowCreateTeam(true)}>
                    CREATE TEAM
                  </MCButton>
                </div>
              ) : (
                <form onSubmit={handleCreateTeam} className="space-y-4">
                  <div>
                    <MCLabel>Team Name</MCLabel>
                    <MCInput
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <MCButton type="submit" variant="success" className="flex-1">
                      CREATE
                    </MCButton>
                    <MCButton type="button" variant="danger" onClick={() => setShowCreateTeam(false)}>
                      CANCEL
                    </MCButton>
                  </div>
                </form>
              )}
            </MCCard>

            {/* Join Team */}
            <MCCard title="JOIN TEAM">
              {!showJoinTeam ? (
                <div className="text-center py-8">
                  <UserPlus className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                  <p className="text-stone-400 text-sm mb-4">Join an existing team</p>
                  <MCButton variant="default" onClick={() => setShowJoinTeam(true)}>
                    JOIN TEAM
                  </MCButton>
                </div>
              ) : (
                <form onSubmit={handleJoinTeam} className="space-y-4">
                  <div>
                    <MCLabel>Team Name</MCLabel>
                    <MCInput
                      value={joinTeamName}
                      onChange={(e) => setJoinTeamName(e.target.value)}
                      placeholder="Enter team name"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <MCButton type="submit" variant="success" className="flex-1">
                      JOIN
                    </MCButton>
                    <MCButton type="button" variant="danger" onClick={() => setShowJoinTeam(false)}>
                      CANCEL
                    </MCButton>
                  </div>
                </form>
              )}
            </MCCard>
          </div>
        )}

        {team && (
          <MCCard title={`TEAM: ${team.team_name}`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-stone-900 border-2 border-stone-700">
                <div>
                  <p className="text-stone-400 text-xs">SCORE</p>
                  <p className="text-3xl font-bold text-mc-green">{team.score}</p>
                </div>
                <div>
                  <p className="text-stone-400 text-xs">STATUS</p>
                  <p className={`text-sm font-bold ${team.active ? "text-green-500" : "text-red-500"}`}>
                    {team.active ? "ACTIVE" : "INACTIVE"}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-stone-400 text-xs mb-3 uppercase">Team Members ({teamMembers.length}/3)</h3>
                <div className="space-y-2">
                  {teamMembers.map((member) => (
                    <div key={member.id} className="flex items-center gap-3 p-3 bg-stone-900 border-2 border-stone-700">
                      <div className="w-8 h-8 bg-mc-stone border-2 border-black" />
                      <div className="flex-1">
                        <p className="text-white font-bold text-sm">{member.name}</p>
                        <p className="text-stone-500 text-xs">{member.usn}</p>
                      </div>
                      {member.usn === team.usn_lead && <Crown className="w-5 h-5 text-yellow-500" />}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </MCCard>
        )}
      </div>
    </MCLayout>
  )
}
