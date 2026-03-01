import type { Metadata } from "next";
import { DashboardContent } from "./DashboardContent";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Dashboard | ${APP_NAME}`,
  description: "View your daily calorie summary and meal history.",
};

export default function DashboardPage() {
  return <DashboardContent />;
}
