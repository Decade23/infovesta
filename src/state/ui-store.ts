import { create } from "zustand";

type UIState = {
    sidebarOpen: boolean;
    openSidebar: () => void;
    closeSidebar: () => void;
    toggleSidebar: () => void;
    setSidebar: (v: boolean) => void;
};

export const useUI = create<UIState>((set) => ({
    sidebarOpen: false,
    openSidebar: () => set({ sidebarOpen: true }),
    closeSidebar: () => set({ sidebarOpen: false }),
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setSidebar: (v) => set({ sidebarOpen: v }),
}));