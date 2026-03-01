import type { ApiError } from "@/lib/api";

const STATUS_KEYS: Record<number, string> = {
  400: "error.badRequest",
  401: "error.sessionExpired",
  403: "error.forbidden",
  404: "error.notFound",
  408: "error.timeout",
  409: "error.conflict",
  422: "error.validation",
  429: "error.tooMany",
  500: "error.server",
  502: "error.unavailable",
  503: "error.maintenance",
};

// Given a t() function and an error, return the user-facing message.
// Prefers the backend message if present, otherwise falls back to i18n by status code.
export function toErrorMessage(t: (key: string) => string, err: unknown): string {
  const apiErr = err as ApiError;
  if (apiErr?.message) return apiErr.message;

  const key = STATUS_KEYS[apiErr?.status] ?? "error.unknown";
  return t(key);
}
