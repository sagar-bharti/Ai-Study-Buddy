import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";
import StudyPlanCard from "../components/StudyPlanCard.jsx";
import {
  generateStudyPlan,
  getStudyPlans,
  updateStudyPlanTask,
  getErrorMessage,
} from "../services/api.js";

const StudyPlanner = () => {
  const [form, setForm] = useState({
    subjects: "",
    examDate: "",
    dailyHours: 2,
    level: "Beginner",
  });
  const [generating, setGenerating] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);

  const loadPlans = async () => {
    try {
      const res = await getStudyPlans();
      setPlans(res.data.plans);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoadingPlans(false);
    }
  };

  useEffect(() => {
    loadPlans();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const subjects = form.subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!subjects.length || !form.examDate || !form.dailyHours) {
      toast.error("Please fill in all fields.");
      return;
    }

    setGenerating(true);
    try {
      await generateStudyPlan({ ...form, subjects });
      toast.success("Study plan generated!");
      setForm({ subjects: "", examDate: "", dailyHours: 2, level: "Beginner" });
      loadPlans();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setGenerating(false);
    }
  };

  const handleStatusChange = async (planId, taskId, status) => {
    try {
      await updateStudyPlanTask(planId, { taskId, status });
      loadPlans();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Study Planner</h1>
        <p className="text-gray-500">Let AI build a personalized study schedule</p>
      </div>

      <form onSubmit={handleSubmit} className="card max-w-xl space-y-4">
        <input
          type="text"
          placeholder="Subjects (comma separated, e.g. DBMS, Java, Networks)"
          className="input"
          value={form.subjects}
          onChange={(e) => setForm({ ...form, subjects: e.target.value })}
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            className="input"
            value={form.examDate}
            onChange={(e) => setForm({ ...form, examDate: e.target.value })}
          />
          <input
            type="number"
            min={1}
            max={16}
            placeholder="Daily hours"
            className="input"
            value={form.dailyHours}
            onChange={(e) => setForm({ ...form, dailyHours: Number(e.target.value) })}
          />
        </div>
        <select
          className="input"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        >
          <option>Beginner</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
        <button type="submit" disabled={generating} className="btn-primary w-full">
          {generating ? "Generating plan..." : "Generate Study Plan"}
        </button>
      </form>

      <div>
        <h2 className="font-semibold text-gray-800 mb-3">Your Study Plans</h2>
        {loadingPlans ? (
          <Loading />
        ) : plans.length === 0 ? (
          <p className="text-gray-400 text-sm">No study plans yet. Create one above.</p>
        ) : (
          <div className="space-y-6">
            {plans.map((plan) => (
              <div key={plan._id}>
                <p className="text-sm text-gray-500 mb-2">
                  {plan.subjects.join(", ")} — Exam:{" "}
                  {new Date(plan.examDate).toLocaleDateString()}
                </p>
                <div className="space-y-2">
                  {plan.tasks.map((task) => (
                    <StudyPlanCard
                      key={task._id}
                      task={task}
                      onStatusChange={(taskId, status) =>
                        handleStatusChange(plan._id, taskId, status)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanner;
