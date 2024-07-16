
import { getAccountConfigOptions } from '@/app/_actions/config-actions'
import { USER_DATA_KEY, CONFIGS_QUERY_KEY } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'

export const useGeneralConfigOptions = () =>
  useQuery({
    queryKey: [CONFIGS_QUERY_KEY],
    queryFn: async () => await getAccountConfigOptions(),
    staleTime: Infinity,
  })
