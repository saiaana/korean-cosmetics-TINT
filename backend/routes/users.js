import express from "express";
import { createUser, getCurrentUser } from "../controllers/usersController.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/", createUser);
router.get("/me", authenticateToken, getCurrentUser);

export default router;
