import { mainApi } from "@/api/mainApi";
import TripCard from "@/components/card/tripCard";
import { MenuBar } from "@/components/MenuBar";
import useUserStore from "@/stores/userStore";
import { useEffect, useState } from "react";
import moment from "moment";

export default function SaveTripPage() {
  const [savedTrips, setSavedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = useUserStore((state) => state.user);

  useEffect(() => {
    const fetchSavedTrips = async () => {
      if (!user?.id) return;

      try {
        const response = await mainApi.get(`/users/${user.id}/saved-trips`);

        console.log("Saved trips:", response.data);

        setSavedTrips(response.data.data);
      } catch (error) {
        console.error("Get saved trips error:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchSavedTrips();
  }, [user?.id]);

  if (loading) {
    return (
      <>
        <MenuBar />
        <div className="flex justify-center p-10">Loading saved trips...</div>
      </>
    );
  }

  return (
    <>
      <MenuBar />
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {savedTrips.length === 0 ? (
            <p className="p-5 text-gray-500">No saved trips yet.</p>
          ) : (
            savedTrips.map((savedTrip) => {
              const trip = savedTrip.trip;

              return (
                <TripCard
                  tripId={trip.id}
                  key={trip.id}
                  category={trip.category.name}
                  title={trip.title}
                  location={trip.destination}
                  dateRange={
                    moment(trip.startDate).format("L") +
                    " - " +
                    moment(trip.endDate).format("L")
                  }
                  price={Number(trip.budget).toLocaleString("th-TH")}
                  hostName={trip.owner.firstName + " " + trip.owner.lastName}
                  joined={trip.maxMember}
                  image={trip.image}
                />
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
