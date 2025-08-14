'use client';
import { Modal, ModalContent, ModalBody, ModalHeader } from '@heroui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import ApproverAction from '@/app/dashboard/[workspaceID]/payments/components/approver-action';
import RecordDetailsViewer from '@/app/dashboard/[workspaceID]/payments/components/batch-records-viewer';
import ValidationDetails from '@/app/dashboard/[workspaceID]/payments/components/validation-details-step';
import CardHeader from '@/components/base/card-header';
import Tabs from '@/components/elements/tabs';
import usePaymentsStore from '@/context/payment-store';
import useCustomTabsHook from '@/hooks/use-custom-tabs';
import { useBatchDetails } from '@/hooks/use-query-data';

export const BATCH_DETAILS_STEPS = [
  {
    title: 'Bulk payment - File Record Validation',
    infoText: 'Provide details for the payment action batch files',
    step: 'Validation',
  },
  {
    title: 'Bulk payment - Approval Status',
    infoText: 'You need to be an administrator to approve bulk payments',
    step: 'Approval',
  },
];

const TABS = [
  {
    name: 'Batch Details',
    index: 0,
  },
  {
    name: 'Approval Status',
    index: 1,
  },
];

export default function BatchDetailsPage({
  isOpen,
  onClose,
  protocol,
}: {
  isOpen: boolean;
  onClose: () => void;
  protocol: string;
}) {
  const [currentStep, setCurrentStep] = useState(BATCH_DETAILS_STEPS[0]);
  const queryClient = useQueryClient();
  const params = useParams();
  const workspaceID = String(params.workspaceID);

  // ** INITIALIZEs PAYMENT STATE **//
  const {
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    selectedProtocol,
    selectedBatch,
    setSelectedBatch,
    setOpenBatchDetailsModal,
  } = usePaymentsStore();

  const batchID = selectedBatch?.id;

  const {
    data: batchResponse,
    isSuccess,
    isLoading,
  } = useBatchDetails(batchID);

  const batch = batchResponse?.data;

  // useEffect(() => {
  //   if (isSuccess && batch?.total.length > 0) {
  //     setSelectedBatch({
  //       ...selectedBatch,
  //       ...batch,
  //     });
  //   }
  // }, [isSuccess, batchID]);

  const COMPONENT_LIST_RENDERER = [
    <ValidationDetails
      key={'batch-details'}
      batch={batch}
      navigateForward={goForward}
      workspaceID={workspaceID}
    />,
    <ApproverAction
      key={'approval-status'}
      batch={batch}
      workspaceID={workspaceID}
    />,
  ];

  const { activeTab, currentTabIndex, navigateTo, navigateForward } =
    useCustomTabsHook(COMPONENT_LIST_RENDERER);

  function goForward() {
    navigateForward();
  }
  function handleClose() {
    setOpenBatchDetailsModal(false);
    setSelectedBatch(null);
    onClose();
  }

  useEffect(() => {
    setCurrentStep(
      BATCH_DETAILS_STEPS[
        batch?.status?.toLowerCase() != 'submitted'
          ? COMPONENT_LIST_RENDERER.length - 1
          : currentTabIndex
      ],
    );
  }, [currentTabIndex]);

  useEffect(() => {
    if (batch?.status?.toLowerCase() != 'submitted') {
      navigateTo(COMPONENT_LIST_RENDERER.length - 1);
    }
  }, []);

  // useEffect(() => {
  //   if (protocol) {
  //     setSelectedProtocol(protocol);
  //   }

  //   return () => {
  //     queryClient.invalidateQueries();
  //   };
  // }, [protocol]);

  return (
    <>
      {/* *************** IF TOP_OVER RENDERING IS REQUIRED *******************/}
      {(openAllRecordsModal ||
        openValidRecordsModal ||
        openInvalidRecordsModal) && <RecordDetailsViewer batch={batch} />}
      {/*********************************************************************** */}
      {/************************* COMPONENT RENDERER *************************/}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        size={'5xl'}
        onClose={handleClose}
      >
        <ModalContent>
          <>
            <ModalHeader className="flex gap-1">
              <CardHeader
                infoText={currentStep.infoText}
                title={
                  <>
                    {currentStep.title}
                    {
                      selectedProtocol && batch && (
                        <span className="capitalize">
                          {' '}
                          ({selectedProtocol} - {batch?.batch_name}){' '}
                        </span>
                      ) //ONLY FOR THE CREATE PAYMENTS PAGE
                    }
                  </>
                }
              />
              <Tabs
                className={'mr-8 w-fit'}
                currentTab={currentTabIndex}
                navigateTo={navigateTo}
                tabs={TABS}
              />
            </ModalHeader>

            <ModalBody>{activeTab}</ModalBody>
          </>
        </ModalContent>
      </Modal>
    </>
  );
}
