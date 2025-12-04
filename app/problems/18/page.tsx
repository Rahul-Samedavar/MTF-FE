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

export default function Problem18Page() {
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
            problem_id: 18,
            flag: flag,
          }),
        }
      );

      setMiningState(response.ok ? "success" : "failure");
      setResult(response);

      if (response.ok) {
        toast.success("Correct flag! Last words counted precisely!");
        setFlag("");
      } else {
        toast.error("Incorrect flag. Check your last word lengths.");
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
              18. Length of Last Word – “Final Count”
            </h1>
            <div className="flex gap-2 mt-2">
              <span className="px-2 py-1 bg-stone-900 border-2 border-stone-700 text-xs text-stone-400">
                String Processing
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
            Accurately compute the length of the last word in each string.
            Trailing spaces must be ignored, and only alphabetic characters
            count. Precision is critical: the decoder expects exact results for
            all 50 strings.
          </p>
        </MCCard>

        {/* Description */}
        <MCCard title="DESCRIPTION">
          <div className="space-y-4 text-stone-300 leading-relaxed">
            <p>
              Each string may have trailing spaces. Your goal is to find the
              final contiguous sequence of letters (the last word) and return
              its length as a string.
            </p>

            <p>Implement the following Python function:</p>

            <MCCodeBlock
              language="python"
              code={`def solution(s: str) -> str:
    pass`}
            />

            <p>Example:</p>
            <MCCodeBlock
              language="text"
              code={`Input: "Hello World"
Output: "5"`}
            />

            <p>
              Repeat this accurately for all 50 strings to ensure the decoder
              returns the correct flag.
            </p>
          </div>
        </MCCard>

        {/* Algorithm */}
        <MCCard title="ALGORITHM">
          <div className="space-y-2 text-stone-300">
            <ol className="list-decimal list-inside space-y-1">
              <li>Trim trailing spaces from the string.</li>
              <li>Scan backward to find the last word.</li>
              <li>Count only alphabetic characters.</li>
              <li>Return the count as a string.</li>
            </ol>
          </div>
        </MCCard>

        {/* Hints */}
        <MCCard title="HINTS">
          <div className="space-y-2 text-stone-300 text-sm">
            <p>• Ignore spaces at the end of the string.</p>
            <p>• Only letters [a-zA-Z] are considered part of the last word.</p>
            <p>• Process all 50 strings exactly as specified.</p>
          </div>
        </MCCard>

        {/* Submit Flag */}
        <MCCard title="SUBMIT FLAG">
          {result && (
            <MCAlert
              type={result.ok ? "success" : "error"}
              message={
                result.ok
                  ? "Correct! Last words counted precisely."
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
