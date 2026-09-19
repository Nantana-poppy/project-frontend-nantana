import { MenuBar } from "@/components/MenuBar";
import TripCard from "@/components/card/tripCard";
import useUserStore from "@/stores/userStore";
import useTripStore from "@/stores/tripStroe";
import { useEffect } from "react";
import moment from "moment";
import { Bookmark, Compass } from "lucide-react";
import { useNavigate } from "react-router";

export default function SaveTripPage() {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const savedTrips = useTripStore((state) => state.savedTrips);
  const loading = useTripStore((state) => state.savedTripsLoading);
  const fetchSavedTrips = useTripStore((state) => state.fetchSavedTrips);

  useEffect(() => {
    if (user?.id) {
      fetchSavedTrips(user.id);
    }
  }, [user?.id]);

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Saved Trips
            </h1>
            <p className="text-sm text-gray-500 font-normal mt-1">
              Your bookmarked trips and adventures to check out later.
            </p>
          </div>
          <span className="rounded-full bg-[#f2f6f0] text-[#2d451e] px-3 py-1 text-xs font-semibold border border-[#385526]/10">
            {savedTrips.length} Saved
          </span>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-2">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#385526] border-t-transparent" />
            <p className="text-xs text-gray-500 font-medium">Loading saved trips...</p>
          </div>
        ) : savedTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-3xl bg-white border border-gray-100 shadow-xs">
            <div className="h-14 w-14 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526] mb-3">
              <Bookmark size={26} />
            </div>
            <p className="text-base font-semibold text-gray-800">
              No saved trips yet
            </p>
            <p className="text-xs text-gray-500 max-w-sm mt-1 mb-5">
              Browse trips on the explore page and bookmark the ones you love to keep track of them here.
            </p>
            <button
              onClick={() => navigate("/explore")}
              className="rounded-full bg-[#385526] hover:bg-[#2d451e] text-white px-6 py-2.5 text-xs font-semibold shadow-xs transition flex items-center gap-2 cursor-pointer"
            >
              <Compass size={16} />
              <span>Explore Adventures</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedTrips.map((savedTrip) => {
              const trip = savedTrip.trip;
              if (!trip) return null;

              return (
                <TripCard
                  key={trip.id}
                  tripId={trip.id}
                  category={trip.category?.name}
                  title={trip.title}
                  location={trip.destination}
                  dateRange={
                    moment(trip.startDate).format("L") +
                    " - " +
                    moment(trip.endDate).format("L")
                  }
                  price={Number(trip.budget).toLocaleString("th-TH")}
                  hostId={trip.owner?.id}
                  hostAvatar={trip.owner?.profileImage}
                  hostName={
                    trip.owner
                      ? `${trip.owner.firstName} ${trip.owner.lastName}`
                      : "Host"
                  }
                  currentMembers={trip.members?.length ?? trip._count?.members ?? 1}
                  maxMembers={trip.maxMember}
                  image={trip.image}
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
