'use client'
import LoadingPage from '@/app/loading'
import { Card, CardHeader, Tabs } from '@/components/base'
import { Button } from '@/components/ui/Button'
import usePaymentsStore from '@/context/paymentsStore'
import React, { Suspense, useState } from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import Search from '@/components/ui/Search'
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'
import { SelectPaymentType } from '@/components/containers'
import useTransactions from '@/hooks/useTransactions'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useDisclosure } from '@nextui-org/react'
import BatchDetailsPage from '../../../../components/containers/disbursements/ViewBatchDetails'
import BulkTransactionsTable from '@/components/containers/tables/BulkTransactionsTable'

const transactionColumns = [
  { name: 'NAME', uid: 'batch_name', sortable: true },
  { name: 'TOTAL RECORDS', uid: 'number_of_records', sortable: true },
  { name: 'TOTAL AMOUNT', uid: 'total_amount', sortable: true },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
]

export default function Disbursements() {
  const { openPaymentsModal, openBatchDetailsModal } = usePaymentsStore()
  const { directBulkTransactions, isLoading } = useTransactions()
  const { onClose } = useDisclosure()

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <BulkTransactionsTable
      columns={transactionColumns}
      rows={directBulkTransactions}
      isLoading={isLoading}
    />,
    <BulkTransactionsTable
      columns={transactionColumns}
      rows={[]}
      isLoading={isLoading}
    />,
  ])

  return (
    <>
      {/* MODALS && OVERLAYS */}
      {openPaymentsModal && <SelectPaymentType protocol={'direct'} />}

      {openBatchDetailsModal && (
        <BatchDetailsPage
          isOpen={openBatchDetailsModal}
          onClose={onClose}
          protocol={'direct'}
        />
      )}

      {/************************************************************************/}
      <Card className={'mb-8 w-full'}>
        <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
          <CardHeader
            title={'Payment Disbursements'}
            infoText={
              'Make payments to your clients or multiple recipients simultaneously with direct transfers'
            }
            classNames={{
              titleClasses: 'xl:text-2xl lg:text-xl font-bold',
              infoClasses: '!text-sm xl:text-base',
            }}
          />
          {/* <div>
            <h1 className="t">Direct Payments</h1>
            <p className="">
              Make payments to your clients or multiple recipients
              simultaneously with direct transfers
            </p>
          </div> */}
        </div>

        <div className="mt-4 flex w-full items-center justify-between gap-8 ">
          <Tabs
            className={'my-2 mr-auto max-w-md'}
            tabs={PAYMENT_SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />
        </div>
      </Card>
      {/*  CURRENTLY ACTIVE TABLE */}
      {activeTab}
    </>
  )
}
