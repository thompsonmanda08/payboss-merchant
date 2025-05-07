"use client";
import { useEffect, useState } from "react";
import { Modal, ModalContent, ModalBody, ModalHeader } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import ValidationDetails from "@/app/dashboard/[workspaceID]/payments/components/validation-details-step";
import ApproverAction from "@/app/dashboard/[workspaceID]/payments/components/approver-action";
import RecordDetailsViewer from "@/app/dashboard/[workspaceID]/payments/components/batch-records-viewer";
import usePaymentsStore from "@/context/payment-store";
import CardHeader from "@/components/base/card-header";
import Tabs from "@/components/tabs";

export const BATCH_DETAILS_STEPS = [
  {
    title: "Bulk payment - File Record Validation",
    infoText: "Provide details for the payment action batch files",
    step: "Validation",
  },
  {
    title: "Bulk payment - Approval Status",
    infoText: "You need to be an administrator to approve bulk payments",
    step: "Approval",
  },
];

export default function BatchDetailsPage({ isOpen, onClose, protocol }) {
  const [currentStep, setCurrentStep] = useState(BATCH_DETAILS_STEPS[0]);
  const queryClient = useQueryClient();

  // ** INITIALIZEs PAYMENT STATE **//
  const {
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    selectedProtocol,
    setSelectedProtocol,
    selectedBatch,
    setSelectedBatch,
    setOpenBatchDetailsModal,
  } = usePaymentsStore();

  const batchID = selectedBatch?.ID;

  const COMPONENT_LIST_RENDERER = [
    <ValidationDetails
      key={"step-4"}
      batchID={batchID}
      navigateForward={goForward}
    />,
    <ApproverAction key={"step-5"} batchID={batchID} />,
  ];

  const TABS = [
    {
      name: "Batch Details",
      index: 0,
    },
    {
      name: "Approval Status",
      index: 1,
    },
  ];

  const {
    activeTab,
    currentTabIndex,
    navigateTo,
    navigateForward,
    navigateBackwards,
  } = useCustomTabsHook(COMPONENT_LIST_RENDERER);

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
        selectedBatch.status?.toLowerCase() != "submitted"
          ? COMPONENT_LIST_RENDERER.length - 1
          : currentTabIndex
      ]
    );
  }, [currentTabIndex]);

  useEffect(() => {
    if (selectedBatch.status?.toLowerCase() != "submitted") {
      navigateTo(COMPONENT_LIST_RENDERER.length - 1);
    }
  }, []);

  useEffect(() => {
    if (protocol) {
      setSelectedProtocol(protocol);
    }

    return () => {
      queryClient.invalidateQueries();
    };
  }, [protocol]);

  return (
    <>
      {/* *************** IF TOP_OVER RENDERING IS REQUIRED *******************/}
      {(openAllRecordsModal ||
        openValidRecordsModal ||
        openInvalidRecordsModal) && <RecordDetailsViewer batchID={batchID} />}
      {/*********************************************************************** */}
      {/************************* COMPONENT RENDERER *************************/}
      <Modal
        isDismissable={false}
        isOpen={isOpen}
        size={"5xl"}
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
                      selectedProtocol && selectedBatch && (
                        <span className="capitalize">
                          {" "}
                          ({selectedProtocol} - {selectedBatch?.batch_name}){" "}
                        </span>
                      ) //ONLY FOR THE CREATE PAYMENTS PAGE
                    }
                  </>
                }
              />
              <Tabs
                className={"mr-8 w-fit"}
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
