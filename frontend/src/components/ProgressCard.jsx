const ProgressCard = ({ subject, percentage }) => {
  const gradient =
    percentage >= 75
      ? "from-emerald-400 to-teal-500"
      : percentage >= 50
      ? "from-amber-400 to-orange-500"
      : "from-rose-400 to-red-500";

  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1.5">
        <span className="font-medium text-gray-700">{subject}</span>
        <span className="text-gray-500 font-semibold">{percentage}%</span>
      </div>
      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressCard;