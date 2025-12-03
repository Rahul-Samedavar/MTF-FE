"use client"

import React from "react"
import { cn } from "@/lib/utils"
// <CHANGE> Added MCAlert export
import { MCAlert } from "./alert"

export { MCAlert }

interface MCButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "danger" | "success" | "stone"
}

export const MCButton = React.forwardRef<HTMLButtonElement, MCButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-mc-stone text-white hover:bg-mc-stone-dark",
      danger: "bg-red-600 text-white hover:bg-red-700",
      success: "bg-mc-green text-white hover:bg-mc-green-dark",
      stone: "bg-stone-600 text-stone-200 hover:bg-stone-700",
    }

    return (
      <button
        ref={ref}
        className={cn(
          "mc-btn px-6 py-3 font-minecraft text-sm uppercase tracking-wider border-2 border-black",
          variants[variant],
          className,
        )}
        {...props}
      />
    )
  },
)
MCButton.displayName = "MCButton"

export const MCCard = ({
  children,
  className,
  title,
}: { children: React.ReactNode; className?: string; title?: string }) => {
  return (
    <div
      className={cn("relative bg-stone-800 border-4 border-black p-1 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]", className)}
    >
      <div className="absolute inset-0 border-2 border-white/10 pointer-events-none" />
      {title && (
        <div className="bg-stone-700 border-b-4 border-black p-3 mb-4 -mx-1 -mt-1 flex items-center justify-between">
          <h3 className="text-shadow-mc text-white font-bold">{title}</h3>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 border border-black" />
            <div className="w-3 h-3 bg-yellow-500 border border-black" />
            <div className="w-3 h-3 bg-green-500 border border-black" />
          </div>
        </div>
      )}
      <div className="p-2">{children}</div>
    </div>
  )
}

export const MCInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full bg-black/30 border-4 border-stone-600 p-3 font-minecraft text-white placeholder:text-stone-500 focus:outline-none focus:border-mc-green focus:bg-black/50 transition-colors",
          className,
        )}
        {...props}
      />
    )
  },
)
MCInput.displayName = "MCInput"

export const MCLabel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <label className={cn("block text-stone-400 text-xs mb-2 uppercase tracking-widest", className)}>{children}</label>
)

// <CHANGE> Added MCImage component
export const MCImage = ({
  src,
  alt,
  caption,
  className,
}: { src: string; alt: string; caption?: string; className?: string }) => {
  return (
    <div className={cn("inline-block", className)}>
      <div className="bg-stone-800 border-4 border-black p-2 shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]">
        <div className="relative border-2 border-stone-600">
          <img src={src || "/placeholder.svg"} alt={alt} className="block max-w-full h-auto" />
          <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none" />
        </div>
        {caption && <div className="mt-2 text-center font-minecraft text-stone-400 text-xs">{caption}</div>}
      </div>
    </div>
  )
}

// <CHANGE> Added MCCodeBlock component
export const MCCodeBlock = ({ code, language = "text" }: { code: string; language?: string }) => {
  return (
    <div className="bg-black/80 border-2 border-stone-600 p-4 font-mono text-sm text-green-400 overflow-x-auto my-4 shadow-inner">
      <div className="flex justify-between items-center mb-2 border-b border-stone-700 pb-2">
        <span className="text-stone-500 text-xs uppercase">{language}</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <div className="w-2 h-2 rounded-full bg-yellow-500" />
          <div className="w-2 h-2 rounded-full bg-green-500" />
        </div>
      </div>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  )
}
