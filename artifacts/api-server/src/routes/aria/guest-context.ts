import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ariaGuestContexts, insertAriaGuestContextSchema } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireGuestSessionId } from "./shared";

const router: IRouter = Router();

function toContext(row: typeof ariaGuestContexts.$inferSelect | undefined) {
  const preferences = row?.preferences && typeof row.preferences === "object"
    ? row.preferences as Record<string, unknown>
    : {};
  const profile = row?.profile && typeof row.profile === "object"
    ? row.profile as Record<string, unknown>
    : {};
  return {
    language: typeof profile.language === "string" ? profile.language : "english",
    preferences: Array.isArray(preferences.preferences)
      ? preferences.preferences.filter((item): item is string => typeof item === "string")
      : [],
    interests: Array.isArray(preferences.interests)
      ? preferences.interests.filter((item): item is string => typeof item === "string")
      : [],
    dietaryNeeds: typeof profile.dietaryNeeds === "string" ? profile.dietaryNeeds : null,
    travelParty: typeof profile.travelParty === "string" ? profile.travelParty : null,
    stayDates: typeof profile.stayDates === "string" ? profile.stayDates : null,
  };
}

async function readContext(req: any) {
  const sessionId = requireGuestSessionId(req);
  if (!sessionId) return null;
  const [row] = await db.select().from(ariaGuestContexts).where(eq(ariaGuestContexts.sessionId, sessionId));
  return toContext(row);
}

router.get("/context", async (req, res): Promise<void> => {
  const sessionId = requireGuestSessionId(req);
  if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
  res.json(await readContext(req));
});

router.get("/guest-context", async (req, res): Promise<void> => {
  const sessionId = requireGuestSessionId(req);
  if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
  res.json(await readContext(req));
});

async function updateContext(req: any, res: any): Promise<void> {
  try {
    const sessionId = requireGuestSessionId(req);
    if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const preferences = Array.isArray(body.preferences)
      ? body.preferences.filter((item: unknown): item is string => typeof item === "string")
      : [];
    const interests = Array.isArray(body.interests)
      ? body.interests.filter((item: unknown): item is string => typeof item === "string")
      : [];
    const parsed = insertAriaGuestContextSchema.parse({
      sessionId,
      preferences: { preferences, interests },
      profile: {
        language: typeof body.language === "string" ? body.language : "english",
        dietaryNeeds: typeof body.dietaryNeeds === "string" ? body.dietaryNeeds : null,
        travelParty: typeof body.travelParty === "string" ? body.travelParty : null,
        stayDates: typeof body.stayDates === "string" ? body.stayDates : null,
      },
    });
    const [row] = await db.insert(ariaGuestContexts).values(parsed).onConflictDoUpdate({
      target: ariaGuestContexts.sessionId,
      set: { preferences: parsed.preferences, profile: parsed.profile, updatedAt: new Date() },
    }).returning();
    res.json(toContext(row));
  } catch (err) {
    req.log.error({ err }, "Failed to upsert guest context");
    res.status(400).json({ error: "Invalid guest context" });
  }
}

router.put("/context", updateContext);
router.put("/guest-context", updateContext);

export default router;