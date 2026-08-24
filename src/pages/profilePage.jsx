import { MenuBar } from "@/components/MenuBar";
import { Map, Grid3X3, Info } from "lucide-react";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { mainApi } from "@/api/mainApi";
import useUserStore from "@/stores/userStore";
import TripCard from "@/components/card/TripCard";
import moment from "moment";

export default function ProfilePage() {
  const navigate = useNavigate();

  const user = useUserStore((state) => state.user);

  const [profile, setProfile] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // ข้อมูล user ที่ login
        setProfile(user);
        // ดึง trip ที่ user คนนี้เป็น owner
        const response = await mainApi.get("/users/me/trips");
        setTrips(response.data.data);
      } catch (error) {
        console.error(
          "Get profile/trips error:",
          error.response?.data || error,
        );
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <>
        <MenuBar />
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <MenuBar />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <p className="text-gray-500">Please login first</p>

          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#0F4C81] px-6 py-2 text-white"
          >
            Login
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <MenuBar />

      <div className="min-h-screen px-8 py-8 md:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl p-10 bg-slate-50/90 rounded-4xl shadow-lg">
          {/* Profile */}
          <div className="rounded-[38px] bg-white px-8 py-8 shadow-lg md:px-12 md:py-10">
            <div className="flex flex-col gap-20 md:flex-row md:items-center">
              {/* Profile Image */}
              <div className="flex shrink-0 flex-col items-center">
                <img
                  src={
                    user.profileImage ||
                    "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                  }
                  alt="profile"
                  className="h-50 w-50 rounded-full object-cover"
                />

                <div className="mt-5 flex gap-2">
                  <button
                    className="rounded-full bg-[#0F4C81] px-6 py-2 text-sm font-medium text-white hover:bg-[#0b3d69]"
                    onClick={() => navigate("/edit-profile")}
                  >
                    Edit Profile
                  </button>
                </div>
              </div>

              {/* User Information */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 md:text-5xl">
                  {user.firstName} {user.lastName}
                </h1>

                <p className="mt-5 md:text-lg text-sm text-gray-500">@{user.username}</p>

                <p className="mt-5 max-w-3xl md:text-lg text-sm leading-6 text-gray-700">
                  {user.bio || "No bio yet."}
                </p>

                <div className="my-6 h-px bg-gray-200" />

                {/* Stats */}
                <div className="flex gap-12 md:gap-20">
                  <div>
                    <p className="text-xl font-semibold text-gray-900">
                      {user._count?.followers || 0}
                    </p>
                    <p className="text-[10px] uppercase text-gray-500">
                      Followers
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-semibold text-gray-900">
                      {user._count?.following || 0}
                    </p>
                    <p className="text-[10px] uppercase text-gray-500">
                      Following
                    </p>
                  </div>

                  <div>
                    <p className="text-xl font-semibold text-gray-900">
                      {trips.length}
                    </p>
                    <p className="text-[10px] uppercase text-gray-500">Trips</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-14 border-b border-gray-200">
            <div className="flex gap-8">
              <button className="flex items-center gap-2 border-b-2 border-[#0F4C81] px-1 pb-3 text-md font-medium text-[#0F4C81]">
                <Map size={25} />
                My Trips
              </button>

              <button className="flex items-center gap-2 px-1 pb-3 text-md text-gray-500 hover:text-gray-800">
                <Grid3X3 size={25} />
                Posts
              </button>

              <button className="flex items-center gap-2 px-1 pb-3 text-md text-gray-500 hover:text-gray-800">
                <Info size={25} />
                About
              </button>
            </div>
          </div>

          {/* My Trips */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3">
            {trips.length > 0 ? (
              trips.map((trip) => (
                <TripCard
                  tripId={trip.id}
                  key={trip.id}
                  category={trip.category.name}
                  image={trip.image}
                  title={trip.title}
                  location={trip.destination}
                  dateRange={
                    moment(trip.startDate).format("L") +
                    " - " +
                    moment(trip.endDate).format("L")
                  }
                  price={Number(trip.budget).toLocaleString("th-TH")}
                  hostName={trip.owner.firstName + " " + trip.owner.lastName}
                  hostAvatar={trip.owner?.profileImage}
                  joined={trip.maxMember}
                />
              ))
            ) : (
              <div className="col-span-full py-10 text-center text-gray-500">
                You haven't created any trips yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
