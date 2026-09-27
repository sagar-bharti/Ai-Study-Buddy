import express from "express";
import {
  generateQuiz,
  saveQuizResult,
  getQuizHistory,
} from "../controllers/quizController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateQuiz);
router.post("/result", protect, saveQuizResult);
router.get("/history", protect, getQuizHistory);

export default router;
