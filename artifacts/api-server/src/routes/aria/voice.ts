import { Router, type IRouter } from "express";
import { speechToText, textToSpeech } from "@workspace/integrations-openai-ai-server/audio";

const router: IRouter = Router();
router.post("/voice/transcribe", async (req, res): Promise<void> => {
  const audioBase64 = typeof req.body?.audioBase64 === "string" ? req.body.audioBase64 : "";
  if (!audioBase64) { res.status(400).json({ error: "audioBase64 required" }); return; }
  const transcript = await speechToText(Buffer.from(audioBase64, "base64"), "webm");
  res.json({ transcript });
});
router.post("/transcribe", async (req, res): Promise<void> => {
  try {
    const audioBase64 = typeof req.body?.audioBase64 === "string" ? req.body.audioBase64 : "";
    if (!audioBase64) { res.status(400).json({ error: "audioBase64 required" }); return; }
    const text = await speechToText(Buffer.from(audioBase64, "base64"), "webm");
    res.json({ text, transcript: text, language: typeof req.body?.language === "string" ? req.body.language : "auto" });
  } catch (err) {
    req.log.error({ err }, "Failed to transcribe audio");
    res.status(500).json({ error: "Audio transcription failed" });
  }
});
router.post("/voice/tts", async (req, res): Promise<void> => {
  const text = typeof req.body?.text === "string" ? req.body.text : "";
  if (!text) { res.status(400).json({ error: "text required" }); return; }
  const audio = await textToSpeech(text, "alloy", "wav");
  res.json({ audioBase64: audio.toString("base64") });
});
router.post("/speak", async (req, res): Promise<void> => {
  try {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text) { res.status(400).json({ error: "text required" }); return; }
    const audio = await textToSpeech(text, "nova", "mp3");
    res.setHeader("Content-Type", "audio/mpeg");
    res.send(audio);
  } catch (err) {
    req.log.error({ err }, "Failed to synthesize speech");
    res.status(500).json({ error: "Speech synthesis failed" });
  }
});
export default router;