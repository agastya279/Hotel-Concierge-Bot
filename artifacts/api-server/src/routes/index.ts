import { Router, type IRouter } from "express";
import healthRouter from "./health";
import openaiConversationsRouter from "./openai/conversations";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/openai", openaiConversationsRouter);

export default router;
