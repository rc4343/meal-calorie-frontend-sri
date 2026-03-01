"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";
import { useMealStore } from "@/stores/mealStore";
import { useTranslation } from "@/lib/i18n";
import { clearAuthCookie } from "@/lib/cookies";
import { UtensilsCrossed, LayoutDashboard, Search, LogOut } from "lucide-react";

export function Header() {
  const router = useRouter();
  const { t } = useTranslation();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const logout = useAuthStore((s) => s.logout);
  const clearMeals = useMealStore((s) => s.clearMeals);

  function handleLogout() {
    logout();
    clearMeals();
    clearAuthCookie();
    router.push("/");
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            {t("app.title")}
          </Link>

          {isAuthenticated && (
            <div className="hidden items-center gap-4 text-sm sm:flex">
              <Link href="/dashboard" className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
                <LayoutDashboard className="h-4 w-4" />
                {t("nav.dashboard")}
              </Link>
              <Link href="/calories" className="flex items-center gap-1.5 text-muted-foreground transition-colors hover:text-foreground">
                <Search className="h-4 w-4" />
                {t("nav.calories")}
              </Link>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <LocaleSwitcher />
          <ThemeToggle />

          {isAuthenticated ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="flex items-center gap-1.5">
              <LogOut className="h-4 w-4" />
              {t("nav.logout")}
            </Button>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/login">{t("nav.login")}</Link>
              </Button>
              <Button size="sm" asChild className="hidden sm:inline-flex">
                <Link href="/register">{t("nav.signup")}</Link>
              </Button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
