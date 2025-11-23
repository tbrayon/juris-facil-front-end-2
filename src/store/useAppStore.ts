import { create } from "zustand";
import { AppView } from "../types/navigation";

interface AppStore {
  currentView: AppView;
  setView: (v: AppView) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentView: "home",
  setView: (v) => set({ currentView: v }),
}));
