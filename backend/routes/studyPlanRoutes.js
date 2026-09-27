import express from "express";
import {
  generateStudyPlan,
  getStudyPlans,
  updateStudyPlanTask,
} from "../controllers/studyPlanController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/generate", protect, generateStudyPlan);
router.get("/", protect, getStudyPlans);
router.put("/:id", protect, updateStudyPlanTask);

export default router;
