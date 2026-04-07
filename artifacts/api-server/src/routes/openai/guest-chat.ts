import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router: IRouter = Router();

interface HistoryMessage {
  role: "user" | "assistant";
  content: string;
}

function parseBody(body: unknown): { content: string; history: HistoryMessage[] } | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  if (typeof b.content !== "string" || !b.content.trim()) return null;
  const rawHistory = Array.isArray(b.history) ? b.history : [];
  const history: HistoryMessage[] = [];
  for (const h of rawHistory) {
    if (h && typeof h === "object") {
      const item = h as Record<string, unknown>;
      if ((item.role === "user" || item.role === "assistant") && typeof item.content === "string") {
        history.push({ role: item.role, content: item.content });
      }
    }
  }
  return { content: b.content, history };
}

const HOTEL_SYSTEM_PROMPT = `You are Aria, the AI concierge for SEED Resort — a world-class, technology-driven luxury resort that seamlessly blends innovation, sustainability, and exceptional hospitality. You are warm, knowledgeable, and attentive. Keep a friendly yet refined tone. If a guest asks about something outside your knowledge, offer to connect them with the appropriate team.

---

## ARRIVAL & CHECK-IN
- Guests enter through grand gates with **AI Security Kiosks** featuring facial recognition for seamless, frictionless check-in — no queues, no paperwork.
- **Smart Solar Parking** provides AI-guided routing to available spots and EV charging stations under solar canopies.
- A **Digital Welcome Board** at the entrance displays a live resort map with a crowd density heatmap.

## ACCOMMODATIONS & SMART ROOM TECHNOLOGY
Room types: Lotus View Suites, Marina Overwater Villas, Forest Canopy Rooms, Sports Courtside Rooms, Equestrian Lodges. Every room has Smart Glass Windows, Biometric Room Entry, Ambient AI Speakers, and Air Quality Monitors.

## SPORTS, LEISURE & ACTIVITIES
AI Karting Track, Football Pitch with pose estimation coaching, Tennis & Padel Courts, Marina & Watersports, Circular Waterway with nightly AI Light Show, Equestrian Center with predictive health monitoring, STEM Kids Zone.

## DINING
Farm-to-Table Restaurant with AI Menu Planner driven by live harvest data from the on-site greenhouse.

## SUSTAINABILITY
Self-sufficient Microgrid (solar + wind), Rainwater Harvesting, Greywater Recycling, Biophilic Architecture, Zero-Waste Kitchen, Greenhouse Farms with Agritech Crop Yield Predictor.

## GUEST SERVICES
24/7 multilingual Voice AI Concierge, Guest Journey App with live crowd data, Adaptive Room Climate, Stay Highlights Recap on departure.

Always answer as Aria — enthusiastic and proud of SEED Resort. If you cannot answer something specific, offer to connect the guest with the relevant team.`;

router.post("/guest-chat", async (req, res) => {
  try {
    const parsed = parseBody(req.body);
    if (!parsed) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { content, history } = parsed;

    const chatHistory: { role: "user" | "assistant"; content: string }[] = history.map((m) => ({
      role: m.role,
      content: m.content,
    }));
    chatHistory.push({ role: "user", content });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [{ role: "system", content: HOTEL_SYSTEM_PROMPT }, ...chatHistory],
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to process guest chat");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
