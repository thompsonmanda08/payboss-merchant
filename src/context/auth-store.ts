import { create } from 'zustand';

import { ErrorState } from '@/types';
import {
  AccountOwner,
  BankAccountDetails,
  BusinessDetails,
  LoginPayload,
} from '@/types/account';
import { AuthStoreType, ChangePassword } from '@/types/stores';

const INITIAL_STATE = {
  isLoading: false,
  merchantID: '',
  isValidTPIN: false,
  isKYCSent: false,
  isAccountCreated: false,

  password: {
    newPassword: '',
    confirmPassword: '',
  } as ChangePassword,

  error: { status: false, message: '' } as ErrorState,

  businessInfo: {
    name: '',
    tpin: '',
    date_of_incorporation: '',
    companyTypeID: '',
    physical_address: '',
    contact: '',
    company_email: '',
    website: '',
    provinceID: '',
    cityID: '',
  } as BusinessDetails,

  bankDetails: {
    bankID: '',
    branch_name: '',
    branch_code: '',
    account_name: '',
    account_number: '',
    currencyID: '',
  } as BankAccountDetails,

  newAdminUser: {
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    phone_number: '',
    password: '',
    confirmPassword: '',
    role: 'owner',
    changePassword: false,
  } as unknown as AccountOwner,

  loginDetails: {
    emailusername: '',
    password: '',
  } as LoginPayload,
};

const useAuthStore = create<AuthStoreType>((set, get) => ({
  ...INITIAL_STATE,

  //SETTERS
  setError: (error) => set({ error }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setBusinessInfo: (businessInfo) => set({ businessInfo }),
  setMerchantID: (merchantID) => set({ merchantID }),
  setNewAdminUser: (newAdminUser) => set({ newAdminUser }),
  setBankingDetails: (bankDetails) => set({ bankDetails }),
  setIsValidTPIN: (isValidTPIN) => set({ isValidTPIN }),
  setAccountCreated: (isAccountCreated) => set({ isAccountCreated }),
  setIsKYCSent: (isKYCSent) => set({ isKYCSent }),

  updateErrorStatus: (fields: Partial<ErrorState>) => {
    set((state) => ({ error: { ...state.error, ...fields } }));
  },

  updateLoginDetails: (fields: Partial<LoginPayload>) =>
    set((state) => {
      return { loginDetails: { ...state.loginDetails, ...fields } };
    }),

  updatePasswordField: (fields: Partial<ChangePassword>) =>
    set((state) => {
      return { password: { ...state.password, ...fields } };
    }),

  // METHODS AND ACTIONS
  handleUserLogOut: async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    try {
      const res = await fetch('/api/logout', {
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();

      // Redirect manually if using JSON response
      if (data.redirect) {
        get().resetAuthData();
        window.location.href = data.redirect;
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTimeout(timeoutId);
    }
  },

  // CLear & Reset
  resetAuthData: () =>
    set({
      ...INITIAL_STATE,
    }),
}));

export default useAuthStore;
