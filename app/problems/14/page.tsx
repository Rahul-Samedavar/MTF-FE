"use client"

import type React from "react"
import { useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCButton, MCCard, MCInput, MCLabel, MCCodeBlock } from "@/components/minecraft/ui"
import { MCAlert } from "@/components/minecraft/alert"
import { MiningAnimation } from "@/components/minecraft/mining-animation"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
import { Footprints, ShieldCheck } from "lucide-react"

export default function Problem14Page() {
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
          problem_id: 14,
          flag: flag,
        }),
      })

      setMiningState(response.ok ? "success" : "failure")
      setResult(response)

      if (response.ok) {
        toast.success("Correct flag — those footsteps were traced perfectly.")
        setFlag("")
      } else {
        toast.error("Incorrect flag. Re-track the steps and try again.")
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
          <div className="w-12 h-12 bg-stone-900/30 border-4 border-black flex items-center justify-center animate-bounce">
            <Footprints className="w-8 h-8 text-mc-green" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">14. FOOT-STEPS</h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">Reverse Engineering</span>
              <span className="px-2 py-1 bg-orange-900/50 border-2 border-orange-600 text-xs font-bold text-orange-300">Medium</span>
              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">250 POINTS</span>
            </div>
          </div>
        </div>

        {/* Important */}
        <MCCard title="IMPORTANT">
          <p className="text-stone-300 text-sm">
            This challenge gives you a multi-stage in-place transformation. Your job: **undo it exactly**, in-place.
            The forward function mutates the list — the inverse must restore it to the original values without allocating
            a new list (the validator checks that). No shortcuts; the decoder will only accept a perfect inverse.
          </p>
        </MCCard>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              You are provided with a black-box <code>original(nums)</code> that performs several in-place operations
              on an integer list. Understanding the sequence and math in that function is the only reliable path to success.
            </p>

            <p>
              Implement <code>solution(nums)</code> that accepts the mutated list (the output of <code>original </code>) and
              restores it back to the exact original list. The contest will run a suite of tests to ensure correctness and
              in-place mutation.
            </p>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 mt-4">
              <p className="text-blue-400 font-bold text-sm mb-2">SNIPPET (FOR ILLUSTRATION — FORWARD FUNCTION IS MORE COMPLICATED):</p>

              <MCCodeBlock
                language="C"
                code={`void original(int *nums, int n) {
    int i = 0, j = n - 1;

    while (i < j) {
        nums[i] ^= nums[j];
        nums[j] ^= nums[i];
        nums[i] ^= nums[j];
        i++;
        j--;
    }
    ...
}
`}
              />
            </div>

            <p>
              The forward function you will see in the challenge bundle is **the real thing** — longer and trickier than
              the illustrative fragment above. Your solution must match that forward function exactly in reverse.
            </p>

            <p className="text-stone-300">
              When your inverse is correct the validator prints a completion message and the decoder reveals the flag.
            </p>

            <MCCodeBlock language="text" code={`Validation Completed Successfully
flag: CCXHR{...}`}/>
          </div>
        </MCCard>

        {/* Task */}
        <MCCard title="THE TASK">
          <div className="space-y-4 text-stone-300">
            <p>Implement <code>solution(nums)</code> that:</p>
            <ul className="list-disc pl-6 text-stone-300">
              <li>Accepts the mutated list produced by <code>original(nums)</code>.</li>
              <li>Restores the list to its exact original values, in-place.</li>
              <li>Works for all validation cases the test harness runs.</li>
            </ul>

            <p className="mt-2">
              Keep in mind: the order of reversing matters. Many forward steps are not commutative — undo them in the
              correct reverse sequence.
            </p>
          </div>
        </MCCard>

        {/* Constraints */}
        <MCCard title="CONSTRAINTS">
          <div className="space-y-2 text-stone-300 text-sm">
            <p>• The flag format is <strong>CCXHR{`{...}`}</strong></p>
            <p>• Operate in-place — no new list creation.</p>
            <p>• Exact integer arithmetic; no floating point or approximations.</p>
            <p>• Do not modify <code>original</code> or the decoder.</p>
          </div>
        </MCCard>

        {/* Testing */}
        <MCCard title="TESTING & VALIDATION">
          <div className="space-y-3 text-stone-300 text-sm">
            <p>
              The test run will: validate your inverse on known samples, run hidden testcases, then pass results to the decoder.
              A successful run prints the flag at the end.
            </p>

            <p>
              Debug tip: write small reversible helpers locally and unit-test your reversal on constructed vectors before
              trusting the full solution.
            </p>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={result.ok ? "Correct! You've reversed the footsteps." : `Incorrect: ${result.reason || "Try again"}`}
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
              className="w-full flex items-center justify-center gap-2"
              disabled={submitting}
            >
              <ShieldCheck className="w-5 h-5" />
              {submitting ? "MINING..." : "SUBMIT FLAG"}
            </MCButton>
          </form>
        </MCCard>
      </div>
    </MCLayout>
  )
}
