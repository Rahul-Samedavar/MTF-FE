"use client"

import type React from "react"

import { useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCButton, MCCard, MCInput, MCLabel, MCCodeBlock } from "@/components/minecraft/ui"
import { MCAlert } from "@/components/minecraft/alert"
import { MiningAnimation } from "@/components/minecraft/mining-animation"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
import { Flag, Shuffle } from "lucide-react"

export default function Problem13Page() {
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
          problem_id: 13,
          flag: flag,
        }),
      })

      setMiningState(response.ok ? "success" : "failure")
      setResult(response)

      if (response.ok) {
        toast.success("Correct flag! Clean reversal!")
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
          <div className="w-12 h-12 bg-purple-900/20 border-4 border-black flex items-center justify-center animate-pulse">
            <Shuffle className="w-8 h-8 text-purple-300" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              13. TRIPLE TWIST
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Reverse Engineering
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

        {/* Top Notice */}
        <MCCard title="IMPORTANT">
          <p className="text-stone-300 text-sm">
            This challenge hides a three-way permutation inside a neat slicing trick. Your mission:
            undo the shuffle with mathematical precision — because the decoder waiting at the other
            end has zero sense of humor about mistakes.
          </p>
        </MCCard>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              You're handed a deceptively simple string transformer. It rips the input into three
              subsequences and then glues them back together in a new order. Your job? Recover the
              original string from the mixed output.
            </p>

            <p>The forward mapping you're reversing is:</p>

            <div className="bg-stone-900 border-2 border-stone-700 p-4">
              <p className="text-purple-300 font-bold text-sm mb-2">THE GIVEN TRANSFORMATION:</p>
              <MCCodeBlock
                language="python"
                code={`def original(s):
    a = s[0::3]
    b = s[1::3]
    c = s[2::3]
    return b + c + a`}
              />
            </div>

            <p>
              That means the string is split like this:
            </p>

            <MCCodeBlock
              language="text"
              code={`a = s at positions 0,3,6,...
b = s at positions 1,4,7,...
c = s at positions 2,5,8,...

output = b + c + a`}
            />

            <p>
              Your task is to reconstruct the original string in perfect order — no guessing, no brute
              force. The decoder that validates your work is tuned to explode spectacularly if you're off
              by even a single character.
            </p>

            <MCCodeBlock
              language="text"
              code={`Validation Completed Successfully
flag: CCXHR{...}`}
            />
          </div>
        </MCCard>


        {/* Constraints */}
        <MCCard title="CONSTRAINTS">
          <div className="space-y-2 text-stone-300 text-sm">
            <p>• The resulting flag format is <strong>CCXHR{`{...}`}</strong></p>
            <p>• No approximations — exact string reconstruction required</p>
            <p>• The decoder rejects incorrect outputs with extreme prejudice</p>
            <p>• Absolutely deterministic permutation, fully reversible</p>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={
                result.ok
                  ? "Correct! Triple Twist undone perfectly."
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
