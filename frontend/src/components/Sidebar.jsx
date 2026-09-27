import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Home", icon: "🏠" },
  { to: "/ai-tutor", label: "AI Tutor", icon: "🤖" },
  { to: "/quiz-generator", label: "Quiz", icon: "📝" },
  { to: "/study-planner", label: "Planner", icon: "📅" },
  { to: "/progress", label: "Progress", icon: "📈" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-30 md:hidden animate-fade-in"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 left-0 z-40 w-60 bg-white/95 md:bg-white/80 backdrop-blur-md border-r border-gray-100 h-screen flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-2 font-extrabold text-lg">
            <span className="animate-float inline-block">📚</span>
            <span className="text-gradient">Study Buddy</span>
          </div>
          <button onClick={onClose} className="md:hidden text-gray-400 text-xl leading-none">
            ✕
          </button>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
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
    </>
  );
};

export default Sidebar;
