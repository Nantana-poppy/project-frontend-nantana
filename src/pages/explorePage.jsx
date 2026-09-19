import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X, Compass, Filter } from "lucide-react";

import { mainApi } from "@/api/mainApi";
import { MenuBar } from "@/components/MenuBar";
import TripCard from "@/components/card/tripCard";
import useUserStore from "@/stores/userStore";
import useTripStore from "@/stores/tripStroe";
import moment from "moment";

export default function ExplorePage() {
  const user = useUserStore((state) => state.user);
  const fetchSavedTrips = useTripStore((state) => state.fetchSavedTrips);

  const [trips, setTrips] = useState([]);
  const [categories, setCategories] = useState([]);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");

  const [groupSize, setGroupSize] = useState("");

  const [sort, setSort] = useState("newest");

  const [loading, setLoading] = useState(true);

  // GET ALL TRIPS & SAVED TRIPS
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const response = await mainApi.get("/trips");
        setTrips(response.data.data || []);
      } catch (error) {
        console.error("Get trips error:", error.response?.data || error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
    if (user?.id) {
      fetchSavedTrips(user.id);
    }
  }, [user?.id]);

  // GET CATEGORIES
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await mainApi.get("/categories");
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Get categories error:", error.response?.data || error);
      }
    };

    fetchCategories();
  }, []);

  // FILTER TRIPS
  const filteredTrips = useMemo(() => {
    let result = [...trips];

    // Search
    if (search.trim()) {
      const keyword = search.toLowerCase().trim();
      result = result.filter((trip) => {
        return (
          trip.title?.toLowerCase().includes(keyword) ||
          trip.destination?.toLowerCase().includes(keyword)
        );
      });
    }

    // Category
    if (selectedCategory !== "All") {
      result = result.filter(
        (trip) => trip.category?.name === selectedCategory,
      );
    }

    // Date
    if (startDate) {
      result = result.filter((trip) => {
        return new Date(trip.startDate) >= new Date(startDate);
      });
    }

    if (endDate) {
      result = result.filter((trip) => {
        return new Date(trip.endDate) <= new Date(endDate);
      });
    }

    // Budget
    if (minBudget) {
      result = result.filter(
        (trip) => Number(trip.budget) >= Number(minBudget),
      );
    }

    if (maxBudget) {
      result = result.filter(
        (trip) => Number(trip.budget) <= Number(maxBudget),
      );
    }

    // Group Size
    if (groupSize) {
      result = result.filter(
        (trip) => Number(trip.maxMember) >= Number(groupSize),
      );
    }

    // SORT
    if (sort === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sort === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    if (sort === "budget-low") {
      result.sort((a, b) => Number(a.budget) - Number(b.budget));
    }
    if (sort === "budget-high") {
      result.sort((a, b) => Number(b.budget) - Number(a.budget));
    }

    return result;
  }, [
    trips,
    search,
    selectedCategory,
    startDate,
    endDate,
    minBudget,
    maxBudget,
    groupSize,
    sort,
  ]);

  // CLEAR FILTER
  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("All");
    setStartDate("");
    setEndDate("");
    setMinBudget("");
    setMaxBudget("");
    setGroupSize("");
    setSort("newest");
  };

  const hasFilter =
    search ||
    selectedCategory !== "All" ||
    startDate ||
    endDate ||
    minBudget ||
    maxBudget ||
    groupSize ||
    sort !== "newest";

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col">
      <MenuBar />

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-1 flex flex-col gap-6">
        {/* HEADER */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
            Explore Trips
          </h1>
          <p className="text-sm text-gray-500 font-normal">
            Find the perfect journey, filter by budget, dates, and connect with fellow explorers.
          </p>
        </div>

        {/* SEARCH & FILTERS CARD */}
        <div className="rounded-[28px] bg-white p-5 sm:p-6 border border-gray-100 shadow-xs">
          {/* Main Search Input */}
          <div className="relative flex items-center">
            <Search size={18} className="absolute left-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search destinations, trip titles, activities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-[#f8faf7] pl-11 pr-10 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#385526]/20 focus:border-[#385526] transition"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3.5 text-gray-400 hover:text-gray-700 p-1"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Filter Controls Grid */}
          <div className="mt-4 grid gap-3.5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-[#385526] focus:ring-1 focus:ring-[#385526]"
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 outline-none focus:border-[#385526] focus:ring-1 focus:ring-[#385526]"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs text-gray-800 outline-none focus:border-[#385526] focus:ring-1 focus:ring-[#385526]"
              />
            </div>

            {/* Group Size */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Group Size
              </label>
              <select
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs text-gray-800 outline-none focus:border-[#385526] focus:ring-1 focus:ring-[#385526]"
              >
                <option value="">Any Group Size</option>
                <option value="2">2+ Members</option>
                <option value="3">3+ Members</option>
                <option value="4">4+ Members</option>
                <option value="5">5+ Members</option>
                <option value="6">6+ Members</option>
                <option value="10">10+ Members</option>
              </select>
            </div>
          </div>

          {/* Budget & Sort Row */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Budget range */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                Budget (฿):
              </span>
              <input
                type="number"
                min="0"
                placeholder="Min"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#385526]"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                min="0"
                placeholder="Max"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-800 outline-none focus:border-[#385526]"
              />
            </div>

            {/* Sort & Clear button */}
            <div className="flex items-center gap-2.5 self-end md:self-auto">
              <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-[#f8faf7] px-3 py-1.5 rounded-xl border border-gray-200">
                <SlidersHorizontal size={14} className="text-[#385526]" />
                <span className="font-medium">Sort:</span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-800 outline-none cursor-pointer"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="budget-low">Budget: Low → High</option>
                  <option value="budget-high">Budget: High → Low</option>
                </select>
              </div>

              {hasFilter && (
                <button
                  onClick={clearFilters}
                  className="rounded-xl border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Available Trips</h2>
            <span className="rounded-full bg-[#f2f6f0] text-[#2d451e] px-2.5 py-0.5 text-xs font-semibold border border-[#385526]/10">
              {filteredTrips.length}
            </span>
          </div>
        </div>

        {/* TRIPS GRID */}
        {loading ? (
          <div className="flex min-h-60 flex-col items-center justify-center gap-2">
            <span className="h-7 w-7 animate-spin rounded-full border-2 border-[#385526] border-t-transparent" />
            <p className="text-xs text-gray-500 font-medium">Loading adventures...</p>
          </div>
        ) : filteredTrips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-3xl bg-white border border-gray-100 shadow-xs">
            <div className="h-14 w-14 rounded-full bg-[#f2f6f0] flex items-center justify-center text-[#385526] mb-3">
              <Compass size={28} />
            </div>
            <p className="text-base font-semibold text-gray-800">
              No matching trips found
            </p>
            <p className="text-xs text-gray-500 max-w-sm mt-1 mb-4">
              Try adjusting your search criteria or clearing filters to see more results.
            </p>
            {hasFilter && (
              <button
                onClick={clearFilters}
                className="rounded-full bg-[#385526] hover:bg-[#2d451e] text-white px-5 py-2 text-xs font-semibold transition cursor-pointer"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <TripCard
                key={trip.id}
                tripId={trip.id}
                hostId={trip.owner?.id}
                category={trip.category?.name}
                title={trip.title}
                location={trip.destination}
                dateRange={
                  moment(trip.startDate).format("L") +
                  " - " +
                  moment(trip.endDate).format("L")
                }
                price={Number(trip.budget).toLocaleString("th-TH")}
                hostAvatar={trip.owner?.profileImage}
                hostName={
                  trip.owner
                    ? `${trip.owner.firstName} ${trip.owner.lastName}`
                    : "Host"
                }
                joined={trip.maxMember}
                image={trip.image}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
