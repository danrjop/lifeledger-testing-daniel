import Link from "next/link";
import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="flex flex-col items-center justify-center px-8 py-24">
        <h1 className="text-4xl font-bold text-gray-900">LifeLedger</h1>
        <p className="mt-4 text-lg text-gray-600">
          Your personal document and expense tracker.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/login"
            className="rounded bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/about"
            className="rounded border border-gray-300 px-6 py-3 text-gray-700 hover:bg-gray-50"
          >
            About
          </Link>
        </div>
      </main>
    </div>
  );
}
