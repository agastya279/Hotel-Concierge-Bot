import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { requireGuestSessionId } from "./shared";

const router: IRouter = Router();
router.post("/recommendations", async (req, res): Promise<void> => {
  try {
    const sessionId = requireGuestSessionId(req);
    if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
    const prompt = typeof req.body?.request === "string"
      ? req.body.request
      : typeof req.body?.prompt === "string"
        ? req.body.prompt
        : "Generate a personalized resort itinerary.";
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 4096,
      messages: [
        {
          role: "system",
          content: "Create concise personalized SEED Resort recommendations and itinerary suggestions. Return JSON with title, summary, and items. Each item must have title, description, category, timing, and actionType.",
        },
        { role: "user", content: JSON.stringify({ sessionId, ...req.body, request: prompt }) },
      ],
    });
    const raw = completion.choices[0]?.message?.content ?? "";
    let parsed: { title?: string; summary?: string; items?: unknown[] } = {};
    try {
      parsed = JSON.parse(raw.replace(/^```json\s*/i, "").replace(/\s*```$/, ""));
    } catch {
      parsed = {
        title: "Your SEED Resort plan",
        summary: raw,
        items: [],
      };
    }
    const items = Array.isArray(parsed.items) ? parsed.items : [];
    res.json({
      title: parsed.title || "Your SEED Resort plan",
      summary: parsed.summary || raw,
      items,
      recommendations: items,
      result: raw,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to generate recommendations");
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;