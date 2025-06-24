import { useQuery } from "@tanstack/react-query";

import { getGeneralConfigs } from "@/app/_actions/config-actions";
import {
  getAllKYCData,
  getAllWorkspaces,
  getUserAccountRoles,
  setupAccountConfig,
  getWorkspaceRoles,
} from "@/app/_actions/merchant-actions";
import { getDashboardAnalytics } from "@/app/_actions/dashboard-actions";
import {
  getAllBulkTransactions,
  getBatchDetails,
  getWalletPrefundHistory,
} from "@/app/_actions/transaction-actions";
import { getAllUsers, getUser } from "@/app/_actions/user-actions";
import {
  getAllWorkspaceTerminals,
  getWalletPrefunds,
  getWorkspaceAPIKey,
  getWorkspaceCallback,
  getWorkspaceMembers,
  getWorkspaceTillNumber,
  initializeWorkspace,
} from "@/app/_actions/workspace-actions";
import { QUERY_KEYS } from "@/lib/constants";
import { getCheckoutURL } from "@/app/_actions/vas-actions";
import { getRefreshToken } from "@/app/_actions/auth-actions";
import { getSubscriptionPacks } from "@/app/_actions/subscription-actions";

export const useGeneralConfigOptions = () =>
  useQuery({
    queryKey: [QUERY_KEYS.CONFIGS],
    queryFn: async () => await getGeneralConfigs(),
    staleTime: Infinity,
  });

export const useSetupConfig = () =>
  useQuery({
    queryKey: [QUERY_KEYS.SETUP],
    queryFn: async () => await setupAccountConfig(),
    staleTime: Infinity,
  });

export const useGetWorkspaces = () =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACES],
    queryFn: async () => await getAllWorkspaces(),
    staleTime: Infinity,
  });

export const useKYCData = () =>
  useQuery({
    queryKey: ["KYC"],
    queryFn: async () => await getAllKYCData(),
    staleTime: Infinity,
  });

export const useAllUsers = () =>
  useQuery({
    queryKey: [QUERY_KEYS.USERS],
    queryFn: async () => await getAllUsers(),
    staleTime: Infinity,
  });

export const useUserDetails = (userID) =>
  useQuery({
    queryKey: [QUERY_KEYS.USERS, userID],
    queryFn: async () => await getUser(userID),
    refetchOnMount: true,
    staleTime: 0,
  });

export const useAccountRoles = () =>
  useQuery({
    queryKey: [QUERY_KEYS.USER_ROLES],
    queryFn: async () => await getUserAccountRoles(),
    staleTime: Infinity,
  });

export const useWorkspaceRoles = () =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE_ROLES],
    queryFn: async () => await getWorkspaceRoles(),
    staleTime: Infinity,
  });

export const useWorkspaceInit = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE_SESSION, workspaceID],
    queryFn: async () => await initializeWorkspace(workspaceID),
    refetchOnMount: true,
    refetchInterval: 1000 * 60 * 3, // 3minutes
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    retry: 3,
    retryDelay: 3000,
    staleTime: 60 * 1000 * 3,
  });

export const useRefreshToken = (enable) =>
  useQuery({
    queryKey: ["refresh-token"],
    queryFn: async () => {
      if (!enable) {
        return {
          success: false,
          error: null,
          message: "Refresh token is disabled",
          data: null,
          status: 200,
          statusText: "REFRESH_TOKEN_DISABLED",
        };
      }

      const response = await getRefreshToken();

      return response;
    },
    retry: 3,
    retryDelay: 3000,
    refetchInterval: 1000 * 60 * 3, // 4minutes
  });

export const useWorkspaceMembers = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE_MEMBERS, workspaceID],
    queryFn: async () => await getWorkspaceMembers(workspaceID),
    refetchOnMount: true,
    staleTime: Infinity,
  });

export const useBulkTransactions = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.BULK_TRANSACTIONS, workspaceID],
    queryFn: async () => await getAllBulkTransactions(workspaceID),
    refetchOnMount: true,
  });

export const useBatchDetails = (batchID) =>
  useQuery({
    queryKey: [QUERY_KEYS.BATCH_DETAILS, batchID],
    queryFn: async () => await getBatchDetails(batchID),
    refetchOnMount: true,
    staleTime: Infinity,
  });

export const useWalletPrefundHistory = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.WALLET_HISTORY, workspaceID],
    queryFn: async () => await getWalletPrefundHistory(workspaceID),
    refetchOnMount: true,
    staleTime: Infinity,
  });

export const useDashboardAnalytics = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_ANALYTICS, workspaceID],
    queryFn: async () => await getDashboardAnalytics(workspaceID),
    refetchOnMount: true,
    staleTime: 0,
  });

export const useWorkspaceAPIKey = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE_API_KEY, workspaceID],
    queryFn: async () => await getWorkspaceAPIKey(workspaceID),
    staleTime: Infinity,
  });

export const useWorkspaceTerminals = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE_TERMINALS, workspaceID],
    queryFn: async () => await getAllWorkspaceTerminals(workspaceID),
    staleTime: 30 * 1000,
    refetchOnMount: true,
  });

export const useTillNumber = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE_TILL_NUMBER, workspaceID],
    queryFn: async () => await getWorkspaceTillNumber(workspaceID),
    staleTime: Infinity,
  });

export const useActivePrefunds = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.ACTIVE_PREFUND, workspaceID],
    queryFn: async () => await getWalletPrefunds(workspaceID),
    staleTime: 30 * 1000,
  });

export const useWorkspaceCallbackURL = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE_CALLBACK, workspaceID],
    queryFn: async () => await getWorkspaceCallback(workspaceID),
    staleTime: Infinity,
  });

export const useWorkspaceTypes = () =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE_TYPES],
    queryFn: async () => await getWorkspaceCallback(),
    staleTime: Infinity,
  });

export const useWorkspaceCheckout = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.WORKSPACE_CHECKOUT],
    queryFn: async () => await getCheckoutURL(workspaceID),
    staleTime: Infinity,
  });

export const useWorkspaceSubscriptions = (workspaceID) =>
  useQuery({
    queryKey: [QUERY_KEYS.SUBSCRIPTION_PACKS, workspaceID],
    queryFn: async () => await getSubscriptionPacks(workspaceID),
    staleTime: Infinity,
  });
