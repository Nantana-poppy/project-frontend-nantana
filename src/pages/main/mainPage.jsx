import "../../index.css";
import TripCard from "@/components/card/tripCard";
import { ProfileComponent } from "./components/ProfileComponent";
import { useCategoryStore } from "@/stores/categoryStore";
import useUserStore from "@/stores/userStore";
import useTripStore from "@/stores/tripStroe";
import { useEffect, useState } from "react";
import { mainApi } from "@/api/mainApi";
import moment from "moment/moment";
import { useNavigate } from "react-router";
import { Compass, Sparkles, Plus, Search } from "lucide-react";

export default function MainPage() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const user = useUserStore((state) => state.user);
  const fetchSavedTrips = useTripStore((state) => state.fetchSavedTrips);

  const fetchCategories = useCategoryStore((state) => state.fetchCategory);
  const category = useCategoryStore((state) => state.category);
  const categoryOptions = [{ id: "all", name: "All" }, ...category];

  const fetchTrips = async () => {
    try {
      const resp = await mainApi.get("/trips");
      setTrips(resp.data.data || []);
    } catch (err) {
      console.error("Failed to fetch trips:", err);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchTrips();
    if (user?.id) {
      fetchSavedTrips(user.id);
    }
  }, [user?.id]);

  // Filter by category and search query
  const filteredTrips = trips.filter((trip) => {
    const matchCategory =
      selectedCategory === "All" || trip.category?.name === selectedCategory;
    const matchSearch =
      searchQuery.trim() === "" ||
      trip.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trip.destination?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      {/* Top Navbar */}
      <ProfileComponent />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-8 sm:gap-10">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#1e3416] text-white shadow-lg">
          {/* Background image overlay with soft gradient */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-35 mix-blend-luminosity scale-105"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b3014]/95 via-[#233d1b]/80 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 px-8 py-12 sm:px-14 sm:py-16 max-w-2xl flex flex-col items-start gap-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-semibold border border-white/10">
              <Sparkles size={14} />
              <span>Discover Your Next Adventure</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-tight sm:leading-tight">
              Find The Joy. <br />
              Find Your People. <br />
              <span className="text-emerald-300">Find Your Journey.</span>
            </h1>

            <p className="text-gray-200 text-sm sm:text-base font-normal max-w-lg mt-1 leading-relaxed">
              Every trip is better when you share unforgettable moments with like-minded travelers. Connect, plan, and explore together.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => navigate("/create-trip")}
                className="rounded-full bg-white text-[#2d451e] hover:bg-emerald-50 px-6 py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-2"
              >
                <Plus size={16} />
                <span>Create a Trip</span>
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="rounded-full bg-white/15 hover:bg-white/25 text-white backdrop-blur-md border border-white/20 px-6 py-2.5 text-sm font-semibold transition-all cursor-pointer flex items-center gap-2"
              >
                <Compass size={16} />
                <span>Explore Map</span>
              </button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Categories
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Filter trips by your travel preference
              </p>
            </div>

            {/* Quick Search */}
            <div className="relative w-full sm:w-72">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trip or destination..."
                className="w-full pl-9 pr-4 py-2 rounded-full bg-white border border-gray-200 text-xs text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#385526]/20 focus:border-[#385526] transition"
              />
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryOptions.map((val) => {
              const isSelected = selectedCategory === val.name;
              return (
                <button
                  type="button"
                  key={val.id ?? val.name}
                  onClick={() => setSelectedCategory(val.name)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#385526] text-white shadow-xs"
                      : "bg-white text-gray-700 border border-gray-200/80 hover:bg-[#f2f6f0] hover:border-[#385526]/30"
                  }`}
                >
                  {val.name}
                </button>
              );
            })}
          </div>
        </section>

        {/* Explore Trips Section */}
        <section className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                Explore Trips
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                {selectedCategory === "All"
                  ? "Showing all active community trips"
                  : `Filtered by ${selectedCategory}`}
              </p>
            </div>
            <span className="text-xs font-semibold text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-100 shadow-2xs">
              {filteredTrips.length} {filteredTrips.length === 1 ? "Trip" : "Trips"} found
            </span>
          </div>

          {/* Trips Grid */}
          {filteredTrips.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-white border border-gray-100 shadow-xs">
              <div className="h-14 w-14 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526] mb-3">
                <Compass size={28} />
              </div>
              <p className="text-base font-semibold text-gray-800">
                No trips found
              </p>
              <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
                There are currently no trips matching "{selectedCategory}". Why not start one yourself?
              </p>
              <button
                onClick={() => navigate("/create-trip")}
                className="rounded-full bg-[#385526] hover:bg-[#2d451e] text-white px-5 py-2 text-xs font-semibold transition cursor-pointer"
              >
                Create the First Trip
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrips.map((value) => (
                <TripCard
                  key={value.id}
                  tripId={value.id}
                  category={value.category?.name}
                  title={value.title}
                  location={value.destination}
                  dateRange={
                    moment(value.startDate).format("L") +
                    " - " +
                    moment(value.endDate).format("L")
                  }
                  price={Number(value.budget).toLocaleString("th-TH")}
                  hostId={value.owner?.id}
                  hostAvatar={value.owner?.profileImage}
                  hostName={
                    value.owner
                      ? `${value.owner.firstName} ${value.owner.lastName}`
                      : "Host"
                  }
                  currentMembers={value.members?.length ?? value._count?.members ?? 1}
                  maxMembers={value.maxMember}
                  image={value.image}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
