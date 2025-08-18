import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <p className="text-sm font-semibold text-gray-500">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 text-gray-600">
        Sorry, we couldn’t find the page you were looking for.
      </p>

      <div className="mt-6 flex items-center justify-center gap-3">
        <Link
          href="/"
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-black/90"
        >
          Go home
        </Link>
        <Link
          href="/contact"
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-900 hover:bg-gray-50"
        >
          Contact support
        </Link>
      </div>
    </main>
  );
}
