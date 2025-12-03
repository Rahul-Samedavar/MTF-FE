"use client"

import type React from "react"

import { useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCCard, MCButton, MCInput, MCAlert, MCCodeBlock } from "@/components/minecraft/ui"
import { useRouter } from "next/navigation"

export default function BonusLevel1() {
  const [flag, setFlag] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (flag === "flag{biome_glitch_fixed}") {
      setStatus("success")
      const currentLevel = Number.parseInt(localStorage.getItem("bonus_level_unlocked") || "1")
      if (currentLevel < 2) {
        localStorage.setItem("bonus_level_unlocked", "2")
      }
      setTimeout(() => router.push("/bonus"), 2000)
    } else {
      setStatus("error")
    }
  }

  return (
    <MCLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <MCCard title="BONUS LEVEL 1: THE HIDDEN BIOME">
          <div className="space-y-6 p-4">
            <div className="prose prose-invert max-w-none font-minecraft">
              <p>
                Our terrain generator is acting up. It's creating biomes that shouldn't exist. We've isolated the faulty
                code segment. Can you find the magic value that fixes the generation?
              </p>

              <MCCodeBlock
                language="python"
                code={`def generate_biome(seed, x, z):
    # TODO: Fix the magic number overflow
    magic_val = (seed * x * z) % 256
    if magic_val > 127:
        return "GLITCH_BIOME"
    return BIOME_MAP[magic_val]`}
              />

              <p>
                <strong>Objective:</strong> Find the flag hidden in the glitch.
                <br />
                <strong>Hint:</strong> The flag format is standard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t-2 border-stone-700">
              <div className="flex gap-4">
                <MCInput
                  placeholder="Enter flag..."
                  value={flag}
                  onChange={(e) => setFlag(e.target.value)}
                  className="flex-1"
                />
                <MCButton type="submit" variant="success">
                  SUBMIT
                </MCButton>
              </div>
              {status === "success" && <MCAlert type="success" message="CORRECT! Level 2 Unlocked. Redirecting..." />}
              {status === "error" && <MCAlert type="error" message="INCORRECT FLAG. Try again." />}
            </form>
          </div>
        </MCCard>
      </div>
    </MCLayout>
  )
}
