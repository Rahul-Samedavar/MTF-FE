"use client"

import type React from "react"

import { useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCButton, MCCard, MCInput, MCLabel, MCCodeBlock, MCImage } from "@/components/minecraft/ui"
import { MCAlert } from "@/components/minecraft/alert"
import { MiningAnimation } from "@/components/minecraft/mining-animation"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
import { Flag } from "lucide-react"

export default function ProblemBiomeStretchPage() {
  const [flag, setFlag] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; reason?: string } | null>(null)
  const [miningState, setMiningState] = useState<"idle" | "mining" | "success" | "failure">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)
    setMiningState("mining")

    try {
      const response = await apiRequest<{ ok: boolean; reason?: string }>("/submit", {
        method: "POST",
        body: JSON.stringify({
          problem_id: 6, // change ID as needed
          flag: flag,
        }),
      })

      setMiningState(response.ok ? "success" : "failure")
      setResult(response)

      if (response.ok) {
        toast.success("Correct flag! Points awarded!")
        setFlag("")
      } else {
        toast.error("Incorrect flag. Try again!")
      }
    } catch (error) {
      setMiningState("failure")
      toast.error(error instanceof Error ? error.message : "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAnimationComplete = () => {
    setMiningState("idle")
  }

  return (
    <MCLayout>
      <MiningAnimation state={miningState} onComplete={handleAnimationComplete} />

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-700 border-4 border-black animate-float" />
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              MINECRAFT BIOME STRETCH ANALYZER
            </h1>

            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Debugging
              </span>

              <span className="px-2 py-1 bg-yellow-900/50 border-2 border-yellow-600 text-xs font-bold text-yellow-400">
                Medium
              </span>

              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                100 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              You are given a traversal sequence of Minecraft biomes representing a player's journey.
              Your goal is to determine the <b>longest continuous stretch</b> of any biome.
            </p>

            <p>
              However, the provided implementation contains a hidden logical flaw. Your task is to inspect
              the buggy code, diagnose the issue, and submit a corrected version that passes all validation tests.
            </p>

            <div className="border border-stone-700 bg-stone-900 p-4 text-sm rounded">
              <p><b>Example:</b></p>
              <p>["Plains", "Plains", "Desert", "Desert", "Desert", "Forest"] → Longest stretch = 3 ("Desert")</p>
            </div>
          </div>
        </MCCard>

        {/* CHALLENGE DETAILS */}
        <MCCard title="CHALLENGE">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>You will receive:</p>

            <ul className="list-disc ml-6">
              <li>A buggy implementation that computes the longest biome stretch</li>
              <li>A driver harness that compiles and tests your fix</li>
            </ul>

            <p>Your task is to fix <b>only</b> the flawed logic.</p>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 rounded">
              <p className="font-bold text-yellow-500 text-sm mb-1">Important:</p>
              <ul className="list-disc ml-6 text-xs text-stone-400">
                <li>Do NOT modify the harness</li>
                <li>Do NOT print extra debug logs</li>
                <li>Do NOT change function signatures</li>
              </ul>
            </div>

            <MCCodeBlock
              language="text"
              code={`Sample Inputs:

Example 1:
Input: ["Plains", "Plains", "Desert", "Desert", "Desert", "Forest"]
Output: 3

Example 2:
Input: ["Forest", "Forest", "Forest"]
Output: 3

Example 3:
Input: ["Snow", "Desert", "Jungle"]
Output: 1

Example 4:
Input: []
Output: 0`}
            />
          </div>
        </MCCard>

        {/* FLAG FORMAT */}
        <MCCard title="FLAG FORMAT">
          <div className="space-y-3">
            <div>
              <p className="text-stone-400 text-xs mb-2">INPUT FORMAT:</p>
              <div className="bg-black/50 border-2 border-stone-700 p-3 font-mono text-sm text-white">
                FLAG{"{"}example_flag_here{"}"}
              </div>
            </div>

            <div>
              <p className="text-stone-400 text-xs mb-2">EXAMPLE:</p>
              <div className="bg-black/50 border-2 border-stone-700 p-3 font-mono text-sm text-stone-500">
                FLAG{"{"}th1s_1s_n0t_th3_fl4g{"}"}
              </div>
            </div>
          </div>
        </MCCard>

        {/* SUBMIT FLAG */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={
                result.ok
                    ? "Correct!."
                    : `Incorrect: ${result.reason || "Try again"}`
              }
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <MCLabel>Enter the flag you discovered</MCLabel>
              <MCInput
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="CCXHR{...}"
                required
              />
            </div>

            <MCButton
              type="submit"
              variant="success"
              className="w-full flex items-center justify-center gap-2"
              disabled={submitting}
            >
              <Flag className="w-5 h-5" />
              {submitting ? "MINING..." : "SUBMIT FLAG"}
            </MCButton>
          </form>
        </MCCard>
      </div>
    </MCLayout>
  )
}