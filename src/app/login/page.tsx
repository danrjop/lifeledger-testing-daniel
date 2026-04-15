"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signInAction } from "@/lib/auth-actions";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { checkAuth } = useAuth();
  const [username, setUsername] = useState("Sally");
  const [password, setPassword] = useState("demo1234");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const fieldError = (field: string, value: string) => {
    if (!touched[field] || value.trim() !== "") return null;
    return "This field is required.";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    if (!isFormValid) return;
    setError("");
    setIsLoggingIn(true);

    const result = await signInAction(username.trim(), password);

    if (result.success) {
      await checkAuth();
      router.push("/dashboard");
    } else if (result.nextStep === "CONFIRM_SIGN_UP") {
      router.push(
        `/verify-email?username=${encodeURIComponent(username.trim())}`
      );
    } else {
      setIsLoggingIn(false);
      setError(result.error || "An unexpected error occurred.");
    }
  };

  if (isLoggingIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-primary">
        <p className="text-body-lg text-fg-secondary">Loading demo…</p>
      </div>
    );
  }

  const inputClass = (field: string, value: string) =>
    `w-full rounded-xl bg-bg-primary border px-4 py-2.5 text-fg-primary placeholder:text-fg-tertiary transition-colors duration-200 focus-visible:outline-none focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent-light ${
      touched[field] && value.trim() === ""
        ? "border-danger"
        : "border-bg-tertiary"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-bg-primary">
      {/* Logo — top left */}
      <div className="px-8 py-4">
        <Link
          href="/"
          className="text-xl font-semibold text-fg-primary tracking-tight"
          aria-label="LifeLedger home"
        >
          LifeLedger
        </Link>
      </div>

      {/* Login Box — centered */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <h1
            className="font-serif text-fg-primary tracking-heading text-center"
            style={{ fontSize: "clamp(2.5rem, 2rem + 2vw, 4rem)" }}
          >
            Log in to LifeLedger
          </h1>

          <form onSubmit={handleLogin} className="mt-8 space-y-5" noValidate>
            {error && (
              <div
                role="alert"
                className="rounded-xl bg-danger/10 border border-danger/20 px-4 py-3 text-sm text-danger"
              >
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-fg-secondary mb-1.5"
              >
                Username <span className="text-danger">*</span>
              </label>
              <input
                id="username"
                type="text"
                required
                aria-required="true"
                aria-invalid={touched.username && username.trim() === ""}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => handleBlur("username")}
                placeholder="Enter your username"
                autoComplete="username"
                className={inputClass("username", username)}
              />
              {fieldError("username", username) && (
                <p className="mt-1 text-xs text-danger" role="alert">
                  {fieldError("username", username)}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-fg-secondary mb-1.5"
              >
                Password <span className="text-danger">*</span>
              </label>
              <input
                id="password"
                type="password"
                required
                aria-required="true"
                aria-invalid={touched.password && password.trim() === ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password")}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={inputClass("password", password)}
              />
              {fieldError("password", password) && (
                <p className="mt-1 text-xs text-danger" role="alert">
                  {fieldError("password", password)}
                </p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-accent hover:text-accent-hover transition-colors duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="w-full rounded-xl px-5 py-2.5 font-medium transition-all duration-200 ease-out min-h-11 flex items-center justify-center bg-accent text-accent-fg hover:bg-accent-hover motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Log In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-fg-tertiary">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-accent hover:text-accent-hover font-medium transition-colors duration-200"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
