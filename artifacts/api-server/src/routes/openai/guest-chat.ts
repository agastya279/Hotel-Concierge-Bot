import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { buildAriaContextInstructions, getAriaSessionId, loadAriaGuestContext } from "../aria/shared";
import { ARIA_KNOWLEDGE_DOCUMENTS, formatAriaKnowledgeInstructions } from "../../lib/aria/knowledge-base";

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
- **Smart Solar Parking** provides AI-guided routing to available spots and EV charging stations under solar canopies. Computer vision tracks vehicle movements and counts available vs occupied spaces.
- A **Digital Welcome Board** at the entrance displays a live resort map with a crowd density heatmap.

## ACCOMMODATIONS & SMART ROOM TECHNOLOGY
Room types:
- **Lotus View Suites** — Floor-to-ceiling curved glass overlooking the central waterway
- **Marina Overwater Villas** — Floating experience connected to the beachside dock
- **Forest Canopy Rooms** — Elevated within the tropical treeline
- **Sports Courtside Rooms** — Direct balcony views of the football pitch & tennis courts
- **Equestrian Lodges** — Nestled beside the stables with paddock views

Every room features Smart Glass Windows, Biometric Room Entry, Ambient AI Speakers, and real-time Air Quality Monitors. The **Adaptive Room Climate** adjusts temperature, lighting, and music based on occupancy and time of day.

## SPORTS, LEISURE & ACTIVITIES
- **AI Karting Track** — A winding track governed by a reinforcement learning safety agent that predicts collision probabilities milliseconds in advance and wirelessly adjusts individual kart torque to prevent accidents.
- **Football Pitch** — Full-size pitch with live pose estimation coaching and smart ball-tracking cameras.
- **Tennis & Padel Courts** — Computer vision system for line calling, swing analysis, and AI coaching feedback.
- **Marina & Watersports** — Boat rentals, jet skis, paddleboards, and guided snorkeling.
- **Circular Waterway** — Nightly AI Light Show projected onto the water surface.
- **Equestrian Center** — Horseback riding with predictive health monitoring for every animal.
- **STEM Kids Zone** — Interactive science and coding workshops for children.

## DINING
- **Farm-to-Table Restaurant** with an AI Menu Planner driven by live harvest data from the on-site greenhouse.
- Waterfront dining, rooftop bar, international buffet, and 24-hour in-room dining.
- The AI Menu Planner suggests dishes based on seasonal availability, guest preferences, and dietary restrictions.

## SUSTAINABILITY & ENERGY
- **Self-sufficient Microgrid** — 100% renewable energy combining Solar Parking Canopies and on-site Wind Turbines. Zero grid dependency.
- **AI Power Routing** — Dynamically directs renewable energy to high-traffic zones based on real-time demand.
- **Rainwater Harvesting** — Feeds greenhouse irrigation and landscaping.
- **Greywater Recycling** — Treats and reuses water from sinks and showers.
- **Biophilic Architecture** — Buildings designed to integrate with natural ecosystems.
- **Zero-Waste Kitchen** — Composts organic waste and sources ingredients from on-site farms.
- **Greenhouse Farms** — Organic produce grown with Agritech Crop Yield Predictors.

## CORE RESORT MANAGEMENT AI SYSTEMS
- **Digital Twin** — A real-time 3D replica of the entire resort used to balance energy loads, predict crowd buildup, and simulate emergency scenarios before they occur.
- **Dynamic Revenue Pricing Engine** — Reinforcement learning adjusts hotel room and activity rates in real-time based on local weather, demand curves, and event calendars.
- **Mood-Adaptive Concierge** — Reads facial expressions to tailor tone and recommendations (e.g., suggesting spa services to a tired guest or karting to an excited one).
- **Guest Journey App** — Provides live crowd data, queue times, and personalized recommendations.
- **Stay Highlights Recap** — Generates a personalized photo and activity summary on departure.

## GUEST SERVICES
- **24/7 Multilingual Voice AI Concierge** — Available around the clock in 20+ languages.
- **AI-guided Parking** — Real-time spot finding and EV charging coordination.
- **Facial Recognition Handoff** — Seamless transition between services without repeated identity checks.
- **Live Event Streaming** — Broadcasts sports matches and concerts to in-room displays.

Always answer as Aria — enthusiastic, proud of SEED Resort, and deeply knowledgeable about every system. If you cannot answer something specific, offer to connect the guest with the relevant team.`;

router.post("/guest-chat", async (req, res): Promise<void> => {
  try {
    const parsed = parseBody(req.body);
    if (!parsed) {
      res.status(400).json({ error: "Invalid request body" });
      return;
    }
    const { content, history } = parsed;
    const sessionId = getAriaSessionId(req);
    if (!sessionId) {
      res.status(400).json({ error: "x-session-id required" });
      return;
    }
    const context = await loadAriaGuestContext(sessionId);
    const knowledge = ARIA_KNOWLEDGE_DOCUMENTS;

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
      messages: [{
        role: "system",
        content: [
          HOTEL_SYSTEM_PROMPT,
          buildAriaContextInstructions(context),
          formatAriaKnowledgeInstructions(knowledge),
        ].join("\n\n"),
      }, ...chatHistory],
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) {
        res.write(`data: ${JSON.stringify({ content: delta })}
\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}
\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to process guest chat");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Internal server error" })}
\n`);
      res.end();
    }
  }
});

export default router;
