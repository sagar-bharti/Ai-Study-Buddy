import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loading from "../components/Loading.jsx";
import StatCard from "../components/StatCard.jsx";
import ProgressCard from "../components/ProgressCard.jsx";
import { getProgress, getSubjectProgress, getErrorMessage } from "../services/api.js";

const ProgressPage = () => {
  const [progress, setProgress] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [progRes, subRes] = await Promise.all([getProgress(), getSubjectProgress()]);
        setProgress(progRes.data.progress);
        setSubjects(subRes.data.subjects);
        setWeakTopics(subRes.data.weakTopics);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loading text="Loading your progress..." />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Your Progress</h1>
        <p className="text-gray-500">Track how you're doing across subjects</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Quizzes" value={progress?.totalQuizzes ?? 0} icon="📝" />
        <StatCard label="Average Score" value={`${progress?.averageScore ?? 0}%`} icon="🎯" />
        <StatCard label="Best Score" value={`${progress?.bestScore ?? 0}%`} icon="🏆" />
        <StatCard label="Tasks Completed" value={progress?.completedTasks ?? 0} icon="✅" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">Subject-wise Performance</h2>
          {subjects.length === 0 ? (
            <p className="text-gray-400 text-sm">No quiz data yet.</p>
          ) : (
            subjects.map((s) => (
              <ProgressCard key={s.subject} subject={s.subject} percentage={s.averagePercentage} />
            ))
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-gray-800 mb-4">Weak Topics</h2>
          {weakTopics.length === 0 ? (
            <p className="text-gray-400 text-sm">No weak topics detected. Great job!</p>
          ) : (
            weakTopics.map((s) => (
              <ProgressCard key={s.subject} subject={s.subject} percentage={s.averagePercentage} />
            ))
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="font-semibold text-gray-800 mb-3">Recent Quiz Results</h2>
        {progress?.recentResults?.length === 0 ? (
          <p className="text-gray-400 text-sm">No quizzes taken yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {progress?.recentResults?.map((r) => (
              <div key={r._id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-medium text-gray-800">
                    {r.subject} — {r.topic}
                  </p>
                  <p className="text-gray-400">
                    {new Date(r.completedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="font-semibold text-primary-600">{r.percentage}%</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressPage;
