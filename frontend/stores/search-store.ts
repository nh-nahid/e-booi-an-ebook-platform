import { create } from "zustand";

interface SearchStore {
  search: string;
  setSearch: (value: string) => void;
  clearSearch: () => void;
}

export const useSearchStore = create<SearchStore>((set) => ({
  search: "",
  setSearch: (value) => set({ search: value }),
  clearSearch: () => set({ search: "" }),
}));