"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/auth";
import Navbar from "@/components/layout/Navbar";

export default function LoginPage() {
  const router = useRouter();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      login();
      router.push("/dashboard");
    }, 1500);
  };

  if (isLoggingIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg text-fg-secondary">Simulating Auth Login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-8 py-28">
        <h1 className="text-3xl font-semibold text-fg-primary tracking-tight">Login</h1>
        <p className="mt-2 text-fg-secondary">
          Sign in to access your dashboard.
        </p>
        <button
          onClick={handleLogin}
          className="mt-8 bg-accent text-accent-fg rounded-xl px-5 py-2.5 font-medium hover:bg-accent-hover transition-all duration-200 ease-out motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-11"
        >
          Login with Cognito
        </button>
      </main>
    </div>
  );
}
