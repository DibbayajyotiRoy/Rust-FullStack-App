import { create } from 'zustand';

interface UIState {
    theme: 'light' | 'dark' | 'system';
    sidebarOpen: boolean;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    theme: 'system',
    sidebarOpen: true,
    setTheme: (theme) => set({ theme }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    closeSidebar: () => set({ sidebarOpen: false }),
}));
