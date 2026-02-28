"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Check, Share2 } from "lucide-react";
import { useTranslation } from "@/lib/i18n";
import { useMealStore } from "@/stores/mealStore";
import type { CalorieResponse } from "@/types";

const DAILY_GOAL = 2000;

interface ResultCardProps {
  data: CalorieResponse;
}

export function ResultCard({ data }: ResultCardProps) {
  const { t } = useTranslation();
  const addMeal = useMealStore((s) => s.addMeal);
  const [added, setAdded] = useState(false);

  const pct = Math.min(Math.round((data.total_calories / DAILY_GOAL) * 100), 100);

  function handleAdd() {
    addMeal({
      dishName: data.dish_name,
      servings: data.servings,
      caloriesPerServing: data.calories_per_serving,
      totalCalories: data.total_calories,
      source: data.source,
    });
    setAdded(true);
    toast.success(t("result.added"));
  }

  async function handleShare() {
    const text = `${data.dish_name} (${data.servings} servings) = ${data.total_calories} kcal (${pct}% daily intake)`;

    if (navigator.share) {
      try {
        await navigator.share({ title: t("result.shareTitle"), text });
        return;
      } catch {
        // user cancelled or share failed, fall through to clipboard
      }
    }

    await navigator.clipboard.writeText(text);
    toast.success(t("result.copied"));
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <CardTitle className="capitalize">{data.dish_name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={handleShare} aria-label={t("result.share")}>
          <Share2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-5">
        <dl className="divide-y text-sm">
          <div className="flex items-center justify-between py-3 first:pt-0">
            <dt className="text-muted-foreground">{t("result.servings")}</dt>
            <dd className="font-medium">{data.servings}</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-muted-foreground">{t("result.caloriesPerServing")}</dt>
            <dd className="font-medium">{data.calories_per_serving} kcal</dd>
          </div>
          <div className="flex items-center justify-between py-3">
            <dt className="text-muted-foreground">{t("result.totalCalories")}</dt>
            <dd className="text-lg font-semibold text-primary">{data.total_calories} kcal</dd>
          </div>
          <div className="flex items-center justify-between py-3 last:pb-0">
            <dt className="text-muted-foreground">{t("result.source")}</dt>
            <dd className="font-medium text-xs">{data.source}</dd>
          </div>
        </dl>

        {/* daily intake percentage */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t("result.dailyIntake")}</span>
            <span className="font-semibold">{pct}%</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {t("result.dailyBasis")}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button
          className="flex-1"
          size="lg"
          onClick={handleAdd}
          disabled={added}
          variant={added ? "secondary" : "default"}
        >
          {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {added ? t("result.addedBtn") : t("result.addToLog")}
        </Button>
      </CardFooter>
    </Card>
  );
}
