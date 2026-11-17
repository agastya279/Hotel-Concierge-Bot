import { Router, type IRouter } from "express";
import { toFile } from "openai";
import {
  ARIA_TRANSCRIPTION_MODEL,
  createAriaSpeechWav,
  detectGroqAudioExtension,
  getGroqClient,
  GroqSpeechTermsRequiredError,
  UnsupportedAriaVoiceLanguageError,
} from "../../lib/aria/groq";

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
    const extension = detectGroqAudioExtension(audioBuffer);
    if (!extension) {
      res.status(400).json({ error: "Audio format is not supported. Record a WAV, MP3, WebM, MP4, or Ogg clip." });
      return;
    }
    const transcription = await getGroqClient().audio.transcriptions.create({
      file: await toFile(audioBuffer, `aria-recording.${extension}`),
      model: ARIA_TRANSCRIPTION_MODEL,
      response_format: "json",
      ...(language !== "auto" ? { language } : {}),
    });
    res.json({ text: transcription.text, language });
  } catch (err) {
    req.log.error({ err }, "Failed to transcribe audio");
    res.status(500).json({ error: "Audio transcription failed" });
  }
});
router.post("/speak", async (req, res): Promise<void> => {
  try {
    const text = typeof req.body?.text === "string" ? req.body.text.trim() : "";
    if (!text || text.length > 4000) { res.status(400).json({ error: "text must contain 1–4000 characters" }); return; }
    const language = typeof req.body?.language === "string" ? req.body.language : "auto";
    const audio = await createAriaSpeechWav(text, language);
    res.setHeader("Content-Type", "audio/wav");
    res.send(audio);
  } catch (err) {
    if (err instanceof GroqSpeechTermsRequiredError) {
      res.status(409).json({
        error: `Accept the Groq speech model terms to enable voice playback: ${err.acceptanceUrl}`,
      });
      return;
    }
    if (err instanceof UnsupportedAriaVoiceLanguageError) {
      res.status(422).json({ error: err.message });
      return;
    }
    req.log.error({ err }, "Failed to synthesize speech");
    res.status(500).json({ error: "Speech synthesis failed" });
  }
});
export default router;