import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_STATE = {
  openCreateUserModal: false,
  openEditUserModal: false,
}

const useSettingsStore = create((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setOpenEditModal: (open) => set({ openEditModal: open }),

  // METHODS
  toggleCreateUserModal: () =>
    set((state) => {
      openCreateUserModal: !state.openCreateUserModal
    }),
  toggleEditUserModal: () =>
    set((state) => {
      openCreateUserModal: !state.openEditUserModal
    }),

  // CLear & Reset
  resetSettingsData: () =>
    set({
      ...INITIAL_STATE,
    }),
}))

export default useSettingsStore
