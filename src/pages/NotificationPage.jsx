import { MenuBar } from "@/components/MenuBar";
import { Bell, Check, X, Users, Compass } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

export default function NotificationPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Notifications
            </h1>
            <p className="text-sm text-gray-500 font-normal mt-1">
              Stay updated on trip requests, invites, and community interactions.
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {["all", "requests", "system"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold capitalize transition cursor-pointer ${
                filter === tab
                  ? "bg-[#385526] text-white shadow-xs"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-[#f2f6f0]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-[28px] bg-white border border-gray-100 shadow-xs">
          <div className="h-14 w-14 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526] mb-3">
            <Bell size={24} />
          </div>
          <p className="text-base font-semibold text-gray-800">
            You're all caught up!
          </p>
          <p className="text-xs text-gray-500 max-w-sm mt-1 mb-5">
            No new notifications right now. Check back when you receive join requests or trip updates.
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="rounded-full bg-[#385526] hover:bg-[#2d451e] text-white px-6 py-2.5 text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <Compass size={16} />
            <span>Discover Trips</span>
          </button>
        </div>
      </main>
    </div>
  );
}