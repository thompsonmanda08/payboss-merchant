import {
  getAccountConfigOptions,
  getAllKYCData,
  getAllWorkspaces,
  getUserAccountRoles,
  getUserSetupConfigs,
  getWorkspaceRoles,
} from '@/app/_actions/config-actions'
import { getDashboardAnalytics } from '@/app/_actions/dashboard-actions'
import { useQuery } from '@tanstack/react-query'
import {
  getAllBulkTransactions,
  getAllSingleTransactions,
  getAllPaymentTransactions,
  getBatchDetails,
  getWalletPrefundHistory,
  getAllCollectionTransactions,
  getBulkAnalyticReports,
  getAPICollectionLatestTransactions,
} from '@/app/_actions/transaction-actions'
import { getAllUsers, getUser } from '@/app/_actions/user-actions'
import {
  getWorkspaceAPIKey,
  getWorkspaceMembers,
  initializeWorkspace,
} from '@/app/_actions/workspace-actions'
import {
  CONFIGS_QUERY_KEY,
  USER_ROLES_QUERY_KEY,
  WORKSPACE_ROLES_QUERY_KEY,
  SETUP_QUERY_KEY,
  WORKSPACES_QUERY_KEY,
  WORKSPACE_DASHBOARD_QUERY_KEY,
  WORKSPACE_MEMBERS_QUERY_KEY,
  BULK_TRANSACTIONS_QUERY_KEY,
  SINGLE_TRANSACTIONS_QUERY_KEY,
  BATCH_DETAILS_QUERY_KEY,
  USERS,
  WALLET_HISTORY_QUERY_KEY,
  DASHBOARD_ANALYTICS_QUERY_KEY,
  PAYMENT_TRANSACTIONS_QUERY_KEY,
  COLLECTION_TRANSACTIONS_QUERY_KEY,
  BULK_REPORTS_QUERY_KEY,
  WORKSPACE_API_KEY_QUERY_KEY,
} from '@/lib/constants'

export const useGeneralConfigOptions = () =>
  useQuery({
    queryKey: [CONFIGS_QUERY_KEY],
    queryFn: async () => await getAccountConfigOptions(),
    staleTime: Infinity,
  })

export const useSetupConfig = () =>
  useQuery({
    queryKey: [SETUP_QUERY_KEY],
    queryFn: async () => await getUserSetupConfigs(),
    staleTime: Infinity,
    refetchOnMount: true,
  })

export const useGetWorkspaces = () =>
  useQuery({
    queryKey: [WORKSPACES_QUERY_KEY],
    queryFn: async () => await getAllWorkspaces(),
    staleTime: Infinity,
  })

export const useKYCData = () =>
  useQuery({
    queryKey: ['KYC'],
    queryFn: async () => await getAllKYCData(),
    staleTime: Infinity,
  })

export const useAllUsers = () =>
  useQuery({
    queryKey: [USERS],
    queryFn: async () => await getAllUsers(),
    staleTime: Infinity,
  })

export const useUserDetails = (userID) =>
  useQuery({
    queryKey: [USERS, userID],
    queryFn: async () => await getUser(userID),
    refetchOnMount: true,
    staleTime: 0,
  })

export const useAccountRoles = () =>
  useQuery({
    queryKey: [USER_ROLES_QUERY_KEY],
    queryFn: async () => await getUserAccountRoles(),
    staleTime: Infinity,
  })

export const useWorkspaceRoles = () =>
  useQuery({
    queryKey: [WORKSPACE_ROLES_QUERY_KEY],
    queryFn: async () => await getWorkspaceRoles(),
    staleTime: Infinity,
  })

export const useWorkspaceInit = (workspaceID) =>
  useQuery({
    queryKey: [WORKSPACE_DASHBOARD_QUERY_KEY, workspaceID],
    queryFn: async () => await initializeWorkspace(workspaceID),
    refetchOnMount: true,
    staleTime: 0,
  })

export const useWorkspaceMembers = (workspaceID) =>
  useQuery({
    queryKey: [WORKSPACE_MEMBERS_QUERY_KEY, workspaceID],
    queryFn: async () => await getWorkspaceMembers(workspaceID),
    refetchOnMount: true,
    staleTime: Infinity,
  })

export const useAllPaymentTransactions = (workspaceID) =>
  useQuery({
    queryKey: [PAYMENT_TRANSACTIONS_QUERY_KEY, workspaceID],
    queryFn: async () => await getAllPaymentTransactions(workspaceID),
    refetchOnMount: true,
  })

export const useAllCollectionsTransactions = (workspaceID) =>
  useQuery({
    queryKey: [COLLECTION_TRANSACTIONS_QUERY_KEY, workspaceID],
    queryFn: async () => await getAllCollectionTransactions(workspaceID),
    refetchOnMount: true,
  })

export const useBulkTransactions = (workspaceID) =>
  useQuery({
    queryKey: [BULK_TRANSACTIONS_QUERY_KEY, workspaceID],
    queryFn: async () => await getAllBulkTransactions(workspaceID),
    refetchOnMount: true,
  })

export const useSingleTransactions = (workspaceID) =>
  useQuery({
    queryKey: [SINGLE_TRANSACTIONS_QUERY_KEY, workspaceID],
    queryFn: async () => await getAllSingleTransactions(workspaceID),
    refetchOnMount: true,
  })

export const useBatchDetails = (batchID) =>
  useQuery({
    queryKey: [BATCH_DETAILS_QUERY_KEY, batchID],
    queryFn: async () => await getBatchDetails(batchID),
    refetchOnMount: true,
    staleTime: Infinity,
  })

export const useWalletPrefundHistory = (workspaceID) =>
  useQuery({
    queryKey: [WALLET_HISTORY_QUERY_KEY, workspaceID],
    queryFn: async () => await getWalletPrefundHistory(workspaceID),
    refetchOnMount: true,
    staleTime: Infinity,
  })

export const useDashboardAnalytics = (workspaceID) =>
  useQuery({
    queryKey: [DASHBOARD_ANALYTICS_QUERY_KEY, workspaceID],
    queryFn: async () => await getDashboardAnalytics(workspaceID),
    refetchOnMount: true,
    staleTime: 0,
  })

export const useWorkspaceAPIKey = (workspaceID) =>
  useQuery({
    queryKey: [WORKSPACE_API_KEY_QUERY_KEY, workspaceID],
    queryFn: async () => await getWorkspaceAPIKey(workspaceID),
    staleTime: Infinity,
  })
