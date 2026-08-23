import { Bell, Bookmark, Plus } from "lucide-react";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/userStore";

export const ProfileComponent = () => {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const token = useUserStore((state) => state.token);
  
  const isLoggedIn = !!user && !!token;

  const logout = useUserStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-between p-5 px-10">
        {/* Logo */}
        <div
          className="cursor-pointer text-5xl font-bold text-primary"
          onClick={() => navigate("/")}
        >
          Journey
        </div>

        {/* Navigation */}
        <div className="flex gap-10 text-lg">
          <p
            className="nav-link cursor-pointer text-lg"
            onClick={() => navigate("/")}
          >
            Home
          </p>

          <p
            className="nav-link cursor-pointer text-lg"
            onClick={() => navigate("/explore")}
          >
            Explore
          </p>

          <p
            className="nav-link cursor-pointer text-lg"
            onClick={() => navigate("/community")}
          >
            Community
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          {/* Create Trip */}
          <button
            className="glass-icon rounded-md p-2"
            onClick={() => navigate("/create-trip")}
          >
            <Plus />
          </button>

          {/* Saved Trips */}
          <button
            className="glass-icon rounded-md p-2"
            onClick={() => navigate("/save-trip")}
          >
            <Bookmark />
          </button>

          {/* Notification */}
          <button
            className="glass-icon rounded-md p-2"
            onClick={() => navigate("/notification")}
          >
            <Bell />
          </button>

          {/* Profile */}
          <button
            className="btn-primary px-4 py-2 text-sm"
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>
          <button
            onClick={handleLogout}
            className="rounded-full bg-red-500 px-5 py-2 text-sm font-medium text-white hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-5 px-10">
      {/* Logo */}
      <div
        className="cursor-pointer text-5xl font-bold text-primary"
        onClick={() => navigate("/")}
      >
        Journey
      </div>

      {/* Auth Buttons */}
      <div className="flex gap-2">
        <button
          className="btn-primary px-4 py-2 text-sm"
          onClick={() => navigate("/register")}
        >
          Register
        </button>

        <button
          className="btn-primary px-4 py-2 text-sm"
          onClick={() => navigate("/login")}
        >
          Login
        </button>
      </div>
    </div>
  );
};
