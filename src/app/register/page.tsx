import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Register | ${APP_NAME}`,
  description: "Create an account to start tracking your daily calorie intake.",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
