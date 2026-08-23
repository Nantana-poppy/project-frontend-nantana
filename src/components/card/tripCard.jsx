import React, { useState } from "react";
import { Bookmark, MapPin, Calendar } from "lucide-react";
import { mainApi } from "@/api/mainApi";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/userStore";
import { toast } from "react-toastify";

export default function TripCard({
  tripId,
  category,
  image,
  title,
  location,
  dateRange,
  price,
  hostName,
  hostAvatar = "...",
  joined,
}) {
  const user = useUserStore((state) => state.user);
  const [joining, setJoining] = useState(false);
  const navigate = useNavigate();

  const handleJoinTrip = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    try {
      setJoining(true);
      await mainApi.post(`/trips/${tripId}/requests`);
      toast.success("Join request sent successfully");
    } catch (error) {
      console.error("Join trip error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to join trip",
      );
    } finally {
      setJoining(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    try {
      const response = await mainApi.post(`/trips/${tripId}/save`);

      toast.success("Trip saved successfully");

      console.log("Save trip:", response.data);
    } catch (error) {
      console.error("Save trip error:", error.response?.data || error);

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save trip",
      );
    }
  };
  return (
    <div className="flex items-center justify-center p-5 w-full">
      <div className="w-full max-w-full rounded-2xl bg-white modern-card overflow-hidden">
        {/* Image section */}
        <div className="relative h-72 w-full">
          <img
            src={
              image ||
              "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop"
            }
            alt={title || "Trip"}
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* gradient for text legibility */}
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

          {/* Category badge */}
          <div className="absolute top-4 left-4 glass-badge">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="shrink-0"
            >
              <circle cx="13" cy="4" r="2" />
              <path d="M10.5 8.5l-3 2v4l-2 5.5 1.8.7L9 16l1.5-1 .5 5h2l-.3-6.5L14 12l3 2.5 1.2-1.5-3.7-3.2-1-3z" />
            </svg>
            {category}
          </div>
          <button
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full glass-icon text-neutral-800 hover:scale-105 transition-transform"
            onClick={handleSaveTrip}
          >
            <Bookmark size={16} />
          </button>

          {/* Title + location */}
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <h2 className="text-3xl font-semibold leading-tight tracking-normal">
              {title}
            </h2>
            <div className="mt-1 flex items-center gap-1 text-white/90 text-base">
              <MapPin size={16} className="shrink-0" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Info section */}
        <div className="px-5 pt-4 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-800">
              <Calendar size={18} className="text-neutral-500" />
              <span className="text-md">{dateRange}</span>
            </div>
            <div className="text-md font-bold text-neutral-900">{price}</div>
          </div>
          <div className="my-4 h-px bg-neutral-200" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={hostAvatar}
                alt={hostName}
                className="h-15 w-15 rounded-full object-cover"
              />
              <div className="leading-tight">
                <div className="text-md text-neutral-900">
                  <span className="font-medium">{hostName}</span>
                </div>
                <div className="text-sm text-neutral-500">{joined} Member</div>
              </div>
            </div>
            {/* Link ไป Detail ของทริป */}
            <div className=" flex flex-col gap-3 lg:flex">
              <div className="flex flex-col gap-3 lg:flex">
                <button
                  onClick={() => navigate(`/trip-detail/${tripId}`)}
                  className="btn-primary px-5 py-2.5 text-sm"
                >
                  View Details
                </button>

                <button
                  onClick={handleJoinTrip}
                  disabled={joining}
                  className="btn-primary px-5 py-2.5 text-sm"
                >
                  {joining ? "Joining..." : "Join Trip"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
