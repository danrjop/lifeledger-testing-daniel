// Demo build: cookies are not used. No-op stubs so any stale import resolves.

export async function setAuthCookies(
  _idToken: string,
  _accessToken: string,
  _refreshToken: string
): Promise<void> {}

export async function getAuthCookies(): Promise<{
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
}> {
  return { idToken: null, accessToken: null, refreshToken: null };
}

export async function clearAuthCookies(): Promise<void> {}

export function decodeJwtPayload(_token: string): Record<string, unknown> {
  return {};
}
