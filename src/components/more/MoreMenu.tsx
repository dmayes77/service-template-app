"use client";

import Link from "next/link";
import { useMoreDrawer } from "./MoreDrawerProvider";
import { Info, Star, HelpCircle, FileText, MapPin } from "lucide-react";

export default function MoreMenu() {
  const { close } = useMoreDrawer();

  const items = [
    { href: "/about", label: "About", Icon: Info },
    // Contact entry now implies address/map on the contact page
    { href: "/contact", label: "Contact & Location", Icon: MapPin },
    { href: "/reviews", label: "Reviews", Icon: Star },
    { href: "/faq", label: "FAQ", Icon: HelpCircle },
    // Warranty → Policies
    { href: "/policies", label: "Policies", Icon: FileText },
  ];

  return (
    <ul className="divide-y divide-gray-200/70">
      {items.map(({ href, label, Icon }) => (
        <li key={href}>
          <Link
            href={href}
            onClick={close}
            className="flex items-center gap-3 py-3 text-gray-900 hover:text-gray-700"
          >
            <Icon className="h-5 w-5 text-gray-500" />
            <span className="text-[15px] font-medium">{label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
