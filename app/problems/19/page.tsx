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
import { Flag, BookOpen } from "lucide-react";

export default function Problem19Page() {
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
            problem_id: 19,
            flag: flag,
          }),
        }
      );

      setMiningState(response.ok ? "success" : "failure");
      setResult(response);

      if (response.ok) {
        toast.success("Correct flag! Strings reversed and cased correctly!");
        setFlag("");
      } else {
        toast.error("Incorrect flag. Check your odd/even casing carefully.");
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
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-900/20 border-4 border-black flex items-center justify-center animate-pulse">
            <BookOpen className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white text-shadow-mc">
              19. Reverse & Odd-Even Casing – “Twist & Turn”
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                String Manipulation
              </span>
              <span className="px-2 py-1 bg-blue-900/50 border-2 border-blue-600 text-xs font-bold text-blue-300">
                Medium
              </span>
              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                50 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <MCCard title="IMPORTANT">
          <p className="text-stone-300 text-sm">
            Reverse the string, separate characters by odd/even positions, and
            apply lowercase/uppercase rules. Only correct outputs will allow the
            decoder to reveal the flag.
          </p>
        </MCCard>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              Each string must first be reversed. Then split characters into two
              strings based on 0-indexed positions:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Odd string → positions 0, 2, 4, … → lowercase</li>
              <li>Even string → positions 1, 3, 5, … → uppercase</li>
            </ul>

            <p>Return the result as a list of two strings:</p>

            <MCCodeBlock
              language="python"
              code={`def solution(s: str) -> list[str]:
    pass`}
            />

            <p>Example:</p>
            <MCCodeBlock
              language="text"
              code={`Input: "Hello"
Reversed: "olleH"
Odd positions: "OlH" → "olh"
Even positions: "le" → "LE"
Output: ["olh", "LE"]`}
            />

            <p>
              Repeat this accurately for all 50 strings to ensure the decoder
              reconstructs the correct flag.
            </p>
          </div>
        </MCCard>

        {/* Algorithm */}
        <MCCard title="ALGORITHM">
          <div className="space-y-2 text-stone-300">
            <ol className="list-decimal list-inside space-y-1">
              <li>Reverse the input string.</li>
              <li>
                Separate characters into odd (0,2,4,…) and even (1,3,5,…)
                positions.
              </li>
              <li>Apply lowercase to odd characters.</li>
              <li>Apply uppercase to even characters.</li>
              <li>Return as a list [odd_transformed, even_transformed].</li>
            </ol>
          </div>
        </MCCard>

        {/* Hints */}
        <MCCard title="HINTS">
          <div className="space-y-2 text-stone-300 text-sm">
            <p>• Reverse the string before splitting.</p>
            <p>• Odd/even positions are 0-indexed.</p>
            <p>• Flattened output expects 50 lists of two strings each.</p>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={
                result.ok
                  ? "Correct! Odd/even casing done perfectly."
                  : `Incorrect: ${result.reason || "Try again"}`
              }
              className="mb-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <MCLabel>Enter the decoded flag</MCLabel>
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
              {submitting ? "PROCESSING..." : "SUBMIT FLAG"}
            </MCButton>
          </form>
        </MCCard>
      </div>
    </MCLayout>
  );
}
