"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import enRaw from "@/locales/en.json";
import esRaw from "@/locales/es.json";

type Translations = Record<string, string>;

const en = enRaw as Translations;
const es = esRaw as Translations;

const localeMap: Record<string, Translations> = { en, es };
const fallback = en;

interface I18nContextValue {
  locale: string;
  setLocale: (l: string) => void;
  t: (key: string) => string;
  locales: string[];
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState("en");

  const t = useCallback(
    (key: string) => {
      const dict = localeMap[locale] ?? fallback;
      return dict[key] ?? fallback[key] ?? key;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, locales: Object.keys(localeMap) }),
    [locale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useTranslation must be used inside I18nProvider");
  return ctx;
}
