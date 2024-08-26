'use client'
import LoadingPage from '@/app/loading'
import { Card, Tabs } from '@/components/base'
import { Button } from '@/components/ui/Button'
import usePaymentsStore from '@/context/paymentsStore'
import React, { Suspense, useState } from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import Search from '@/components/ui/Search'
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'
import { SelectPaymentType } from '@/components/containers'
import useTransactions from '@/hooks/useTransactions'
import CustomTable from '@/components/containers/tables/Table'
import { PlusIcon } from '@heroicons/react/24/outline'
import { useDisclosure } from '@nextui-org/react'
import BatchDetailsPage from '../../../../../components/containers/disbursements/ViewBatchDetails'

const transactionColumns = [
  { name: 'NAME', uid: 'batch_name' },
  { name: 'TOTAL RECORDS', uid: 'number_of_records' },
  { name: 'TOTAL AMOUNT', uid: 'total_amount' },
  { name: 'STATUS', uid: 'status' },
  { name: 'LINK', uid: 'link' },
]

export default function Payments() {
  const [searchQuery, setSearchQuery] = useState('')
  const { openPaymentsModal, setOpenPaymentsModal, openBatchDetailsModal } =
    usePaymentsStore()
  const { directBulkTransactions } = useTransactions()
  const { onClose } = useDisclosure()
  const [selectedKeys, setSelectedKeys] = React.useState(new Set(['']))

  const bulkRows = directBulkTransactions?.filter((item) => {
    return (
      item?.batch_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item?.amount?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <CustomTable
      columns={transactionColumns}
      rows={bulkRows}
      selectedKeys={selectedKeys}
      setSelectedKeys={setSelectedKeys}
    />,
  ])

  return (
    <Suspense fallback={<LoadingPage />}>
      <>
        {/* MODALS && OVERLAYS */}
        {openPaymentsModal && <SelectPaymentType service={'direct'} />}

        {openBatchDetailsModal && (
          <BatchDetailsPage
            isOpen={openBatchDetailsModal}
            onClose={onClose}
            service={'direct'}
          />
        )}

        {/************************************************************************/}
        <Card className={'mb-8 w-full'}>
          <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
            <div>
              <h1 className="text-xl font-bold">Direct Payments</h1>
              <p className="text-gary-500 text-xs md:text-sm">
                Make payments to your clients or multiple recipients
                simultaneously with direct transfers
              </p>
            </div>
            <Button
              onClick={() => {
                setOpenPaymentsModal(true)
              }}
              startContent={<PlusIcon className="h-5 w-5" />}
            >
              Create Payment
            </Button>
          </div>

          <div className="mt-4 flex w-full items-center justify-between gap-8 ">
            <Search
              onChange={(e) => {
                setSearchQuery(e.target.value)
              }}
            />
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
    </Suspense>
  )
}
