/// <reference lib="webworker" />
export {};

import type { PrecacheEntry } from "serwist";
import { Serwist, StaleWhileRevalidate, NetworkFirst } from "serwist";
import { defaultCache } from "@serwist/next/worker";



/** Augment the worker global with Serwist’s injected manifest */
declare global {
  interface WorkerGlobalScope {
    __SW_MANIFEST?: Array<string | PrecacheEntry>;
  }
}
declare const self: ServiceWorkerGlobalScope & WorkerGlobalScope;

const sanityImageRule = {
  matcher({ url, request }: { url: URL; request: Request }) {
    return (
      request.method === "GET" &&
      request.destination === "image" &&
      /(^|\.)cdn\.sanity\.io$/i.test(url.hostname)
    );
  },
  handler: new StaleWhileRevalidate({ cacheName: "sanity-images" }),
};

const serwist = new Serwist({
  // Correct type: (string | PrecacheEntry)[] | undefined
  precacheEntries: self.__SW_MANIFEST,

  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,

  runtimeCaching: defaultCache.length
    ? [...defaultCache, sanityImageRule]
    : [{ matcher: () => true, handler: new NetworkFirst() }, sanityImageRule],

  fallbacks: {
    entries: [
      {
        url: "/~offline",
        matcher({ request }) {
          return request.mode === "navigate";
        },
      },
    ],
  },
});

serwist.addEventListeners();
