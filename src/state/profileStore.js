import { create } from "zustand";
import { persist } from "zustand/middleware";

const INITIAL_STATE = {
  user: null,
};

const useProfileStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      //SETTERS
      setUser: (user) => set({ user }),

      // CLear & Reset
      resetProfileData: () =>
        set({
          ...INITIAL_STATE,
        }),
    }),
    {
      name: "sp-profile",
    }
  )
);

export default useProfileStore;
