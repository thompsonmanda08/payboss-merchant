'use client';

import { Alert, addToast } from '@heroui/react';
import React from 'react';
import { useEffect } from 'react';

import PrefundsTable from '@/components/tables/prefunds-table';
import { Button } from '@/components/ui/button';
import usePaymentsStore from '@/context/payment-store';
import { useActivePrefunds } from '@/hooks/use-query-data';

const SelectPrefund = ({
  navigateForward,
  workspaceID,
  protocol,
}: {
  navigateForward: () => void;
  workspaceID: string;
  protocol: string;
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));

  const { data: prefunds, isLoading } = useActivePrefunds(workspaceID);
  const walletActivePrefunds = prefunds?.data?.data || [];

  const { paymentAction, updatePaymentFields, error, setError } =
    usePaymentsStore();

  function handleProceed() {
    setError({ status: false, message: '' });

    if (paymentAction?.prefund_id !== '' || selectedKeys.size !== 0) {
      const prefund = walletActivePrefunds.find(
        (prefund: any) => prefund.ID === paymentAction?.prefund_id,
      );

      if (prefund.isLocked) {
        setError({ status: true, message: 'This prefund is locked!' });
        addToast({
          title: 'Error',
          color: 'danger',
          description: 'This prefund is locked!',
        });
        return;
      }

      if (prefund) {
        updatePaymentFields({ prefund, protocol });
        navigateForward();
      }

      return;
    }

    setError({ status: true, message: 'You need to select a prefund!' });
    addToast({
      title: 'Error',
      color: 'danger',
      description: 'You need to select a prefund!',
    });
  }

  useEffect(() => {
    updatePaymentFields({ prefund_id: selectedKeys.values().next().value });
  }, [selectedKeys]);

  return (
    <>
      <div className="mt-4 flex h-full w-full flex-col gap-5">
        <PrefundsTable
          removeWrapper
          emptyDescriptionText={
            'You have no active prefunds available at this moment'
          }
          emptyTitleText={'Unavailable Prefunds'}
          isLoading={isLoading}
          rows={walletActivePrefunds}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
        {error?.status && (
          <Alert
            classNames={{
              base: 'items-center',
            }}
            color="danger"
          >
            {error.message}
          </Alert>
        )}

        <div className="mt-auto flex w-full items-end justify-end gap-4">
          <Button
            isDisabled={isLoading || selectedKeys.size === 0}
            onClick={handleProceed}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
};

export default SelectPrefund;
