"use client"

import type React from "react"

import { useState } from "react"
import { MCLayout } from "@/components/minecraft/layout"
import { MCButton, MCCard, MCInput, MCLabel, MCCodeBlock } from "@/components/minecraft/ui"
import { MCAlert } from "@/components/minecraft/alert"
import { MiningAnimation } from "@/components/minecraft/mining-animation"
import { apiRequest } from "@/lib/api"
import { toast } from "sonner"
import { Flag } from "lucide-react"

export default function ProblemDijkstraPage() {
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
          problem_id: 21,
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
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 border-4 border-black animate-float" />
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              SHORTEST PATH IN MINECRAFT VILLAGE
            </h1>

            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Debugging
              </span>

              <span className="px-2 py-1 bg-red-900/50 border-2 border-red-600 text-xs font-bold text-red-400">
                Hard
              </span>

              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                250 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              Steve must travel across a Minecraft village represented as a <strong>weighted graph</strong>.
              The adjacency matrix indicates travel cost/danger between nodes. A buggy Dijkstra implementation is provided that produces incorrect results.
              Your goal is to debug and correct it.
            </p>

            <ul className="list-disc ml-6">
              <li>graph[i][j] → cost/danger from node i → j</li>
              <li>graph[i][j] == -1 → no direct path</li>
              <li>Graph is directed but should also work for undirected cases</li>
            </ul>

            <div className="border border-stone-700 bg-stone-900 p-4 text-sm rounded">
              <p className="font-semibold">FLAG (on successful validation):</p>
            </div>
          </div>
        </MCCard>

        {/* CHALLENGE DETAILS */}
        <MCCard title="CHALLENGE">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>You will receive:</p>
            <ul className="list-disc ml-6">
              <li>A buggy Dijkstra implementation</li>
              <li>A hidden judge that validates your solution on multiple graphs</li>
            </ul>

            <p>Your task: <strong>fix only the Dijkstra logic</strong> so that all tests pass.</p>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 rounded">
              <p className="font-bold text-red-400 text-sm mb-1">Important:</p>
              <ul className="list-disc ml-6 text-xs text-stone-400">
                <li>Do NOT modify the judge harness</li>
                <li>Do NOT print extra debug logs</li>
                <li>Do NOT change function signatures</li>
              </ul>
            </div>

            <MCCodeBlock
              language="text"
              code={`Algorithm Recap:
1. Initialize dist[src] = 0, others = ∞
2. Use visited set or priority selection
3. Pick the unvisited node with smallest distance
4. Relax all outgoing edges:
   if graph[u][v] != -1:
       dist[v] = min(dist[v], dist[u] + graph[u][v])
5. Repeat until all nodes are processed`}
            />
          </div>
        </MCCard>

        {/* INPUT / OUTPUT */}
        <MCCard title="INPUT & OUTPUT">
          <div className="space-y-2 text-stone-300">
            <p><strong>Input:</strong> <code>int[][] graph</code> — adjacency matrix, <code>int src</code> — source node.</p>
            <p><strong>Output:</strong> <code>int[] dist</code> — minimum travel cost from <code>src</code> to all nodes, or <code>Integer.MAX_VALUE</code> if unreachable.</p>
          </div>
        </MCCard>

        {/* SAMPLE TESTCASES */}
        <MCCard title="SAMPLE TESTCASES">
          <MCCodeBlock
            language="text"
            code={`Example 1:
Input:
graph = [
  [0, 2, -1],
  [-1, 0, 3],
  [4, -1, 0]
], src = 0
Output: [0, 2, 5]

Example 2:
Input:
graph = [
  [0, 5, -1, 10],
  [-1, 0, 3, -1],
  [-1, -1, 0, 1],
  [-1, -1, -1, 0]
], src = 0
Output: [0, 5, 8, 9]

Example 3 (Disconnected):
Input:
graph = [
  [0, -1, -1],
  [-1, 0, -1],
  [-1, -1, 0]
], src = 0
Output: [0, INF, INF]`}
          />
        </MCCard>

        {/* VALIDATION */}
        <MCCard title="VALIDATION & RULES">
          <div className="space-y-2 text-stone-300">
            <p>The judge will:</p>
            <ul className="list-disc ml-6">
              <li>Compile and execute your corrected Dijkstra implementation</li>
              <li>Test it on multiple hidden graphs</li>
              <li>Accept only fully correct solutions</li>
            </ul>

            <p className="text-stone-400 text-xs mt-3">
              ⚠ No debug logs, no extra output. Strict validation.
            </p>
          </div>
        </MCCard>

        {/* SUBMIT FLAG */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={
                result.ok
                    ? "Correct! Shortest paths computed."
                    : `Incorrect: ${result.reason || "Try again"}`
                }

className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <MCLabel>Enter the flag you discovered</MCLabel>
              <MCInput
                value={flag}
                onChange={(e) => setFlag(e.target.value)}
                placeholder="CCXHR{...}"
                required
              />
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