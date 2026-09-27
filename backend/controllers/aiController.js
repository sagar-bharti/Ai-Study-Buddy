import * as gemini from "../services/geminiService.js";
import QuizResult from "../models/QuizResult.js";

// @route POST /api/ai/ask
export const askTutor = async (req, res, next) => {
  try {
    const { subject, level, question } = req.body;

    if (!subject || !level || !question) {
      res.status(400);
      throw new Error("Subject, level, and question are all required.");
    }

    const answer = await gemini.generateTutorResponse({ subject, level, question });

    res.json({ success: true, answer });
  } catch (error) {
    console.error("GEMINI ERROR (askTutor):", error);
    if (error.message?.toLowerCase().includes("rate")) {
      res.status(429);
      return next(new Error("AI is receiving too many requests right now. Please try again shortly."));
    }
    res.status(res.statusCode === 200 ? 502 : res.statusCode);
    next(new Error("The AI tutor could not generate a response. Please try again."));
  }
};

// @route POST /api/ai/recommendation
export const getRecommendation = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const results = await QuizResult.find({ userId }).sort({ completedAt: -1 }).limit(50);

    if (results.length === 0) {
      return res.json({
        success: true,
        recommendation: {
          summary: "You haven't completed any quizzes yet. Take a quiz to get a personalized recommendation!",
          topicsToRevise: [],
          recommendedOrder: [],
          practiceSuggestions: ["Try the Quiz Generator to create your first quiz."],
          recommendedQuizTopic: "",
        },
      });
    }

    const topicMap = {};
    results.forEach((r) => {
      const key = `${r.subject} - ${r.topic}`;
      if (!topicMap[key]) topicMap[key] = { total: 0, count: 0 };
      topicMap[key].total += r.percentage;
      topicMap[key].count += 1;
    });

    const weakTopics = Object.entries(topicMap)
      .map(([topic, v]) => ({ topic, averagePercentage: Math.round(v.total / v.count) }))
      .sort((a, b) => a.averagePercentage - b.averagePercentage)
      .slice(0, 5);

    const overallStats = {
      totalQuizzes: results.length,
      averageScore: Math.round(
        results.reduce((sum, r) => sum + r.percentage, 0) / results.length
      ),
    };

    const recommendation = await gemini.generateRecommendation({ weakTopics, overallStats });

    res.json({ success: true, recommendation });
  } catch (error) {
    console.error("GEMINI ERROR (getRecommendation):", error);
    res.status(res.statusCode === 200 ? 502 : res.statusCode);
    next(new Error("Could not generate a recommendation right now. Please try again."));
  }
};