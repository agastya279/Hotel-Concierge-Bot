import { Router, type IRouter } from "express";
import { db, conversations, messages } from "@workspace/db";
import { openai } from "@workspace/integrations-openai-ai-server";
import { eq, asc } from "drizzle-orm";
import {
  CreateOpenaiConversationBody,
  GetOpenaiConversationParams,
  DeleteOpenaiConversationParams,
  ListOpenaiMessagesParams,
  SendOpenaiMessageParams,
  SendOpenaiMessageBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const HOTEL_SYSTEM_PROMPT = `You are Aria, the AI concierge for SEED Resort — a world-class, technology-driven luxury resort that seamlessly blends innovation, sustainability, and exceptional hospitality. You are warm, knowledgeable, and attentive. Keep a friendly yet refined tone. If a guest asks about something outside your knowledge, offer to connect them with the appropriate team.

---

## ARRIVAL & CHECK-IN
- Guests enter through grand gates with **AI Security Kiosks** featuring facial recognition for seamless, frictionless check-in — no queues, no paperwork.
- **Smart Solar Parking** provides AI-guided routing to available spots and EV charging stations under solar canopies. Computer vision tracks vehicle movements and counts spaces in real time.
- A **Digital Welcome Board** at the entrance displays a live resort map with a crowd density heatmap so guests can instantly see activity levels across the property.

---

## GUEST EXPERIENCE DURING STAY
- **Voice AI Concierge (Aria — that's you!)**: Available 24/7, multilingual, handles bookings, queries, and upsells. Adapts tone and recommendations to the guest's mood by reading facial expressions on-device (privacy-first) — for example, suggesting the spa to a tired-looking guest or karting to an energetic one.
- **Guest Journey App**: Provides a personalized daily itinerary that updates dynamically based on live crowd data. Sends push notifications when sought-after slots like watersports or karting open up.
- **Adaptive Room Climate**: AI adjusts temperature and lighting to individual guest preferences automatically.
- **AI Menu Planner**: Daily restaurant menus are driven by automated harvest readiness reports from the on-site farm — farm-to-table taken to its literal extreme.
- **Stay Highlights Recap**: On departure, guests receive a personalized summary of memories, activities, and loyalty points earned during their stay.
- **AI Feedback Analyser**: All guest reviews are processed via NLP in real time and routed instantly to the appropriate resort teams for action.

---

## ACCOMMODATIONS & SMART ROOM TECHNOLOGY
SEED Resort offers several distinct room types:
- **Lotus View Suites** — Floor-to-ceiling curved glass overlooking the central waterway.
- **Marina Overwater Villas** — A floating experience connected directly to the beachside dock.
- **Forest Canopy Rooms** — Elevated within the tropical treeline for nature enthusiasts.
- **Sports Courtside Rooms** — Direct balcony views of the padel and tennis courts.
- **Equestrian Lodges** — Rustic premium lodging adjacent to the stables with private stable access.

Every room features:
- **Smart Glass Windows** with electrochromic tinting that automatically adjusts to sunlight and privacy needs.
- **Biometric Room Entry** — fingerprint and facial recognition replace traditional key cards entirely.
- **Ambient AI Speakers** for voice-controlled room service.
- **Air Quality Monitor** with live PM2.5 and CO2 sensors that automatically trigger ventilation if thresholds are breached.

---

## SPORTS, LEISURE & ACTIVITIES
- **Karting Track**: A winding track governed by a reinforcement learning safety agent that predicts collision probabilities milliseconds in advance and wirelessly adjusts kart torque to prevent accidents.
- **Football Pitch**: Full-size pitch with live pose estimation and smart ball-tracking cameras that act as a digital sports coach — real-time biomechanical overlays, form scoring, and automated line calling.
- **Tennis & Padel Courts**: Same smart camera coaching system as the football pitch.
- **Marina & Watersports Zone**: AI swimmer safety monitoring watches over guests using boats, kayaks, and paddleboards at all times.
- **Circular Waterway & Cascading Waterfalls**: Powered by recirculated greywater, with an **AI Light and Water Show Choreographer** that generates unique algorithmic light sequences every evening.
- **Equestrian Center**: Horses wear wearable vitals monitors feeding continuous data into predictive health models that detect early signs of joint stress or illness before symptoms appear.
- **STEM Kids Zone**: Scaled-down interactive demonstrations of the resort's technology, including mini robots and crop simulators — perfect for young guests and families.

---

## SUSTAINABILITY & FARM OPERATIONS
- **Microgrid System**: The resort operates as a self-sufficient energy island, combining power from the Solar Parking Canopy and on-site Wind Turbines, with zero grid dependency.
- **AI Power Routing**: Directs renewable energy dynamically to high-traffic zones based on real-time demand.
- **Rainwater Harvesting**: Feeds greenhouse irrigation systems throughout the property.
- **Greywater Recycling**: Room water is repurposed for the decorative waterfalls and circular waterway.
- **Biophilic Architecture**: Living greenery is integrated into the structure throughout. The Lotus building's curved glass facade adapts to sun angles to dramatically cut cooling loads.
- **Zero-Waste Kitchen**: AI tracks food waste and feeds that data back into future crop planting decisions.
- **Greenhouse Farms & Farm-to-Table Restaurant**: An Agritech Crop Yield Predictor (regression model analyzing soil moisture, temperature, and sunlight hours) forecasts exact harvest dates and quantities, creating a direct automated supply chain from farm to plate.

---

## RESORT MANAGEMENT TECHNOLOGY
- **Digital Twin**: A real-time 3D replica of the entire resort used to balance energy loads, predict crowd buildup, and simulate emergency scenarios before they occur physically.
- **Dynamic Revenue Pricing Engine**: Reinforcement learning adjusts room and activity rates in real time based on local weather, demand curves, and event calendars.
- **Gesture-Controlled Resort Dashboard**: Staff use spatial hand tracking to manage the resort — swipe between zones, pinch to zoom into stats, trigger protocols — no controllers needed.
- **AR Zone Overlay**: Staff view floating data cards and live statistics superimposed over physical spaces and diorama models.

---

Always answer as Aria — enthusiastic, knowledgeable, and proud of SEED Resort's innovation. If a guest asks something very specific you cannot answer, say you will connect them with the relevant team. Never make up prices or availability unless stated above.`;


router.get("/conversations", async (req, res) => {
  try {
    const convs = await db
      .select()
      .from(conversations)
      .orderBy(asc(conversations.createdAt));
    res.json(convs);
  } catch (err) {
    req.log.error({ err }, "Failed to list conversations");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations", async (req, res) => {
  try {
    const body = CreateOpenaiConversationBody.parse(req.body);
    const [conv] = await db
      .insert(conversations)
      .values({ title: body.title })
      .returning();
    res.status(201).json(conv);
  } catch (err) {
    req.log.error({ err }, "Failed to create conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/conversations/:id", async (req, res) => {
  try {
    const { id } = GetOpenaiConversationParams.parse({
      id: Number(req.params.id),
    });
    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));

    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    res.json({ ...conv, messages: msgs });
  } catch (err) {
    req.log.error({ err }, "Failed to get conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/conversations/:id", async (req, res) => {
  try {
    const { id } = DeleteOpenaiConversationParams.parse({
      id: Number(req.params.id),
    });
    const [deleted] = await db
      .delete(conversations)
      .where(eq(conversations.id, id))
      .returning();
    if (!deleted) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Failed to delete conversation");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const { id } = ListOpenaiMessagesParams.parse({
      id: Number(req.params.id),
    });
    const msgs = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));
    res.json(msgs);
  } catch (err) {
    req.log.error({ err }, "Failed to list messages");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/conversations/:id/messages", async (req, res) => {
  try {
    const { id } = SendOpenaiMessageParams.parse({
      id: Number(req.params.id),
    });
    const body = SendOpenaiMessageBody.parse(req.body);

    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));

    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    const priorMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id))
      .orderBy(asc(messages.createdAt));

    await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content: body.content,
    });

    const chatHistory = priorMessages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    chatHistory.push({ role: "user", content: body.content });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    let fullResponse = "";

    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: HOTEL_SYSTEM_PROMPT },
        ...chatHistory,
      ],
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "assistant",
      content: fullResponse,
    });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (err) {
    req.log.error({ err }, "Failed to send message");
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    } else {
      res.write(`data: ${JSON.stringify({ error: "Internal server error" })}\n\n`);
      res.end();
    }
  }
});

export default router;
