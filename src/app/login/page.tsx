import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: `Sign In | ${APP_NAME}`,
  description: `Log in to your ${APP_NAME} account.`,
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
