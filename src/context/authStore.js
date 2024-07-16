import { create } from 'zustand'

const INITIAL_STATE = {
  loading: false,
  error: false,
  message: '',
}

const useAuthStore = create((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setMessage: (message) => set({ message }),

  // METHODS AND ACTIONS

  // CLear & Reset
  resetAuthData: () =>
    set({
      ...INITIAL_STATE,
    }),
}))

export default useAuthStore
