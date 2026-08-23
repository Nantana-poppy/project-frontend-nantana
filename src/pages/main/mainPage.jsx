import "../../index.css";
import BgSand from "../../assets/BgSand.png";
import TripCard from "@/components/card/tripCard";
import { ProfileComponent } from "./components/ProfileComponent";
import { useCategoryStore } from "@/stores/categoryStore";
import { useEffect, useState } from "react";
import { mainApi } from "@/api/mainApi";
import moment from "moment/moment";
import { useNavigate } from "react-router";

export default function MainPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const fetchCategories = useCategoryStore((state) => state.fetchCategory);
  const category = useCategoryStore((state) => state.category);
  const categoryOptions = [{ id: "all", name: "All" }, ...category];
  const filteredTrips =
    selectedCategory === "All"
      ? trips
      : trips.filter((trip) => trip.category?.name === selectedCategory);

  const fetchTrips = async () => {
    const resp = await mainApi.get("/trips");
    setTrips(resp.data.data);
  };

  useEffect(() => {
    fetchCategories();
    fetchTrips();
  }, []);

  return (
    <>
      <div className="bg-[#f8f9f7]">
        {/* Navbar */}
        <div>
          <ProfileComponent />
        </div>
        {/* Content */}
        <div
          className="rounded-4xl m-8 h-full p-15 bg-cover bg-center shadow-lg shadow-neutral-700/50"
          style={{ backgroundImage: `url(${BgSand})` }}
        >
          <div className="flex flex-col text-5xl text-white gap-5 font-bold">
            <p>Find The Joy</p>
            <p>Find Your People</p>
            <p>Find Your Journey</p>
          </div>
          <p className="text-black pt-3">
            Every journey is better when you find the joy and share it with the
            right people.
          </p>
        </div>
        {/* Category */}
        <p className="text-2xl px-10 pb-5 font-semibold text-[#0f4c81]">
          Category Trips
        </p>
        <div className="flex flex-wrap px-10 gap-3">
          {categoryOptions.map((value) => {
            const isSelected = selectedCategory === value.name;

            return (
              <button
                type="button"
                className={`btn-category ${
                  isSelected ? "bg-[#0f4c81] text-white" : "bg-black/25"
                }`}
                key={value.id ?? value.name}
                onClick={() => setSelectedCategory(value.name)}
              >
                {value.name}
              </button>
            );
          })}
        </div>
        {/* Freatured Trips  */}
        <div>
          <p className="text-2xl px-10 pt-8 font-semibold text-[#0f4c81]">
            Explore Trips
          </p>
          <p className="text-sm px-10 text-[#0f4c81]">
            {selectedCategory === "All"
              ? "Find your next adventure and meet new travel friends."
              : `Showing trips for ${selectedCategory}.`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 px-5">
            {filteredTrips.length === 0 ? (
              <p className="px-5 py-6 text-[#0f4c81]">
                No trips available for {selectedCategory} yet.
              </p>
            ) : (
              filteredTrips.map((value) => {
                return (
                  <TripCard
                    handleClick={() => {
                      navigate(`/trip-detail/${value.id}`);
                    }}
                    tripId={value.id}
                    key={value.id}
                    category={value.category.name}
                    title={value.title}
                    location={value.destination}
                    dateRange={
                      moment(value.startDate).format("L") +
                      " - " +
                      moment(value.endDate).format("L")
                    }
                    price={Number(value.budget).toLocaleString("th-TH")}
                    hostAvatar={value.owner.profileImage}
                    hostName={
                      value.owner.firstName + " " + value.owner.lastName
                    }
                    joined={value.maxMember}
                    image={value.image}
                  />
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
