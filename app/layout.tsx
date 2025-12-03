import type React from "react"
import type { Metadata } from "next"
import { Press_Start_2P } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "sonner"
import MinecraftCompilerSidebar from "@/components/minecraft/side-bar"


const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-minecraft",
})

export const metadata: Metadata = {
  title: "MineTheFlag - Coding Contest",
  description: "A Minecraft-themed coding contest by HackerRank X Codechef Club of GIT",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${pressStart2P.variable} font-minecraft antialiased bg-stone-900 text-white overflow-x-hidden`}>
        {children}
        <Toaster position="top-right" theme="dark" />
        <Analytics />
        <MinecraftCompilerSidebar/>
      </body>
    </html>
  )
}
