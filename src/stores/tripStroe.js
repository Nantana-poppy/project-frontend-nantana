import { create } from "zustand";
import { mainApi } from "@/api/mainApi";

const mergeTrips = (oldTrips, newTrips) => {
  const map = new Map(oldTrips.map((trip) => [trip.id, trip]));
  newTrips.forEach((trip) => {
    map.set(trip.id, trip);
  });
  return Array.from(map.values());
};

const useTripStore = create((set, get) => ({
  trips: [],
  savedTripIds: [],
  members: [],
  tripsLoading: false,
  savedTripsLoading: false,
  membersLoading: false,

  fetchTrips: async () => {
    if (get().trips.length > 0) {
      return get().trips;
    }
    set({ tripsLoading: true });
    try {
      const response = await mainApi.get("/trips");
      const trips = response.data.data;
      set({ trips });
      return trips;
    } finally {
      set({ tripsLoading: false });
    }
  },

  fetchMembers: async (tripId) => {
    if (!tripId) return [];
    set({ membersLoading: true });
    try {
      const response = await mainApi.get(`/trips/${tripId}/members`);
      const members = response.data.data;
      set({ members });
      return members;
    } finally {
      set({ membersLoading: false });
    }
  },

  fetchSavedTrips: async (userId) => {
    if (!userId) return [];
    set({ savedTripsLoading: true });
    try {
      const response = await mainApi.get(
        `/users/${userId}/saved-trips`,
      );
      const savedTrips = response.data.data;
      const savedTripIds = savedTrips.map(({ trip }) => trip.id);
      set((state) => ({
        trips: mergeTrips(
          state.trips,
          savedTrips.map(({ trip }) => trip),
        ),
        savedTripIds,
      }));
      return savedTrips;
    } finally {
      set({ savedTripsLoading: false });
    }
  },

  saveTrip: async (tripId) => {
    await mainApi.post(`/trips/${tripId}/save`);
    set((state) => ({
      savedTripIds: [
        ...new Set([...state.savedTripIds, tripId]),
      ],
    }));
  },
}));

export default useTripStore;