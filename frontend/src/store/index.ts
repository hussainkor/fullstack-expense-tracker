import { create } from "zustand";

const useStore = create((set) => ({
  theme: localStorage.getItem("theme") ?? "light",
  user: JSON.parse(localStorage.getItem("user") as "{}") ?? null,

  setTheme: (value: boolean) => set({ theme: value }),
  setCredentials: (user: {}) => set({ user }),
  singOut: () => set({ user: null }),
}));

export default useStore;
