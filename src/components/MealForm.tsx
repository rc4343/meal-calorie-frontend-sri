"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

import { mealSchema } from "@/lib/validations";
import type { MealFormData } from "@/lib/validations";
import { getCalories } from "@/lib/api";
import type { ApiError } from "@/lib/api";
import { useTranslation } from "@/lib/i18n";
import type { CalorieResponse } from "@/types";

interface MealFormProps {
  onResult: (data: CalorieResponse) => void;
  onLoading: (loading: boolean) => void;
}

export function MealForm({ onResult, onLoading }: MealFormProps) {
  const { t } = useTranslation();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MealFormData>({
    resolver: zodResolver(mealSchema),
    defaultValues: { dish_name: "", servings: 1 },
  });

  async function onSubmit(values: MealFormData) {
    setSubmitting(true);
    onLoading(true);
    try {
      const res = await getCalories({
        dish_name: values.dish_name,
        servings: values.servings,
      });
      const d = res.data;
      onResult(d);
      toast.success(`Found ${d.total_calories} kcal for ${d.dish_name}`);
    } catch (err) {
      const apiErr = err as ApiError;
      toast.error(apiErr.message || "Could not fetch calorie data.");
    } finally {
      setSubmitting(false);
      onLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("meal.title")}</CardTitle>
        <CardDescription>{t("meal.placeholder")}</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <CardContent className="space-y-5">
          <fieldset className="space-y-2">
            <Label htmlFor="dish_name">{t("meal.dishName")}</Label>
            <Input id="dish_name" placeholder={t("meal.dishPlaceholder")}
              autoComplete="off" className="h-12 text-base sm:h-10 sm:text-sm"
              aria-invalid={!!errors.dish_name} {...register("dish_name")} />
            {errors.dish_name && (
              <p className="text-sm text-destructive" role="alert">{errors.dish_name.message}</p>
            )}
          </fieldset>
          <fieldset className="space-y-2">
            <Label htmlFor="servings">{t("meal.servings")}</Label>
            <Input id="servings" type="number" min={1} step={1} placeholder="1"
              className="h-12 text-base sm:h-10 sm:text-sm"
              aria-invalid={!!errors.servings}
              {...register("servings", { valueAsNumber: true })} />
            {errors.servings && (
              <p className="text-sm text-destructive" role="alert">{errors.servings.message}</p>
            )}
          </fieldset>
          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            <Search className="h-4 w-4" />
            {submitting ? t("meal.searching") : t("meal.search")}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
