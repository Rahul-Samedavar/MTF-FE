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

export default function ProblemLISPage() {
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
          problem_id: 4, // LIS Problem
          flag: flag,
        }),
      })

      setMiningState(response.ok ? "success" : "failure")
      setResult(response)

      if (response.ok) {
        toast.success("Correct flag! LIS length computed successfully!")
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
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/20 border-4 border-black flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              Longest Increasing Subsequence (LIS)
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Dynamic Programming
              </span>
              <span className="px-2 py-1 bg-blue-900/50 border-2 border-blue-600 text-xs font-bold text-blue-300">
                Hard
              </span>
              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                300 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              Given an integer array <code>nums</code>, find the <strong>length of the longest strictly increasing subsequence</strong>.
              A subsequence is derived from the array by deleting some elements (possibly none) without changing the order of the remaining elements.
            </p>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 mt-4">
              <p className="text-blue-400 font-bold text-sm mb-2">INPUT FORMAT:</p>
              <MCCodeBlock
                language="typescript"
                code={`nums: number[] // integer array`}
              />
            </div>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 mt-4">
              <p className="text-blue-400 font-bold text-sm mb-2">OUTPUT:</p>
              <MCCodeBlock
                language="typescript"
                code={`number // length of the longest strictly increasing subsequence`}
              />
            </div>
          </div>
        </MCCard>

        {/* Examples */}
        <MCCard title="EXAMPLES">
          <MCCodeBlock
            language="text"
            code={`Example 1:
Input: nums = [10,9,2,5,3,7,101,18]
Output: 4
Explanation: LIS is [2,3,7,101]

Example 2:
Input: nums = [0,1,0,3,2,3]
Output: 4
Explanation: LIS is [0,1,2,3]

Example 3:
Input: nums = [7,7,7,7,7,7,7]
Output: 1
Explanation: All elements are the same`}
          />
        </MCCard>

        {/* Notes */}
        <MCCard title="NOTES">
          <div className="space-y-2 text-stone-300 text-sm">
            <ul className="list-disc ml-6">
              <li>The subsequence does not need to be contiguous.</li>
              <li>Binary search optimization can give O(n log n) complexity.</li>
              <li>Dynamic Programming alone gives O(n²) complexity, acceptable for n ≤ 2500.</li>
              <li>1 ≤ nums.length ≤ 2500</li>
              <li>-10⁴ ≤ nums[i] ≤ 10⁴</li>
            </ul>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={result.ok ? "Correct! LIS length computed successfully." : `Incorrect: ${result.reason || "Try again"}`}
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