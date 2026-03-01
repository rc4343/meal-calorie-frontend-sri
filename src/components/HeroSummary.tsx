"use client";

import { useMealStore } from "@/stores/mealStore";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

const DAILY_GOAL = 2000;

export function HeroSummary() {
  const { t } = useTranslation();
  const totalCalories = useMealStore((s) => s.totalCalories);
  const mealCount = useMealStore((s) => s.meals.length);

  const pct = Math.round((totalCalories / DAILY_GOAL) * 100);
  const exceeded = totalCalories > DAILY_GOAL;

  return (
    <Card className={exceeded ? "border-destructive bg-destructive/5" : "bg-primary text-primary-foreground"}>
      <CardContent className="flex flex-col items-center gap-1 py-8 text-center sm:flex-row sm:justify-around sm:py-10">
        <div>
          <p className={`text-4xl font-extrabold tabular-nums sm:text-5xl ${exceeded ? "text-destructive" : ""}`}>
            {totalCalories}
          </p>
          <p className="mt-1 text-sm opacity-80">{t("dashboard.kcalToday")}</p>
        </div>
        <div className={`hidden h-12 w-px sm:block ${exceeded ? "bg-destructive/20" : "bg-primary-foreground/20"}`} />
        <div>
          <p className={`text-4xl font-extrabold tabular-nums sm:text-5xl ${exceeded ? "text-foreground" : ""}`}>
            {mealCount}
          </p>
          <p className="mt-1 text-sm opacity-80">
            {mealCount === 1 ? t("dashboard.mealSearched") : t("dashboard.mealsSearched")}
          </p>
        </div>
      </CardContent>

      {/* progress bar */}
      {mealCount > 0 && (
        <div className="px-6 pb-6">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="opacity-70">{pct}% {t("dashboard.ofDaily")}</span>
            <span className="opacity-70">{DAILY_GOAL} kcal</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary-foreground/20" role="progressbar" aria-valuenow={Math.min(pct, 100)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className={`h-full rounded-full transition-all duration-500 ${exceeded ? "bg-destructive" : "bg-primary-foreground"}`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* exceeded warning */}
      {exceeded && (
        <div className="flex items-center justify-center gap-2 border-t border-destructive/20 px-6 py-3">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            {t("dashboard.exceeded").replace("{over}", String(totalCalories - DAILY_GOAL))}
          </p>
        </div>
      )}

      {mealCount === 0 && (
        <p className="pb-6 text-center text-sm opacity-70">{t("dashboard.emptyHero")}</p>
      )}
    </Card>
  );
}
