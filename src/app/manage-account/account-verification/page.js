"use client";
import { useEffect, useState } from "react";
import {
  DocumentIcon,
  BuildingOffice2Icon,
  CreditCardIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/solid";
import { PencilIcon } from "@heroicons/react/20/solid";
import {
  CheckBadgeIcon,
  DocumentCheckIcon,
  FlagIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import useConfigOptions from "@/hooks/useConfigOptions";
import useAccountProfile from "@/hooks/useProfileDetails";
import { cn } from "@/lib/utils";
import useKYCInfo from "@/hooks/useKYCInfo";

import DocumentAttachments from "./components/kyc-document-attachments";
import BusinessInformationForm from "./components/BusinessInformationForm";
import BankAccountForm from "./components/BankAccountForm";
import ComplianceSummary from "./components/ComplianceSummary";
import ContactPersonProfile from "./components/ContactPersonProfile";
import TermsAndAgreement from "./components/TermsAndAgreement";
import ProgressStageTracker from "./components/account-verification-tracker";
import AccountVerificationLoading from "./loading";

const SIDEBAR_ITEMS = [
  {
    name: "KYC Stages",
    id: "start",
    status: "inProgress",
    Icon: FlagIcon,
  },
  {
    name: "Business Details",
    id: "business",
    status: "pending",
    Icon: BuildingOffice2Icon,
  },
  {
    name: "Bank Account",
    id: "bankAccount",
    status: "pending",
    Icon: CreditCardIcon,
  },
  {
    name: "Contact Person",
    id: "contactPerson",
    status: "pending",
    Icon: UserGroupIcon,
  },
  { name: "Documents", id: "documents", status: "pending", Icon: DocumentIcon },
  {
    name: "Contract & Agreement",
    id: "contract",
    status: "pending",
    Icon: DocumentCheckIcon,
  },
  {
    name: "Summary",
    id: "summary",
    status: "pending",
    Icon: ClipboardDocumentCheckIcon,
  },
];

function AccountVerification({}) {
  const { user, isOwner, isAccountAdmin } = useAccountProfile();

  const {
    companyTypes,
    banks,
    currencies,
    provinces,
    isLoading: loadingConfigOptions,
  } = useConfigOptions();

  const {
    KYCStageID,
    merchantID,
    documents,
    refDocsExist,
    businessDetails,
    isLoading: loadingKYCInfo,
  } = useKYCInfo();

  const [sections, setSections] = useState(SIDEBAR_ITEMS);

  const [activeSection, setActiveSection] = useState(
    SIDEBAR_ITEMS.find((item) => item.status === "inProgress")?.id ||
      SIDEBAR_ITEMS[0].id
  );

  const navigateToSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  function updateSectionStatus(sectionId, status) {
    const updatedSections = sections.map((section) => {
      if (section.id === sectionId) {
        return { ...section, status };
      }

      return section;
    });

    return updatedSections;
  }

  // UPDATE SECTION STATUS BASED ON THE KYC STAGE ID AND BUSINESS DETAILS
  useEffect(() => {
    setSections((currentSections) => {
      let hasChanged = false;
      let newSections = [...currentSections];

      const updateStatus = (sectionId, status) => {
        const sectionIndex = newSections.findIndex((s) => s.id === sectionId);

        if (
          sectionIndex !== -1 &&
          newSections[sectionIndex].status !== status
        ) {
          // Create a new array with the updated section
          newSections = [
            ...newSections.slice(0, sectionIndex),
            { ...newSections[sectionIndex], status },
            ...newSections.slice(sectionIndex + 1),
          ];
          hasChanged = true;
        }
      };

      if (KYCStageID > 2) {
        updateStatus("start", "completed");
      }

      // IF ALL BUSINESS DETAILS FIELDS ARE PROVIDED IN THE BUSINESS DETAILS OBJECT
      if (
        // BUSINESS PROFILE FIELDS
        businessDetails.name &&
        businessDetails.companytypeID &&
        businessDetails.tpin &&
        businessDetails.date_of_incorporation &&
        // CONTACT INFORMATION FIELDS
        businessDetails.contact &&
        businessDetails.company_email &&
        businessDetails.website &&
        // BUSINESS ADDRESS FIELDS
        businessDetails.cityID &&
        businessDetails.provinceID &&
        businessDetails.physical_address
      ) {
        updateStatus("business", "completed");
      }

      // IF ALL BANK ACCOUNT FIELDS ARE PROVIDED IN THE BUSINESS DETAILS OBJECT
      if (
        businessDetails.bankID &&
        businessDetails.branch_name &&
        businessDetails.account_name &&
        businessDetails.account_number &&
        businessDetails.currencyID
      ) {
        updateStatus("bankAccount", "completed");
      }

      // IF DOCUMENTS OBJECT HAS BEEN UPDATED AND HAS ALL ENTRY KEYS
      if (
        documents.company_profile_url &&
        documents.cert_of_incorporation_url &&
        documents.share_holder_url &&
        documents.tax_clearance_certificate_url &&
        documents.articles_of_association_url &&
        documents.organisation_structure_url &&
        documents.director_nrc_url &&
        documents.proof_of_address_url &&
        documents.bank_statement_url
      ) {
        updateStatus("documents", "completed");
      }

      return hasChanged ? newSections : currentSections;
    });
    // IF THE BUSINESS DETAILS / DOCUMENTS / KYC STATE HAS BEEN UPDATED, UPDATE THE SECTIONS STATE WITH THE UPDATED SECTIONS
  }, [KYCStageID, businessDetails, documents]);

  // console.log("BIZNESS", businessDetails);

  const renderActiveComponent = () => {
    switch (activeSection) {
      case "start":
        return (
          <ProgressStageTracker
            onCompletionNavigateTo={() =>
              navigateToSection(
                sections.find((s) => s.status === "pending")?.id || "business"
              )
            }
          />
        );
      case "business":
        return (
          <BusinessInformationForm
            businessDetails={businessDetails}
            companyTypes={companyTypes}
            provinces={provinces}
            user={user}
            onCompletionNavigateTo={(targetSectionId) =>
              navigateToSection(targetSectionId || "bankAccount")
            }
          />
        );
      case "bankAccount":
        return (
          <BankAccountForm
            banks={banks}
            businessDetails={businessDetails}
            currencies={currencies}
            onCompletionNavigateTo={(targetSectionId) =>
              navigateToSection(targetSectionId || "contactPerson")
            }
          />
        );
      case "contactPerson":
        return (
          <ContactPersonProfile
            onCompletionNavigateTo={(targetSectionId) =>
              navigateToSection(targetSectionId || "documents")
            }
          />
        );

      case "documents":
        return (
          <div className="w-full lg:px-8 mx-auto p-2">
            <DocumentAttachments
              key={"documents"}
              allowUserToSubmitKYC={isOwner || isAccountAdmin}
              documents={documents}
              merchantID={merchantID}
              refDocsExist={refDocsExist}
              onCompletionNavigateTo={(targetSectionId) =>
                navigateToSection(targetSectionId || "contract")
              }
            />
          </div>
        );
      case "contract":
        return (
          <TermsAndAgreement
            onCompletionNavigateTo={(targetSectionId) =>
              navigateToSection(targetSectionId || "summary")
            }
          />
        );
      case "summary":
        return <ComplianceSummary navigateToSection={navigateToSection} />;
      default:
        return (
          <ProgressStageTracker
            onCompletionNavigateTo={(targetSectionId) =>
              navigateToSection(targetSectionId || "business")
            }
          />
        );
    }
  };

  if (loadingConfigOptions || loadingKYCInfo) {
    return <AccountVerificationLoading />;
  }

  return (
    <div className="flex w-full flex-col">
      <section
        className="flex w-full flex-col mb-6 px-4 md:px-0"
        role="account-verification-header"
      >
        <h2 className="heading-3 !font-bold tracking-tight text-foreground ">
          Account Verification
        </h2>
        <p className="text-sm text-foreground-600">
          Complete all sections to get your account activated.
        </p>
      </section>

      <div className="flex w-full flex-col md:flex-row gap-y-6 md:gap-x-8 px-4 md:px-0">
        <aside className="w-full md:w-72 md:pr-4">
          <nav aria-label="Vertical stepper">
            <ol className="space-y-0" role="list">
              {sections.map((item, index) => {
                const isActive = activeSection === item.id;
                const isCompleted = item.status === "completed";

                return (
                  <li key={item.id} className="relative flex flex-col pb-0">
                    {/* Line between steps */}
                    {index !== SIDEBAR_ITEMS.length - 1 && (
                      <div
                        aria-hidden="true"
                        className={cn(
                          "absolute left-[32px] top-8 -ml-px mt-0.5 h-full w-0.5 bg-primary-300 dark:bg-primary-600",
                          {
                            "bg-primary-600 dark:bg-primary-400": isCompleted,
                          }
                        )}
                      />
                    )}

                    {/* Step button */}
                    <button
                      aria-current={isActive ? "step" : undefined}
                      className={cn(
                        "group relative flex w-full items-start py-3 my-2 sm:my-3 lg:my-4 xl:my-5 rounded-md transition-colors focus:outline-none",
                        {
                          "bg-blue-50 dark:bg-gray-800": isActive,
                          "hover:bg-gray-50 dark:hover:bg-gray-800": !isActive,
                        }
                      )}
                      onClick={() => setActiveSection(item.id)}
                    >
                      <span className="flex items-center mx-4">
                        <span
                          className={cn(
                            "relative z-10 flex aspect-square w-9 items-center justify-center transition-all duration-300 rounded-full bg-primary-100 dark:bg-gray-700 group-hover:bg-primary-400 dark:group-hover:bg-primary-600",
                            {
                              "bg-primary-600 dark:bg-primary-400 text-white":
                                isActive || isCompleted,
                            }
                          )}
                        >
                          {isCompleted ? (
                            <CheckBadgeIcon className="h-5 w-5 text-white" />
                          ) : isActive ? (
                            <PencilIcon className="h-4 w-4 text-white" />
                          ) : (
                            <item.Icon className="h-4 w-4 text-primary-500 group-hover:text-white dark:group-hover:text-white" />
                          )}
                        </span>
                      </span>
                      <span className="flex flex-col items-start">
                        <span
                          className={cn(
                            "text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200",
                            {
                              "text-primary-700 dark:text-primary-300":
                                isActive || isCompleted,
                            }
                          )}
                        >
                          {item.name}
                        </span>
                        <span
                          className={cn(
                            "text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400",
                            {
                              "text-primary-500 dark:text-primary-400":
                                isActive || isCompleted,
                            }
                          )}
                        >
                          {isCompleted
                            ? "Completed"
                            : isActive
                              ? "In Progress"
                              : "Pending"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          </nav>
        </aside>

        <section
          className="flex-1 w-full min-h-[calc(100vh-10rem)] md:mt-0 mt-4"
          role="account-verification-content"
        >
          {renderActiveComponent()}
        </section>
      </div>
    </div>
  );
}

export default AccountVerification;
