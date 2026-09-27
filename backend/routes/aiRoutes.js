import express from "express";
import { askTutor, getRecommendation } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/ask", protect, askTutor);
router.post("/recommendation", protect, getRecommendation);

export default router;
