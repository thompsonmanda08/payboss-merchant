import { Balance, Card, PaymentMethods, SimpleStats } from '@/components/base'
import ReportsBarChart from '@/components/charts/ReportsBarChart'
import { TransactionsTable } from '@/components/containers'
import React, { Suspense } from 'react'
import reportsBarChartData from './data/reportsBarChartData'
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import GradientLineChart from '@/components/charts/LineCharts/GradientLineChart'
import gradientLineChartData from './data/gradientLineChartData'
import LoadingPage from '../loading'
import Batches from '@/components/batch'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import InfoBanner from '@/components/base/InfoBanner'

function DashboardHome() {
  const { chart, items } = reportsBarChartData

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex w-full flex-col gap-4 md:gap-6">
        <InfoBanner
          buttonText="Verify Account"
          infoText="You have not verified your account yet. Please verify your account to access all the features of the app."
          href={'settings/account-verification'}
        />
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

        <div className="flex w-full gap-4">
          <PaymentMethods />
          <div className="flex flex-col gap-4">
            <Balance title={'PayBoss Wallet'} amount={'K10, 500'} />
            <Balance title={'Bank'} amount={'K10, 500'} />
          </div>
          <ReportsBarChart
            title="transactions"
            description={
              <>
                (<strong>+23%</strong>) than last week
              </>
            }
            chart={chart}
            items={items}
          />
        </div>
        <div className="flex gap-6">
          <GradientLineChart
            title="Transactions Overview"
            description={
              <div className="flex items-center">
                <div className="mb-1 mr-1 text-lg leading-none text-green-500">
                  <ArrowUpIcon className="h-5 w-5 font-bold" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  4% more <span className="font-normal">in 2021</span>
                </span>
              </div>
            }
            height="20.25rem"
            chart={gradientLineChartData}
          />
          <RecentTransactions />
        </div>
        <div className="grid grid-cols-10 gap-6">
          <div className="col-span-6">
            <Batches />
          </div>
          <div className="col-span-4 flex">
            <RecentTransactions />
          </div>
        </div>
      </div>
    </Suspense>
  )
}

function RecentTransactions() {
  return (
    <Card>
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
    </Card>
  )
}

export default DashboardHome
