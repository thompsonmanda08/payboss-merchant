import TransactionsTable from '@/components/containers/TransactionsTable'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import React from 'react'

function Home() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center gap-6 overflow-clip bg-background text-foreground ">
      <div className="flex w-full flex-col gap-4 md:gap-6 lg:flex-row">
        {/*  */}
      </div>
      <div className="min-h-2/3 mt-4 flex w-full flex-col">
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-foreground sm:text-xl md:text-2xl lg:text-3xl">
              Recent Transactions
            </h2>
            <p>Some of your recent transactions are shown below</p>
          </div>
          <div className="flex gap-2 text-gray-500">
            <p>View all Transactions</p>
            <ChevronRightIcon className="h-6 w-6" />
          </div>
        </div>
        <TransactionsTable limit={5} />
      </div>
    </main>
  )
}

export default Home
