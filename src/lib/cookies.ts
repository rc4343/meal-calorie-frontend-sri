import { AUTH_COOKIE, AUTH_COOKIE_MAX_AGE } from "@/lib/constants";

export function setAuthCookie(token: string) {
  document.cookie = `${AUTH_COOKIE}=${token}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; SameSite=Lax`;
}

export function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
}
