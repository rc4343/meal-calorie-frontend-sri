"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/authStore";
import { useTranslation } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, BarChart3, Globe, UserCheck, ChefHat, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export default function HomePage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { t } = useTranslation();

  useEffect(() => {
    if (isAuthenticated) router.replace("/calories");
  }, [isAuthenticated, router]);

  if (isAuthenticated) return null;

  return (
    <>
      {/* hero */}
      <section className="flex flex-col items-center gap-6 pb-16 pt-12 text-center sm:pt-20 sm:pb-24">
        <span className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          Powered by USDA FoodData Central
        </span>

        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          {t("landing.hero")}
        </h1>

        <p className="max-w-lg text-lg text-muted-foreground">
          {t("landing.subtitle")}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" asChild>
            <Link href="/register">{t("landing.cta")}</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">{t("landing.ctaLogin")}</Link>
          </Button>
        </div>
      </section>

      {/* product preview */}
      <section aria-label="Product preview" className="pb-16">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border bg-card shadow-lg">
          <div className="flex items-center gap-1.5 border-b bg-muted/50 px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-red-400" />
            <span className="h-3 w-3 rounded-full bg-yellow-400" />
            <span className="h-3 w-3 rounded-full bg-green-400" />
            <span className="ml-3 text-xs text-muted-foreground">nourishlog.app/calories</span>
          </div>
          <div className="grid gap-6 p-6 sm:grid-cols-2">
            <div className="space-y-4 rounded-lg border p-5">
              <p className="text-sm font-medium">{t("landing.preview.dishLabel")}</p>
              <div className="flex h-10 items-center rounded-md border bg-background px-3 text-sm text-foreground">
                {t("landing.preview.dishValue")}
              </div>
              <p className="text-sm font-medium">{t("landing.preview.servingsLabel")}</p>
              <div className="flex h-10 items-center rounded-md border bg-background px-3 text-sm text-foreground">
                {t("landing.preview.servingsValue")}
              </div>
              <div className="flex h-10 items-center justify-center rounded-md bg-primary text-sm font-medium text-primary-foreground">
                {t("landing.preview.searchBtn")}
              </div>
            </div>
            <div className="space-y-4 rounded-lg border p-5">
              <p className="text-lg font-semibold capitalize">{t("landing.preview.dishValue")}</p>
              <dl className="grid grid-cols-2 gap-y-3 text-sm">
                <dt className="text-muted-foreground">{t("result.servings")}</dt>
                <dd className="text-right font-medium">2</dd>
                <dt className="text-muted-foreground">{t("landing.preview.calPerServing")}</dt>
                <dd className="text-right font-medium">280 kcal</dd>
                <dt className="text-muted-foreground">{t("landing.preview.total")}</dt>
                <dd className="text-right text-lg font-semibold text-primary">560 kcal</dd>
                <dt className="text-muted-foreground">{t("landing.preview.source")}</dt>
                <dd className="text-right text-xs font-medium">{t("landing.preview.sourceValue")}</dd>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* features */}
      <section aria-label="Features" className="pb-16">
        <div className="grid gap-6 sm:grid-cols-3">
          <FeatureCard icon={Zap} title={t("landing.feature1.title")} description={t("landing.feature1.desc")} accent="amber" />
          <FeatureCard icon={BarChart3} title={t("landing.feature2.title")} description={t("landing.feature2.desc")} accent="teal" />
          <FeatureCard icon={Globe} title={t("landing.feature3.title")} description={t("landing.feature3.desc")} accent="violet" />
        </div>
      </section>

      {/* how it works */}
      <section aria-label="How it works" className="pb-16">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
          {t("landing.how.title")}
        </h2>
        <div className="grid gap-8 sm:grid-cols-3">
          <Step num={1} icon={UserCheck} title={t("landing.how.step1")} description={t("landing.how.step1.desc")} accent="amber" />
          <Step num={2} icon={ChefHat} title={t("landing.how.step2")} description={t("landing.how.step2.desc")} accent="teal" />
          <Step num={3} icon={TrendingUp} title={t("landing.how.step3")} description={t("landing.how.step3.desc")} accent="violet" />
        </div>
      </section>

      {/* bottom cta */}
      <section className="pb-20 text-center">
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="flex flex-col items-center gap-4 py-10">
            <h2 className="text-2xl font-bold sm:text-3xl">{t("landing.bottomCta.title")}</h2>
            <p className="max-w-md text-sm opacity-80">
              {t("landing.bottomCta.desc")}
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">{t("landing.cta")}</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        {t("landing.footer")}
      </footer>
    </>
  );
}

const accentMap = {
  amber: { bg: "bg-amber-100 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400", ring: "border-amber-200 dark:border-amber-900/50" },
  teal: { bg: "bg-teal-100 dark:bg-teal-950/40", text: "text-teal-600 dark:text-teal-400", ring: "border-teal-200 dark:border-teal-900/50" },
  violet: { bg: "bg-violet-100 dark:bg-violet-950/40", text: "text-violet-600 dark:text-violet-400", ring: "border-violet-200 dark:border-violet-900/50" },
} as const;

type Accent = keyof typeof accentMap;

function FeatureCard({ icon: Icon, title, description, accent }: { icon: LucideIcon; title: string; description: string; accent: Accent }) {
  const c = accentMap[accent];
  return (
    <Card className={c.ring}>
      <CardContent className="flex flex-col gap-3 pt-6">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${c.bg}`}>
          <Icon className={`h-5 w-5 ${c.text}`} />
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function Step({ num, icon: Icon, title, description, accent }: { num: number; icon: LucideIcon; title: string; description: string; accent: Accent }) {
  const c = accentMap[accent];
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`relative mb-3 flex h-12 w-12 items-center justify-center rounded-full ${c.bg}`}>
        <Icon className={`h-6 w-6 ${c.text}`} />
        <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background`}>
          {num}
        </span>
      </div>
      <h3 className="mb-1 font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
