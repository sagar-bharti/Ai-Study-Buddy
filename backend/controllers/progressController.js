import QuizResult from "../models/QuizResult.js";
import StudyPlan from "../models/StudyPlan.js";

// @route GET /api/progress
export const getProgress = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const results = await QuizResult.find({ userId }).sort({ completedAt: -1 });
    const plans = await StudyPlan.find({ userId });

    const totalQuizzes = results.length;
    const averageScore = totalQuizzes
      ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / totalQuizzes)
      : 0;
    const bestScore = totalQuizzes ? Math.max(...results.map((r) => r.percentage)) : 0;

    const completedTasks = plans.reduce(
      (sum, p) => sum + p.tasks.filter((t) => t.status === "Completed").length,
      0
    );

    res.json({
      success: true,
      progress: {
        totalQuizzes,
        averageScore,
        bestScore,
        studyPlansCreated: plans.length,
        completedTasks,
        recentResults: results.slice(0, 5),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/progress/subjects
export const getSubjectProgress = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id });

    const subjectMap = {};
    results.forEach((r) => {
      if (!subjectMap[r.subject]) subjectMap[r.subject] = { total: 0, count: 0 };
      subjectMap[r.subject].total += r.percentage;
      subjectMap[r.subject].count += 1;
    });

    const subjects = Object.entries(subjectMap).map(([subject, v]) => ({
      subject,
      averagePercentage: Math.round(v.total / v.count),
      quizzesTaken: v.count,
    }));

    const weakTopics = subjects.filter((s) => s.averagePercentage < 60);

    res.json({ success: true, subjects, weakTopics });
  } catch (error) {
    next(error);
  }
};
