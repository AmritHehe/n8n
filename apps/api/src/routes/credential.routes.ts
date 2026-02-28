import { Router } from "express";
import { authMiddleware } from "../middlewares/middleware.js";
import { GetCredentials, CreateCredentials, DeleteCredentials,} from "../controllers/credential.controllers.js";

const router = Router();

router.use(authMiddleware);

router.get("/", GetCredentials);
router.post("/", CreateCredentials);
router.delete("/", DeleteCredentials);

export default router;
