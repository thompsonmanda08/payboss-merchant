'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  useDirectBulkTransactions,
  useGetWorkspaces,
  useSetupConfig,
  useWalletPrefundHistory,
} from './useQueryHooks'
import useWorkspaces from './useWorkspaces'

const useTransactions = (query) => {
  const { workspaceID } = useWorkspaces()

  const {
    data: directBulkResponse,
    isFetching: bulkDirectFetching,
    isLoading: bulkDirectLoading,
  } = useDirectBulkTransactions(workspaceID || query?.workspaceID)

  const {
    data: walletHistoryResponse,
    isFetching: walletHistoryFetching,
    isLoading: walletHistoryLoading,
  } = useWalletPrefundHistory(workspaceID || query?.workspaceID)

  const directBulkTransactions = directBulkResponse?.data?.batches || []
  const walletHistory = walletHistoryResponse?.data?.data || []

  const isLoading = bulkDirectLoading || bulkDirectFetching
  const isFetching = walletHistoryLoading || walletHistoryFetching

  return {
    isFetching,
    isLoading,
    directBulkTransactions,
    walletHistory,
  }
}

export default useTransactions
