"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Pickaxe, Gem, Box } from "lucide-react"

interface MiningAnimationProps {
  state: "idle" | "mining" | "success" | "failure"
  onComplete?: () => void
}

export const MiningAnimation = ({ state, onComplete }: MiningAnimationProps) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string }[]>([])

  useEffect(() => {
    if (state === "success" || state === "failure") {
      // Generate particles
      const newParticles = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 100,
        y: (Math.random() - 0.5) * 100,
        color: state === "success" ? "#00ffff" : "#7d7d7d",
      }))
      setParticles(newParticles)

      const timer = setTimeout(() => {
        onComplete?.()
      }, 2000)
      return () => clearTimeout(timer)
    } else {
      setParticles([])
    }
  }, [state, onComplete])

  if (state === "idle") return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative">
        {/* Block being mined */}
        <div
          className={cn(
            "w-32 h-32 bg-stone-800 border-4 border-black relative flex items-center justify-center transition-all duration-100",
            state === "mining" && "animate-pulse",
            (state === "success" || state === "failure") && "scale-0 opacity-0",
          )}
        >
          <div className="absolute inset-0 border-2 border-white/10" />
          <div className="text-stone-600 font-bold text-4xl">?</div>
        </div>

        {/* Pickaxe */}
        <div
          className={cn(
            "absolute -right-12 -top-12 text-white transition-all duration-300",
            state === "mining" && "animate-mine origin-bottom-left",
            (state === "success" || state === "failure") && "opacity-0",
          )}
        >
          <Pickaxe className="w-24 h-24 fill-yellow-500 text-black" />
        </div>

        {/* Success: Diamonds */}
        {state === "success" && (
          <div className="absolute inset-0 flex items-center justify-center animate-pop">
            <Gem className="w-32 h-32 text-cyan-400 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]" />
          </div>
        )}

        {/* Failure: Cobblestone */}
        {state === "failure" && (
          <div className="absolute inset-0 flex items-center justify-center animate-pop">
            <Box className="w-32 h-32 text-stone-500" />
          </div>
        )}

        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-4 h-4 border-2 border-black"
            style={{
              backgroundColor: p.color,
              left: "50%",
              top: "50%",
              transform: `translate(${p.x}px, ${p.y}px)`,
              opacity: 0,
              animation: "pop 0.5s forwards",
              animationDelay: `${Math.random() * 0.2}s`,
            }}
          />
        ))}

        {/* Text Feedback */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 whitespace-nowrap">
          {state === "success" && (
            <h2 className="text-4xl font-bold text-cyan-400 text-shadow-mc animate-bounce">DIAMONDS FOUND!</h2>
          )}
          {state === "failure" && (
            <h2 className="text-4xl font-bold text-red-500 text-shadow-mc animate-bounce">JUST COBBLESTONE...</h2>
          )}
        </div>
      </div>
    </div>
  )
}
