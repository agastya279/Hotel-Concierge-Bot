import { eq } from "drizzle-orm";
import { ariaGuestContexts, db } from "@workspace/db";

export interface AriaGuestContext {
  language: string;
  preferences: string[];
  interests: string[];
  dietaryNeeds: string | null;
  travelParty: string | null;
  stayDates: string | null;
}

export function getAriaSessionId(req: any): string | null {
  const userId = req.isAuthenticated?.() && typeof req.user?.id === "string"
    ? req.user.id
    : null;
  const headerSid = typeof req.headers?.["x-session-id"] === "string"
    ? req.headers["x-session-id"].trim()
    : "";
  return userId ?? (headerSid || null);
}

export function getSessionOrUserId(req: any): { sessionId: string | null; userId: string | null } {
  const userId = req.isAuthenticated?.() && typeof req.user?.id === "string"
    ? req.user.id
    : null;
  return { sessionId: userId ?? getAriaSessionId(req), userId };
}

export function requireGuestSessionId(req: any): string | null {
  return getAriaSessionId(req);
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

export async function loadAriaGuestContext(sessionId: string): Promise<AriaGuestContext> {
  const [row] = await db
    .select()
    .from(ariaGuestContexts)
    .where(eq(ariaGuestContexts.sessionId, sessionId));
  const preferences = row?.preferences && typeof row.preferences === "object"
    ? row.preferences as Record<string, unknown>
    : {};
  const profile = row?.profile && typeof row.profile === "object"
    ? row.profile as Record<string, unknown>
    : {};

  return {
    language: typeof profile.language === "string" ? profile.language : "auto",
    preferences: stringArray(preferences.preferences),
    interests: stringArray(preferences.interests),
    dietaryNeeds: typeof profile.dietaryNeeds === "string" ? profile.dietaryNeeds : null,
    travelParty: typeof profile.travelParty === "string" ? profile.travelParty : null,
    stayDates: typeof profile.stayDates === "string" ? profile.stayDates : null,
  };
}

export function buildAriaContextInstructions(context: AriaGuestContext): string {
  const lines = [
    "Guest personalization:",
    context.language === "auto"
      ? "Detect the language of the guest's latest message and reply in that language."
      : `Reply in ${context.language}, unless the guest asks to switch languages.`,
  ];
  if (context.preferences.length) lines.push(`Preferences: ${context.preferences.join(", ")}.`);
  if (context.interests.length) lines.push(`Interests: ${context.interests.join(", ")}.`);
  if (context.dietaryNeeds) lines.push(`Dietary needs: ${context.dietaryNeeds}.`);
  if (context.travelParty) lines.push(`Travel party: ${context.travelParty}.`);
  if (context.stayDates) lines.push(`Stay dates: ${context.stayDates}.`);
  return lines.join("\n");
}