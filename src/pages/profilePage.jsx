import { MenuBar } from "@/components/MenuBar";
import { Map, Grid3X3, Info, Plus, Compass } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { mainApi } from "@/api/mainApi";
import useUserStore from "@/stores/userStore";
import TripCard from "@/components/card/tripCard";
import moment from "moment";

export default function ProfilePage() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);
  const updateUser = useUserStore((state) => state.updateUser);

  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const meResp = await mainApi.get("/auth/me");
        if (meResp.data?.user) {
          updateUser(meResp.data.user);
          setProfile(meResp.data.user);
        } else {
          setProfile(user);
        }

        const response = await mainApi.get("/users/me/trips");
        setTrips(response.data.data || []);
      } catch (error) {
        console.error("Get profile/trips error:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col">
        <MenuBar />
        <div className="flex flex-1 items-center justify-center gap-2">
          <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#385526] border-t-transparent" />
          <p className="text-xs text-gray-500 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8faf7] flex flex-col">
        <MenuBar />
        <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <p className="text-base font-semibold text-gray-800">Please log in to view your profile</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 rounded-full bg-[#385526] hover:bg-[#2d451e] px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Profile Header Card */}
        <div className="rounded-[32px] sm:rounded-[40px] bg-white p-6 sm:p-10 border border-gray-100 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
            {/* Avatar */}
            <div className="relative shrink-0">
              <img
                src={
                  user.profileImage ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                }
                alt="Profile"
                className="h-28 w-28 sm:h-36 sm:max-w-36 rounded-full object-cover border-4 border-[#f2f6f0] shadow-sm"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-500 font-medium mt-0.5">
                    @{user.username}
                  </p>
                </div>

                <button
                  onClick={() => navigate("/edit-profile")}
                  className="rounded-full bg-[#385526] hover:bg-[#2d451e] px-5 py-2 text-xs font-semibold text-white shadow-xs transition cursor-pointer self-center sm:self-auto"
                >
                  Edit Profile
                </button>
              </div>

              {/* Bio */}
              <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
                {user.bio || "No bio added yet. Tell other travelers about your travel style!"}
              </p>

              <div className="my-5 h-px bg-gray-100" />

              {/* Stats */}
              <div className="flex items-center justify-center sm:justify-start gap-8 sm:gap-12 text-center">
                <div>
                  <p className="text-lg font-bold text-gray-900">{trips.length}</p>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    My Trips
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {user._count?.followers || 0}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    Followers
                  </p>
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    {user._count?.following || 0}
                  </p>
                  <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    Following
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold bg-[#385526] text-white shadow-xs">
            <Map size={15} />
            <span>My Created Trips ({trips.length})</span>
          </button>
        </div>

        {/* Trips Grid */}
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-white border border-gray-100 shadow-xs">
            <div className="h-14 w-14 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526] mb-3">
              <Compass size={26} />
            </div>
            <p className="text-base font-semibold text-gray-800">
              You haven't created any trips yet
            </p>
            <p className="text-xs text-gray-500 max-w-sm mt-1 mb-5">
              Ready to host your own adventure? Create a trip and find travel companions!
            </p>
            <button
              onClick={() => navigate("/create-trip")}
              className="rounded-full bg-[#385526] hover:bg-[#2d451e] text-white px-6 py-2.5 text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Your First Trip</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                tripId={trip.id}
                hostId={trip.owner?.id || user?.id}
                category={trip.category?.name}
                image={trip.image}
                title={trip.title}
                location={trip.destination}
                dateRange={
                  moment(trip.startDate).format("L") +
                  " - " +
                  moment(trip.endDate).format("L")
                }
                price={Number(trip.budget).toLocaleString("th-TH")}
                hostName={`${user.firstName} ${user.lastName}`}
                hostAvatar={user.profileImage}
                currentMembers={trip.members?.length ?? trip._count?.members ?? 1}
                maxMembers={trip.maxMember}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
