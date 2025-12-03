"use client"

import type React from "react"

import { useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCButton, MCCard, MCInput, MCLabel, MCCodeBlock } from "@/components/minecraft/ui"
import { MCAlert } from "@/components/minecraft/alert"
import { MiningAnimation } from "@/components/minecraft/mining-animation"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
import { Flag, Zap } from "lucide-react"

export default function Problem2Page() {
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
          problem_id: 2,
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
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-900/20 border-4 border-black flex items-center justify-center animate-pulse">
            <Zap className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">REDSTONE CIRCUIT</h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">Crypto</span>
              <span className="px-2 py-1 bg-yellow-900/50 border-2 border-yellow-600 text-xs font-bold text-yellow-400">
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
              The ancient redstone engineers created a complex circuit to protect their most valuable secrets. The
              circuit uses a special encoding mechanism that transforms messages into seemingly random patterns.
            </p>
            <p>
              You have intercepted an encoded message from the circuit. Your mission is to reverse-engineer the encoding
              algorithm and decode the message to reveal the flag.
            </p>
            <div className="bg-stone-900 border-2 border-stone-700 p-4 mt-4">
              <p className="text-yellow-500 font-bold text-sm mb-2">HINT:</p>
              <p className="text-xs">
                The redstone circuit uses a Caesar cipher with a twist. The shift value is hidden in the circuit
                diagram.
              </p>
            </div>
          </div>
        </MCCard>

        {/* Challenge Content */}
        <MCCard title="ENCODED MESSAGE">
          <div className="space-y-4">
            <MCCodeBlock language="text" code="SYNT{e3qfg0a3_p1epa1g_f0lv3q}" />

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-900 border-2 border-stone-700 p-4 text-center">
                <p className="text-stone-500 text-xs mb-2">SHIFT</p>
                <p className="text-2xl font-bold text-red-500 animate-pulse">???</p>
              </div>
              <div className="bg-stone-900 border-2 border-stone-700 p-4 text-center">
                <p className="text-stone-500 text-xs mb-2">ALGORITHM</p>
                <p className="text-sm font-bold text-white">ROT-?</p>
              </div>
              <div className="bg-stone-900 border-2 border-stone-700 p-4 text-center">
                <p className="text-stone-500 text-xs mb-2">POWER</p>
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-4 h-4 text-red-500" />
                  <p className="text-2xl font-bold text-red-500">13</p>
                </div>
              </div>
            </div>
          </div>
        </MCCard>

        {/* Constraints */}
        <MCCard title="CONSTRAINTS">
          <div className="space-y-2 text-stone-300 text-sm">
            <p>
              • The flag format is FLAG{"{"}...{"}"}
            </p>
            <p>• All letters are lowercase except FLAG prefix</p>
            <p>• Numbers and special characters remain unchanged</p>
            <p>• The circuit power level indicates the rotation value</p>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={result.ok ? "Correct! You decoded the circuit!" : `Incorrect: ${result.reason || "Try again"}`}
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <MCLabel>Enter the decoded flag</MCLabel>
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
