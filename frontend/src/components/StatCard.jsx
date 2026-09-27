const StatCard = ({ label, value, icon }) => (
  <div className="card card-hover flex items-center gap-4">
    <div className="h-12 w-12 rounded-xl bg-gradient-brand flex items-center justify-center text-xl shadow-md shadow-primary-500/20">
      <span className="drop-shadow-sm">{icon}</span>
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default StatCard;