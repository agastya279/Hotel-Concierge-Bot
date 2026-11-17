import { Router, type IRouter } from "express";
import { buildAriaContextInstructions, loadAriaGuestContext, requireGuestSessionId } from "./shared";
import { formatAriaKnowledgeInstructions, searchAriaKnowledge } from "../../lib/aria/knowledge-base";
import { ARIA_CHAT_MODEL, getGroqClient } from "../../lib/aria/groq";

const router: IRouter = Router();
router.post("/recommendations", async (req, res): Promise<void> => {
  try {
    const sessionId = requireGuestSessionId(req);
    if (!sessionId) { res.status(400).json({ error: "x-session-id required" }); return; }
    const prompt = typeof req.body?.request === "string"
      ? req.body.request
      : typeof req.body?.prompt === "string"
        ? req.body.prompt
        : typeof req.body?.query === "string"
          ? req.body.query
          : "Generate a personalized resort itinerary.";
    const context = await loadAriaGuestContext(sessionId);
    const knowledge = searchAriaKnowledge(prompt, 5);
    const completion = await getGroqClient().chat.completions.create({
      model: ARIA_CHAT_MODEL,
      max_completion_tokens: 4096,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "Create concise personalized SEED Resort recommendations and itinerary suggestions.",
            "Never claim live availability, prices, or a confirmed booking. Do not invent opening hours or travel times.",
            "Return only valid JSON with title, summary, and items. Each item must have title, description, category, timing, and actionType.",
            buildAriaContextInstructions(context),
            formatAriaKnowledgeInstructions(knowledge),
          ].join("\n\n"),
        },
        {
          role: "user",
          content: JSON.stringify({
            request: prompt,
            preferences: context.preferences,
            interests: context.interests,
            dietaryNeeds: context.dietaryNeeds,
            travelParty: context.travelParty,
            stayDates: context.stayDates,
            category: req.body?.category,
            days: req.body?.days,
          }),
        },
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
    const items = Array.isArray(parsed.items) ? parsed.items.filter((item) => {
      return item && typeof item === "object" &&
        typeof (item as Record<string, unknown>).title === "string" &&
        typeof (item as Record<string, unknown>).description === "string" &&
        typeof (item as Record<string, unknown>).category === "string";
    }) : [];
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