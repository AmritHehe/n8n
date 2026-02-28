import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import {CreateWorflow,GetAllWorkflows,GetWorkflow,UpdateWorkflow,DeleteWorkflow} from "../controllers/workflow.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", CreateWorflow);
router.get("/", GetAllWorkflows);
router.get("/:id", GetWorkflow);
router.put("/:id", UpdateWorkflow);
router.delete("/", DeleteWorkflow);

export default router;
