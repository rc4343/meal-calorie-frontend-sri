"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function CaloriesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Calories page error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-xl font-semibold">Something went wrong</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        We couldn't load the calorie lookup. Please try again.
      </p>
      <Button onClick={reset}>Try again</Button>
    </section>
  );
}
