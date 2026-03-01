"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { isTokenExpired } from "@/lib/auth";
import { clearAuthCookie } from "@/lib/cookies";

// Protected pages: redirects to /login if token is missing or expired.
// Waits for Zustand persist rehydration before checking.
export function useAuthGuard() {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    const { token, logout } = useAuthStore.getState();
    if (!token || isTokenExpired(token)) {
      logout();
      clearAuthCookie();
      router.replace("/login");
    }
  }, [hasHydrated, router]);
}

// Auth pages (login/register): redirects to /calories if already logged in.
export function useRedirectIfAuthenticated() {
  const router = useRouter();
  const hasHydrated = useAuthStore((s) => s._hasHydrated);

  useEffect(() => {
    if (!hasHydrated) return;

    const { token } = useAuthStore.getState();
    if (token && !isTokenExpired(token)) {
      router.replace("/calories");
    }
  }, [hasHydrated, router]);
}
