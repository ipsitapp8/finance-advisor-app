import { create } from "zustand";

interface UIState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  clientSearchQuery: string;
  setClientSearchQuery: (query: string) => void;

  clientFilterStatus: string;
  setClientFilterStatus: (status: string) => void;

  policyFilterType: string;
  setPolicyFilterType: (type: string) => void;

  policyFilterStatus: string;
  setPolicyFilterStatus: (status: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  clientSearchQuery: "",
  setClientSearchQuery: (query) => set({ clientSearchQuery: query }),

  clientFilterStatus: "ALL",
  setClientFilterStatus: (status) => set({ clientFilterStatus: status }),

  policyFilterType: "ALL",
  setPolicyFilterType: (type) => set({ policyFilterType: type }),

  policyFilterStatus: "ALL",
  setPolicyFilterStatus: (status) => set({ policyFilterStatus: status }),
}));
