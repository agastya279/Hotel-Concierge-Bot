import { Router, type IRouter } from "express";
import { ARIA_KNOWLEDGE_DOCUMENTS, formatAriaKnowledgeInstructions, searchAriaKnowledge } from "../../lib/aria/knowledge-base";
import { ARIA_CHAT_MODEL, getGroqClient } from "../../lib/aria/groq";

const router: IRouter = Router();
router.post("/knowledge/search", async (req, res): Promise<void> => {
  const query = typeof req.body?.query === "string" ? req.body.query : "";
  if (!query.trim()) { res.status(400).json({ error: "query required" }); return; }
  try {
    const matchedDocuments = searchAriaKnowledge(query, 4);
    const documents = matchedDocuments.length ? matchedDocuments : ARIA_KNOWLEDGE_DOCUMENTS;
    const completion = await getGroqClient().chat.completions.create({
      model: ARIA_CHAT_MODEL,
      max_completion_tokens: 2048,
      messages: [
        {
          role: "system",
          content: `${formatAriaKnowledgeInstructions(documents)}\n\nAnswer the guest clearly and briefly.`,
        },
        { role: "user", content: query },
      ],
    });
    res.json({
      answer: completion.choices[0]?.message?.content ?? "",
      sources: documents.map(({ id, title, source }) => ({ id, title, source })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to search resort knowledge");
    res.status(500).json({ error: "Knowledge search failed" });
  }
});
export default router;