import useUserStore from "@/stores/userStore";
import { Bell, Bookmark, Plus, Compass } from "lucide-react";
import { useNavigate, useLocation } from "react-router";

export function MenuBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  const logout = useUserStore((state) => state.logout);

  const isLoggedIn = !!user && !!token;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 sm:px-8 py-3.5">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => navigate("/")}
        >
          <div className="h-9 w-9 rounded-xl bg-[#385526] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
            <Compass size={20} />
          </div>
          <span className="text-2xl font-bold tracking-tight text-[#385526]">
            Journey
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button
            onClick={() => navigate("/")}
            className={`cursor-pointer transition-colors ${
              isActive("/")
                ? "text-[#385526] font-semibold"
                : "text-gray-600 hover:text-[#385526]"
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/explore")}
            className={`cursor-pointer transition-colors ${
              isActive("/explore")
                ? "text-[#385526] font-semibold"
                : "text-gray-600 hover:text-[#385526]"
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => navigate("/community")}
            className={`cursor-pointer transition-colors ${
              isActive("/community")
                ? "text-[#385526] font-semibold"
                : "text-gray-600 hover:text-[#385526]"
            }`}
          >
            Community
          </button>
        </nav>

        {/* Actions */}
        {isLoggedIn ? (
          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              className="h-9 w-9 rounded-xl flex items-center justify-center border border-gray-200 bg-white text-gray-700 hover:text-[#385526] hover:border-[#385526]/30 hover:bg-[#f2f6f0] transition-all cursor-pointer shadow-2xs"
              onClick={() => navigate("/create-trip")}
              title="Create Trip"
            >
              <Plus size={18} />
            </button>
            <button
              className="h-9 w-9 rounded-xl flex items-center justify-center border border-gray-200 bg-white text-gray-700 hover:text-[#385526] hover:border-[#385526]/30 hover:bg-[#f2f6f0] transition-all cursor-pointer shadow-2xs"
              onClick={() => navigate("/save-trip")}
              title="Saved Trips"
            >
              <Bookmark size={17} />
            </button>
            <button
              className="h-9 w-9 rounded-xl flex items-center justify-center border border-gray-200 bg-white text-gray-700 hover:text-[#385526] hover:border-[#385526]/30 hover:bg-[#f2f6f0] transition-all cursor-pointer shadow-2xs"
              onClick={() => navigate("/notification")}
              title="Notifications"
            >
              <Bell size={17} />
            </button>

            {/* Profile Button */}
            <button
              className="flex items-center gap-2 pl-1.5 pr-3 py-1 rounded-full bg-[#f2f6f0] hover:bg-[#e3ede0] border border-[#385526]/15 text-xs font-semibold text-[#2d451e] transition-all cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              <img
                src={
                  user?.profileImage ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                }
                alt="Profile"
                className="h-6 w-6 rounded-full object-cover border border-white"
              />
              <span className="max-w-[90px] truncate">{user?.firstName || "Profile"}</span>
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="rounded-full px-3.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <button
              className="rounded-full px-4 py-1.5 text-xs font-semibold text-gray-700 hover:text-[#385526] transition cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              className="rounded-full bg-[#385526] hover:bg-[#2d451e] px-4 py-1.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default MenuBar;
