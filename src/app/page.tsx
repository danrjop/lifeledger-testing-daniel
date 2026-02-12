import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import HeroGallery from "@/components/ui/HeroGallery";
import FeatureShowcase from "@/components/ui/FeatureShowcase";

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero — full viewport */}
      <section className="relative h-screen overflow-hidden">
        <main className="relative flex flex-col items-center justify-center px-8 pt-20 pb-[360px] h-full">
          <h1 className="font-serif text-fg-primary tracking-display text-center leading-[1.05] whitespace-nowrap" style={{ fontSize: "clamp(8rem, 2rem + 3.5vw, 5.5rem)" }}>
            Find Everything, Miss Nothing
          </h1>
          <p className="mt-6 text-fg-secondary max-w-lg text-center font-sans" style={{ fontSize: "clamp(1.15rem, 1rem + 0.5vw, 1.4rem)", lineHeight: 1.6 }}>
            The app that makes your photo library screenshots instantly
            searchable.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/login"
              className="bg-accent text-accent-fg rounded-xl px-6 py-3 font-medium hover:bg-accent-hover transition-all duration-200 ease-out motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-11 inline-flex items-center text-base"
            >
              Get Started
            </Link>
            <Link
              href="/about"
              className="bg-bg-secondary text-fg-primary border border-bg-tertiary rounded-xl px-6 py-3 font-medium hover:border-fg-tertiary transition-all duration-200 ease-out motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-11 inline-flex items-center text-base"
            >
              About
            </Link>
          </div>
        </main>
        <HeroGallery />
      </section>

      {/* Feature showcase — dark card */}
      <FeatureShowcase />
    </div>
  );
}
