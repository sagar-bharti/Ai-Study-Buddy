import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white/70 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="font-semibold text-gray-800">
        Welcome back, <span className="text-gradient">{user?.name?.split(" ")[0]}</span> 👋
      </div>
      <div className="flex items-center gap-4">
        <div className="h-9 w-9 rounded-full bg-gradient-brand text-white flex items-center justify-center text-sm font-bold shadow-sm">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <span className="text-sm text-gray-500 hidden sm:block">{user?.email}</span>
        <button onClick={handleLogout} className="btn-secondary text-sm">
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;