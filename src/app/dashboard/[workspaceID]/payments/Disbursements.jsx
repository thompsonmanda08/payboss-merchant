'use client'
import { Card, CardHeader, Tabs } from '@/components/base'
import usePaymentsStore from '@/context/paymentsStore'
import React from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'
import { SelectPaymentType } from '@/components/containers'
import useTransactions from '@/hooks/useTransactions'
import { useDisclosure } from '@nextui-org/react'
import BatchDetailsPage from '../../../../components/containers/disbursements/ViewBatchDetails'
import BulkTransactionsTable from '@/components/containers/tables/BulkTransactionsTable'
import SingleTransactionsTable from '@/components/containers/tables/SingleTransactionsTable'

export default function Disbursements() {
  const { openPaymentsModal, openBatchDetailsModal } = usePaymentsStore()
  const { bulkTransactions, isLoading, singleTransactions } = useTransactions()
  const { onClose } = useDisclosure()

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <BulkTransactionsTable rows={bulkTransactions} isLoading={isLoading} />,
    <SingleTransactionsTable rows={singleTransactions} isLoading={isLoading} />,
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
