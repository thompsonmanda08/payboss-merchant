"use client";
import React, { useState } from "react"; // Removed useState as tabs are removed
import { Button } from "@/components/ui/button";
import CardHeader from "@/components/base/card-header";
import { ArrowRightIcon, CheckBadgeIcon } from "@heroicons/react/24/outline";
import { addToast } from "@heroui/react";
import SoftBoxIcon from "@/components/base/soft-box-icon";
import { useDisclosure } from "@heroui/react";
import PromptModal from "@/components/modals/prompt-modal";
import useKYCInfo from "@/hooks/use-kyc-info";
import { InfoIcon } from "lucide-react";
import { submitKYCForReview } from "@/app/_actions/auth-actions";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/lib/constants";
import { capitalize } from "@/lib/utils";

// Helper to determine badge class based on status
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
    case "incomplete":
    case "pending": // Treat pending as incomplete for badge color
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"; // Warm yellow
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};

function ComplianceSummary({
  sections,
  navigateToSection,
}: {
  sections: any[];
  navigateToSection?: (id: string) => void;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { allowUserToSubmitKYC, KYCStage } = useKYCInfo();
  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNavigate = (sectionLink: string) => {
    if (navigateToSection && sectionLink) {
      navigateToSection(sectionLink);
    } else {
      addToast({
        title: capitalize(sectionLink).replace("-", " "),
        description: "Navigation unavailable or sectionLink missing for:",
      });
      console.warn(
        "Navigation unavailable or sectionLink missing for:",
        sectionLink,
      );
    }
  };

  // FILTER OUT "start" and "summary"
  const filteredSections = sections.filter(
    (section) => section.id !== "start" && section.id !== "summary",
  );

  const handleSubmitKYC = async () => {
    setIsSubmitting(true);

    const response = await submitKYCForReview();

    if (response.success) {
      addToast({
        title: "Success",
        color: "success",
        description: "KYC submitted for review",
      });
      queryClient.invalidateQueries({ queryKey: ["KYC"] });
      queryClient.invalidateQueries({ queryKey: ["uploaded-docs"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETUP] });
    } else {
      addToast({
        title: "Error",
        color: "danger",
        description: response.message,
      });
    }

    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="w-full mx-auto p-2 lg:px-8">
      <CardHeader
        title="Compliance Review"
        infoText="Please ensure the information you submitted is accurate. Incomplete information or documents can delay the activation of your business."
        className={"py-0 mb-6"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
      />

      {/* Removed Tab UI */}

      <div className="space-y-4">
        {filteredSections.map((section) => (
          <div
            key={section.id}
            className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800"
          >
            <SoftBoxIcon
              className={
                "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mr-4 p-2 md:p-3"
              }
            >
              <section.Icon />
            </SoftBoxIcon>
            <div className="flex-grow">
              <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-100">
                {section.name}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {section.description}
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center ml-4 ">
              <span
                className={`lg:px-3 lg:py-1 p-1 lg:mr-2 font-semibold rounded-full flex items-center justify-center
                            ${getStatusBadgeClass(section.status)}`}
              >
                {section.status === "completed" ? (
                  <CheckBadgeIcon className="h-4 w-4" />
                ) : (
                  <InfoIcon className="h-4 w-4" />
                )}
                <span className="hidden text-[10px] lg:block ml-1">
                  {section.status === "completed" ? "Completed" : "Incomplete"}
                </span>
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate(section.id)}
                className="text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-gray-700 dark:focus:ring-blue-600"
              >
                <span className="hidden text-[10px] lg:block ml-1">View</span>
                <ArrowRightIcon className="lg:ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}

        {!allowUserToSubmitKYC && KYCStage === "review" && (
          <div className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800">
            <SoftBoxIcon
              className={
                "w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 mr-4 p-2 md:p-3"
              }
            >
              <CheckBadgeIcon />
            </SoftBoxIcon>
            <div className="flex-grow">
              <span className="text-sm md:text-base font-medium text-gray-800 dark:text-gray-100">
                KYC Verification In Progress
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Please wait for the KYC verification to be completed.
              </p>
            </div>
            <div className="flex flex-col lg:flex-row items-center ml-4 ">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNavigate("start")}
                className="text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-gray-700 dark:focus:ring-blue-600"
              >
                <span className="hidden text-[10px] lg:block ml-1">View</span>
                <ArrowRightIcon className="lg:ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {allowUserToSubmitKYC && (
          <div className="flex justify-end">
            <Button
              className="ml-auto"
              onPress={onOpen}
              isDisabled={isSubmitting}
            >
              Submit KYC for Review
            </Button>
          </div>
        )}

        <PromptModal
          isOpen={isOpen}
          // onOpen={onOpen}
          onClose={onClose}
          isLoading={isSubmitting}
          isDisabled={isSubmitting}
          // isLoadingText="Submitting KYC..."
          title="Submit KYC for Review?"
          onConfirm={handleSubmitKYC}
          className="max-w-[500px]"
        >
          <p className="text-sm text-gray-700 dark:text-gray-400 -mt-3">
            Are you sure you want to submit your KYC for review? You will not be
            able to make any changes after submission.
          </p>
        </PromptModal>

        {filteredSections.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No compliance sections to display.
          </p>
        )}
      </div>
    </div>
  );
}

export default ComplianceSummary;
