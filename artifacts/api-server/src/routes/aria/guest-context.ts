import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ariaGuestContexts, insertAriaGuestContextSchema } from "@workspace/db/schema";
import { getAriaSessionId, loadAriaGuestContext } from "./shared";

const router: IRouter = Router();

router.get("/context", async (req, res): Promise<void> => {
  const sessionId = getAriaSessionId(req);
  if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
  res.json(await loadAriaGuestContext(sessionId));
});

router.get("/guest-context", async (req, res): Promise<void> => {
  const sessionId = getAriaSessionId(req);
  if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
  res.json(await loadAriaGuestContext(sessionId));
});

async function updateContext(req: any, res: any): Promise<void> {
  try {
    const sessionId = getAriaSessionId(req);
    if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
    const body = req.body && typeof req.body === "object" ? req.body as Record<string, unknown> : {};
    const current = await loadAriaGuestContext(sessionId);
    const preferences = Array.isArray(body.preferences)
      ? body.preferences.filter((item: unknown): item is string => typeof item === "string")
      : current.preferences;
    const interests = Array.isArray(body.interests)
      ? body.interests.filter((item: unknown): item is string => typeof item === "string")
      : current.interests;
    const nullableString = (key: "dietaryNeeds" | "travelParty" | "stayDates") => {
      if (!(key in body)) return current[key];
      return typeof body[key] === "string" ? body[key] as string : null;
    };
    const parsed = insertAriaGuestContextSchema.parse({
      sessionId,
      preferences: { preferences, interests },
      profile: {
        language: typeof body.language === "string" ? body.language : current.language,
        dietaryNeeds: nullableString("dietaryNeeds"),
        travelParty: nullableString("travelParty"),
        stayDates: nullableString("stayDates"),
      },
    });
    const [row] = await db.insert(ariaGuestContexts).values(parsed).onConflictDoUpdate({
      target: ariaGuestContexts.sessionId,
      set: { preferences: parsed.preferences, profile: parsed.profile, updatedAt: new Date() },
    }).returning();
    res.json(await loadAriaGuestContext(row.sessionId));
  } catch (err) {
    req.log.error({ err }, "Failed to upsert guest context");
    res.status(400).json({ error: "Invalid guest context" });
  }
}

router.put("/context", updateContext);
router.put("/guest-context", updateContext);

export default router;