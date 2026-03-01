"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";
import { isTokenExpired } from "@/lib/auth";

// Checks token expiry after Zustand has rehydrated from localStorage.
// Uses a small delay to ensure persist middleware has restored state.
export function useAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    // Small timeout lets Zustand persist finish rehydrating.
    // On first render the store is empty; by the next frame it's restored.
    const id = setTimeout(() => {
      const { token, logout } = useAuthStore.getState();
      if (isTokenExpired(token)) {
        logout();
        document.cookie = "auth-token=; path=/; max-age=0";
        router.replace("/login");
      }
    }, 50);

    return () => clearTimeout(id);
  }, [router]);
}
