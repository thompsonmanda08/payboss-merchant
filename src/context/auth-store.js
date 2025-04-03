import { create } from "zustand";

import { logUserOut } from "@/app/_actions/auth-actions";

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
    name: "",
    tpin: "",
    date_of_incorporation: "",
    companyTypeID: "",
    physical_address: "",
    contact: "",
    company_email: "",
    website: "",
    provinceID: "",
    cityID: "",
    merchant_type: "",
    signatory_name: "",
    signatory_email: "",
    signatory_contact: "",
    cfo_name: "",
    cfo_email: "",
    cfo_contact: "",
  },

  bankDetails: {
    bankID: "",
    branch_name: "",
    branch_code: "",
    account_name: "",
    account_number: "",
    currencyID: "",
  },

  newAdminUser: {
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    phone_number: "",
    password: "",
    confirmPassword: "",
    role: "owner",
    changePassword: false,
  },

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
  setBankingDetails: (bankDetails) => set({ bankDetails }),
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
  handleUserLogOut: async () => {
    const isLoggedOut = await logUserOut();

    if (isLoggedOut) {
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
