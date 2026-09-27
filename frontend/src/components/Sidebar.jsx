import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Home", icon: "🏠" },
  { to: "/ai-tutor", label: "AI Tutor", icon: "🤖" },
  { to: "/quiz-generator", label: "Quiz", icon: "📝" },
  { to: "/study-planner", label: "Planner", icon: "📅" },
  { to: "/progress", label: "Progress", icon: "📈" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

const Sidebar = () => {
  return (
    <aside className="w-60 bg-white/80 backdrop-blur-md border-r border-gray-100 h-screen sticky top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 gap-2 font-extrabold text-lg">
        <span className="animate-float inline-block">📚</span>
        <span className="text-gradient">Study Buddy</span>
      </div>
      <nav className="flex-1 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-gradient-brand text-white shadow-md shadow-primary-500/25"
                  : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
              }`
            }
          >
            <span className="text-base transition-transform group-hover:scale-110">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 mx-3 mb-4 rounded-xl bg-gradient-card border border-primary-100/60 text-xs text-gray-500">
        Keep learning every day ✨
      </div>
    </aside>
  );
};

export default Sidebar;