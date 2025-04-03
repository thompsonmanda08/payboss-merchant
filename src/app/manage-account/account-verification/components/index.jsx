"use client";
import { useEffect } from "react";

import useCustomTabsHook from "@/hooks/useCustomTabsHook";
import useConfigOptions from "@/hooks/useConfigOptions";
import useAccountProfile from "@/hooks/useProfileDetails";
import DocumentsViewer from "@/components/base/document-viewer";
import Tabs from "@/components/tabs";

import ProgressStageTracker from "./account-verification-tracker";
import BusinessAccountDetails from "./business-account-details";
import DocumentAttachments from "./kyc-document-attachments";

function AccountVerification({ session }) {
  const {
    user,
    businessDetails,
    businessDocs,
    signedContractDoc,
    allowUserToSubmitKYC,
    KYCStageID,
    KYCApprovalStatus,
  } = useAccountProfile();
  const { companyTypes, banks, currencies } = useConfigOptions();

  // ************* TABS RENDERER ************** //
  const TABS = [
    { name: "Verification Status", href: "#", index: 0 },
    { name: "Business Details", href: "#", index: 1 },
    { name: "Documentation", href: "#", index: 2 },
  ];

  const DOCUMENT_COMPONENTS = allowUserToSubmitKYC ? (
    <DocumentAttachments
      key={"documents"}
      businessDocs={businessDocs}
      navigateToPage={navigateToPage}
    />
  ) : (
    <DocumentsViewer
      key={"documents"}
      contractDocument={signedContractDoc}
      documents={businessDocs}
      navigateToPage={navigateToPage}
    />
  );

  const RENDER_COMPONENTS = [
    <ProgressStageTracker key={"verification-status"} />,
    <BusinessAccountDetails
      key={"business-details"}
      banks={banks}
      businessDetails={businessDetails}
      companyTypes={companyTypes}
      currencies={currencies}
      navigateToPage={navigateToPage}
      user={user}
    />,
    DOCUMENT_COMPONENTS,
  ];

  // ************* COMPONENT RENDERER ************** //
  const { activeTab, navigateTo, currentTabIndex } =
    useCustomTabsHook(RENDER_COMPONENTS);

  function navigateToPage(index) {
    navigateTo(index);
  }

  useEffect(() => {}, [KYCStageID, KYCApprovalStatus]);

  return (
    <div className="flex w-full flex-col">
      <section
        className="flex w-full flex-col"
        role="account-verification-header"
      >
        <h2 className="heading-3 !font-bold tracking-tight text-foreground ">
          Account Verification
        </h2>
        <p className="text-sm text-foreground-600">
          Initiate your KYC, business details, and document verification process
          from this section
        </p>

        <div className="flex items-center justify-between gap-8">
          <Tabs
            className={"my-4"}
            currentTab={currentTabIndex}
            navigateTo={navigateTo}
            tabs={TABS}
          />
        </div>
        <div className="mb-4" />
      </section>

      <section
        className="grid w-full place-items-center gap-4 "
        role="profile-content"
      >
        {activeTab}
      </section>
    </div>
  );
}

export default AccountVerification;
