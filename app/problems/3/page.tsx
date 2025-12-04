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

export default function ProblemLetterCombinationsPage() {
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
          problem_id: 3, // Letter Combinations Problem
          flag: flag,
        }),
      })

      setMiningState(response.ok ? "success" : "failure")
      setResult(response)

      if (response.ok) {
        toast.success("Correct flag! Letter combinations computed successfully!")
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
          <div className="w-12 h-12 bg-purple-600/20 border-4 border-black flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              Letter Combinations of a Phone Number
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Backtracking
              </span>
              <span className="px-2 py-1 bg-purple-900/50 border-2 border-purple-600 text-xs font-bold text-purple-300">
                Medium
              </span>
              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                200 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              Given a string containing digits from <code>2-9</code>, return <strong>all possible letter combinations</strong>
              that the number could represent. The mapping of digits to letters is the same as on telephone buttons:
            </p>

            <MCCodeBlock
              language="text"
              code={`2 -> "abc"
3 -> "def"
4 -> "ghi"
5 -> "jkl"
6 -> "mno"
7 -> "pqrs"
8 -> "tuv"
9 -> "wxyz"`}
            />

            <p className="text-stone-400">
              Note: <code>1</code> does not map to any letters. Return the answer in any order.
            </p>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 mt-4">
              <p className="text-purple-400 font-bold text-sm mb-2">INPUT FORMAT:</p>
              <MCCodeBlock
                language="typescript"
                code={`digits: string // string of digits from '2' to '9'`}
              />
            </div>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 mt-4">
              <p className="text-purple-400 font-bold text-sm mb-2">OUTPUT:</p>
              <MCCodeBlock
                language="typescript"
                code={`string[] // all possible letter combinations`}
              />
            </div>
          </div>
        </MCCard>

        {/* Examples */}
        <MCCard title="EXAMPLES">
          <MCCodeBlock
            language="text"
            code={`Example 1:
Input: digits = "23"
Output: ["ad","ae","af","bd","be","bf","cd","ce","cf"]

Example 2:
Input: digits = "2"
Output: ["a","b","c"]`}
          />
        </MCCard>

        {/* Notes */}
        <MCCard title="NOTES">
          <div className="space-y-2 text-stone-300 text-sm">
            <ul className="list-disc ml-6">
              <li>1 ≤ digits.length ≤ 4</li>
              <li>digits[i] is in the range ['2', '9']</li>
              <li>Return the combinations in any order</li>
            </ul>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={result.ok ? "Correct! Letter combinations computed successfully." : `Incorrect: ${result.reason || "Try again"}`}
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