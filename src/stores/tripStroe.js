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
  savedTrips: [],
  savedTripIds: [],
  members: [],
  tripsLoading: false,
  savedTripsLoading: false,
  membersLoading: false,

  fetchTrips: async (forceRefresh = false) => {
    if (!forceRefresh && get().trips.length > 0) {
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

  updateUserAvatarInTrips: (userId, newProfileImage) => {
    const numId = Number(userId);
    set((state) => ({
      trips: state.trips.map((t) =>
        t.owner?.id === numId || t.ownerId === numId
          ? {
              ...t,
              owner: {
                ...t.owner,
                profileImage: newProfileImage,
              },
            }
          : t
      ),
      savedTrips: state.savedTrips.map((st) =>
        st.trip?.owner?.id === numId || st.trip?.ownerId === numId
          ? {
              ...st,
              trip: {
                ...st.trip,
                owner: {
                  ...st.trip.owner,
                  profileImage: newProfileImage,
                },
              },
            }
          : st
      ),
    }));
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
      const savedTrips = response.data.data || [];
      const savedTripIds = savedTrips.map(({ trip }) => Number(trip.id));
      set((state) => ({
        savedTrips,
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

  toggleSaveTrip: async (tripId) => {
    const response = await mainApi.post(`/trips/${tripId}/save`);
    const { isSaved, data } = response.data;
    const numericTripId = Number(tripId);

    set((state) => {
      let nextSavedTripIds = [];
      let nextSavedTrips = [];

      if (isSaved) {
        nextSavedTripIds = [...new Set([...state.savedTripIds, numericTripId])];
        if (data) {
          nextSavedTrips = [data, ...state.savedTrips.filter((item) => Number(item.trip.id) !== numericTripId)];
        } else {
          nextSavedTrips = state.savedTrips;
        }
      } else {
        nextSavedTripIds = state.savedTripIds.filter((id) => id !== numericTripId);
        nextSavedTrips = state.savedTrips.filter((item) => Number(item.trip.id) !== numericTripId);
      }

      return {
        savedTripIds: nextSavedTripIds,
        savedTrips: nextSavedTrips,
      };
    });

    return response.data;
  },

  saveTrip: async (tripId) => {
    return get().toggleSaveTrip(tripId);
  },

  deleteTrip: async (tripId) => {
    const response = await mainApi.delete(`/trips/${tripId}`);
    const numericTripId = Number(tripId);
    set((state) => ({
      trips: state.trips.filter((trip) => Number(trip.id) !== numericTripId),
      savedTripIds: state.savedTripIds.filter((id) => id !== numericTripId),
      savedTrips: state.savedTrips.filter((item) => Number(item.trip.id) !== numericTripId),
    }));
    return response.data;
  },
}));

export default useTripStore;