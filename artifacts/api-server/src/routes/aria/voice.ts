import { Router, type IRouter } from "express";
import { ensureCompatibleFormat, speechToText, textToSpeech } from "@workspace/integrations-openai-ai-server/audio";

const router: IRouter = Router();
router.post("/transcribe", async (req, res): Promise<void> => {
  try {
    const audioBase64 = typeof req.body?.audioBase64 === "string" ? req.body.audioBase64 : "";
    if (!audioBase64 || audioBase64.length > 8_000_000 || !/^[A-Za-z0-9+/]+={0,2}$/.test(audioBase64)) {
      res.status(400).json({ error: "Provide a valid audio recording under 6 MB" });
      return;
    }
    const language = typeof req.body?.language === "string" ? req.body.language : "auto";
    const audioBuffer = Buffer.from(audioBase64, "base64");
    if (!audioBuffer.length) { res.status(400).json({ error: "Audio recording is empty" }); return; }
    const compatibleAudio = await ensureCompatibleFormat(audioBuffer);
    const text = await speechToText(compatibleAudio.buffer, compatibleAudio.format);
    res.json({ text, language });
  } catch (err) {
    req.log.error({ err }, "Failed to transcribe audio");
    res.status(500).json({ error: "Audio transcription failed" });
  }
});
router.post("/speak", async (req, res): Promise<void> => {
  try {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text || text.length > 4000) { res.status(400).json({ error: "text must contain 1–4000 characters" }); return; }
    const audio = await textToSpeech(text, "nova", "mp3");
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (err) {
    req.log.error({ err }, "Failed to synthesize speech");
    res.status(500).json({ error: "Speech synthesis failed" });
  }
});
export default router;