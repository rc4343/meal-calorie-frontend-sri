"use client";

import { useMealStore } from "@/stores/mealStore";
import { useTranslation } from "@/lib/i18n";
import { Card, CardContent } from "@/components/ui/card";

export function HeroSummary() {
  const { t } = useTranslation();
  const totalCalories = useMealStore((s) => s.totalCalories);
  const mealCount = useMealStore((s) => s.meals.length);

  return (
    <Card className="bg-primary text-primary-foreground">
      <CardContent className="flex flex-col items-center gap-1 py-8 text-center sm:flex-row sm:justify-around sm:py-10">
        <div>
          <p className="text-4xl font-extrabold tabular-nums sm:text-5xl">{totalCalories}</p>
          <p className="mt-1 text-sm opacity-80">{t("dashboard.kcalToday")}</p>
        </div>
        <div className="hidden h-12 w-px bg-primary-foreground/20 sm:block" />
        <div>
          <p className="text-4xl font-extrabold tabular-nums sm:text-5xl">{mealCount}</p>
          <p className="mt-1 text-sm opacity-80">
            {mealCount === 1 ? t("dashboard.mealSearched") : t("dashboard.mealsSearched")}
          </p>
        </div>
      </CardContent>
      {mealCount === 0 && (
        <p className="pb-6 text-center text-sm opacity-70">{t("dashboard.emptyHero")}</p>
      )}
    </Card>
  );
}
