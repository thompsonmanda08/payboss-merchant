import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
  openEditModal: false,
};

const useSettingsStore = create((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setOpenEditModal: (open) => set({ openEditModal: open }),

  // CLear & Reset
  resetSettingsData: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useSettingsStore;
