import { create } from 'zustand'

const INITIAL_STATE = {
  isLoading: false,
  error: {}, // STATUS, MESSAGE, FIELD-ERROR

  businessInfo: {},
  businessDocs: {},
  newAdminUser: {},
}

const useAuthStore = create((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setBusinessInfo: (businessInfo) => set({ businessInfo }),
  setBusinessDocs: (businessDocs) => set({ businessDocs }),
  setNewAdminUser: (newAdminUser) => set({ newAdminUser }),

  updateErrorStatus: (fields) => {
    set((state) => ({ error: { ...state.error, ...fields } }))
  },

  // METHODS AND ACTIONS

  // CLear & Reset
  resetAuthData: () =>
    set({
      ...INITIAL_STATE,
    }),
}))

export default useAuthStore
