import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = ({ title }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-white border-b border-navy-100 px-8 py-4 sticky top-0 z-10">
      <h1 className="text-xl font-semibold text-navy-900">{title}</h1>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-navy-900">{user?.name}</p>
          <p className="text-xs text-navy-400 capitalize">{user?.role?.replace("admin", " admin")}</p>
        </div>
        <div className="w-9 h-9 rounded-full bg-teal-500 text-white flex items-center justify-center font-semibold text-sm">
          {user?.name?.charAt(0)}
        </div>
        <button
          onClick={handleLogout}
          className="p-2 rounded-lg text-navy-400 hover:bg-navy-50 hover:text-navy-700 transition-colors"
          aria-label="Log out"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
