import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: String,
    selectedAnswer: String,
    correctAnswer: String,
    isCorrect: Boolean,
    explanation: String,
  },
  { _id: false }
);

const quizResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Medium",
    },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    answers: [answerSchema],
    completedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("QuizResult", quizResultSchema);
