// Demo build: Cognito is not used. This file is kept as a no-op stub so any
// stale import path resolves without pulling in the AWS SDK.

const noop = {} as Record<string, never>;
export default noop;
export function computeSecretHash(_username: string): string {
  return "";
}
export function getClientId(): string {
  return "";
}
