import { apiClient } from '@/lib/utils'
import axios from 'axios'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const INITIAL_STATE = {
  configOptions: [],
  userRoles: [],
}

const useConfigStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      //SETTERS
      setConfigOptions: (configOptions) => set({ configOptions }),
      setUserRoles: (userRoles) => set({ userRoles }),

      // METHODS AND ACTIONS

      // CLear & Reset
      resetConfigs: () =>
        set({
          ...INITIAL_STATE,
        }),
    }),
    {
      name: 'pb-config-store',
    },
  ),
)

export default useConfigStore
