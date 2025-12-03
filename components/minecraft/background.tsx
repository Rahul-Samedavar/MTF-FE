"use client"

import { useEffect, useRef } from "react"

export const ProceduralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let blocks: { x: number; y: number; size: number; speed: number; color: string }[] = []

    const colors = ["#3E7C3E", "#55AA55", "#8B4513", "#5d4037", "#7d7d7d"]

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const initBlocks = () => {
      blocks = []
      const count = Math.floor(window.innerWidth / 50)
      for (let i = 0; i < count; i++) {
        blocks.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: 20 + Math.random() * 40,
          speed: 0.5 + Math.random() * 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    const draw = () => {
      ctx.fillStyle = "#1c1917" // stone-900
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#292524" // stone-800
      ctx.lineWidth = 2
      const gridSize = 50

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw floating blocks
      blocks.forEach((block) => {
        ctx.fillStyle = block.color
        ctx.fillRect(block.x, block.y, block.size, block.size)

        // Pixel border effect
        ctx.strokeStyle = "rgba(0,0,0,0.3)"
        ctx.lineWidth = 4
        ctx.strokeRect(block.x, block.y, block.size, block.size)

        // Highlight
        ctx.fillStyle = "rgba(255,255,255,0.1)"
        ctx.fillRect(block.x, block.y, block.size, block.size / 4)

        block.y -= block.speed
        if (block.y + block.size < 0) {
          block.y = canvas.height + block.size
          block.x = Math.random() * canvas.width
        }
      })

      animationFrameId = requestAnimationFrame(draw)
    }

    window.addEventListener("resize", resize)
    resize()
    initBlocks()
    draw()

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 opacity-50 pointer-events-none" />
}
