"use client";

import Link from "next/link";
import { HeroSummary } from "@/components/HeroSummary";
import { MealHistoryTable } from "@/components/MealHistoryTable";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n";
import { useAuthGuard } from "@/lib/useAuthGuard";

export function DashboardContent() {
  const { t } = useTranslation();
  useAuthGuard();

  return (
    <section aria-label="Dashboard">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <Button asChild>
          <Link href="/calories">{t("dashboard.addMeal")}</Link>
        </Button>
      </div>
      <div className="space-y-6">
        <HeroSummary />
        <MealHistoryTable />
      </div>
    </section>
  );
}
