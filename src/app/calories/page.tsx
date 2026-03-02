"use client";

import { useState } from "react";
import { MealForm } from "@/components/MealForm";
import { ResultCard } from "@/components/ResultCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import { useAuthGuard } from "@/lib/useAuthGuard";
import type { CalorieResponse } from "@/types";

export default function CaloriesPage() {
  useAuthGuard();
  const [result, setResult] = useState<CalorieResponse | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <section className="flex min-h-[calc(100vh-3.5rem-3rem)] flex-col items-center justify-start pt-8 sm:justify-center sm:pt-0" aria-label="Calorie lookup">
      <div className="w-full max-w-xl space-y-6">
        <MealForm onResult={setResult} onLoading={setLoading} />
        <aside aria-label="Calorie results">
          {loading && <SkeletonCard />}
          {!loading && result && <ResultCard data={result} />}
        </aside>
      </div>
    </section>
  );
}
