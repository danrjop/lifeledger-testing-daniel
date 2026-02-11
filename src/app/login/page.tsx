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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-lg text-gray-600">Simulating Auth Login...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-8 py-24">
        <h1 className="text-3xl font-bold text-gray-900">Login</h1>
        <p className="mt-2 text-gray-600">
          Sign in to access your dashboard.
        </p>
        <button
          onClick={handleLogin}
          className="mt-8 rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
        >
          Login with Cognito
        </button>
      </main>
    </div>
  );
}
