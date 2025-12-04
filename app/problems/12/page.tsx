"use client"

import type React from "react"

import { useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCButton, MCCard, MCInput, MCLabel, MCCodeBlock } from "@/components/minecraft/ui"
import { MCAlert } from "@/components/minecraft/alert"
import { MiningAnimation } from "@/components/minecraft/mining-animation"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
import { Flag, BookOpen } from "lucide-react"

export default function Problem12Page() {
  const [flag, setFlag] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok: boolean; reason?: string } | null>(null)
  const [miningState, setMiningState] = useState<
    "idle" | "mining" | "success" | "failure"
  >("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setResult(null)
    setMiningState("mining")

    try {
      const response = await apiRequest<{ ok: boolean; reason?: string }>("/submit", {
        method: "POST",
        body: JSON.stringify({
          problem_id: 12,
          flag,
        }),
      })

      setMiningState(response.ok ? "success" : "failure")
      setResult(response)

      if (response.ok) {
        toast.success("Correct flag! You're on fire!")
        setFlag("")
      } else {
        toast.error("Incorrect flag — check your inversion math.")
      }
    } catch (error) {
      setMiningState("failure")
      toast.error(error instanceof Error ? error.message : "Submission failed")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <MCLayout>
      <MiningAnimation state={miningState} onComplete={() => setMiningState("idle")} />

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-900/20 border-4 border-black flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              12.  “Duet”
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Reverse Engineering
              </span>
              <span className="px-2 py-1 bg-purple-900/50 border-2 border-purple-600 text-xs font-bold text-purple-300">
                Easy
              </span>
              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                100 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <MCCard title="IMPORTANT">
          <p className="text-stone-300 text-sm">
            This challenge asks you to <b>undo a pairwise linear transformation</b>. No brute force,
            no lookup tables — just crisp algebra. If you can reverse a 2×2 matrix, you're good.
          </p>
        </MCCard>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              The engineers have cooked up another transformation. This time, every pair of integers
              takes part in a duet — one adds, one subtracts. Your mission is to restore the original
              sequence.
            </p>

            <p>
              The forward function <code>original()</code> modifies the list <strong>pair by pair</strong>:
            </p>

            <MCCodeBlock
              language="python"
              code={`def original(nums):
    out = nums[:]
    for i in range(0, len(nums)-1, 2):
        out[i] = nums[i] + nums[i+1]
        out[i+1] = nums[i] - nums[i+1]
    return out`}
            />

            <p>The transformation per pair looks like:</p>

            <MCCodeBlock
              language="text"
              code={`a' = a + b
b' = a - b`}
            />

            <p>
              Your task: derive and implement the <strong>inverse mapping</strong>, such that given{" "}
              <code>[a', b']</code> you can recover the original <code>[a, b]</code>.
            </p>
          </div>
        </MCCard>

        {/* Task */}
        <MCCard title="THE TASK">
          <div className="space-y-4 text-stone-300">
            <p>Your <code>solution()</code> must:</p>
            <ul className="list-disc pl-6">
              <li>Accept the transformed list</li>
              <li>Return the exact original list</li>
              <li>Pass validator checks</li>
              <li>Enable the decoder to reconstruct the final flag</li>
            </ul>
          </div>
        </MCCard>

        {/* Constraints */}
        <MCCard title="CONSTRAINTS">
          <div className="space-y-2 text-stone-300 text-sm">
            <p>• Flag format: <b>CCXHR{"{...}"}</b></p>
            <p>• Arithmetic must be exact; no approximations</p>
            <p>• The decoder reveals the flag only if inversion is flawless</p>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={
                result.ok
                  ? "Correct! Perfect inversion — well played."
                  : `Incorrect: ${result.reason || "Try again"}`
              }
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <MCLabel>Enter the decoded flag</MCLabel>
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
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2"
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
