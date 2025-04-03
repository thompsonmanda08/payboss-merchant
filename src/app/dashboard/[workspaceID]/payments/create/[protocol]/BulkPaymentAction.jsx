"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import usePaymentsStore from "@/context/payment-store";
import UploadCSVFile from "@/app/dashboard/[workspaceID]/payments/components/UploadCSVFile";
import PaymentDetails from "@/app/dashboard/[workspaceID]/payments/components/bulk-payment-batch-details";
import ValidationDetails from "@/app/dashboard/[workspaceID]/payments/components/ValidationDetails";
import RecordDetailsViewer from "@/app/dashboard/[workspaceID]/payments/components/batch-records-viewer";
import ApproverAction from "@/app/dashboard/[workspaceID]/payments/components/approver-action";
import Card from "@/components/base/custom-card";
import CardHeader from "@/components/base/card-header";
import ProgressStep from "@/components/progress-step";
import LoadingPage from "@/app/loading";
import SelectPrefund from "@/app/dashboard/[workspaceID]/payments/components/SelectPrefund";

export const STEPS = [
  {
    title: "Create a Bulk payment - Select Prefund",
    infoText: "Choose a prefund balance to use for the disbursement action",
    step: "Wallet",
  },
  {
    title: "Create a Bulk payment - Upload Batch File",
    infoText: "Upload a file with records of the recipient in `.csv` format",
    step: "Batch",
  },
  {
    title: "Create a Bulk payment - Batch Details",
    infoText: "Provide details for the payment action batch files",
    step: "Details",
  },
  {
    title: "Create a payment - File Record Validation",
    infoText:
      "The validation will make sure all record entries do not cause internal errors",
    step: "Validation",
  },
  {
    title: "Create a payment - Approval Status",
    infoText: "Approvals can only be done by account admins",
    step: "Approval",
  },
];

function BulkPaymentAction({ workspaceID, protocol, activePrefunds }) {
  // ** INITIALIZES STEPS **//
  // const [currentStep, setCurrentStep] = useState(STEPS[0])

  // ** INITIALIZEs PAYMENT STATE **//
  const {
    openAllRecordsModal,
    openValidRecordsModal,
    openInvalidRecordsModal,
    setLoading,
    paymentAction,
    setError,
  } = usePaymentsStore();

  const router = useRouter();

  //************ STEPS TO CREATE A BULK PAYMENT ACTION *****************/
  const { activeTab, currentTabIndex, navigateForward, navigateBackwards } =
    useCustomTabsHook([
      <SelectPrefund
        key={"step-1"}
        navigateBackwards={goBack}
        navigateForward={goForward}
        protocol={protocol}
        walletActivePrefunds={activePrefunds}
        workspaceID={workspaceID}
      />,
      <UploadCSVFile
        key={"step-2"}
        navigateBackwards={goBack}
        navigateForward={goForward}
        protocol={protocol}
      />,
      <PaymentDetails
        key={"step-3"}
        navigateBackwards={goBack}
        navigateForward={goForward}
        protocol={protocol}
        workspaceID={workspaceID}
      />,
      <ValidationDetails
        key={"step-4"}
        navigateBackwards={goBack}
        navigateForward={goForward}
      />,
      <ApproverAction
        key={"step-5"}
        // navigateForward={goForward}
        // navigateBackwards={goBack}
      />,
    ]);

  function goForward() {
    navigateForward();
  }

  function goBack() {
    navigateBackwards();
  }

  useEffect(() => {
    setError({ status: false, message: "" });
    setLoading(false);
  }, [paymentAction, currentTabIndex]);

  //**************** USER ROLE CHECK *************************************** //
  // if (!role?.can_initiate) return router.back()

  return !workspaceID && !protocol ? (
    <LoadingPage />
  ) : (
    <>
      <Card className={""}>
        <CardHeader
          handleClose={() => router.back()}
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
        openInvalidRecordsModal) && <RecordDetailsViewer />}
      {/************************************************************************/}
    </>
  );
}

export default BulkPaymentAction;
