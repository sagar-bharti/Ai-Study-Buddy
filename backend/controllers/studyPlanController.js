import * as gemini from "../services/geminiService.js";
import StudyPlan from "../models/StudyPlan.js";

// @route POST /api/study-plan/generate
export const generateStudyPlan = async (req, res, next) => {
  try {
    const { subjects, examDate, dailyHours, level } = req.body;

    if (!subjects || !subjects.length || !examDate || !dailyHours || !level) {
      res.status(400);
      throw new Error("Subjects, exam date, daily hours, and level are all required.");
    }

    const days = await gemini.generateStudyPlan({ subjects, examDate, dailyHours, level });

    if (!days.length) {
      res.status(502);
      throw new Error("The AI could not generate a study plan. Please try again.");
    }

    const tasks = days.map((d) => ({
      day: d.day,
      subject: d.subject,
      topic: d.topic,
      duration: d.duration,
      activity: d.activity,
      status: "Not Started",
    }));

    const plan = await StudyPlan.create({
      userId: req.user._id,
      subjects,
      examDate,
      dailyHours,
      level,
      tasks,
    });

    res.status(201).json({ success: true, plan });
  } catch (error) {
    res.status(res.statusCode === 200 ? 502 : res.statusCode);
    next(new Error(error.message || "Could not generate the study plan. Please try again."));
  }
};

// @route GET /api/study-plan
export const getStudyPlans = async (req, res, next) => {
  try {
    const plans = await StudyPlan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, plans });
  } catch (error) {
    next(error);
  }
};

// @route PUT /api/study-plan/:id
export const updateStudyPlanTask = async (req, res, next) => {
  try {
    const { taskId, status } = req.body;

    const plan = await StudyPlan.findOne({ _id: req.params.id, userId: req.user._id });

    if (!plan) {
      res.status(404);
      throw new Error("Study plan not found.");
    }

    const task = plan.tasks.id(taskId);
    if (!task) {
      res.status(404);
      throw new Error("Task not found in this study plan.");
    }

    task.status = status;
    await plan.save();

    res.json({ success: true, plan });
  } catch (error) {
    next(error);
  }
};
