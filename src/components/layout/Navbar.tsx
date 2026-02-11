import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-200 bg-white">
      <Link href="/" className="text-xl font-bold text-gray-900">
        LifeLedger
      </Link>
      <div className="flex items-center gap-6">
        <Link href="/" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <Link href="/about" className="text-gray-600 hover:text-gray-900">
          About
        </Link>
        <Link
          href="/login"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Login
        </Link>
      </div>
    </nav>
  );
}
