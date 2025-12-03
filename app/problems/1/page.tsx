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

export default function Problem1Page() {
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
          problem_id: 1,
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
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-600 border-4 border-black animate-float" />
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">THE HIDDEN CHEST</h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">Web</span>
              <span className="px-2 py-1 bg-green-900/50 border-2 border-green-600 text-xs font-bold text-green-400">
                Easy
              </span>
              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                100 POINTS
              </span>
            </div>
          </div>
        </div>

        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              Deep in the mines of BlockCTF, there lies a hidden chest containing valuable treasures. The chest is
              protected by an ancient mechanism that only responds to the correct secret phrase.
            </p>
            <p>
              Your task is to explore the web application, find the hidden endpoint, and retrieve the flag from the
              chest. The miners left clues in the HTML comments and JavaScript files.
            </p>
            <div className="bg-stone-900 border-2 border-stone-700 p-4 mt-4">
              <p className="text-yellow-500 font-bold text-sm mb-2">HINT:</p>
              <p className="text-xs">
                Check the page source and look for hidden paths. Sometimes treasures are buried in plain sight.
              </p>
            </div>
          </div>
        </MCCard>

        <MCCard title="CHALLENGE">
          <div className="space-y-4">
            <div className="flex justify-center">
              <MCImage
                src="/placeholder.svg?height=200&width=200&text=CHEST"
                alt="Hidden Chest"
                caption="A mysterious chest awaits..."
              />
            </div>

            <MCCodeBlock
              language="bash"
              code="$ curl http://challenge.blockctf.local/\n<!-- TODO: Remove /api/secret before production -->"
            />
          </div>
        </MCCard>

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

        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={result.ok ? "Correct! You found the treasure!" : `Incorrect: ${result.reason || "Try again"}`}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <MCLabel>Enter the flag you discovered</MCLabel>
              <MCInput value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="FLAG{...}" required />
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
