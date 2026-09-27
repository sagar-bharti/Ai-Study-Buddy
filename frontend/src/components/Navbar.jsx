import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-20">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-600 text-xl leading-none shrink-0"
          aria-label="Open menu"
        >
          ☰
        </button>
        <div className="font-semibold text-gray-800 truncate">
          Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="h-9 w-9 rounded-full bg-gradient-brand text-white flex items-center justify-center text-sm font-bold shadow-sm overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
          ) : (
            user?.name?.[0]?.toUpperCase()
          )}
        </div>
        <span className="text-sm text-gray-500 hidden md:block">{user?.email}</span>
        <button onClick={handleLogout} className="btn-secondary text-sm px-3 py-2 sm:px-4 sm:py-2.5">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
