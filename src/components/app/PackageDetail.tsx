"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export interface PackageDetailDoc {
  _id: string;
  name: string;
  slug: { current: string };
  description: string;
  mainDescription: string;
  price?: number;
  priceUnit?: string;
  durationMinutes?: number;
  includes?: string[];
  badge?: string;
  imageUrl?: string;
  imageAlt?: string;
  tieredPricing?: {
    tintType: "carbon" | "ceramic";
    vehicleSize: "small" | "medium" | "large" | "xl";
    price: number;
    label: "flat" | "from" | "per-window";
    note?: string;
  }[];
}

export default function PackageDetail({ pkg }: { pkg: PackageDetailDoc }) {
 
  const [tintType, setTintType] = useState<"carbon" | "ceramic">("carbon");
  const [vehicleSize, setVehicleSize] = useState<
    "small" | "medium" | "large" | "xl"
  >("small");

  const matchedTier = pkg.tieredPricing?.find(
    (tier) => tier.tintType === tintType && tier.vehicleSize === vehicleSize
  );
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {pkg.imageUrl && (
        <div className="mb-6">
          <Image
            src={pkg.imageUrl}
            alt={pkg.imageAlt || pkg.name}
            width={800}
            height={450}
            priority
            className="rounded-lg w-full h-auto object-cover"
          />
        </div>
      )}

      <h1 className="text-3xl font-bold mb-2">{pkg.name}</h1>
      {pkg.badge && (
        <span className="text-sm bg-blue-200 text-blue-800 px-2 py-1 rounded">
          {pkg.badge}
        </span>
      )}
      <p className="text-gray-700 mt-2">{pkg.mainDescription}</p>
      {/* What’s included */}
      {pkg.includes && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">What’s Included</h2>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {pkg.includes.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Tiered Pricing Selector */}
      {pkg.tieredPricing && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Select Tint & Size</h2>

          <div className="flex flex-wrap gap-4 mb-4">
            {["carbon", "ceramic"].map((type) => (
              <button
                key={type}
                onClick={() => setTintType(type as "carbon" | "ceramic")}
                className={`px-4 py-2 border rounded ${tintType === type ? "bg-black text-white" : "bg-white"}`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 mb-4">
            {["small", "medium", "large", "xl"].map((size) => (
              <button
                key={size}
                onClick={() =>
                  setVehicleSize(size as "small" | "medium" | "large" | "xl")
                }
                className={`px-4 py-2 border rounded ${vehicleSize === size ? "bg-black text-white" : "bg-white"}`}
              >
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </button>
            ))}
          </div>

          {matchedTier ? (
            <div className="text-lg font-bold">
              {matchedTier.label === "from"
                ? "From "
                : matchedTier.label === "per-window"
                  ? "Per Window: "
                  : ""}
              ${matchedTier.price}
              {matchedTier.note && (
                <p className="text-sm mt-1 text-gray-500">{matchedTier.note}</p>
              )}
            </div>
          ) : (
            <p className="text-red-500">
              No price available for this combination.
            </p>
          )}
        </div>
      )}

      {/* Duration */}
      {pkg.durationMinutes && (
        <p className="mt-4 text-sm text-gray-600">
          Estimated duration: {pkg.durationMinutes} minutes
        </p>
      )}

      {/* Book Now Button */}
      <Link
        href={`/schedule`}
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded shadow-md transition w-full text-center mt-4"
      >
        Book Now
      </Link>
    </div>
  );
}
