import { User } from "@/types/auth";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface State {
  //   : boolean;
  user: User | null;
}

interface Action {
  setUser: (user: User | null) => void;
}

export const useAppStore = create<State & Action>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user: User | null) => set({ user }),
    }),
    {
      name: "app-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
