import type { Metadata } from "next";
import AppShell from "./AppShell.client";
import InstallGateFromSanity from "@/components/pwa/InstallGateFromSanity";

export const metadata: Metadata = {
  title: { default: "App", template: "%s · App" },
  robots: { index: false, follow: false },
};

export default function AppGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AppShell>{children}</AppShell>
      <InstallGateFromSanity />
    </>
  );
}
