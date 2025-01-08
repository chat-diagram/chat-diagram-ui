import { create } from "zustand";

interface State {
  addProjectDialogOpen: boolean;
}

interface Action {
  setAddProjectDialogOpen: (open: boolean) => void;
}

export const useProjectsStore = create<State & Action>()((set) => ({
  addProjectDialogOpen: false,
  setAddProjectDialogOpen: (open: boolean) =>
    set({ addProjectDialogOpen: open }),
}));
