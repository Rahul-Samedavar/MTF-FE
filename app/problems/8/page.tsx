"use client";

import type React from "react";

import { useState } from "react";
import { MCLayout } from "@/components/minecraft/layout";
import {
  MCButton,
  MCCard,
  MCInput,
  MCLabel,
  MCCodeBlock,
} from "@/components/minecraft/ui";
import { MCAlert } from "@/components/minecraft/alert";
import { MiningAnimation } from "@/components/minecraft/mining-animation";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { Flag } from "lucide-react";

export default function ProblemResourceGatheringPage() {
  const [flag, setFlag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; reason?: string } | null>(
    null
  );
  const [miningState, setMiningState] = useState<
    "idle" | "mining" | "success" | "failure"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    setMiningState("mining");

    try {
      const response = await apiRequest<{ ok: boolean; reason?: string }>(
        "/submit",
        {
          method: "POST",
          body: JSON.stringify({
            problem_id: 8, // Resource Gathering DP Problem
            flag: flag,
          }),
        }
      );

      setMiningState(response.ok ? "success" : "failure");
      setResult(response);

      if (response.ok) {
        toast.success("Correct flag! Points awarded!");
        setFlag("");
      } else {
        toast.error("Incorrect flag. Try again!");
      }
    } catch (error) {
      setMiningState("failure");
      toast.error(error instanceof Error ? error.message : "Submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAnimationComplete = () => {
    setMiningState("idle");
  };

  return (
    <MCLayout>
      <MiningAnimation
        state={miningState}
        onComplete={handleAnimationComplete}
      />

      <div className="space-y-6 max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-yellow-600 border-4 border-black animate-float" />
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              8. OPTIMAL RESOURCE GATHERING
            </h1>

            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Dynamic Programming
              </span>

              <span className="px-2 py-1 bg-red-900/50 border-2 border-red-600 text-xs font-bold text-red-400">
                Hard
              </span>

              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                200 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* DESCRIPTION */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              Steve explores multiple regions in a Minecraft world. Each region
              contains three resources:
              <strong> wood, stone, and gold</strong>. He must collect resources
              strategically to maximize total gain.
            </p>

            <ul className="list-disc ml-6">
              <li>
                Pick exactly <strong>one resource</strong> per region
              </li>
              <li>
                <strong>Cannot pick the same resource type</strong> in two
                consecutive regions
              </li>
            </ul>

            <p>
              A buggy implementation exists that attempts to compute the maximum
              possible resources but fails. Your task is to fix the dynamic
              programming logic so all hidden judge tests pass.
            </p>

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
              <li>A buggy DP implementation</li>
              <li>A hidden judge that tests correctness exhaustively</li>
            </ul>

            <p>
              Your goal: Fix <strong>only the DP transition logic</strong>.
            </p>

            <div className="bg-stone-900 border-2 border-stone-700 p-4 rounded">
              <p className="font-bold text-red-400 text-sm mb-1">Important:</p>
              <ul className="list-disc ml-6 text-xs text-stone-400">
                <li>No changes to harness</li>
                <li>No extra print statements</li>
                <li>Maintain required function signatures</li>
              </ul>
            </div>

            <MCCodeBlock
              language="text"
              code={`Rules Recap:
1. Pick ONE resource per region.
2. Cannot repeat the SAME resource type in consecutive regions.
Goal: Maximize total collected resources.`}
            />
          </div>
        </MCCard>

        {/* INPUT / OUTPUT */}
        <MCCard title="INPUT & OUTPUT">
          <div className="space-y-2 text-stone-300">
            <p>
              <strong>Input:</strong> <code>int[][] resources</code> — a list of
              regions, each with 3 resource values.
            </p>
            <p>
              <strong>Output:</strong> <code>int</code> — the maximum total
              resources Steve can gather.
            </p>
            <ul className="list-disc ml-6 text-sm">
              <li>resources[i][0] = wood</li>
              <li>resources[i][1] = stone</li>
              <li>resources[i][2] = gold</li>
            </ul>
          </div>
        </MCCard>

        {/* SAMPLE TESTCASES */}
        <MCCard title="SAMPLE TESTCASES">
          <MCCodeBlock
            language="text"
            code={`Example 1:
Input:
[ [3, 2, 5],
  [1, 3, 4],
  [4, 3, 2] ]
Output: 12

Example 2:
Input:
[ [1, 2, 3],
  [3, 2, 1],
  [2, 3, 1],
  [4, 1, 2] ]
Output: 13

Example 3:
Input: [ [5, 5, 5] ]
Output: 5

Example 4:
Input: []
Output: 0`}
          />
        </MCCard>

        {/* VALIDATION */}
        <MCCard title="VALIDATION & RULES">
          <div className="space-y-2 text-stone-300">
            <p>The judge will:</p>
            <ul className="list-disc ml-6">
              <li>Compile & execute your fix</li>
              <li>Run extensive hidden testcases</li>
              <li>Accept only completely correct outputs</li>
            </ul>

            <p className="text-stone-400 text-xs mt-3">
              ⚠ No extra output, no debugging logs — strict validation.
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
                  ? "Correct!."
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
  );
}
