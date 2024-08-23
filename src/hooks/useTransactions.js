'use client'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  useDirectBulkTransactions,
  useGetWorkspaces,
  useSetupConfig,
} from './useQueryHooks'
import useWorkspaces from './useWorkspaces'

const useTransactions = () => {
  const { workspaceID } = useWorkspaces()

  const {
    data: directBulkResponse,
    isFetching,
    isLoading,
  } = useDirectBulkTransactions(workspaceID)

  const directBulkTransactions = directBulkResponse?.data?.batches || []

  console.log(directBulkTransactions)

  return {
    isFetching,
    isLoading,
    directBulkTransactions,
  }
}

export default useTransactions
