import { create } from "zustand";
import { AppView } from "@/types/navigation";

export type DefaultTabs = "list" | "form";

interface AppStore {
  currentView: AppView;
  setView: (v: AppView) => void;

  clientsTab: DefaultTabs;
  setClientsTab: (tab: DefaultTabs) => void;

  contractsTab: DefaultTabs;
  setContractsTab: (tab: DefaultTabs) => void;

  selectedContract: string | null;
  setSelectedContract: (id: string | null) => void;

  selectedProcess: string | null;
  setSelectedProcess: (id: string | null) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentView: "home",
  setView: (v) => set({ currentView: v }),

  clientsTab: "list",
  setClientsTab: (t) => set({ clientsTab: t }),

  contractsTab: "list",
  setContractsTab: (t) => set({ contractsTab: t }),

  selectedContract: null,
  setSelectedContract: (selectedContract) => set({ selectedContract }),

  selectedProcess: null,
  setSelectedProcess: (selectedProcess) => set({ selectedProcess }),
}));
