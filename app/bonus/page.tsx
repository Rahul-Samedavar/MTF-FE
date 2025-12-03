"use client"

import { useEffect, useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCCard, MCButton } from "@/components/minecraft/ui"
import { Lock, Unlock, Star } from "lucide-react"
import Link from "next/link"

export default function BonusPage() {
  const [unlockedLevel, setUnlockedLevel] = useState(1)

  useEffect(() => {
    const level = Number.parseInt(localStorage.getItem("bonus_level_unlocked") || "1")
    setUnlockedLevel(level)
  }, [])

  const levels = [
    { id: 1, title: "The Hidden Biome", description: "Find the glitch in the terrain generation code." },
    { id: 2, title: "The Ender Dragon's Secret", description: "Decrypt the dragon's roar to find the final flag." },
  ]

  return (
    <MCLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-minecraft text-yellow-400 text-shadow-mc">BONUS QUESTS</h1>
          <p className="text-stone-400 font-minecraft max-w-2xl mx-auto">
            Solve these sequential challenges to earn legendary status. You must complete each quest to unlock the next.
          </p>
        </div>

        <div className="grid gap-6 max-w-3xl mx-auto">
          {levels.map((level) => {
            const isUnlocked = level.id <= unlockedLevel
            const isCompleted = level.id < unlockedLevel

            return (
              <MCCard
                key={level.id}
                className={`transition-all ${isUnlocked ? "hover:scale-[1.02]" : "opacity-75 grayscale"}`}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-6">
                    <div
                      className={`w-16 h-16 flex items-center justify-center border-4 border-black ${
                        isUnlocked ? "bg-mc-gold" : "bg-stone-700"
                      }`}
                    >
                      {isCompleted ? (
                        <Star className="w-8 h-8 text-white fill-white" />
                      ) : isUnlocked ? (
                        <Unlock className="w-8 h-8 text-white" />
                      ) : (
                        <Lock className="w-8 h-8 text-stone-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-minecraft text-white mb-1">
                        Level {level.id}: {level.title}
                      </h3>
                      <p className="text-stone-400 text-sm font-minecraft">{level.description}</p>
                    </div>
                  </div>
                  <div>
                    {isUnlocked ? (
                      <Link href={`/bonus/${level.id}`}>
                        <MCButton variant={isCompleted ? "success" : "default"}>
                          {isCompleted ? "REPLAY" : "START"}
                        </MCButton>
                      </Link>
                    ) : (
                      <MCButton variant="stone" disabled>
                        LOCKED
                      </MCButton>
                    )}
                  </div>
                </div>
              </MCCard>
            )
          })}
        </div>
      </div>
    </MCLayout>
  )
}
