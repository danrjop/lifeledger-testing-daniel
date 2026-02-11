import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-8 py-28">
        <h1 className="text-4xl font-semibold text-fg-primary tracking-tight">LifeLedger</h1>
        <p className="mt-4 text-lg text-fg-secondary leading-relaxed max-w-prose text-center">
          Your personal document and expense tracker.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/login"
            className="bg-accent text-accent-fg rounded-xl px-5 py-2.5 font-medium hover:bg-accent-hover transition-all duration-200 ease-out motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-11 inline-flex items-center"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="bg-bg-secondary text-fg-primary border border-bg-tertiary rounded-xl px-5 py-2.5 font-medium hover:border-fg-tertiary transition-all duration-200 ease-out motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-11 inline-flex items-center"
          >
            About
          </Link>
        </div>
      </main>
    </div>
  );
}
