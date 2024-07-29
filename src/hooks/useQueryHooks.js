import {
  getAccountConfigOptions,
  getUserRoles,
  getUserSetupConfigs,
} from '@/app/_actions/config-actions'
import {
  USER_DATA_KEY,
  CONFIGS_QUERY_KEY,
  USER_ROLES_QUERY_KEY,
  SETUP_QUERY_KEY,
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

export const useUserRoles = () =>
  useQuery({
    queryKey: [USER_ROLES_QUERY_KEY],
    queryFn: async () => await getUserRoles(),
    staleTime: Infinity,
  })
