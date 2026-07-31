export interface SeedRuntimeConfig {
  apiBaseUrl?: string;
  clerkPublishableKey?: string;
  clerkProxyUrl?: string;
}

declare global {
  interface Window {
    __SEED_CONFIG__?: SeedRuntimeConfig;
  }
}

export const runtimeConfig: SeedRuntimeConfig =
  typeof window === "undefined" ? {} : window.__SEED_CONFIG__ ?? {};