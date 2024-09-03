'use client'
import {
  useBulkTransactions,
  useSingleTransactions,
  useWalletPrefundHistory,
  useWorkspaceTransactions,
} from './useQueryHooks'
import useWorkspaces from './useWorkspaces'

const useTransactions = (query) => {
  const { workspaceID } = useWorkspaces()

  const {
    data: workspaceTransactionsResponse,
    isFetching: workspaceTransactionsFetching,
    isLoading: workspaceTransactionsoading,
  } = useWorkspaceTransactions(workspaceID || query?.workspaceID)

  const {
    data: bulkTransactionsResponse,
    isFetching: bulkFetching,
    isLoading: bulkLoading,
  } = useBulkTransactions(workspaceID || query?.workspaceID)

  const {
    data: transactionsResponse,
    isLoading: singleLoading,
    isFetching: singleFetching,
  } = useSingleTransactions(workspaceID || query?.workspaceID)

  const {
    data: walletHistoryResponse,
    isFetching: walletHistoryFetching,
    isLoading: walletHistoryLoading,
  } = useWalletPrefundHistory(workspaceID || query?.workspaceID)

  const walletHistory = walletHistoryResponse?.data?.data || []

  const isLoading = bulkLoading || bulkFetching || singleLoading
  const isFetching =
    walletHistoryLoading || walletHistoryFetching || singleFetching

  const bulkTransactions = bulkTransactionsResponse?.data?.batches || []
  const singleTransactions = transactionsResponse?.data?.data || []
  const workspaceTransactions = workspaceTransactionsResponse?.data || []

  return {
    isFetching,
    isLoading,
    bulkTransactions,
    singleTransactions,
    workspaceTransactions,
    walletHistory,
  }
}

export default useTransactions
