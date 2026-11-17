import OpenAI from "openai";
import { Buffer } from "node:buffer";

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
export const ARIA_CHAT_MODEL = "qwen/qwen3.8-27b";
export const ARIA_TRANSCRIPTION_MODEL = "whisper-large-v3-turbo";

let client: OpenAI | undefined;

export function getGroqClient(): OpenAI {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("GROQ_API_KEY is required to use Aria's AI features.");
  }
  client ??= new OpenAI({ apiKey, baseURL: GROQ_BASE_URL });
  return client;
}

export class UnsupportedAriaVoiceLanguageError extends Error {
  constructor() {
    super("Aria voice playback currently supports English and Arabic.");
    this.name = "UnsupportedAriaVoiceLanguageError";
  }
}

export class GroqSpeechTermsRequiredError extends Error {
  constructor(readonly model: string) {
    super("The Groq speech model requires organization terms acceptance.");
    this.name = "GroqSpeechTermsRequiredError";
  }

  get acceptanceUrl(): string {
    return `https://console.groq.com/playground?model=${encodeURIComponent(this.model)}`;
  }
}

function getGroqErrorCode(error: unknown): string | undefined {
  if (!error || typeof error !== "object" || !("code" in error)) return undefined;
  return typeof error.code === "string" ? error.code : undefined;
}

function splitForSpeech(text: string, maxLength = 200): string[] {
  const chunks: string[] = [];
  let remaining = text.trim();

  while (remaining.length > maxLength) {
    let splitAt = remaining.lastIndexOf(" ", maxLength);
    if (splitAt < 1) splitAt = maxLength;
    chunks.push(remaining.slice(0, splitAt).trim());
    remaining = remaining.slice(splitAt).trimStart();
  }

  if (remaining) chunks.push(remaining);
  return chunks;
}

interface ParsedWav {
  format: Buffer;
  chunks: Array<{ id: string; raw: Buffer; data: Buffer }>;
  audio: Buffer;
}

function parseWav(wav: Buffer): ParsedWav {
  if (wav.length < 12 || wav.toString("ascii", 0, 4) !== "RIFF" || wav.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error("Groq returned an invalid WAV audio response.");
  }

  const chunks: ParsedWav["chunks"] = [];
  const audioChunks: Buffer[] = [];
  let format: Buffer | undefined;
  let offset = 12;

  while (offset + 8 <= wav.length) {
    const id = wav.toString("ascii", offset, offset + 4);
    const size = wav.readUInt32LE(offset + 4);
    const dataStart = offset + 8;
    const dataEnd = dataStart + size;
    const paddedEnd = dataEnd + (size % 2);
    if (dataEnd > wav.length || paddedEnd > wav.length) {
      throw new Error("Groq returned a truncated WAV audio response.");
    }

    const data = wav.subarray(dataStart, dataEnd);
    const raw = wav.subarray(offset, paddedEnd);
    chunks.push({ id, raw, data });
    if (id === "fmt ") format ??= data;
    if (id === "data") audioChunks.push(data);
    offset = paddedEnd;
  }

  if (!format || !audioChunks.length) {
    throw new Error("Groq returned a WAV response without audio data.");
  }

  return { format, chunks, audio: Buffer.concat(audioChunks) };
}

function createWavChunk(id: string, data: Buffer): Buffer {
  const header = Buffer.alloc(8);
  header.write(id, 0, 4, "ascii");
  header.writeUInt32LE(data.length, 4);
  const padding = data.length % 2 === 1 ? Buffer.from([0]) : Buffer.alloc(0);
  return Buffer.concat([header, data, padding]);
}

function joinWavFiles(wavFiles: Buffer[]): Buffer {
  if (wavFiles.length === 1) return wavFiles[0];

  const parsed = wavFiles.map(parseWav);
  const template = parsed[0];
  if (parsed.some((wav) => !wav.format.equals(template.format))) {
    throw new Error("Groq returned WAV segments with incompatible audio formats.");
  }

  const chunks = template.chunks.filter((chunk) => chunk.id !== "data").map((chunk) => chunk.raw);
  chunks.push(createWavChunk("data", Buffer.concat(parsed.map((wav) => wav.audio))));
  const body = Buffer.concat([Buffer.from("WAVE", "ascii"), ...chunks]);
  const header = Buffer.alloc(8);
  header.write("RIFF", 0, 4, "ascii");
  header.writeUInt32LE(body.length, 4);
  return Buffer.concat([header, body]);
}

export async function createAriaSpeechWav(text: string, language = "auto"): Promise<Buffer> {
  const normalizedLanguage = language.trim().toLowerCase();
  const isArabic = normalizedLanguage.startsWith("ar")
    || normalizedLanguage === "arabic"
    || (normalizedLanguage === "auto" && /[\u0600-\u06ff]/u.test(text));
  const isEnglish = normalizedLanguage === ""
    || normalizedLanguage === "auto"
    || normalizedLanguage.startsWith("en")
    || normalizedLanguage === "english";

  if (!isArabic && !isEnglish) {
    throw new UnsupportedAriaVoiceLanguageError();
  }

  const model = isArabic ? "canopylabs/orpheus-arabic-saudi" : "canopylabs/orpheus-v1-english";
  const voice = isArabic ? "lulwa" : "hannah";
  const client = getGroqClient();
  const wavFiles: Buffer[] = [];

  for (const input of splitForSpeech(text)) {
    try {
      const response = await client.audio.speech.create({
        model,
        voice,
        input,
        response_format: "wav",
      });
      wavFiles.push(Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      if (getGroqErrorCode(error) === "model_terms_required") {
        throw new GroqSpeechTermsRequiredError(model);
      }
      throw error;
    }
  }

  return joinWavFiles(wavFiles);
}

export function detectGroqAudioExtension(audio: Buffer): string | null {
  if (audio.length >= 12 && audio.toString("ascii", 0, 4) === "RIFF" && audio.toString("ascii", 8, 12) === "WAVE") {
    return "wav";
  }
  if (audio.length >= 4 && audio[0] === 0x1a && audio[1] === 0x45 && audio[2] === 0xdf && audio[3] === 0xa3) {
    return "webm";
  }
  if (audio.length >= 8 && audio.toString("ascii", 4, 8) === "ftyp") return "mp4";
  if (audio.length >= 4 && audio.toString("ascii", 0, 4) === "OggS") return "ogg";
  if (
    (audio.length >= 3 && audio.toString("ascii", 0, 3) === "ID3")
    || (audio.length >= 2 && audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0)
  ) {
    return "mp3";
  }
  return null;
}
