import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();
router.post("/knowledge/search", async (req, res): Promise<void> => {
  const query = typeof req.body?.query === "string" ? req.body.query : "";
  if (!query.trim()) { res.status(400).json({ error: "query required" }); return; }
  try {
    const completion = await openai.chat.completions.create({ model: "gpt-5.2", max_completion_tokens: 2048, messages: [{ role: "system", content: "Answer only from known SEED Resort content. If the resort content does not answer the question, say that clearly and offer the human concierge team." }, { role: "user", content: query }] });
  res.json({ answer: completion.choices[0]?.message?.content ?? "" });
  } catch (err) {
    req.log.error({ err }, "Failed to search resort knowledge");
    res.status(500).json({ error: "Knowledge search failed" });
  }
});
export default router;