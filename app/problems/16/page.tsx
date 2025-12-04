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

export default function Problem16Page() {
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
            problem_id: 16,
            flag: flag,
          }),
        }
      );

      setMiningState(response.ok ? "success" : "failure");
      setResult(response);

      if (response.ok) {
        toast.success("Correct flag! Minimum flips computed successfully!");
        setFlag("");
      } else {
        toast.error("Incorrect flag. Try calculating the flips carefully.");
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
              16. Min Flips Challenge – “Alternating Reality”
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Algorithmic Challenge
              </span>
              <span className="px-2 py-1 bg-blue-900/50 border-2 border-blue-600 text-xs font-bold text-blue-300">
                Easy
              </span>
              <span className="px-2 py-1 bg-mc-green border-2 border-black text-xs font-bold text-white">
                50 POINTS
              </span>
            </div>
          </div>
        </div>

        {/* Top Notice */}
        <MCCard title="IMPORTANT">
          <p className="text-stone-300 text-sm">
            Your job is to compute the <strong>minimum number of flips</strong>{" "}
            required to turn each binary string into an alternating pattern.
            Only precise computation will yield the correct flag.
          </p>
        </MCCard>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              You're given <strong>50 binary strings</strong> consisting only of
              '0' and '1'. Each string should be transformed into an alternating
              sequence:
            </p>
            <MCCodeBlock
              language="text"
              code={`010101010...
101010101...`}
            />
            <p>
              A <strong>flip</strong> means changing a '0' to '1' or a '1' to
              '0'. Compute the <em>minimum number of flips</em> needed for each
              string.
            </p>
          </div>
        </MCCard>

        {/* Algorithm */}
        <MCCard title="ALGORITHM">
          <div className="space-y-4 text-stone-300">
            <p>For each string:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Assume the string starts with '0', count mismatches →{" "}
                <code>flips_start_with_0</code>
              </li>
              <li>
                Assume the string starts with '1', count mismatches →{" "}
                <code>flips_start_with_1</code>
              </li>
              <li>
                Return <code>min(flips_start_with_0, flips_start_with_1)</code>
              </li>
            </ol>
            <MCCodeBlock
              language="python"
              code={`def flips_needed(s):
    flips_start_with_0 = sum(c != '01'[i%2] for i, c in enumerate(s))
    flips_start_with_1 = sum(c != '10'[i%2] for i, c in enumerate(s))
    return min(flips_start_with_0, flips_start_with_1)`}
            />
          </div>
        </MCCard>

        {/* Hints */}
        <MCCard title="HINTS">
          <div className="space-y-2 text-stone-300 text-sm">
            <p>• Check both possible alternating patterns.</p>
            <p>
              • Carefully count mismatches; off-by-one errors break validation.
            </p>
            <p>• Output exactly 50 integers, one per string.</p>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={
                result.ok
                  ? "Correct! All flips counted accurately."
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
              {submitting ? "MINING..." : "SUBMIT FLAG"}
            </MCButton>
          </form>
        </MCCard>
      </div>
    </MCLayout>
  );
}
