import { Balance, PaymentMethods, SimpleStats } from '@/components/base'
import { TransactionsTable } from '@/components/containers'
import { ChevronRightIcon } from '@radix-ui/react-icons'
import React from 'react'

function Home() {
  return (
    <div className="">
      <div className="flex w-full flex-col gap-4 md:gap-6">
        <div className="flex w-full gap-4 ">
          <Balance title={'PayBoss Wallet'} amount={'K10, 500'} />
          <PaymentMethods />
        </div>
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(300px,1fr))] place-items-center gap-4 ">
          <SimpleStats
            title={'Todays Transactions'}
            figure={'10, 500'}
            figurePercentage={'75%'}
            isGood={true}
          />
          <SimpleStats
            title={"Yesterday's Transactions"}
            figure={'5, 685'}
            figurePercentage={'15%'}
            isBad={true}
          />
          <SimpleStats
            title={'Total Sales'}
            figure={'125, 685'}
            figurePercentage={'14%'}
          />
          <SimpleStats
            title={'Total Stock'}
            figure={'125, 685'}
            // figurePercentage={'14%'}
          />
        </div>
      </div>

      <div className="min-h-2/3 mt-8 flex w-full flex-col">
        <div className="flex w-full items-end justify-between">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-bold text-foreground">
              Recent Transactions
            </h2>
            <p>Some of your recent transactions are shown below</p>
          </div>
          <div className="flex gap-2 text-sm text-gray-500">
            <p>View all Transactions</p>
            <ChevronRightIcon className="h-6 w-6" />
          </div>
        </div>
        <TransactionsTable limit={5} />
      </div>
    </div>
  )
}

export default Home
