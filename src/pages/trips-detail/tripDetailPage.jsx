import { mainApi } from "@/api/mainApi";
import { MenuBar } from "@/components/MenuBar";
import {
  CalendarDays,
  Clock3,
  Users,
  WalletCards,
  Bookmark,
  UserRoundPlus,
  MapPin,
  Check,
  X,
  Trash2,
  ArrowLeft,
  UserCheck,
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import TripMembers from "./TripMember";
import useTripStore from "@/stores/tripStroe";
import useUserStore from "@/stores/userStore";
import ConfirmModal from "@/components/ui/ConfirmModal";

function StatCard({ icon, label, value, subtext }) {
  return (
    <div className="flex items-center gap-3.5 rounded-2xl bg-white p-3.5 border border-gray-100 shadow-2xs">
      <div className="h-10 w-10 rounded-xl bg-[#f2f6f0] text-[#385526] flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-xs sm:text-sm font-bold text-gray-900 mt-0.5">{value}</p>
        {subtext && <p className="text-[10px] text-gray-400 font-normal">{subtext}</p>}
      </div>
    </div>
  );
}

const TripDetailPage = () => {
  const { tripId } = useParams();
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  const [requests, setRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);

  const members = useTripStore((state) => state.members);
  const fetchMembers = useTripStore((state) => state.fetchMembers);
  const deleteTrip = useTripStore((state) => state.deleteTrip);
  const savedTripIds = useTripStore((state) => state.savedTripIds);
  const toggleSaveTrip = useTripStore((state) => state.toggleSaveTrip);

  const [joinLoading, setJoinLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isSaved = savedTripIds.includes(Number(tripId));

  const isOwner =
    user?.id && trip?.owner?.id
      ? Number(user.id) === Number(trip.owner.id)
      : false;

  const currentMemberCount = members.length;
  const maxCapacity = trip?.maxMember || 4;
  const spotsLeft = Math.max(0, maxCapacity - currentMemberCount);
  const isFull = currentMemberCount >= maxCapacity;

  const isAlreadyMember = members.some(
    (m) => Number(m.user?.id) === Number(user?.id) || Number(m.userId) === Number(user?.id)
  );

  // Get Trip Detail
  const fetchTripDetail = async () => {
    try {
      setLoading(true);
      const response = await mainApi.get(`/trips/${tripId}`);
      setTrip(response.data.data);
    } catch (error) {
      console.error("Get trip detail error:", error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  // Get Trip Members
  const fetchTripMembers = async () => {
    try {
      await fetchMembers(tripId);
    } catch (error) {
      console.error("Get trip members error:", error.response?.data || error);
    }
  };

  // Get Join Requests (Owner only)
  const fetchJoinRequests = async () => {
    if (!tripId || !isOwner) return;

    try {
      setRequestsLoading(true);
      const response = await mainApi.get(`/trips/${tripId}/requests`);
      setRequests(response.data.data || []);
    } catch (error) {
      console.error("Get join requests error:", error.response?.data || error);
    } finally {
      setRequestsLoading(false);
    }
  };

  // Join Trip
  const handleJoinTrip = async () => {
    if (!user) {
      toast.error("Please login first");
      return;
    }
    if (isFull) {
      toast.info("This trip is already full");
      return;
    }
    if (isAlreadyMember) {
      toast.info("You are already a member of this trip");
      return;
    }

    try {
      setJoinLoading(true);
      const response = await mainApi.post(`/trips/${tripId}/requests`);
      toast.success(response.data.message || "Join request sent successfully");
    } catch (error) {
      console.error("Join trip error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to send join request");
    } finally {
      setJoinLoading(false);
    }
  };

  // Delete Trip
  const handleDeleteTrip = async () => {
    try {
      setDeleteLoading(true);
      await deleteTrip(tripId);
      setShowDeleteModal(false);
      toast.success("Trip deleted successfully");
      navigate("/profile");
    } catch (error) {
      console.error("Delete trip error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to delete trip");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Accept Request
  const handleAcceptRequest = async (requestId) => {
    try {
      await mainApi.patch(`/requests/${requestId}/accept`);
      toast.success("Join request accepted");
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
      await fetchTripMembers();
    } catch (error) {
      console.error("Accept request error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to accept request");
    }
  };

  // Reject Request
  const handleRejectRequest = async (requestId) => {
    try {
      await mainApi.patch(`/requests/${requestId}/reject`);
      toast.info("Join request rejected");
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error("Reject request error:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Failed to reject request");
    }
  };

  // Save / Unsave Trip
  const handleSaveTrip = async () => {
    if (!user) {
      toast.error("Please login first");
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
      toast.error(error.response?.data?.message || "Failed to save trip");
    } finally {
      setSaveLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    if (!tripId) return;
    fetchTripDetail();
    fetchMembers(tripId);
  }, [tripId]);

  useEffect(() => {
    if (!tripId || !isOwner) return;
    fetchJoinRequests();
  }, [tripId, isOwner]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col">
        <MenuBar />
        <div className="flex flex-1 flex-col items-center justify-center gap-2">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#385526] border-t-transparent" />
          <p className="text-xs text-gray-500 font-medium">Loading trip details...</p>
        </div>
      </div>
    );
  }

  // Trip not found
  if (!trip) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col">
        <MenuBar />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="text-base font-semibold text-gray-800">Trip not found</p>
          <p className="text-xs text-gray-500 mt-1 mb-4">This trip may have been removed or deleted.</p>
          <button
            onClick={() => navigate("/")}
            className="rounded-full bg-[#385526] text-white px-5 py-2 text-xs font-semibold"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const duration =
    moment(trip.endDate).diff(moment(trip.startDate), "days") + 1;

  const effectiveHostAvatar =
    isOwner && user?.profileImage
      ? user.profileImage
      : trip.owner?.profileImage || "https://i.pravatar.cc/100?img=11";

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-600 hover:text-[#385526] transition cursor-pointer"
          >
            <ArrowLeft size={16} />
            <span>Back to Trips</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveTrip}
              disabled={saveLoading}
              className={`h-9 px-4 rounded-full border flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer ${
                isSaved
                  ? "bg-[#385526] text-white border-[#385526] shadow-xs"
                  : "bg-white text-gray-700 border-gray-200 hover:bg-[#f2f6f0]"
              }`}
            >
              <Bookmark size={14} fill={isSaved ? "currentColor" : "none"} />
              <span>{isSaved ? "Saved" : "Save"}</span>
            </button>
          </div>
        </div>

        {/* Hero Banner Section */}
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-gray-900 shadow-md min-h-[380px] sm:min-h-[440px] flex items-end">
          <img
            src={
              trip.image ||
              "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85"
            }
            alt={trip.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

          {/* Banner Details */}
          <div className="relative z-10 p-6 sm:p-10 text-white w-full">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/20 backdrop-blur-md px-3.5 py-1 text-xs font-semibold border border-white/20 text-emerald-200">
                {trip.category?.name || "General"}
              </span>

              {/* Members joined badge */}
              <span className="rounded-full bg-black/40 backdrop-blur-md px-3.5 py-1 text-xs font-semibold border border-white/20 text-white flex items-center gap-1.5">
                <Users size={13} className="text-emerald-300" />
                <span>
                  {currentMemberCount}/{maxCapacity} Members ({isFull ? "Trip Full" : `${spotsLeft} spots left`})
                </span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              {trip.title}
            </h1>

            <div className="mt-2.5 flex items-center gap-2 text-xs sm:text-sm text-white/90">
              <MapPin size={16} className="text-emerald-300 shrink-0" />
              <span>{trip.destination}</span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          <StatCard
            icon={<CalendarDays size={20} />}
            label="Dates"
            value={`${moment(trip.startDate).format("MMM DD")} - ${moment(
              trip.endDate,
            ).format("MMM DD")}`}
          />
          <StatCard
            icon={<Clock3 size={20} />}
            label="Duration"
            value={`${duration > 0 ? duration : 1} Days`}
          />
          <StatCard
            icon={<Users size={20} />}
            label="Members / Capacity"
            value={`${currentMemberCount} / ${maxCapacity}`}
            subtext={isFull ? "Full" : `${spotsLeft} spots remaining`}
          />
          <StatCard
            icon={<WalletCards size={20} />}
            label="Estimated Budget"
            value={`฿${Number(trip.budget).toLocaleString("th-TH")}`}
            subtext="Per person"
          />
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Trip */}
            <div className="rounded-[28px] bg-white p-6 sm:p-8 border border-gray-100 shadow-xs">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About this trip</h2>
              <p className="text-sm leading-relaxed text-gray-600 whitespace-pre-line">
                {trip.description || "No description provided for this trip."}
              </p>
            </div>

            {/* Owner Only: Join Requests */}
            {isOwner && (
              <div className="rounded-[28px] bg-white p-6 sm:p-8 border border-gray-100 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Join Requests</h2>
                    <p className="text-xs text-gray-500">People who requested to join your journey</p>
                  </div>
                  <span className="rounded-full bg-[#f2f6f0] text-[#2d451e] px-3 py-1 text-xs font-semibold border border-[#385526]/10">
                    {requests.filter((r) => r.status === "PENDING").length} Pending
                  </span>
                </div>

                {requestsLoading ? (
                  <p className="py-6 text-center text-xs text-gray-400">Loading requests...</p>
                ) : requests.filter((r) => r.status === "PENDING").length === 0 ? (
                  <p className="py-6 text-center text-xs text-gray-400">No pending join requests</p>
                ) : (
                  <div className="space-y-3">
                    {requests
                      .filter((r) => r.status === "PENDING")
                      .map((req) => (
                        <div
                          key={req.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#f8faf7] border border-gray-100"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={req.user?.profileImage || "https://i.pravatar.cc/100?img=12"}
                              alt={req.user?.username}
                              className="h-10 w-10 rounded-full object-cover border border-white shadow-2xs"
                            />
                            <div>
                              <p className="text-xs font-semibold text-gray-900">
                                {req.user?.firstName} {req.user?.lastName}
                              </p>
                              <p className="text-[11px] text-gray-500">@{req.user?.username}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 self-end sm:self-auto">
                            <button
                              onClick={() => handleAcceptRequest(req.id)}
                              disabled={isFull}
                              className={`flex items-center gap-1 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white transition cursor-pointer ${
                                isFull 
                                  ? "bg-gray-300 cursor-not-allowed" 
                                  : "bg-[#385526] hover:bg-[#2d451e]"
                              }`}
                            >
                              <Check size={14} />
                              <span>Accept</span>
                            </button>
                            <button
                              onClick={() => handleRejectRequest(req.id)}
                              className="flex items-center gap-1 rounded-full border border-gray-200 bg-white hover:bg-red-50 hover:text-red-600 px-3.5 py-1.5 text-xs font-semibold text-gray-600 transition cursor-pointer"
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Host Card */}
            <div className="rounded-[28px] bg-white p-6 border border-gray-100 shadow-xs">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-3">
                Trip Host
              </span>

              <div className="flex items-center gap-3">
                <img
                  src={effectiveHostAvatar}
                  alt={trip.owner?.username}
                  className="h-12 w-12 rounded-full object-cover border border-gray-100 shadow-2xs"
                />
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {trip.owner?.firstName} {trip.owner?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">@{trip.owner?.username}</p>
                </div>
              </div>

              {/* Members List with ratio and remaining spots */}
              <TripMembers members={members} maxMember={trip.maxMember} />

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                {!isOwner && (
                  <>
                    {isAlreadyMember ? (
                      <div className="w-full rounded-xl bg-emerald-50 border border-emerald-200 py-3 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-1.5">
                        <UserCheck size={15} className="text-emerald-600" />
                        <span>You are a member of this trip</span>
                      </div>
                    ) : (
                      <button
                        onClick={handleJoinTrip}
                        disabled={joinLoading || isFull}
                        className={`w-full rounded-xl py-3 text-xs font-semibold shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 ${
                          isFull
                            ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                            : "bg-[#385526] hover:bg-[#2d451e] text-white disabled:opacity-50"
                        }`}
                      >
                        <UserRoundPlus size={15} />
                        <span>
                          {joinLoading
                            ? "Sending request..."
                            : isFull
                            ? "Trip Full (0 spots left)"
                            : `Request to Join Trip (${spotsLeft} spots left)`}
                        </span>
                      </button>
                    )}
                  </>
                )}

                {isOwner && (
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    disabled={deleteLoading}
                    className="w-full rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 py-2.5 text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Trash2 size={15} />
                    <span>Delete This Trip</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => !deleteLoading && setShowDeleteModal(false)}
        onConfirm={handleDeleteTrip}
        loading={deleteLoading}
        title="Delete Trip"
        message="Are you sure you want to delete this trip? This action cannot be undone."
        confirmText="Delete Trip"
        cancelText="Cancel"
      />
    </div>
  );
};

export default TripDetailPage;
