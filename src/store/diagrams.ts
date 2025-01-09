import { Diagram } from "@/lib/api/diagrams";
import { create } from "zustand";

interface State {
  renameDiagramDialogOpen: boolean;
  renameDiagramInfo: Diagram | null;
}

interface Action {
  setRenameDiagramDialogOpen: (open: boolean, diagram?: Diagram | null) => void;
}

export const useDiagramsStore = create<State & Action>()((set) => ({
  renameDiagramDialogOpen: false,
  renameDiagramInfo: null,
  setRenameDiagramDialogOpen: (open: boolean, diagram?: Diagram | null) =>
    set({
      renameDiagramDialogOpen: open,
      renameDiagramInfo: diagram || null,
    }),
}));
