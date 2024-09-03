'use client'
import {
  useAllCollectionsTransactions,
  useAllPaymentTransactions,
  useBulkTransactions,
  useSingleTransactions,
  useWalletPrefundHistory,
  useWorkspaceTransactions,
} from './useQueryHooks'
import useWorkspaces from './useWorkspaces'

const useTransactions = (query) => {
  const { workspaceID } = useWorkspaces()

  const {
    data: paymentTransactionsResponse,
    isFetching: workspaceTransactionsFetching,
    isLoading: workspaceTransactionsoading,
  } = useAllPaymentTransactions(workspaceID || query?.workspaceID)

  const {
    data: collectionsTransactionsResponse,
    isFetching: collectionsTransactionsFetching,
    isLoading: collectionsTransactionsoading,
  } = useAllCollectionsTransactions(workspaceID || query?.workspaceID)

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
  const allPaymentTransactions = paymentTransactionsResponse?.data?.data || []
  const allCollectionsTransactions =
    collectionsTransactionsResponse?.data?.data || []

  // console.log(allPaymentTransactions)
  // console.log(allCollectionsTransactions)

  return {
    isFetching,
    isLoading,
    bulkTransactions,
    singleTransactions,
    allPaymentTransactions,
    allCollectionsTransactions,
    walletHistory,
  }
}

export default useTransactions
