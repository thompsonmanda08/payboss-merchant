'use client'

// TODO: TO BE DELETED
import {
  // useAllCollectionsTransactions,
  // useAllPaymentTransactions,
  useBulkTransactions,
  useSingleTransactions,
  // useWalletPrefundHistory,
  // useWorkspaceTransactions,
} from './useQueryHooks'
import useWorkspaces from './useWorkspaces'

const useTransactions = (query) => {
  const { workspaceID } = useWorkspaces()

  // const {
  //   data: paymentTransactionsResponse,
  //   isFetching: workspaceTransactionsFetching,
  //   isLoading: workspaceTransactionsoading,
  // } = useAllPaymentTransactions(workspaceID || query?.workspaceID)

  // const {
  //   data: collectionsTransactionsResponse,
  //   isFetching: collectionsTransactionsFetching,
  //   isLoading: collectionsTransactionsoading,
  // } = useAllCollectionsTransactions(workspaceID || query?.workspaceID)

  const {
    data: bulkTransactionsResponse,
    isFetching: bulkFetching,
    isLoading: bulkLoading,
  } = useBulkTransactions(workspaceID || query?.workspaceID)
  const bulkTransactions = bulkTransactionsResponse?.data?.batches || []

  const {
    data: transactionsResponse,
    isLoading: singleLoading,
    isFetching: singleFetching,
  } = useSingleTransactions(workspaceID || query?.workspaceID)
  const singleTransactions = transactionsResponse?.data?.data || []

  const isLoading = bulkLoading || bulkFetching || singleLoading
  const isFetching = singleFetching

  // const allPaymentTransactions = paymentTransactionsResponse?.data?.data || []
  // const allCollectionsTransactions =
  //   collectionsTransactionsResponse?.data?.data || []

  return {
    isFetching,
    isLoading,
    bulkTransactions,
    singleTransactions,
    // allPaymentTransactions,
    // allCollectionsTransactions,
  }
}

export default useTransactions
