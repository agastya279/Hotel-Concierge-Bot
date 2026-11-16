import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { ariaActionRequests } from "@workspace/db/schema";
import { requireGuestSessionId, getSessionOrUserId } from "./shared";

const router: IRouter = Router();
router.get("/actions", async (req, res): Promise<void> => {
  try {
    const { sessionId } = getSessionOrUserId(req);
    if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
    const rows = await db.select().from(ariaActionRequests).where(eq(ariaActionRequests.sessionId, sessionId));
    res.json(rows.map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      details: typeof row.details === "string" ? row.details : JSON.stringify(row.details ?? {}),
      preferredTime: typeof row.confirmationMetadata === "object" && row.confirmationMetadata
        ? ((row.confirmationMetadata as Record<string, unknown>).preferredTime as string | null ?? null)
        : null,
      status: row.status === "pending" ? "requested" : row.status,
      createdAt: row.createdAt,
    })));
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
    const type = typeof req.body?.type === "string" ? req.body.type : "human-concierge";
    const details = typeof req.body?.details === "string"
      ? { text: req.body.details }
      : (req.body?.details && typeof req.body.details === "object" ? req.body.details : {});
    const preferredTime = typeof req.body?.preferredTime === "string" ? req.body.preferredTime : null;
    const [row] = await db.insert(ariaActionRequests).values({
      sessionId,
      userId,
      title,
      type,
      status: "requested",
      details,
      confirmationMetadata: { preferredTime },
    }).returning();
    res.status(201).json({
      id: row.id,
      type: row.type,
      title: row.title,
      details: typeof details.text === "string" ? details.text : JSON.stringify(details),
      preferredTime,
      status: row.status,
      createdAt: row.createdAt,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to create action request");
    res.status(500).json({ error: "Internal server error" });
  }
});
router.patch("/actions/:id", async (req, res): Promise<void> => {
  const sid = requireGuestSessionId(req);
  if (!sid) { res.status(400).json({ error: "x-session-id required" }); return; }
  res.status(501).json({ error: "Not implemented" });
});
export default router;