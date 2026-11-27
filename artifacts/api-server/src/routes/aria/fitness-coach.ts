import { Router, type IRouter } from "express";
import { ARIA_CHAT_MODEL, getGroqClient } from "../../lib/aria/groq";

const router: IRouter = Router();
const MAX_RECENT_ACTIVITIES = 8;

router.post("/fitness-coach", async (req, res): Promise<void> => {
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  if (!question || question.length > 1000) {
    res.status(400).json({ error: "question must be between 1 and 1000 characters" });
    return;
  }

  const recentActivities = Array.isArray(req.body?.recentActivities)
    ? req.body.recentActivities.slice(0, MAX_RECENT_ACTIVITIES).map((activity: unknown) => {
      if (!activity || typeof activity !== "object") return null;
      const item = activity as Record<string, unknown>;
      return {
        title: typeof item.title === "string" ? item.title.slice(0, 80) : "Activity",
        minutes: typeof item.minutes === "number" && Number.isFinite(item.minutes)
          ? Math.max(0, Math.min(300, item.minutes))
          : 0,
      };
    }).filter(Boolean)
    : [];
  const todayMinutes = typeof req.body?.todayMinutes === "number" && Number.isFinite(req.body.todayMinutes)
    ? Math.max(0, Math.min(1440, req.body.todayMinutes))
    : 0;

  try {
    const completion = await getGroqClient().chat.completions.create({
      model: ARIA_CHAT_MODEL,
      max_completion_tokens: 500,
      messages: [
        {
          role: "system",
          content: [
            "You are SEED Coach, a kind, practical general-wellness companion inside a resort fitness app.",
            "Give concise, encouraging suggestions tailored to the user's stated question and activity context. Offer flexible, low-pressure ideas; never shame users or prescribe an extreme routine.",
            "Do not diagnose, treat, or claim to prevent illness; do not provide individualized medical advice, calorie prescriptions, or supplement recommendations. For pain, injury, pregnancy, chronic conditions, medication questions, or urgent symptoms, recommend consulting an appropriate healthcare professional. For chest pain, severe breathing trouble, fainting, or another emergency, tell them to seek emergency help now.",
            "Do not claim to access a wearable, live biometrics, bookings, or data beyond the activity context supplied. Do not promise that activities are booked or points were awarded.",
            "Keep replies warm and brief, usually 2–5 sentences. Acknowledge that rest and adapting to how someone feels are valid.",
          ].join("\n"),
        },
        {
          role: "user",
          content: JSON.stringify({ question, activityContext: { todayMinutes, recentActivities } }),
        },
      ],
    });
    const answer = completion.choices[0]?.message?.content?.trim();
    if (!answer) {
      res.status(502).json({ error: "The wellness coach did not return an answer" });
      return;
    }
    res.json({ answer });
  } catch (err) {
    req.log.error({ err }, "Failed to answer wellness coach question");
    res.status(500).json({ error: "Wellness coach is temporarily unavailable" });
  }
});

export default router;
