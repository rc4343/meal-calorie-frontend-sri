"use client";

import { useState } from "react";
import { MealForm } from "@/components/MealForm";
import { ResultCard } from "@/components/ResultCard";
import { SkeletonCard } from "@/components/SkeletonCard";
import type { CalorieResponse } from "@/types";

export default function CaloriesPage() {
  const [result, setResult] = useState<CalorieResponse | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <section className="py-6" aria-label="Calorie lookup">
      <div className="mx-auto max-w-xl space-y-6">
        <MealForm onResult={setResult} onLoading={setLoading} />
        <aside aria-label="Calorie results">
          {loading && <SkeletonCard />}
          {!loading && result && <ResultCard data={result} />}
        </aside>
      </div>
    </section>
  );
}
