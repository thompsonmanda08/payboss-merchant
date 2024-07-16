import { apiClient } from '@/lib/utils'
import axios from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_STATE = {
  openMobileMenu: false,
}

const useConfigStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      //SETTERS
      

      // METHODS AND ACTIONS

      // CLear & Reset
      resetConfigs: () =>
        set({
          ...INITIAL_STATE,
        }),
    }),
    {
      name: 'navigation',
    },
  ),
)

export default useConfigStore
