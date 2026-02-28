import { Router } from "express";
import { Signup, Signin } from "../controllers/auth.controllers.js";

const router = Router();

router.post("/signup", Signup);
router.post("/signin", Signin);

export default router;
