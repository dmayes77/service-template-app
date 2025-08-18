// src/app/(app)/AppShell.client.tsx
"use client";
import SafeAreaView from "@/components/safe-area/SafeAreaView";
import HeaderBar from "@/components/app/HeaderBar";
import BottomTabBar from "@/components/app/BottomTabBar";
import MoreDrawerProvider from "@/components/more/MoreDrawerProvider";
import MoreMenu from "@/components/more/MoreMenu";

const HEADER_H = 48; // px
const FOOTER_H = 64; // px (h-16)

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <MoreDrawerProvider drawerContent={<MoreMenu />}>
      {/* no overflow-hidden so the fixed main can scroll */}
      <div className="min-h-[100svh]">
        {/* Fixed header */}
        <div className="fixed inset-x-0 top-0 z-50">
          <SafeAreaView edges={["top", "left", "right"]}>
            <HeaderBar />
          </SafeAreaView>
        </div>

        {/* The only scroll container, pinned between header & footer */}
        <main
          className="fixed inset-x-0 mx-auto w-full max-w-[640px] overflow-y-auto"
          style={{
            top: `calc(env(safe-area-inset-top) + ${HEADER_H}px)`,
            bottom: `calc(env(safe-area-inset-bottom) + ${FOOTER_H}px)`,
            WebkitOverflowScrolling: "touch",
          }}
        >
          {children}
        </main>

        {/* Fixed bottom bar; paint the safe-area */}
        <div
          className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <SafeAreaView edges={["left", "right"]}>
            <BottomTabBar />
          </SafeAreaView>
        </div>
      </div>
    </MoreDrawerProvider>
  );
}
