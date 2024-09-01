import { Balance, Card, PaymentMethods, SimpleStats } from '@/components/base'
import ReportsBarChart from '@/components/charts/ReportsBarChart'
// import { TransactionsTable } from '@/components/containers'
import React, { Suspense } from 'react'
import reportsBarChartData from './data/reportsBarChartData'
import { ArrowUpIcon } from '@heroicons/react/24/outline'
import GradientLineChart from '@/components/charts/LineCharts/GradientLineChart'
import gradientLineChartData from './data/gradientLineChartData'
import LoadingPage from '../../loading'
import Batches from '@/components/batch'
import { ChevronRightIcon } from '@heroicons/react/24/solid'
import InfoBanner from '@/components/base/InfoBanner'
import { formatCurrency } from '@/lib/utils'

function DashboardHome() {
  const { chart, items } = reportsBarChartData

  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex w-full flex-col gap-4 md:gap-6">
        <InfoBanner
          buttonText="Verify Account"
          infoText="Just one more step, please submit your business documents to aid us with the approval process"
          href={'manage-account/account-verification'}
        />
        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(300px,1fr))] place-items-center gap-4 ">
          <SimpleStats
            title={'Todays Transactions'}
            figure={'10, 500'}
            smallFigure={`(${formatCurrency('1000000')})`}
            classNames={{
              smallFigureClasses: 'md:text-base font-semibold',
            }}
            // isGood={true}
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

        <div className="grid w-full grid-cols-[repeat(auto-fill,minmax(400px,1fr))] place-items-center gap-4 ">
          <SimpleStats
            title={'Total Collections'}
            figure={'10, 500'}
            smallFigure={`(${formatCurrency('1000000')})`}
            classNames={{
              smallFigureClasses: 'md:text-base font-semibold',
            }}
            isGood={true}
          />
          <SimpleStats
            title={'Total Disbursements'}
            figure={'10, 500'}
            smallFigure={`(${formatCurrency('1000000')})`}
            classNames={{
              smallFigureClasses: 'md:text-base font-semibold',
            }}
            isGood={true}
          />
          <Balance isLandscape amount={'K10, 500'} />
        </div>

        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
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
        </div>

        <div className="flex w-full gap-4">
          <Batches />
          <Batches />
        </div>
      </div>
    </Suspense>
  )
}

export default DashboardHome
