'use client'

import usePaymentsStore from '@/context/paymentsStore'
import React, { useEffect, useState } from 'react'
import useCustomTabsHook from '@/hooks/useCustomTabsHook'
import { PAYMENT_SERVICE_TYPES } from '@/lib/constants'
import { useDisclosure } from '@nextui-org/react'
import BatchDetailsPage from '../../../../components/containers/disbursements/ViewBatchDetails'
import BulkTransactionsTable from '@/components/containers/tables/BulkTransactionsTable'
import Card from '@/components/base/Card'
import CardHeader from '@/components/base/CardHeader'
import SelectPaymentType from '@/components/containers/disbursements/SelectPaymentType'
import OverlayLoader from '@/components/ui/OverlayLoader'

export default function Disbursements({ workspaceID }) {
  const {
    openPaymentsModal,
    openBatchDetailsModal,
    setSelectedActionType,
    resetPaymentData,
  } = usePaymentsStore()
  const { onClose } = useDisclosure()
  const [createPaymentLoading, setCreatePaymentLoading] = useState(false)

  const { activeTab, currentTabIndex, navigateTo } = useCustomTabsHook([
    <BulkTransactionsTable
      key={PAYMENT_SERVICE_TYPES[0]?.name}
      workspaceID={workspaceID}
    />,
    // <SingleTransactionsTable
    //   key={PAYMENT_SERVICE_TYPES[1]?.name}
    //   workspaceID={workspaceID}
    //   onRowAction={(key) => {}}
    // />,
  ])

  useEffect(() => {
    // setCurrentStep(PAYMENT_SERVICE_TYPES[currentTabIndex])
    resetPaymentData()
    setSelectedActionType(PAYMENT_SERVICE_TYPES[currentTabIndex])

    //TODO: => CLEAR DATA WHEN THE THE COMPONENT IS UNMOUNTED
    // return () => {
    //   resetPaymentData()
    // }
  }, [currentTabIndex])

  return (
    <>
      <Card className={'mb-8 w-full gap-4'}>
        <div className="flex w-full flex-col justify-between md:flex-row md:items-center">
          <CardHeader
            title={'Disbursement Transfers'}
            infoText={
              'Make payments to your clients or multiple recipients simultaneously with direct/voucher transfers'
            }
            classNames={{
              titleClasses: 'xl:text-2xl lg:text-xl font-bold',
              infoClasses: 'text-[15px] xl:text-base',
            }}
          />
        </div>

        {/* <div className="mt-4 flex w-full items-center justify-between gap-8 ">
          <Tabs
            className={'my-2 mr-auto max-w-md'}
            tabs={PAYMENT_SERVICE_TYPES}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
          />
        </div> */}

        {/* ****  CURRENTLY ACTIVE TABLE */}
        {activeTab}
      </Card>

      {/************************************************************************/}
      {/* MODALS && OVERLAYS */}
      {openPaymentsModal && (
        <SelectPaymentType
          setCreatePaymentLoading={setCreatePaymentLoading}
          protocol={'direct'}
        />
      )}

      {createPaymentLoading && <OverlayLoader show={createPaymentLoading} />}

      {openBatchDetailsModal && (
        <BatchDetailsPage
          isOpen={openBatchDetailsModal}
          onClose={onClose}
          protocol={'direct'}
        />
      )}

      {/************************************************************************/}
    </>
  )
}
