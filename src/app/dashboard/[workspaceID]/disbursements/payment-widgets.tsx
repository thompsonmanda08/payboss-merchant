'use client';

import { useDisclosure } from '@heroui/react';
import { useState } from 'react';

import OverlayLoader from '@/components/ui/overlay-loader';
import usePaymentsStore from '@/context/payment-store';

import BatchDetailsPage from './_components/batch-details-view';
import SelectPaymentType from './_components/payment-protocol-selection';
import BatchDetailsModal from './_components/batch-details-modal';

export default function PaymentWidgets({
  workspaceID,
}: {
  workspaceID: string;
}) {
  const { openPaymentsModal } = usePaymentsStore();
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

      {/* {openBatchDetailsModal && (
        <BatchDetailsPage
          isOpen={openBatchDetailsModal}
          protocol={'direct'}
          onClose={onClose}
        />
      )} */}
      {/* {<BatchDetailsModal />} */}

      {/************************************************************************/}
    </>
  );
}
