"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

import { mealSchema } from "@/lib/validations";
import type { MealFormData } from "@/lib/validations";
import { getCalories } from "@/lib/api";
import { toErrorMessage } from "@/lib/errors";
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
        dish_name: values.dish_name.trim(),
        servings: values.servings,
      });
      onResult(res.data);
      toast.success(`Found ${res.data.total_calories} kcal for ${res.data.dish_name}`);
    } catch (err) {
      toast.error(toErrorMessage(t, err));
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
            <Input
              id="dish_name"
              placeholder={t("meal.dishPlaceholder")}
              autoComplete="off"
              maxLength={100}
              className="h-12 text-base sm:h-10 sm:text-sm"
              aria-invalid={!!errors.dish_name}
              aria-describedby={errors.dish_name ? "dish_name-error" : undefined}
              {...register("dish_name")}
            />
            {errors.dish_name && (
              <p id="dish_name-error" className="text-sm text-destructive" role="alert">
                {errors.dish_name.message}
              </p>
            )}
          </fieldset>

          <fieldset className="space-y-2">
            <Label htmlFor="servings">{t("meal.servings")}</Label>
            <Input
              id="servings"
              type="number"
              inputMode="decimal"
              min={0.5}
              max={100}
              step={0.5}
              placeholder="1"
              className="h-12 text-base sm:h-10 sm:text-sm"
              aria-invalid={!!errors.servings}
              aria-describedby={errors.servings ? "servings-error" : undefined}
              {...register("servings", { valueAsNumber: true })}
            />
            {errors.servings && (
              <p id="servings-error" className="text-sm text-destructive" role="alert">
                {errors.servings.message}
              </p>
            )}
          </fieldset>

          <Button type="submit" className="w-full" size="lg" disabled={submitting}>
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {submitting ? t("meal.searching") : t("meal.search")}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
