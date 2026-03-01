"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-center text-gray-900 dark:bg-gray-950 dark:text-gray-100">
        <h2 className="text-xl font-semibold">Something went wrong</h2>
        <p className="max-w-md text-sm text-gray-500">
          An unexpected error occurred. Please refresh the page.
        </p>
        <button
          onClick={reset}
          className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
