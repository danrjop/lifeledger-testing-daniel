import Navbar from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="mx-auto max-w-2xl px-8 py-16">
        <h1 className="text-3xl font-bold text-gray-900">About the Team</h1>
        <p className="mt-4 text-gray-600">
          LifeLedger is built by a team dedicated to helping you organize and
          track your personal documents and expenses.
        </p>
      </main>
    </div>
  );
}
