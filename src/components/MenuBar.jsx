import useUserStore from "@/stores/userStore";
import { Bell, Bookmark, Plus } from "lucide-react";
import { useNavigate } from "react-router";

export function MenuBar() {
  const navigate = useNavigate();
  const logout = useUserStore((state) => state.logout);
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  return (
    <>
      <div className="flex justify-between items-center p-5 px-10">
        <div className="text-5xl font-bold text-primary">Jouney</div>
        <div className="flex gap-10 text-lg">
          <p className="nav-link text-lg" onClick={() => navigate("/")}>
            Home
          </p>
          <p className="nav-link text-lg" onClick={() => navigate("/explore")}>
            Explore
          </p>
          <p
            className="nav-link text-lg"
            onClick={() => navigate("/community")}
          >
            Community
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <button
            className="glass-icon p-2 rounded-md"
            onClick={() => navigate("/create-trip")}
          >
            <Plus />
          </button>
          <button
            className="glass-icon p-2 rounded-md"
            onClick={() => navigate("/save-trip")}
          >
            <Bookmark />
          </button>
          <button
            className="glass-icon p-2 rounded-md"
            onClick={() => navigate("/notification")}
          >
            <Bell />
          </button>
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
    </>
  );
}
