import LoadingPage from '@/app/loading'
import React, { Suspense } from 'react'
import Transactions from './Transactions'

export default async function TransactionsPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <Transactions />
    </Suspense>
  )
}
