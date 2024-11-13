import { logUserOut } from "@/app/_actions/auth-actions";
import { create } from "zustand";

const INITIAL_STATE = {
  isLoading: false,
  auth: {},
  password: {
    newPassword: "",
    confirmPassword: "",
  },

  error: { status: false, message: "" }, // STATUS, MESSAGE, FIELD-ERROR
  merchantID: "",
  isValidTPIN: false,
  isKYCSent: false,
  accountCreated: false,
  businessInfo: {
    businessName: "",
    companyTypeID: "",
    tpin: "",
    company_email: "",
    date_of_incorporation: "",
    provinceID: "",
    cityID: "",
    physical_address: "",
    contact: "",
    website: "",
  },
  newAdminUser: {},
  loginDetails: {},
};

const useAuthStore = create((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setError: (error) => set({ error }),
  setAuth: (auth) => set({ auth }), // TODO => TO HANDLE REFRESH TOKENS
  setIsLoading: (isLoading) => set({ isLoading }),
  setBusinessInfo: (businessInfo) => set({ businessInfo }),
  setMerchantID: (merchantID) => set({ merchantID }),
  setNewAdminUser: (newAdminUser) => set({ newAdminUser }),
  setIsValidTPIN: (isValidTPIN) => set({ isValidTPIN }),
  setAccountCreated: (accountCreated) => set({ accountCreated }),
  setIsKYCSent: (isKYCSent) => set({ isKYCSent }),

  updateErrorStatus: (fields) => {
    set((state) => ({ error: { ...state.error, ...fields } }));
  },

  updateLoginDetails: (fields) =>
    set((state) => {
      return { loginDetails: { ...state.loginDetails, ...fields } };
    }),

  updatePasswordField: (fields) =>
    set((state) => {
      return { password: { ...state.password, ...fields } };
    }),

  // METHODS AND ACTIONS
  handleUserLogOut: async (pathname) => {
    const isLoggedOut = await logUserOut();
    if (isLoggedOut) {
      window.location.href = pathname
        ? `/login?callbackUrl=${pathname}`
        : "/login";

      get().resetAuthData();
      return isLoggedOut;
    }
    return isLoggedOut;
  },

  // CLear & Reset
  resetAuthData: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useAuthStore;
