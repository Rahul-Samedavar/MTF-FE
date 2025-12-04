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

export default function Problem17Page() {
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
            problem_id: 17,
            flag: flag,
          }),
        }
      );

      setMiningState(response.ok ? "success" : "failure");
      setResult(response);

      if (response.ok) {
        toast.success("Correct flag! Characters removed accurately!");
        setFlag("");
      } else {
        toast.error("Incorrect flag. Check your character removal logic.");
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
              17. Remove Characters Challenge – “Selective Erasure”
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                Algorithmic Challenge
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

        {/* Top Notice */}
        <MCCard title="IMPORTANT">
          <p className="text-stone-300 text-sm">
            Accuracy is critical. You must remove characters from{" "}
            <code>str1</code> that exist in <code>str2</code>
            exactly as described. Only precise results produce the correct flag.
          </p>
        </MCCard>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              You are given <strong>50 pairs of strings</strong> (
              <code>str1, str2</code>). Your task is to remove every character
              in <code>str1</code> that is present in <code>str2</code> and
              return the resulting string.
            </p>

            <MCCodeBlock
              language="python"
              code={`def solution(pair):
    str1, str2 = pair
    present = set(str2)
    return "".join([c for c in str1 if c not in present])`}
            />

            <p>Step-by-step example:</p>
            <MCCodeBlock
              language="text"
              code={`str1 = "abcdef"
str2 = "bd"
solution([str1, str2]) -> "acef"`}
            />
          </div>
        </MCCard>

        {/* Algorithm */}
        <MCCard title="ALGORITHM">
          <div className="space-y-4 text-stone-300">
            <ol className="list-decimal list-inside space-y-1">
              <li>
                Go through each character in <code>str1</code>.
              </li>
              <li>
                If the character exists in <code>str2</code>, skip it;
                otherwise, keep it.
              </li>
              <li>
                Return the new string formed by all kept characters, preserving
                order.
              </li>
            </ol>
          </div>
        </MCCard>

        {/* Hints */}
        <MCCard title="HINTS">
          <div className="space-y-2 text-stone-300 text-sm">
            <p>
              • Preserve original order of <code>str1</code>.
            </p>
            <p>
              • Only remove characters present in <code>str2</code>.
            </p>
            <p>• Be careful with empty strings or repeated characters.</p>
            <p>• Flatten the outputs exactly for the decoder.</p>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={
                result.ok
                  ? "Correct! All characters removed accurately."
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
