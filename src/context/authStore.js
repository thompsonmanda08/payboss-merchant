import { logUserOut } from '@/app/_actions/auth-actions'
import { create } from 'zustand'

const INITIAL_STATE = {
  isLoading: false,
  businessInfoSent: false,
  documentsInfoSent: false,
  auth: {},

  error: {}, // STATUS, MESSAGE, FIELD-ERROR
  merchantID: '',

  businessInfo: {},
  businessDocs: {},
  newAdminUser: {},
  loginDetails: {},
}

const useAuthStore = create((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setError: (error) => set({ error }),
  setAuth: (auth) => set({ auth }), // TODO => TO HANDLE REFRESH TOKENS
  setIsLoading: (isLoading) => set({ isLoading }),
  setBusinessInfo: (businessInfo) => set({ businessInfo }),
  setMerchantID: (merchantID) => set({ merchantID }),
  setBusinessDocs: (businessDocs) => set({ businessDocs }),
  setBusinessInfoSent: (businessInfoSent) => set({ businessInfoSent }),
  setDocumentsInfoSent: (documentsInfoSent) => set({ documentsInfoSent }),
  setNewAdminUser: (newAdminUser) => set({ newAdminUser }),

  updateErrorStatus: (fields) => {
    set((state) => ({ error: { ...state.error, ...fields } }))
  },

  updateLoginDetails: (fields) =>
    set((state) => {
      return { loginDetails: { ...state.loginDetails, ...fields } }
    }),

  // METHODS AND ACTIONS
  handleUserLogOut: async () => {
    const isLoggedOut = await logUserOut()
    if (isLoggedOut) {
      window.location.href = '/login'
      get().resetAuthData()
      return isLoggedOut
    }
    return isLoggedOut
  },

  // CLear & Reset
  resetAuthData: () =>
    set({
      ...INITIAL_STATE,
    }),
}))

export default useAuthStore
