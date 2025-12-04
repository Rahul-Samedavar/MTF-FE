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

export default function ProblemStudentRankingPage() {
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
          problem_id: 7, // Student Ranking
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
          <div className="w-12 h-12 bg-indigo-700 border-4 border-black animate-float" />
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              7. STUDENT RANKING WITH TIE RULES
            </h1>

            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Debugging
              </span>

              <span className="px-2 py-1 bg-yellow-900/50 border-2 border-yellow-600 text-xs font-bold text-yellow-400">
                Medium
              </span>

              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                150 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              You are organizing a coding contest. Given an array of student marks, assign <strong>dense ranks</strong>:
            </p>
            <ul className="list-disc ml-6">
              <li>Higher marks → better (lower) rank</li>
              <li>Equal marks → same rank</li>
              <li>No gaps in ranking (dense ranking)</li>
            </ul>

            <p>
              A buggy implementation is provided that attempts to compute dense ranks but fails on several cases.
              Your task is to identify the incorrect logic and submit a corrected version that passes the validator.
            </p>

            <div className="border border-stone-700 bg-stone-900 p-4 text-sm rounded">
              <p className="font-semibold">FLAG (for reference on successful validation):</p>
            </div>
          </div>
        </MCCard>

        {/* CHALLENGE DETAILS */}
        <MCCard title="CHALLENGE">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>You will receive:</p>

            <ul className="list-disc ml-6">
              <li>A buggy source file containing incorrect ranking logic</li>
              <li>A judge harness that compiles and runs hidden testcases</li>
            </ul>

            <p>Your job is to fix <strong>only</strong> the ranking function so all tests pass.</p>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 rounded">
              <p className="font-bold text-yellow-500 text-sm mb-1">Important:</p>
              <ul className="list-disc ml-6 text-xs text-stone-400">
                <li>Do NOT modify the harness</li>
                <li>Do NOT print extra debug logs</li>
                <li>Do NOT change required function signatures</li>
              </ul>
            </div>

            <MCCodeBlock
              language="text"
              code={`Example 1:
Input: [95, 90, 90, 80]
Output: [1, 2, 2, 3]

Example 2:
Input: [40, 95, 90, 80, 95]
Output: [4, 1, 2, 3, 1]`}
            />
          </div>
        </MCCard>

        {/* INPUT / OUTPUT */}
        <MCCard title="INPUT & OUTPUT">
          <div className="space-y-2 text-stone-300">
            <p><strong>Input:</strong> <code>int[] marks</code> — array of student marks.</p>
            <p><strong>Output:</strong> <code>int[] ranks</code> — dense ranks corresponding to each input position.</p>
            <ul className="list-disc ml-6 text-sm">
              <li>Array length may vary</li>
              <li>Marks are not guaranteed sorted</li>
              <li>Duplicate scores indicate tied ranks</li>
            </ul>
          </div>
        </MCCard>

        {/* SAMPLE TESTCASES */}
        <MCCard title="SAMPLE TESTCASES">
          <MCCodeBlock
            language="text"
            code={`Example 1:
Input: [95, 90, 90, 80]
Output: [1, 2, 2, 3]

Example 2:
Input: [40, 95, 90, 80, 95]
Output: [4, 1, 2, 3, 1]

Example 3:
Input: [10]
Output: [1]

Example 4:
Input: []
Output: []`}
          />
        </MCCard>

        {/* VALIDATION */}
        <MCCard title="VALIDATION & RULES">
          <div className="space-y-2 text-stone-300">
            <p>The judge will:</p>
            <ul className="list-disc ml-6">
              <li>Execute your corrected code against hidden testcases</li>
              <li>Validate outputs strictly</li>
              <li>Accept only fully correct submissions</li>
            </ul>

            <p className="text-stone-400 text-xs mt-3">
              ⚠ No debug logs. No extra output. Do not modify the harness.
            </p>
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
              }className="mb-4"
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