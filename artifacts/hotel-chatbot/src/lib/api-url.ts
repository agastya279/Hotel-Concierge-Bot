import { runtimeConfig } from "./runtime-config";

const configuredApiBaseUrl =
  runtimeConfig.apiBaseUrl?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  "";

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");

type AuthTokenGetter = () => Promise<string | null> | string | null;

let authTokenGetter: AuthTokenGetter | null = null;

export function setApiAuthTokenGetter(getter: AuthTokenGetter | null): void {
  authTokenGetter = getter;
}

export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path}`;
}

export async function apiFetch(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  const headers = new Headers(init?.headers);
  if (authTokenGetter && !headers.has("authorization")) {
    const token = await authTokenGetter();
    if (token) headers.set("authorization", `Bearer ${token}`);
  }

  return fetch(apiUrl(path), {
    ...init,
    headers,
    credentials: init?.credentials ?? "include",
  });
}