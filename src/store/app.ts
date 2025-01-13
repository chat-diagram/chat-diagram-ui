import { User } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
  //   : boolean;
  user: User | null;
  showUpgrade: boolean;
}

interface Action {
  setUser: (user: User | null) => void;
  setShowUpgrade: (showUpgrade: boolean) => void;
}

export const useAppStore = create<State & Action>()(
  persist(
    (set) => ({
      user: null,
      showUpgrade: true,
      setUser: (user: User | null) => set({ user }),
      setShowUpgrade: (showUpgrade: boolean) => set({ showUpgrade }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
