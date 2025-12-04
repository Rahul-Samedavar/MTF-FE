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

export default function ProblemCreeperPage() {
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
          problem_id: 5, // Count Creepers
          flag: flag,
        }),
      })

      setMiningState(response.ok ? "success" : "failure")
      setResult(response)

      if (response.ok) {
        toast.success("Correct flag! Debugging complete.")
        setFlag("")
      } else {
        toast.error("Incorrect flag. Try again.")
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

        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-green-900/20 border-4 border-black flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              5. COUNT CREEPERS — "CASE CLOSED"
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Debugging
              </span>
              <span className="px-2 py-1 bg-green-900/50 border-2 border-green-600 text-xs font-bold text-green-300">
                Easy
              </span>
              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                50 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* Overview */}
        <MCCard title="PROBLEM OVERVIEW">
          <p className="text-stone-300 text-sm leading-relaxed">
            Villagers reported multiple mob sightings. Your task is to count how many of them are
            <strong> creepers</strong>, ignoring case.  
            The provided file compiles, but contains a bug that causes incorrect answers.
            Your job is to inspect the buggy function, find the incorrect logic, and fix it so all internal tests pass.
          </p>
        </MCCard>

        {/* What You Receive */}
        <MCCard title="WHAT YOU WILL RECEIVE">
          <ul className="text-stone-300 text-sm list-disc pl-6 space-y-1">
            <li>A single source file containing a buggy function</li>
            <li>A driver harness that compiles your submission</li>
            <li>Runs hidden testcases</li>
            <li>Validates outputs using an internal decoder</li>
            <li>Accepts your solution only if all tests pass</li>
          </ul>
          <p className="text-stone-400 text-xs mt-3">
            You must fix the function only. Do <strong>not</strong> modify the harness.
          </p>
        </MCCard>

        {/* Input Format */}
        <MCCard title="INPUT FORMAT">
          <p className="text-stone-300 text-sm">String[] mobs — array of mob names observed in the village.</p>
          <ul className="text-stone-300 text-sm list-disc pl-6 mt-2">
            <li>Order does not matter</li>
            <li>Duplicates allowed</li>
            <li>May be empty</li>
          </ul>
        </MCCard>

        {/* Output Format */}
        <MCCard title="OUTPUT FORMAT">
          <p className="text-stone-300 text-sm">Returns an integer — number of times “creeper” appears (case-insensitive).</p>
        </MCCard>

        {/* Samples */}
        <MCCard title="SAMPLE TESTCASES">
          <div className="space-y-4">

            <div>
              <p className="text-stone-400 text-xs">Example 1</p>
              <MCCodeBlock
                language="text"
                code={`Input:
["Creeper", "Zombie", "skeleton", "CREEPER", "Spider"]

Output:
2`}
              />
            </div>

            <div>
              <p className="text-stone-400 text-xs">Example 2</p>
              <MCCodeBlock
                language="text"
                code={`Input:
["Zombie", "Skeleton", "Spider"]

Output:
0`}
              />
            </div>

            <div>
              <p className="text-stone-400 text-xs">Example 3</p>
              <MCCodeBlock
                language="text"
                code={`Input:
["creeper","creeper","Creeper"]

Output:
3`}
              />
            </div>

          </div>
        </MCCard>

        {/* Validation */}
        <MCCard title="VALIDATION & RULES">
          <ul className="text-stone-300 text-sm list-disc pl-6 space-y-1">
            <li>The driver runs multiple hidden testcases</li>
            <li>Collects outputs into a list</li>
            <li>Passes them to an internal validator</li>
            <li>Accepts only if all match expected values</li>
          </ul>

          <p className="text-stone-400 text-xs mt-3">
            ⚠ Do NOT print anything extra.  
            ⚠ Do NOT modify the driver.
          </p>

          <p className="text-stone-300 text-sm mt-4">
            Your goal: Fix the tiny bug, pass all tests, move on.
          </p>
        </MCCard>

        {/* Submit */}
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
              <MCLabel>Enter the flag</MCLabel>
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