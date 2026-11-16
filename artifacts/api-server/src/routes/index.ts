import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import openaiConversationsRouter from "./openai/conversations";
import guestChatRouter from "./openai/guest-chat";
import ariaRouter from "./aria";

const router: IRouter = Router();

router.get("/", (_req, res) => {
  res.json({ status: "ok", service: "api" });
});

router.use(healthRouter);
router.use(authRouter);
router.use("/openai", openaiConversationsRouter);
router.use("/openai", guestChatRouter);
router.use("/aria", ariaRouter);

export default router;
