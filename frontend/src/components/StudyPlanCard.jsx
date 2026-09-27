const statusStyles = {
  "Not Started": "bg-gray-100 text-gray-600",
  "In Progress": "bg-gradient-to-r from-amber-100 to-orange-100 text-orange-700",
  Completed: "bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700",
};

const StudyPlanCard = ({ task, onStatusChange }) => (
  <div className="card card-hover flex items-center justify-between gap-4">
    <div>
      <p className="text-xs text-primary-500 font-semibold mb-1">Day {task.day}</p>
      <p className="font-semibold text-gray-800">
        {task.subject} — {task.topic}
      </p>
      <p className="text-sm text-gray-500">{task.activity}</p>
      <p className="text-xs text-gray-400 mt-1">{task.duration}</p>
    </div>
    <select
      value={task.status}
      onChange={(e) => onStatusChange(task._id, e.target.value)}
      className={`text-xs font-semibold rounded-lg px-3 py-2 border-none cursor-pointer transition ${statusStyles[task.status]}`}
    >
      <option>Not Started</option>
      <option>In Progress</option>
      <option>Completed</option>
    </select>
  </div>
);

export default StudyPlanCard;