"use client";

import { useMealStore } from "@/stores/mealStore";
import { useTranslation } from "@/lib/i18n";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell,
  TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

function formatTime(date: Date | string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function MealHistoryTable() {
  const { t } = useTranslation();
  const meals = useMealStore((s) => s.meals);
  const removeMeal = useMealStore((s) => s.removeMeal);

  function handleRemove(id: string, dishName: string) {
    removeMeal(id);
    toast.success(t("history.removed").replace("{dish}", dishName));
  }

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
                  <TableHead className="w-10"><span className="sr-only">{t("history.actions")}</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {meals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell className="capitalize font-medium">{meal.dishName}</TableCell>
                    <TableCell className="text-right tabular-nums">{meal.servings}</TableCell>
                    <TableCell className="text-right tabular-nums">{meal.totalCalories} kcal</TableCell>
                    <TableCell className="text-right text-muted-foreground">{formatTime(meal.timestamp)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(meal.id, meal.dishName)}
                        aria-label={t("history.remove").replace("{dish}", meal.dishName)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
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
