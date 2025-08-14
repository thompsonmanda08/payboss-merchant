'use client';

import { useDisclosure } from '@heroui/react';
import { useState } from 'react';

import OverlayLoader from '@/components/ui/overlay-loader';
import usePaymentsStore from '@/context/payment-store';

import BatchDetailsPage from './components/batch-details-view';
import SelectPaymentType from './components/payment-protocol-selection';

export default function PaymentWidgets({
  workspaceID,
}: {
  workspaceID: string;
}) {
  const { onClose } = useDisclosure();
  const { openPaymentsModal, openBatchDetailsModal } = usePaymentsStore();
  const [createPaymentLoading, setCreatePaymentLoading] = useState(false);

  return (
    <>
      {createPaymentLoading && <OverlayLoader show={createPaymentLoading} />}

      {openPaymentsModal && (
        <SelectPaymentType
          // protocol={"direct"}
          setCreatePaymentLoading={setCreatePaymentLoading}
        />
      )}

      {openBatchDetailsModal && (
        <BatchDetailsPage
          isOpen={openBatchDetailsModal}
          protocol={'direct'}
          onClose={onClose}
        />
      )}

      {/************************************************************************/}
    </>
  );
}
