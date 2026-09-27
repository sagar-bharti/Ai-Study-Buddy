import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    day: Number,
    subject: String,
    topic: String,
    duration: String,
    activity: String,
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },
  },
  { _id: true }
);

const studyPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    subjects: [{ type: String }],
    examDate: { type: Date },
    dailyHours: { type: Number },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    tasks: [taskSchema],
  },
  { timestamps: true }
);

export default mongoose.model("StudyPlan", studyPlanSchema);
