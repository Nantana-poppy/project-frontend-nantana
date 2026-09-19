import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mainApi } from "@/api/mainApi";

const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: "",

      login: async (data) => {
        const resp = await mainApi.post("/auth/login", data);

        set({
          user: resp.data.user,
          token: resp.data.token,
        });

        return resp;
      },

      updateUser: (user) => {
        set((state) => ({
          user: {
            ...state.user,
            ...user,
          },
        }));
      },

      fetchCurrentUser: async () => {
        try {
          const resp = await mainApi.get("/auth/me");
          if (resp.data.user) {
            set((state) => ({
              user: {
                ...state.user,
                ...resp.data.user,
              },
            }));
            return resp.data.user;
          }
        } catch (error) {
          console.error("fetchCurrentUser error:", error);
        }
      },

      logout: () => {
        set({
          user: null,
          token: "",
        });
      },
    }),
    {
      name: "authState",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export default useUserStore;
