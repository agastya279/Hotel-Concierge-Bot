import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();
router.post("/vision", async (req, res): Promise<void> => {
  const imageUrl = typeof req.body?.imageUrl === "string"
    ? req.body.imageUrl
    : typeof req.body?.image === "string"
      ? req.body.image
      : "";
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt : "Describe the image in the context of SEED Resort.";
  if (!imageUrl) { res.status(400).json({ error: "imageUrl required" }); return; }
  try {
    const completion = await openai.chat.completions.create({ model: "gpt-5.2", max_completion_tokens: 2048, messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image_url", image_url: { url: imageUrl } }] as any }] });
    const summary = completion.choices[0]?.message?.content ?? "";
    res.json({ summary, text: summary, suggestions: [], detectedLanguage: null });
  } catch (err) {
    req.log.error({ err }, "Failed to analyze image");
    res.status(500).json({ error: "Image analysis failed" });
  }
});
export default router;