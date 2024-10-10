'use client'

import { Button } from '@/components/ui/Button'
import usePaymentsStore from '@/context/paymentsStore'
import React from 'react'
import { useActivePrefunds } from '@/hooks/useQueryHooks'
import PrefundsTable from '../tables/PrefundsTable'
import { useEffect } from 'react'
import { notify } from '@/lib/utils'
import StatusMessage from '@/components/base/StatusMessage'

const SelectPrefund = ({
  navigateForward,
  workspaceID,
  walletActivePrefunds,
  protocol,
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]))

  const { paymentAction, updatePaymentFields, error, setError } =
    usePaymentsStore()
  const [isLoading, setIsLoading] = React.useState(false)

  function handleProceed() {
    setIsLoading(true)

    if (paymentAction?.prefundID !== '' || selectedKeys.size !== 0) {
      let prefund = walletActivePrefunds.find(
        (prefund) => prefund.ID === paymentAction?.prefundID,
      )

      if (prefund) {
        updatePaymentFields({ prefund, protocol })
        navigateForward()
      }

      setIsLoading(false)
      return
    }

    setError({ status: true, message: 'You need to select a prefund!' })
    notify('error', 'You need to select a prefund!')
    setIsLoading(false)
  }

  useEffect(() => {
    updatePaymentFields({ prefundID: selectedKeys.values().next().value })
  }, [selectedKeys])

  return (
    <>
      <div className="mt-4 flex h-full w-full flex-col gap-5">
        <PrefundsTable
          removeWrapper={true}
          rows={walletActivePrefunds}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
          selectionBehavior={'multiple'}
          emptyTitleText={'Unavailable Prefunds'}
          emptyDescriptionText={
            'You have no active prefunds available at this moment'
          }
        />
        {error?.status && (
          <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
            <StatusMessage error={error?.status} message={error?.message} />
          </div>
        )}

        <div className="mt-auto flex w-full items-end justify-end gap-4">
          <Button
            size="lg"
            isLoading={isLoading}
            isDisabled={isLoading || selectedKeys.size === 0}
            onClick={handleProceed}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  )
}

export default SelectPrefund
