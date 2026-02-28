import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import { Webhook, Execute } from "../controllers/execution.controllers.js";
import { SSE } from "../controllers/sse.controllers.js";

const router = Router();

router.all("/webhook/:id", Webhook);

router.get("/execute/logs/:workflowId",authMiddleware, SSE);

router.post("/execute", authMiddleware, Execute);

export default router;
