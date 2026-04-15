/**
 * Frontend-only auth stubs for the demo.
 * Any username/password combo "works". No Cognito, no cookies, no network.
 *
 * These functions retain their original signatures so the existing pages
 * (login/signup/verify/forgot/reset) all continue to work without changes.
 */

"use server";

export interface AuthResult {
  success: boolean;
  error?: string;
  errorCode?: string;
  nextStep?: string;
  user?: {
    userId: string;
    username: string;
    email?: string;
  };
}

const DEMO_USER = {
  userId: "demo-sally-001",
  username: "Sally",
  email: "sally@lifeledger.demo",
};

export async function signInAction(
  _username: string,
  _password: string
): Promise<AuthResult> {
  return { success: true, user: DEMO_USER };
}

export async function signUpAction(
  _username: string,
  _password: string,
  _email: string
): Promise<AuthResult> {
  return { success: true };
}

export async function confirmSignUpAction(
  _username: string,
  _code: string
): Promise<AuthResult> {
  return { success: true };
}

export async function resendCodeAction(_username: string): Promise<AuthResult> {
  return { success: true };
}

export async function forgotPasswordAction(_username: string): Promise<AuthResult> {
  return { success: true };
}

export async function confirmResetPasswordAction(
  _username: string,
  _code: string,
  _newPassword: string
): Promise<AuthResult> {
  return { success: true };
}

export async function signOutAction(): Promise<AuthResult> {
  return { success: true };
}

export async function getIdTokenAction(): Promise<string | null> {
  return "demo-token";
}

export async function getSessionAction(): Promise<AuthResult> {
  // Server-side this can't read sessionStorage; return success so the
  // client AuthProvider always shows the dashboard. The client-side
  // AuthProvider also forces this same default on mount.
  return { success: true, user: DEMO_USER };
}
