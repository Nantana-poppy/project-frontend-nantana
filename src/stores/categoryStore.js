import { mainApi } from "@/api/mainApi";
import { create } from "zustand";

export const useCategoryStore = create((set, get) => ({
  category: [],
  fetchCategory: async () => {
    //Call api
    const resp = await mainApi.get("/categories");
    //Save to store
    set(()=> ({ category: resp.data.data }));
    //return
    return resp.data.data;
  },
}));
