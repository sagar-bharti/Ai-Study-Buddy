import express from "express";
import { getProgress, getSubjectProgress } from "../controllers/progressController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getProgress);
router.get("/subjects", protect, getSubjectProgress);

export default router;
