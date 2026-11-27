import { Router, type IRouter } from "express";
import guestContextRouter from "./guest-context";
import recommendationsRouter from "./recommendations";
import actionsRouter from "./actions";
import knowledgeRouter from "./knowledge";
import visionRouter from "./vision";
import voiceRouter from "./voice";
import fitnessCoachRouter from "./fitness-coach";

const router: IRouter = Router();

router.use(guestContextRouter);
router.use(recommendationsRouter);
router.use(actionsRouter);
router.use(knowledgeRouter);
router.use(visionRouter);
router.use(voiceRouter);
router.use(fitnessCoachRouter);

export default router;
