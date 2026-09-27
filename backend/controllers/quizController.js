import * as gemini from "../services/geminiService.js";
import QuizResult from "../models/QuizResult.js";

// @route POST /api/quiz/generate
export const generateQuiz = async (req, res, next) => {
  try {
    const { subject, topic, difficulty, numQuestions } = req.body;

    if (!subject || !topic || !difficulty || !numQuestions) {
      res.status(400);
      throw new Error("Subject, topic, difficulty, and number of questions are required.");
    }

    if (numQuestions < 1 || numQuestions > 25) {
      res.status(400);
      throw new Error("Number of questions must be between 1 and 25.");
    }

    const questions = await gemini.generateQuiz({ subject, topic, difficulty, numQuestions });

    if (!questions.length) {
      res.status(502);
      throw new Error("The AI could not generate a quiz. Please try again.");
    }

    res.json({ success: true, subject, topic, difficulty, questions });
  } catch (error) {
    res.status(res.statusCode === 200 ? 502 : res.statusCode);
    next(new Error(error.message || "Could not generate the quiz. Please try again."));
  }
};

// @route POST /api/quiz/result
export const saveQuizResult = async (req, res, next) => {
  try {
    const { subject, topic, difficulty, answers, totalQuestions } = req.body;

    if (!subject || !topic || !answers || !totalQuestions) {
      res.status(400);
      throw new Error("Missing required quiz result data.");
    }

    const score = answers.filter((a) => a.isCorrect).length;
    const percentage = Math.round((score / totalQuestions) * 100);

    const result = await QuizResult.create({
      userId: req.user._id,
      subject,
      topic,
      difficulty,
      score,
      totalQuestions,
      percentage,
      answers,
    });

    res.status(201).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

// @route GET /api/quiz/history
export const getQuizHistory = async (req, res, next) => {
  try {
    const results = await QuizResult.find({ userId: req.user._id }).sort({ completedAt: -1 });
    res.json({ success: true, results });
  } catch (error) {
    next(error);
  }
};
