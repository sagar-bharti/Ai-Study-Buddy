import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import toast from "react-hot-toast";
import StatCard from "../components/StatCard.jsx";
import Loading from "../components/Loading.jsx";
import LeaderboardTable from "../components/LeaderboardTable.jsx";
import { getProgress, getRecommendation, getLeaderboard, getErrorMessage } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getProgress();
        setProgress(res.data.progress);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadRec = async () => {
      try {
        const res = await getRecommendation();
        setRecommendation(res.data.recommendation);
      } catch {
        // Recommendation is best-effort; fail silently on dashboard
      } finally {
        setRecLoading(false);
      }
    };
    loadRec();
  }, []);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const res = await getLeaderboard();
        setLeaderboard(res.data.leaderboard);
      } catch {
        // Leaderboard is best-effort; fail silently on dashboard
      } finally {
        setLeaderboardLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  if (loading) return <Loading text="Loading your dashboard..." />;

  const chartData = (progress?.recentResults || [])
    .slice()
    .reverse()
    .map((r, i) => ({ name: `Quiz ${i + 1}`, score: r.percentage }));

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-brand p-6 text-white shadow-lg shadow-primary-500/20 animate-fade-up">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <h1 className="relative text-2xl font-extrabold">
          Welcome back, {user?.name?.split(" ")[0]}! 👋
        </h1>
        <p className="relative text-white/80 mt-1">Here's how your learning is going.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-stagger">
        <StatCard label="Total Quizzes" value={progress?.totalQuizzes ?? 0} icon="📝" />
        <StatCard label="Average Score" value={`${progress?.averageScore ?? 0}%`} icon="🎯" />
        <StatCard label="Study Plans" value={progress?.studyPlansCreated ?? 0} icon="📅" />
        <StatCard label="Tasks Completed" value={progress?.completedTasks ?? 0} icon="✅" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card animate-fade-up">
          <h2 className="font-semibold text-gray-800 mb-4">Recent Quiz Performance</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4f6ef7" strokeWidth={2.5} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-gray-400 text-sm py-10 text-center">
              No quiz data yet. Take a quiz to see your progress here.
            </div>
          )}
        </div>

        <div className="card-gradient animate-fade-up">
          <h2 className="font-semibold text-gray-800 mb-3">🤖 AI Recommendation</h2>
          {recLoading ? (
            <Loading text="Analyzing..." />
          ) : recommendation ? (
            <div className="space-y-2 text-sm text-gray-600">
              <p>{recommendation.summary}</p>
              {recommendation.topicsToRevise?.length > 0 && (
                <ul className="list-disc list-inside text-gray-700">
                  {recommendation.topicsToRevise.slice(0, 3).map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No recommendation available yet.</p>
          )}
        </div>
      </div>

      <div className="card animate-fade-up">
        <h2 className="font-semibold text-gray-800 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/ai-tutor" className="btn-primary">Ask AI Tutor</Link>
          <Link to="/quiz-generator" className="btn-secondary">Generate a Quiz</Link>
          <Link to="/study-planner" className="btn-secondary">Create Study Plan</Link>
          <Link to="/progress" className="btn-secondary">View Progress</Link>
        </div>
      </div>

      <div className="card animate-fade-up">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-800">🏆 Global Leaderboard</h2>
          <span className="text-xs text-gray-400">Top 50 learners</span>
        </div>
        {leaderboardLoading ? (
          <Loading text="Loading leaderboard..." />
        ) : (
          <LeaderboardTable leaderboard={leaderboard} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;