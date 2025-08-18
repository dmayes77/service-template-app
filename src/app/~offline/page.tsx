// Server Component
export const metadata = { title: "Offline" };

import RetryButton from "./retry.client";

export default function OfflinePage() {
  return (
    <main className="mx-auto max-w-3xl p-6 text-center">
      <h1 className="text-2xl font-semibold">You’re offline</h1>
      <p className="mt-2 text-gray-600">
        Reconnect to see fresh content. Cached pages will still work.
      </p>
      <RetryButton />
    </main>
  );
}
