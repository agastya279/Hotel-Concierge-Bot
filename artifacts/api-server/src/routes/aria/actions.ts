import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ariaActionRequests } from "@workspace/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { getSessionOrUserId } from "./shared";

const router: IRouter = Router();

const ACTION_TYPES = new Set([
  "reservation",
  "room-service",
  "spa",
  "dining",
  "transport",
  "activity",
  "human-concierge",
]);

function actionResponse(row: typeof ariaActionRequests.$inferSelect) {
  const details = row.details && typeof row.details === "object"
    ? row.details as Record<string, unknown>
    : {};
  const metadata = row.confirmationMetadata && typeof row.confirmationMetadata === "object"
    ? row.confirmationMetadata as Record<string, unknown>
    : {};
  return {
    id: row.id,
    type: row.type,
    title: row.title,
    details: typeof details.text === "string" ? details.text : JSON.stringify(details),
    preferredTime: typeof metadata.preferredTime === "string" ? metadata.preferredTime : null,
    status: row.status,
    createdAt: row.createdAt,
  };
}

router.get("/actions", async (req, res): Promise<void> => {
  try {
    const { sessionId } = getSessionOrUserId(req);
    if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
    const rows = await db.select().from(ariaActionRequests)
      .where(eq(ariaActionRequests.sessionId, sessionId))
      .orderBy(desc(ariaActionRequests.createdAt));
    res.json(rows.map(actionResponse));
  } catch (err) {
    req.log.error({ err }, "Failed to list action requests");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/actions", async (req, res): Promise<void> => {
  try {
    const { sessionId, userId } = getSessionOrUserId(req);
    if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
    const title = typeof req.body?.title === "string" && req.body.title.trim() ? req.body.title.trim() : "Action request";
    const type = typeof req.body?.type === "string" && ACTION_TYPES.has(req.body.type)
      ? req.body.type
      : "human-concierge";
    const details = typeof req.body?.details === "string"
      ? { text: req.body.details }
      : (req.body?.details && typeof req.body.details === "object" ? req.body.details : {});
    const preferredTime = typeof req.body?.preferredTime === "string" ? req.body.preferredTime : null;
    if (typeof details.text !== "string" || !details.text.trim()) {
      res.status(400).json({ error: "details required" });
      return;
    }
    const [row] = await db.insert(ariaActionRequests).values({
      sessionId,
      userId,
      title,
      type,
      status: "requested",
      details,
      confirmationMetadata: { preferredTime },
    }).returning();
    res.status(201).json(actionResponse(row));
  } catch (err) {
    req.log.error({ err }, "Failed to create action request");
    res.status(500).json({ error: "Internal server error" });
  }
});
router.patch("/actions/:id", async (req, res): Promise<void> => {
  try {
    const { sessionId } = getSessionOrUserId(req);
    if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) { res.status(400).json({ error: "Invalid action id" }); return; }
    if (req.body?.status !== "cancelled") {
      res.status(400).json({ error: "Only cancellation is available to guests" });
      return;
    }
    const [row] = await db.update(ariaActionRequests)
      .set({ status: "cancelled", updatedAt: new Date() })
      .where(and(
        eq(ariaActionRequests.id, id),
        eq(ariaActionRequests.sessionId, sessionId),
        eq(ariaActionRequests.status, "requested"),
      ))
      .returning();
    if (!row) { res.status(404).json({ error: "Request not found or no longer cancellable" }); return; }
    res.json(actionResponse(row));
  } catch (err) {
    req.log.error({ err }, "Failed to cancel action request");
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;