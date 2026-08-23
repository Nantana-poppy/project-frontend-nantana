import { useEffect, useMemo, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { mainApi } from "@/api/mainApi";
import { MenuBar } from "@/components/MenuBar";
import TripCard from "@/components/card/tripCard";
import moment from "moment";

export default function ExplorePage() {
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

  // ==========================================
  // GET ALL TRIPS
  // ==========================================

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
  }, []);

  // ==========================================
  // GET CATEGORIES
  // ==========================================

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

  // ==========================================
  // FILTER TRIPS
  // ==========================================

  const filteredTrips = useMemo(() => {
    let result = [...trips];

    // ------------------------------------------
    // Search
    // ------------------------------------------

    if (search.trim()) {
      const keyword = search.toLowerCase().trim();

      result = result.filter((trip) => {
        return (
          trip.title?.toLowerCase().includes(keyword) ||
          trip.destination?.toLowerCase().includes(keyword)
        );
      });
    }

    // ------------------------------------------
    // Category
    // ------------------------------------------

    if (selectedCategory !== "All") {
      result = result.filter(
        (trip) => trip.category?.name === selectedCategory,
      );
    }

    // ------------------------------------------
    // Date
    // ------------------------------------------

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

    // ------------------------------------------
    // Budget
    // ------------------------------------------

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

    // ------------------------------------------
    // Group Size
    // ------------------------------------------

    if (groupSize) {
      result = result.filter(
        (trip) => Number(trip.maxMember) >= Number(groupSize),
      );
    }

    // ==========================================
    // SORT
    // ==========================================

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

  // ==========================================
  // CLEAR FILTER
  // ==========================================

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

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-[#f8f9f7]">
      <MenuBar />

      <main className="px-8 py-8">
        <div className="mx-auto max-w-7xl">
          {/* ================================= */}
          {/* HEADER */}
          {/* ================================= */}

          <div className="mb-8">
            <h1 className="text-5xl font-bold text-[#171b19]">Explore Trips</h1>

            <p className="mt-2 text-gray-500">
              Find the perfect trip and travel with your people.
            </p>
          </div>

          {/* ================================= */}
          {/* SEARCH */}
          {/* ================================= */}

          <div className="rounded-3xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3 rounded-full border border-gray-200 bg-[#fafafa] px-5 py-3">
              <Search size={20} className="text-gray-400" />

              <input
                type="text"
                placeholder="Search trips or destinations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-gray-400 hover:text-gray-700"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            {/* ================================= */}
            {/* FILTERS */}
            {/* ================================= */}

            <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="All">All Categories</option>

                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  From Date
                </label>

                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* End Date */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  To Date
                </label>

                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>

              {/* Group Size */}

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Group Size
                </label>

                <select
                  value={groupSize}
                  onChange={(e) => setGroupSize(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
                >
                  <option value="">Any Group Size</option>

                  <option value="2">2+ People</option>

                  <option value="3">3+ People</option>

                  <option value="4">4+ People</option>

                  <option value="5">5+ People</option>

                  <option value="6">6+ People</option>

                  <option value="10">10+ People</option>
                </select>
              </div>
            </div>

            {/* ================================= */}
            {/* BUDGET */}
            {/* ================================= */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium">Budget</label>

              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Minimum budget"
                  value={minBudget}
                  onChange={(e) => setMinBudget(e.target.value)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
                />

                <input
                  type="number"
                  min="0"
                  placeholder="Maximum budget"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm outline-none"
                />
              </div>
            </div>

            {/* ================================= */}
            {/* SORT + CLEAR */}
            {/* ================================= */}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-gray-400" />

                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm outline-none"
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
                  className="rounded-full border border-gray-300 px-5 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* ================================= */}
          {/* RESULT COUNT */}
          {/* ================================= */}

          <div className="mb-5 mt-8 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Explore Trips</h2>
            <p className="text-sm text-gray-500">
              {filteredTrips.length} trips found
            </p>
          </div>

          {/* ================================= */}
          {/* TRIPS */}
          {/* ================================= */}

          {loading ? (
            <div className="flex min-h-60 items-center justify-center">
              <p className="text-[#0F4C81]">Loading trips...</p>
            </div>
          ) : filteredTrips.length === 0 ? (
            <div className="rounded-3xl bg-white py-20 text-center shadow-sm">
              <p className="text-xl font-semibold text-gray-700">
                No trips found
              </p>

              <p className="mt-2 text-sm text-gray-400">
                Try changing your search or filters.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-full bg-[#0F4C81] px-6 py-3 text-sm font-medium text-white"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip) => (
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
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
