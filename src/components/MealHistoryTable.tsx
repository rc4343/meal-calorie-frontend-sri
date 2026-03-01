"use client";

import { useMealStore } from "@/stores/mealStore";
import { useTranslation } from "@/lib/i18n";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export function MealHistoryTable() {
  const { t } = useTranslation();
  const meals = useMealStore((s) => s.meals);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("history.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {meals.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            {t("history.empty")}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("history.dish")}</TableHead>
                  <TableHead className="text-right">{t("history.servings")}</TableHead>
                  <TableHead className="text-right">{t("history.calories")}</TableHead>
                  <TableHead className="text-right">{t("history.time")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell className="capitalize font-medium">{meal.dishName}</TableCell>
                    <TableCell className="text-right tabular-nums">{meal.servings}</TableCell>
                    <TableCell className="text-right tabular-nums">{meal.totalCalories} kcal</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatTime(meal.timestamp)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
