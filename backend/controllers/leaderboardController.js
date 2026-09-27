import QuizResult from "../models/QuizResult.js";

// @route GET /api/leaderboard
export const getLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await QuizResult.aggregate([
      {
        $group: {
          _id: "$userId",
          totalQuizzes: { $sum: 1 },
          totalQuestions: { $sum: "$totalQuestions" },
          totalCorrect: { $sum: "$score" },
          averageScore: { $avg: "$percentage" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          name: "$user.name",
          avatar: "$user.avatar",
          totalQuizzes: 1,
          totalQuestions: 1,
          totalCorrect: 1,
          averageScore: { $round: ["$averageScore", 0] },
        },
      },
      { $sort: { averageScore: -1, totalQuizzes: -1 } },
      { $limit: 50 },
    ]);

    const ranked = leaderboard.map((entry, index) => ({ ...entry, rank: index + 1 }));

    const currentUserEntry = ranked.find(
      (entry) => entry.userId.toString() === req.user._id.toString()
    );

    res.json({ success: true, leaderboard: ranked, currentUserRank: currentUserEntry?.rank || null });
  } catch (error) {
    next(error);
  }
};