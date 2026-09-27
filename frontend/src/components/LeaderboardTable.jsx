import { useAuth } from "../context/AuthContext.jsx";

const medals = ["🥇", "🥈", "🥉"];

const LeaderboardTable = ({ leaderboard }) => {
  const { user } = useAuth();

  if (!leaderboard || leaderboard.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-6 text-center">
        No quiz activity yet. Be the first to take a quiz and top the leaderboard!
      </p>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {leaderboard.map((entry) => {
        const isMe = entry.name === user?.name && entry.rank && user?.email;
        return (
          <div
            key={entry.userId}
            className={`flex items-center gap-4 py-3 px-2 rounded-xl transition ${
              isMe ? "bg-gradient-card" : "hover:bg-gray-50"
            }`}
          >
            <div className="w-8 text-center font-bold text-gray-500">
              {entry.rank <= 3 ? (
                <span className="text-xl">{medals[entry.rank - 1]}</span>
              ) : (
                `#${entry.rank}`
              )}
            </div>

            <div className="h-10 w-10 rounded-full bg-gradient-brand flex items-center justify-center text-sm font-bold text-white overflow-hidden shrink-0">
              {entry.avatar ? (
                <img src={entry.avatar} alt={entry.name} className="h-full w-full object-cover" />
              ) : (
                entry.name?.[0]?.toUpperCase()
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 truncate">
                {entry.name} {isMe && <span className="text-xs text-primary-600">(You)</span>}
              </p>
              <p className="text-xs text-gray-400">
                {entry.totalQuizzes} quiz{entry.totalQuizzes !== 1 ? "zes" : ""} attempted ·{" "}
                {entry.totalCorrect}/{entry.totalQuestions} correct
              </p>
            </div>

            <div className="text-right shrink-0">
              <p className="font-bold text-primary-600">{entry.averageScore}%</p>
              <p className="text-xs text-gray-400">avg score</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardTable;