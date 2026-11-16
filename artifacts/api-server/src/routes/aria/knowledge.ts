import { Router, type IRouter } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { ARIA_KNOWLEDGE_DOCUMENTS, formatAriaKnowledgeInstructions, searchAriaKnowledge } from "../../lib/aria/knowledge-base";

const router: IRouter = Router();
router.post("/knowledge/search", async (req, res): Promise<void> => {
  const query = typeof req.body?.query === "string" ? req.body.query : "";
  if (!query.trim()) { res.status(400).json({ error: "query required" }); return; }
  try {
    const matchedDocuments = searchAriaKnowledge(query, 4);
    const documents = matchedDocuments.length ? matchedDocuments : ARIA_KNOWLEDGE_DOCUMENTS;
    const completion = await openai.chat.completions.create({
      model: "gpt-5.2",
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