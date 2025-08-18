import type { Metadata } from "next";
import BookingEmbed from "@/components/orbisx/BookingEmbed.client";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  return (
    <section className="mx-auto w-full max-w-[640px] px-0">
      <BookingEmbed bookingId="VSnff" />
    </section>
  );
}
