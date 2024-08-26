import {
  getAccountConfigOptions,
  getAllKYCData,
  getAllWorkspaces,
  getUserAccountRoles,
  getUserSetupConfigs,
  getWorkspaceRoles,
} from '@/app/_actions/config-actions'
import {
  getAllDirectBulkTransactions,
  getBatchDetails,
} from '@/app/_actions/transaction-actions'
import { getAllUsers, getUser } from '@/app/_actions/user-actions'
import {
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
  DIRECT_BULK_TRANSACTIONS_QUERY_KEY,
  BATCH_DETAILS_QUERY_KEY,
  USERS,
} from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'

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
    staleTime: 3600 * 1000,
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
    staleTime: 3600 * 1000,
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
    staleTime: 300 * 5 * 1000,
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
  })

export const useWorkspaceMembers = (workspaceID) =>
  useQuery({
    queryKey: [WORKSPACE_MEMBERS_QUERY_KEY, workspaceID],
    queryFn: async () => await getWorkspaceMembers(workspaceID),
    refetchOnMount: true,
  })

export const useDirectBulkTransactions = (workspaceID) =>
  useQuery({
    queryKey: [DIRECT_BULK_TRANSACTIONS_QUERY_KEY, workspaceID],
    queryFn: async () => await getAllDirectBulkTransactions(workspaceID),
    refetchOnMount: true,
  })

export const useBatchDetails = (batchID) =>
  useQuery({
    queryKey: [BATCH_DETAILS_QUERY_KEY, batchID],
    queryFn: async () => await getBatchDetails(batchID),
    refetchOnMount: true,
    staleTime: Infinity,
  })
