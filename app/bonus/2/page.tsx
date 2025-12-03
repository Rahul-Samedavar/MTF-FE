"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCCard, MCButton, MCInput, MCAlert, MCCodeBlock } from "@/components/minecraft/ui"
import { useRouter } from "next/navigation"

export default function BonusLevel2() {
  const [flag, setFlag] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const router = useRouter()

  useEffect(() => {
    const level = Number.parseInt(localStorage.getItem("bonus_level_unlocked") || "1")
    if (level < 2) {
      router.push("/bonus")
    }
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (flag === "flag{ender_dragon_defeated}") {
      setStatus("success")
      // Could unlock level 3 here if it existed
    } else {
      setStatus("error")
    }
  }

  return (
    <MCLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <MCCard title="BONUS LEVEL 2: THE ENDER DRAGON'S SECRET">
          <div className="space-y-6 p-4">
            <div className="prose prose-invert max-w-none font-minecraft">
              <p>
                You've reached the End. The Dragon is guarding a secret encrypted string. Decrypt it to claim the final
                victory.
              </p>

              <MCCodeBlock
                language="javascript"
                code={`const encrypted = "synt{raqre_qentba_qrsrngrq}";
// The dragon speaks in ROT13
// Decrypt the message to get the flag`}
              />

              <p>
                <strong>Objective:</strong> Decrypt the string.
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
              {status === "success" && (
                <MCAlert type="success" message="CONGRATULATIONS! You have completed the bonus challenges." />
              )}
              {status === "error" && <MCAlert type="error" message="INCORRECT FLAG. Try again." />}
            </form>
          </div>
        </MCCard>
      </div>
    </MCLayout>
  )
}
