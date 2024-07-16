import { apiClient } from '@/lib/utils'
import axios from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_STATE = {
  openMobileMenu: false,
}

const useNavigationStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      //SETTERS
      toggleMobileMenu: () =>
        set((state) => ({ openMobileMenu: !state.openMobileMenu })),

      // METHODS AND ACTIONS

      // CLear & Reset
      resetNavigation: () =>
        set({
          ...INITIAL_STATE,
        }),
    }),
    {
      name: 'navigation',
    },
  ),
)

export default useNavigationStore
