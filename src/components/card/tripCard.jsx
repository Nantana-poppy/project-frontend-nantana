import React, { useState } from "react";
import { Bookmark, MapPin, Calendar, Users, ArrowRight } from "lucide-react";
import { mainApi } from "@/api/mainApi";
import { useNavigate } from "react-router";
import useUserStore from "@/stores/userStore";
import useTripStore from "@/stores/tripStroe";
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
  hostAvatar = "",
  hostId,
  currentMembers = 1,
  maxMembers = 4,
  joined, // backward compatibility
}) {
  const user = useUserStore((state) => state.user);
  const savedTripIds = useTripStore((state) => state.savedTripIds);
  const toggleSaveTrip = useTripStore((state) => state.toggleSaveTrip);
  const isSaved = savedTripIds.includes(Number(tripId));

  const totalMax = Number(maxMembers || joined || 4);
  const currentCount = Number(currentMembers ?? 1);
  const spotsLeft = Math.max(0, totalMax - currentCount);
  const isFull = currentCount >= totalMax;

  const effectiveHostAvatar =
    hostId && user?.id && Number(hostId) === Number(user.id) && user.profileImage
      ? user.profileImage
      : hostAvatar && hostAvatar !== "..."
      ? hostAvatar
      : "https://i.pravatar.cc/100?img=11";

  const [joining, setJoining] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const navigate = useNavigate();

  const handleJoinTrip = async (e) => {
    e?.stopPropagation();
    if (!user) {
      toast.error("Please login first");
      return;
    }
    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    if (isFull) {
      toast.info("This trip is already full");
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
          "Failed to join trip"
      );
    } finally {
      setJoining(false);
    }
  };

  const handleSaveTrip = async (e) => {
    e?.stopPropagation();
    if (!user) {
      toast.error("Please login first");
      return;
    }

    if (!tripId) {
      toast.error("Trip ID not found");
      return;
    }

    try {
      setSaveLoading(true);
      const res = await toggleSaveTrip(tripId);
      if (res.isSaved) {
        toast.success(res.message || "Trip saved successfully");
      } else {
        toast.info(res.message || "Trip removed from saved trips");
      }
    } catch (error) {
      console.error("Save trip error:", error.response?.data || error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to save trip"
      );
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div
      onClick={() => navigate(`/trip-detail/${tripId}`)}
      className="group relative flex flex-col rounded-[24px] bg-white border border-gray-100 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer h-full"
    >
      {/* Image section */}
      <div className="relative h-56 w-full overflow-hidden bg-gray-100">
        <img
          src={
            image ||
            "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop"
          }
          alt={title || "Trip"}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        {/* Subtle Dark Gradient at Bottom of Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

        {/* Badges top left */}
        <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5">
          <div className="px-3 py-1 rounded-full text-xs font-medium bg-black/40 backdrop-blur-md text-white border border-white/20">
            {category || "General"}
          </div>
          {isFull ? (
            <div className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-600/90 text-white backdrop-blur-md shadow-xs">
              Full
            </div>
          ) : (
            <div className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#385526]/85 text-emerald-100 backdrop-blur-md border border-white/10">
              {spotsLeft} spots left
            </div>
          )}
        </div>

        {/* Bookmark / Save button */}
        <button
          className={`absolute top-3.5 right-3.5 h-9 w-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isSaved
              ? "bg-[#385526] text-white shadow-md scale-105"
              : "bg-white/90 text-gray-700 hover:bg-white hover:text-[#385526] backdrop-blur-md shadow-xs"
          } disabled:opacity-50`}
          onClick={handleSaveTrip}
          disabled={saveLoading}
          title={isSaved ? "Unsave Trip" : "Save for Later"}
        >
          <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
        </button>

        {/* Title + Location inside bottom of image */}
        <div className="absolute bottom-3.5 left-4 right-4 text-white">
          <h2 className="text-xl font-bold leading-snug tracking-tight text-white line-clamp-1 group-hover:text-emerald-100 transition-colors">
            {title}
          </h2>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-white/90">
            <MapPin size={13} className="shrink-0 text-emerald-300" />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Date & Price row */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-gray-600 bg-[#f8faf7] px-2.5 py-1 rounded-lg border border-gray-100">
              <Calendar size={13} className="text-[#385526] shrink-0" />
              <span className="font-medium">{dateRange}</span>
            </div>
            <div className="text-right">
              <span className="text-xs text-gray-400 block font-normal">Budget</span>
              <span className="text-sm font-bold text-[#385526]">
                ฿{price}
              </span>
            </div>
          </div>

          <div className="my-3.5 h-px bg-gray-100" />

          {/* Host & Member Count Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={effectiveHostAvatar}
                alt={hostName}
                className="h-9 w-9 rounded-full object-cover border border-gray-100 shadow-2xs"
              />
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {hostName}
                </p>
                <p className="text-[11px] text-gray-400">Host</p>
              </div>
            </div>

            {/* Member count ratio (e.g. 2/4) */}
            <div className="flex items-center gap-1.5 bg-[#f8faf7] px-2.5 py-1 rounded-full border border-gray-100">
              <Users size={13} className="text-[#385526]" />
              <span className="text-xs font-bold text-gray-800">
                {currentCount}/{totalMax}
              </span>
              <span className="text-[10px] text-gray-400">
                ({isFull ? "Full" : `${spotsLeft} left`})
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trip-detail/${tripId}`);
            }}
            className="w-full py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-[#f2f6f0] hover:border-[#385526]/30 text-xs font-semibold text-[#2d451e] transition-all cursor-pointer text-center"
          >
            Details
          </button>

          <button
            type="button"
            onClick={handleJoinTrip}
            disabled={joining || isFull}
            className={`w-full py-2 px-3 rounded-xl text-xs font-semibold shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
              isFull
                ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                : "bg-[#385526] hover:bg-[#2d451e] text-white disabled:opacity-50"
            }`}
          >
            {joining ? (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : isFull ? (
              <span>Trip Full</span>
            ) : (
              <>
                <span>Join</span>
                <ArrowRight size={13} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
