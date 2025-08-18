"use client";

export default function RetryButton() {
  return (
    <button
      className="mt-6 rounded-lg border px-4 py-2"
      onClick={() => location.reload()}
    >
      Try again
    </button>
  );
}
