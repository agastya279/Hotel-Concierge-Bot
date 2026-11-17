import { Router, type IRouter } from "express";
import { ARIA_CHAT_MODEL, getGroqClient } from "../../lib/aria/groq";

const router: IRouter = Router();
router.post("/vision", async (req, res): Promise<void> => {
  const imageUrl = typeof req.body?.imageDataUrl === "string"
    ? req.body.imageDataUrl
    : typeof req.body?.imageUrl === "string"
      ? req.body.imageUrl
      : "";
  const prompt = typeof req.body?.prompt === "string" ? req.body.prompt : "Describe the image in the context of SEED Resort.";
  if (!/^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(imageUrl) || imageUrl.length > 8_000_000) {
    res.status(400).json({ error: "Provide a JPEG, PNG, or WebP image under 5 MB" });
    return;
  }
  try {
    const completion = await getGroqClient().chat.completions.create({
      model: ARIA_CHAT_MODEL,
      max_completion_tokens: 2048,
      messages: [{
        role: "user",
        content: [
          { type: "text", text: prompt.slice(0, 1000) },
          { type: "image_url", image_url: { url: imageUrl } },
        ] as any,
      }],
    });
    const summary = completion.choices[0]?.message?.content ?? "";
    res.json({ summary, suggestions: [], detectedLanguage: null });
  } catch (err) {
    req.log.error({ err }, "Failed to analyze image");
    res.status(500).json({ error: "Image analysis failed" });
  }
});
export default router;