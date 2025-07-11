import { ErrorState } from ".";
import {
  AccountOwner,
  BankAccountDetails,
  BusinessDetails,
  LoginPayload,
} from "./account";

export type ChangePassword = {
  newPassword: string;
  confirmPassword: string;
};

export type AuthStoreType = {
  merchantID: string;
  isLoading: boolean;
  isValidTPIN: boolean;
  isKYCSent: boolean;
  isAccountCreated: boolean;
  password: ChangePassword;
  error?: ErrorState;
  businessInfo: BusinessDetails;
  bankDetails: BankAccountDetails;
  newAdminUser: AccountOwner;
  loginDetails: LoginPayload;

  setError: (error: ErrorState) => void;
  setIsLoading: (isLoading: boolean) => void;
  setBusinessInfo: (businessInfo: BusinessDetails) => void;
  setMerchantID: (merchantID: string) => void;
  setNewAdminUser: (newAdminUser: AccountOwner) => void;
  setBankingDetails: (bankDetails: BankAccountDetails) => void;
  setIsValidTPIN: (isValidTPIN: boolean) => void;
  setAccountCreated: (isAccountCreated: boolean) => void;
  setIsKYCSent: (isKYCSent: boolean) => void;
  updateLoginDetails: (fields: Partial<LoginPayload>) => void;
  updatePasswordField: (fields: Partial<ChangePassword>) => void;
  handleUserLogOut: () => Promise<void>;
  resetAuthData: () => void;
};
