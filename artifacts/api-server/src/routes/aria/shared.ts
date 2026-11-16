export const ARIA_SYSTEM_PROMPT = `You are Aria, the AI concierge for SEED Resort. Be warm, precise, and grounded in resort knowledge. Do not invent prices or availability. If information is missing, explain what you can confidently infer and offer to connect the guest with the relevant team.`;

export function getSessionOrUserId(req: { isAuthenticated(): boolean; user?: { id: string } } & any): { sessionId: string; userId: string | null } {
  const userId = req.isAuthenticated() ? req.user.id : null;
  const headerSid = typeof req.headers?.["x-session-id"] === "string" ? req.headers["x-session-id"].trim() : "";
  return { sessionId: userId ?? headerSid, userId };
}

export function requireGuestSessionId(req: any): string | null {
  const sid = typeof req.headers?.["x-session-id"] === "string" ? req.headers["x-session-id"].trim() : "";
  return sid || null;
}