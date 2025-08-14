'use client';
import { Skeleton } from '@heroui/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import ApproverAction from '@/app/dashboard/[workspaceID]/payments/components/approver-action';
import RecordDetailsViewer from '@/app/dashboard/[workspaceID]/payments/components/batch-records-viewer';
import PaymentDetails from '@/app/dashboard/[workspaceID]/payments/components/bulk-payment-batch-details';
import SelectPrefund from '@/app/dashboard/[workspaceID]/payments/components/select-prefund-step';
import UploadCSVFile from '@/app/dashboard/[workspaceID]/payments/components/upload-batch-file-step';
import ValidationDetails from '@/app/dashboard/[workspaceID]/payments/components/validation-details-step';
import CardHeader from '@/components/base/card-header';
import Card from '@/components/base/custom-card';
import ProgressStep from '@/components/elements/progress-step';
import usePaymentsStore from '@/context/payment-store';
import useCustomTabsHook from '@/hooks/use-custom-tabs';

export const STEPS = [
  {
    title: 'Create a Bulk payment - Select Prefund',
    infoText: 'Choose a prefund balance to use for the disbursement action',
    step: 'Wallet',
  },
  {
    title: 'Create a Bulk payment - Upload Batch File',
    infoText: 'Upload a file with records of the recipient in `.csv` format',
    step: 'Batch',
  },
  {
    title: 'Create a Bulk payment - Batch Details',
    infoText: 'Provide details for the payment action batch files',
    step: 'Details',
  },
  {
    title: 'Create a payment - File Record Validation',
    infoText:
      'The validation will make sure all record entries do not cause internal errors',
    step: 'Validation',
  },
  {
    title: 'Create a payment - Approval Status',
    infoText: 'Approvals can only be done by account admins',
    step: 'Approval',
  },
];

export default function BulkPaymentForm({
  workspaceID,
  protocol,
}: {
  workspaceID: string;
  protocol: string;
}) {
  const router = useRouter();

  // ** INITIALIZEs PAYMENT STATE **//
  const {
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    setLoading,
    paymentAction,
    setPaymentAction,
    setError,
    selectedBatch,
  } = usePaymentsStore();

  //************ STEPS TO CREATE A BULK PAYMENT ACTION *****************/
  const {
    activeTab,
    currentTabIndex,
    navigateForward,
    navigateBackwards,
    navigateTo,
  } = useCustomTabsHook([
    <SelectPrefund
      key={'step-1'}
      // navigateBackwards={goBack}
      navigateForward={goForward}
      protocol={protocol}
      workspaceID={workspaceID}
    />,
    <UploadCSVFile
      key={'step-2'}
      handleCancel={handleCancel}
      // navigateBackwards={goBack}
      navigateForward={goForward}
      protocol={protocol}
    />,
    <PaymentDetails
      key={'step-3'}
      navigateBackwards={goBack}
      navigateForward={goForward}
      protocol={protocol}
      workspaceID={workspaceID}
    />,
    <ValidationDetails
      key={'step-4'}
      batch={selectedBatch}
      navigateForward={goForward}
      workspaceID={workspaceID}
    />,
    <ApproverAction
      key={'step-5'}
      batch={selectedBatch}
      workspaceID={workspaceID}
    />,
  ]);

  function goForward() {
    navigateForward();
  }

  function goBack() {
    navigateBackwards();
  }

  function handleCancel() {
    if (currentTabIndex == 0) {
      router.back();
    }

    setPaymentAction({
      type: protocol,
      url: '',
    });
    navigateTo(0);
  }

  useEffect(() => {
    setError({ status: false, message: '' });
    setLoading(false);
  }, [paymentAction, currentTabIndex]);

  return !workspaceID && !protocol ? (
    <div className="w-full mx-auto p-4 space-y-4">
      {/* Short title skeleton */}
      <Skeleton className="h-9 w-1/4" />

      {/* Longer subtitle skeleton */}
      <Skeleton className="h-6 w-3/4" />

      {/* Full width divider */}
      <Skeleton className="h-5 w-full" />

      {/* First content block */}
      <Skeleton className="h-32 w-full" />

      {/* Second content block */}
      <Skeleton className="h-60 w-full" />
      {/* Second content block */}
      <Skeleton className="h-48 w-full" />
      {/* Second content block */}
    </div>
  ) : (
    <>
      <Card className={''}>
        <CardHeader
          handleClose={handleCancel}
          infoText={STEPS[currentTabIndex].infoText}
          title={
            <>
              {STEPS[currentTabIndex].title}
              <span className="capitalize"> ({protocol})</span>
            </>
          }
        />
        <ProgressStep STEPS={STEPS} currentTabIndex={currentTabIndex} />
        {activeTab}
      </Card>

      {/**************** IF TOP_OVER RENDERING IS REQUIRED *******************/}
      {(openAllRecordsModal ||
        openValidRecordsModal ||
        openInvalidRecordsModal) && (
        <RecordDetailsViewer batch={selectedBatch} />
      )}
      {/************************************************************************/}
    </>
  );
}
