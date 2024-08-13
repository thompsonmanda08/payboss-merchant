import {
  getAccountConfigOptions,
  getAllKYCData,
  getAllWorkspaces,
  getUserAccountRoles,
  getUserSetupConfigs,
  getWorkspaceRoles,
} from '@/app/_actions/config-actions'
import { getAllUsers, getUser } from '@/app/_actions/user-actions'
import {
  CONFIGS_QUERY_KEY,
  USER_ROLES_QUERY_KEY,
  WORKSPACE_ROLES_QUERY_KEY,
  SETUP_QUERY_KEY,
  WORKSPACES_QUERY_KEY,
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
    staleTime: Infinity,
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

export const useUsers = () =>
  useQuery({
    queryKey: [USERS],
    queryFn: async () => await getAllUsers(),
    staleTime: Infinity,
  })

export const useUserDetails = (userID) =>
  useQuery({
    queryKey: [USERS, userID],
    queryFn: async () => await getUser(userID),
    staleTime: Infinity,
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
