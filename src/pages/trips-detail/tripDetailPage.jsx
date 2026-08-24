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
} from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import TripMembers from "./TripMember";
import useTripStore from "@/stores/tripStroe";
import useUserStore from "@/stores/userStore";

function Stat({ icon, label, value }) {
  return (
    <div className="flex items-center justify-center gap-7 rounded-2xl bg-white px-3 py-4 shadow-sm">
      <div className="text-[#0F4C81]">{icon}</div>

      <div>
        <p className="text-md text-gray-400">{label}</p>

        <p className="mt-0.5 text-md font-semibold">{value}</p>
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

  const [joinLoading, setJoinLoading] = useState(false);

  const members = useTripStore((state) => state.members);
  const fetchMembers = useTripStore((state) => state.fetchMembers);

  const isOwner =
    user?.id && trip?.owner?.id
      ? Number(user.id) === Number(trip.owner.id)
      : false;

  // =========================
  // Get Trip Detail
  // =========================
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

  // =========================
  // Get Trip Members
  // =========================
  const fetchTripMembers = async () => {
    try {
      await fetchMembers(tripId);
    } catch (error) {
      console.error("Get trip members error:", error.response?.data || error);
    }
  };

  // =========================
  // Get Join Requests
  // Owner only
  // =========================
  const fetchJoinRequests = async () => {
    if (!tripId || !isOwner) return;

    try {
      setRequestsLoading(true);

      const response = await mainApi.get(`/trips/${tripId}/requests`);

      setRequests(response.data.data);
    } catch (error) {
      console.error("Get join requests error:", error.response?.data || error);
    } finally {
      setRequestsLoading(false);
    }
  };

  // =========================
  // Join Trip
  // =========================
  const handleJoinTrip = async () => {
    try {
      setJoinLoading(true);

      const response = await mainApi.post(`/trips/${tripId}/requests`);

      alert(response.data.message || "Join request sent successfully");
    } catch (error) {
      console.error("Join trip error:", error.response?.data || error);

      alert(error.response?.data?.message || "Failed to send join request");
    } finally {
      setJoinLoading(false);
    }
  };

  // =========================
  // Accept Request
  // =========================
  const handleAcceptRequest = async (requestId) => {
    try {
      await mainApi.patch(`/requests/${requestId}/accept`);
      alert("Join request accepted");
      // ลบ request ที่ accept แล้วออกจาก pending list
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
      // ดึง members ใหม่
      await fetchTripMembers();
    } catch (error) {
      console.error("Accept request error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to accept request");
    }
  };

  // =========================
  // Reject Request
  // =========================
  const handleRejectRequest = async (requestId) => {
    try {
      await mainApi.patch(`/requests/${requestId}/reject`);
      alert("Join request rejected");
      // ลบ request ที่ reject แล้ว
      setRequests((prev) => prev.filter((request) => request.id !== requestId));
    } catch (error) {
      console.error("Reject request error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to reject request");
    }
  };

  // =========================
  // Save Trip
  // =========================
  const handleSaveTrip = async () => {
    try {
      await mainApi.post(`/trips/${tripId}/save`);
      alert("Trip saved successfully");
    } catch (error) {
      console.error("Save trip error:", error.response?.data || error);
      alert(error.response?.data?.message || "Failed to save trip");
    }
  };

  // =========================
  // Initial Load
  // =========================
  useEffect(() => {
    if (!tripId) return;

    fetchTripDetail();
    fetchMembers(tripId);
  }, [tripId]);

  // =========================
  // Fetch Request หลังจากรู้ว่า
  // คนที่ login เป็น Owner
  // =========================
  useEffect(() => {
    if (!tripId || !isOwner) return;

    fetchJoinRequests();
  }, [tripId, isOwner]);

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <div>
        <MenuBar />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-[#0F4C81]">Loading trip...</p>
        </div>
      </div>
    );
  }

  // =========================
  // Trip not found
  // =========================
  if (!trip) {
    return (
      <div>
        <MenuBar />

        <div className="flex min-h-screen items-center justify-center">
          <p className="text-red-500">Trip not found</p>
        </div>
      </div>
    );
  }

  const duration =
    moment(trip.endDate).diff(moment(trip.startDate), "days") + 1;

  return (
    <div>
      <MenuBar />

      <div className="min-h-screen bg-[#f5f5f2] px-8 py-8 text-[#17211c]">
        <div className="mx-auto max-w-7xl p-10 bg-slate-50/90 rounded-4xl shadow-lg">
          {/* Header */}
          <h1 className="mb-3 text-5xl font-semibold tracking-[1px]">
            Trip Detail
          </h1>

          {/* Main Card */}
          <div className="overflow-hidden rounded-3xl bg-[#f8f8f5] shadow-[0_8px_40px_rgba(0,0,0,0.07)]">
            {/* ================= HERO ================= */}
            <section className="relative h-90 overflow-hidden rounded-3xl">
              <img
                src={
                  trip.image ||
                  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85"
                }
                alt={trip.title}
                className="absolute inset-0 h-full w-full object-cover"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/10 to-black/10" />

              <div className="absolute bottom-7 left-7 right-7 text-white">
                <div className="mb-3 flex items-center gap-2">
                  <span className="rounded-md bg-[#0F4C81] px-2.5 py-1 font-semibold">
                    {trip.category?.name}
                  </span>
                </div>

                <h1 className="text-xl font-bold tracking-tight md:text-6xl">
                  {trip.title}
                </h1>

                <div className="mt-3 flex items-center gap-1 text-base text-white/90">
                  <MapPin size={20} className="shrink-0" />

                  <span>{trip.destination}</span>
                </div>
              </div>
            </section>

            {/* ================= CONTENT ================= */}
            <div className="p-4 md:p-6">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                <Stat
                  icon={<CalendarDays size={45} />}
                  label="Dates"
                  value={`${moment(trip.startDate).format("MMM DD")} - ${moment(
                    trip.endDate,
                  ).format("MMM DD")}`}
                />

                <Stat
                  icon={<Clock3 size={45} />}
                  label="Duration"
                  value={`${duration} Days`}
                />

                <Stat
                  icon={<Users size={45} />}
                  label="Max Member"
                  value={`${trip.maxMember} People`}
                />

                <Stat
                  icon={<WalletCards size={45} />}
                  label="Budget"
                  value={`฿${Number(trip.budget).toLocaleString("th-TH")}`}
                />
              </div>

              {/* Lower section */}
              <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_330px]">
                {/* ================= ABOUT ================= */}
                <section className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                  <h2 className="text-xl font-semibold">About this trip</h2>

                  <p className="mt-3 leading-5 text-gray-500">
                    {trip.description}
                  </p>
                </section>

                {/* ================= OWNER ================= */}
                <div className="rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                  <p className="text-md font-medium uppercase tracking-wider text-gray-400">
                    Owner trip
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <img
                      src={
                        trip.owner?.profileImage ||
                        "https://i.pravatar.cc/100?img=11"
                      }
                      alt={trip.owner?.username}
                      className="h-11 w-11 rounded-full object-cover"
                    />

                    <div>
                      <p className="text-md font-semibold">
                        {trip.owner?.firstName} {trip.owner?.lastName}
                      </p>

                      <button
                        onClick={() => navigate(`/profile/${trip.owner.id}`)}
                        className="mt-0.5 text-sm font-medium text-[#0F4C81]"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>

                  {/* Members */}
                  <TripMembers members={members} />
                </div>

                {/* ================= ACTION BUTTONS ================= */}
                <div className="mt-5 space-y-2">
                  {/* ไม่แสดง Join ให้ Owner */}
                  {!isOwner && (
                    <button
                      onClick={handleJoinTrip}
                      disabled={joinLoading}
                      className="flex h-9 w-full items-center justify-center gap-2 rounded-full bg-[#0F4C81] text-md text-white transition hover:bg-[#064174] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <UserRoundPlus size={13} />

                      {joinLoading ? "Sending..." : "Join Trip"}
                    </button>
                  )}

                  <button
                    onClick={handleSaveTrip}
                    className="flex h-9 w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white text-md font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    <Bookmark size={13} />
                    Save for Later
                  </button>
                </div>
              </div>

              {/* ================================================= */}
              {/* OWNER ONLY : JOIN REQUESTS */}
              {/* ================================================= */}

              {isOwner && (
                <section className="mt-6 rounded-3xl border border-black/5 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-semibold">Join Requests</h2>

                      <p className="mt-1 text-sm text-gray-500">
                        People who want to join this trip
                      </p>
                    </div>

                    <span className="rounded-full bg-[#0F4C81]/10 px-3 py-1 text-sm font-medium text-[#0F4C81]">
                      {
                        requests.filter(
                          (request) => request.status === "PENDING",
                        ).length
                      }
                      Pending
                    </span>
                  </div>

                  <div className="my-4 h-px bg-gray-200" />

                  {requestsLoading ? (
                    <p className="py-5 text-center text-sm text-gray-500">
                      Loading requests...
                    </p>
                  ) : requests.filter((request) => request.status === "PENDING")
                      .length === 0 ? (
                    <p className="py-5 text-center text-sm text-gray-500">
                      No pending join requests
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {requests
                        .filter((request) => request.status === "PENDING")
                        .map((request) => (
                          <div
                            key={request.id}
                            className="flex items-center justify-between rounded-2xl border border-gray-200 p-3"
                          >
                            {/* User */}
                            <div className="flex items-center gap-3">
                              <img
                                src={
                                  request.user?.profileImage ||
                                  "https://i.pravatar.cc/100?img=12"
                                }
                                alt={request.user?.username}
                                className="h-12 w-12 rounded-full object-cover"
                              />

                              <div>
                                <p className="font-semibold">
                                  {request.user?.firstName}{" "}
                                  {request.user?.lastName}
                                </p>

                                <p className="text-sm text-gray-500">
                                  @{request.user?.username}
                                </p>
                              </div>
                            </div>

                            {/* Accept / Reject */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleAcceptRequest(request.id)}
                                className="flex items-center gap-1 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
                              >
                                <Check size={15} />
                                Accept
                              </button>

                              <button
                                onClick={() => handleRejectRequest(request.id)}
                                className="flex items-center gap-1 rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                              >
                                <X size={15} />
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailPage;
