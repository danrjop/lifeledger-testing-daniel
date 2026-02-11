import Navbar from "@/components/layout/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-2xl px-8 py-24">
        <h1 className="text-3xl font-semibold text-fg-primary tracking-tight">About the Team</h1>
        <p className="mt-4 text-fg-secondary leading-relaxed">
          LifeLedger is built by a team dedicated to helping you organize and
          track your personal documents and expenses.
        </p>
      </main>
    </div>
  );
}
