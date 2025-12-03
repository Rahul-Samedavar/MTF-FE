"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MCButton } from "./ui"
import { ProceduralBackground } from "./background"
import { removeAuthToken, getAdminToken } from "@/lib/api"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export const MCLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(!!getAdminToken())
  }, [])

  const handleLogout = () => {
    removeAuthToken()
    router.push("/")
  }

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Team", href: "/team" },
    { name: "Lobby", href: "/lobby" },
    { name: "Problems", href: "/problems" },
    { name: "Bonus", href: "/bonus" },
    { name: "Leaderboard", href: "/leaderboard" },
    ...(isAdmin ? [{ name: "OP Console", href: "/admin" }] : []),
  ]

  return (
    <div className="min-h-screen flex flex-col relative">
      <ProceduralBackground />

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-stone-800 border-b-4 border-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-mc-green border-4 border-black group-hover:animate-bounce" />
                <span className="text-xl font-bold text-white text-shadow-mc tracking-widest">
                  {/* Updated logo text */}
                  MINE<span className="text-mc-green">THE</span>FLAG
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              {navItems.map((item) => (
                <Link key={item.name} href={item.href}>
                  <MCButton variant={pathname === item.href ? "success" : "stone"} className="text-xs py-2">
                    {item.name}
                  </MCButton>
                </Link>
              ))}
              <MCButton variant="danger" onClick={handleLogout} className="text-xs py-2 ml-4">
                Logout
              </MCButton>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-stone-400 hover:text-white">
                {isMenuOpen ? <X size={32} /> : <Menu size={32} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-stone-900 border-b-4 border-black p-4 space-y-2">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href} onClick={() => setIsMenuOpen(false)}>
                <div
                  className={cn(
                    "block px-4 py-3 text-center border-2 border-black font-minecraft text-sm",
                    pathname === item.href ? "bg-mc-green text-white" : "bg-stone-700 text-stone-300",
                  )}
                >
                  {item.name}
                </div>
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 text-center border-2 border-black font-minecraft text-sm bg-red-600 text-white"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>

      {/* Footer */}
      <footer className="bg-stone-900 border-t-4 border-black py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-stone-500 text-xs font-minecraft">
          <p>BUILT WITH BLOCKS & CODE</p>
          <p className="mt-2">v0.1.0 BETA</p>
        </div>
      </footer>
    </div>
  )
}
