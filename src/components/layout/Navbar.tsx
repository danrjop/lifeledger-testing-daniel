import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-4 md:px-8 py-4 border-b border-bg-tertiary/50 bg-bg-primary/80 backdrop-blur-md">
      <Link href="/" className="text-xl font-semibold text-fg-primary tracking-tight">
        LifeLedger
      </Link>
      <div className="flex items-center gap-4 md:gap-6">
        <Link href="/" className="hidden md:block text-fg-secondary hover:text-fg-primary transition-colors duration-200">
          Home
        </Link>
        <Link href="/about" className="hidden md:block text-fg-secondary hover:text-fg-primary transition-colors duration-200">
          About
        </Link>
        <Link
          href="/login"
          className="bg-accent text-accent-fg rounded-xl px-4 md:px-5 py-2.5 font-medium hover:bg-accent-hover transition-all duration-200 ease-out motion-safe:hover:scale-[1.02] motion-safe:active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent min-h-11 inline-flex items-center"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
