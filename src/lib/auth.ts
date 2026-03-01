// Decode JWT payload without a library (browser-safe)
function decodePayload(token: string): Record<string, unknown> | null {
  try {
    const base64 = token.split('.')[1];
    if (!base64) return null;
    const json = atob(base64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// Check if a JWT token is expired (with 30s buffer).
// Returns true only if the token has a valid exp claim that is in the past.
// If the token can't be decoded or has no exp, we assume it's valid
// and let the server reject it with 401 if needed.
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const payload = decodePayload(token);
  if (!payload || typeof payload.exp !== 'number') return false;
  return Date.now() >= (payload.exp - 30) * 1000;
}
