"use client";
import { MCLayout } from "@/components/minecraft/layout";
import { MCCard } from "@/components/minecraft/ui";
import { apiRequest } from "@/lib/api";
import Link from "next/link";
import {
  Code,
  Terminal,
  Bug,
  RotateCcw,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { useEffect, useState } from "react";

const problems = [
  {
    id: 1,
    title: "Hamming Weights",
    difficulty: "Easy",
    points: 100,
    category: "Normal",
    description: "Find the count of 1's in binary",
  },
  {
    id: 2,
    title: "Redstone Circuit",
    difficulty: "Medium",
    points: 200,
    category: "Debugging",
    description: "Reverse engineer the redstone encoding algorithm.",
  },
  {
    id: 3,
    title: "Mystery Function",
    difficulty: "Hard",
    points: 300,
    category: "Function Reversal",
    description: "Determine what this obfuscated function does.",
  },
  {
    id: 4,
    title: "Path Finder",
    difficulty: "Medium",
    points: 250,
    category: "Algorithm",
    description: "Optimize the pathfinding algorithm for efficiency.",
  },
  {
    id: 5,
    title: "Simple Cipher",
    difficulty: "Easy",
    points: 150,
    category: "Normal",
    description: "Decode a basic encryption scheme.",
  },
  {
    id: 6,
    title: "Memory Leak Hunt",
    difficulty: "Hard",
    points: 350,
    category: "Debugging",
    description: "Find and fix the memory leak in the server code.",
  },
];

const categoryConfig = {
  Normal: {
    icon: Code,
    color: "blue",
    bgClass: "bg-blue-900/30",
    borderClass: "border-blue-600",
    textClass: "text-blue-400",
    iconBg: "bg-blue-600",
    description: "Standard coding challenges",
  },
  Debugging: {
    icon: Bug,
    color: "red",
    bgClass: "bg-red-900/30",
    borderClass: "border-red-600",
    textClass: "text-red-400",
    iconBg: "bg-red-600",
    description: "Find and fix bugs in existing code",
  },
  "Function Reversal": {
    icon: RotateCcw,
    color: "purple",
    bgClass: "bg-purple-900/30",
    borderClass: "border-purple-600",
    textClass: "text-purple-400",
    iconBg: "bg-purple-600",
    description: "Reverse engineer mysterious functions",
  },
  Algorithm: {
    icon: Cpu,
    color: "green",
    bgClass: "bg-green-900/30",
    borderClass: "border-green-600",
    textClass: "text-green-400",
    iconBg: "bg-green-600",
    description: "Optimize and improve algorithms",
  },
};

export default function ProblemsPage() {
  const [solvedProblems, setSolvedProblems] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolvedProblems();
  }, []);

  const fetchSolvedProblems = async () => {
    try {
      const response = await apiRequest<{ok: Boolean, x: [number] }>("/team/solved", {
        method: "POST",
        body: JSON.stringify({}),
      });

      console.log("Fetched Solved Prbls");
      console.log(response);
      if (response.ok) {
        setSolvedProblems(response.x);
      }
    } catch (error) {
      console.error("Failed to fetch solved problems:", error);
    } finally {
      setLoading(false);
    }
  };

  // Group problems by category
  const problemsByCategory = problems.reduce((acc, problem) => {
    if (!acc[problem.category]) {
      acc[problem.category] = [];
    }
    acc[problem.category].push(problem);
    return acc;
  }, {} as Record<string, typeof problems>);

  return (
    <MCLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-amber-600 border-4 border-black flex items-center justify-center">
            <Terminal className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white text-shadow-mc">
              CODING CHALLENGES
            </h1>
            <p className="text-stone-400 text-lg mt-1 font-minecraft">
              Fix bugs, write code, and optimize algorithms to capture flags.
            </p>
          </div>
        </div>

        {/* Categories */}
        {Object.entries(problemsByCategory).map(
          ([category, categoryProblems]) => {
            const config =
              categoryConfig[category as keyof typeof categoryConfig];
            const CategoryIcon = config.icon;

            return (
              <div key={category} className="space-y-4">
                {/* Category Header */}
                <div
                  className={`border-4 ${config.borderClass} ${config.bgClass} p-4`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 ${config.iconBg} border-4 border-black flex items-center justify-center`}
                    >
                      <CategoryIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className={`text-2xl font-bold ${config.textClass}`}>
                        {category}
                      </h2>
                      <p className="text-stone-400 text-sm font-minecraft">
                        {config.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Problems Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {categoryProblems.map((problem) => {
                    const isSolved = solvedProblems.includes(problem.id);

                    return (
                      <Link key={problem.id} href={`/problems/${problem.id}`}>
                        <MCCard
                          className={`hover:scale-[1.02] transition-transform cursor-pointer h-full ${
                            isSolved ? "opacity-75" : ""
                          }`}
                        >
                          <div className="space-y-4 h-full flex flex-col">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <h3 className="text-xl font-bold text-white">
                                    {problem.title}
                                  </h3>
                                  {isSolved && (
                                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                                  )}
                                </div>
                                <div className="flex gap-2 flex-wrap">
                                  <span
                                    className={`px-2 py-1 border-2 text-xs font-bold ${
                                      problem.difficulty === "Easy"
                                        ? "bg-green-900/50 border-green-600 text-green-400"
                                        : problem.difficulty === "Medium"
                                        ? "bg-yellow-900/50 border-yellow-600 text-yellow-400"
                                        : "bg-red-900/50 border-red-600 text-red-400"
                                    }`}
                                  >
                                    {problem.difficulty}
                                  </span>
                                  {isSolved && (
                                    <span className="px-2 py-1 bg-green-900/50 border-2 border-green-600 text-xs font-bold text-green-400">
                                      SOLVED
                                    </span>
                                  )}
                                </div>
                              </div>
                              <CategoryIcon
                                className={`w-8 h-8 ${config.textClass} flex-shrink-0`}
                              />
                            </div>

                            <p className="text-stone-400 text-sm font-minecraft flex-grow">
                              {problem.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t-2 border-stone-700 mt-auto">
                              <span className="text-stone-500 text-xs">
                                REWARD
                              </span>
                              <span
                                className={`text-2xl font-bold ${
                                  isSolved ? "text-green-400" : "text-mc-green"
                                }`}
                              >
                                {problem.points} pts
                              </span>
                            </div>
                          </div>
                        </MCCard>
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          }
        )}

        {loading && (
          <div className="text-center text-stone-400 py-8">
            Loading solved problems...
          </div>
        )}
      </div>
    </MCLayout>
  );
}
