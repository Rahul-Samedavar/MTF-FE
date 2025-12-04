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

export default function Problem11Page() {
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
          problem_id: 11,
          flag: flag,
        }),
      })

      setMiningState(response.ok ? "success" : "failure")
      setResult(response)

      if (response.ok) {
        toast.success("Correct flag! Well reversed!")
        setFlag("")
      } else {
        toast.error("Incorrect flag. Give it another shot.")
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
          <div className="w-12 h-12 bg-blue-900/20 border-4 border-black flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              11. BACK TO SCHOOL
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Reverse Engineering
              </span>
              <span className="px-2 py-1 bg-blue-900/50 border-2 border-blue-600 text-xs font-bold text-blue-300">
                Easy
              </span>
              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                75 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* Top Notice */}
        <MCCard title="IMPORTANT">
          <p className="text-stone-300 text-sm">
            In this challenge, you must **reverse a function**. That means taking the output produced
            by the given transformation and mathematically deducing the exact inputs that created it.  
            No brute force. No lookup table. Just algebra — the stuff your math teacher swore you'd need someday.
          </p>
        </MCCard>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              The engineers of old loved two things: overengineered puzzles and algebra that makes
              sleep-deprived contestants question their life choices. This challenge gives you a
              transformation function and expects you to walk it backwards.
            </p>

            <p>
              You're handed a forward mapping <code>original()</code> that takes a pair <code>[x, y]</code> and spits
              out a modified pair. Your job? Recover the original <code>x</code> and <code>y</code> from the output.
              Once you derive the inverse, the provided decoder will use your results to reconstruct a final secret
              and reveal the flag.
            </p>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 mt-4">
              <p className="text-blue-400 font-bold text-sm mb-2">THE GIVEN TRANSFORMATION:</p>
              <MCCodeBlock
                language="python"
                code={`def original(nums):
    x, y = nums
    out = [x, y]
    out[0] += 2*y
    out[1] += 2*x
    return out`}
              />
            </div>

            <p>
              To reverse a function means to find a mapping that undoes this transformation — a function that,
              when given the output <code>[x', y']</code>, returns the exact original <code>[x, y]</code>.
            </p>

            <p className="text-stone-300">
              Once your inverse is correct, the validation script runs cleanly and the decoder prints:
            </p>

            <MCCodeBlock language="text" code={`Validation Completed Successfully
flag: CCXHR{...}`}/>
          </div>
        </MCCard>

        {/* Challenge Content */}
        <MCCard title="THE TASK">
          <div className="space-y-4 text-stone-300">
            <p>Original Function Does this</p>

            <MCCodeBlock
              language="text"
              code={`a = x + 2y
b = y + 2x`}
            />

            <p>
              Original Function takes [x, y] array as input and give [a, b] aray as output.
            </p>

            <p>
              Your task is to write solution function that takes this [a, b] arraay as input and gives [x, y] array as output.
            </p>
          </div>
        </MCCard>

        {/* Constraints */}
        <MCCard title="CONSTRAINTS">
          <div className="space-y-2 text-stone-300 text-sm">
            <p>• The resulting flag format is <strong>CCXHR{`{...}`}</strong></p>
            <p>• Output must match validator expectations exactly</p>
            <p>• No approximations; this is precise arithmetic</p>
            <p>• The decoder reveals the final flag only after successful inversion</p>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={result.ok ? "Correct! Function reversed flawlessly." : `Incorrect: ${result.reason || "Try again"}`}
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
              <Flag className="w-5 h-5" />
              {submitting ? "MINING..." : "SUBMIT FLAG"}
            </MCButton>
          </form>
        </MCCard>
      </div>
    </MCLayout>
  )
}
