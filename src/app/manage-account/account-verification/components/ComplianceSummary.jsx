"use client";
import React from "react"; // Removed useState as tabs are removed
import { Button } from "@/components/ui/button";
import CardHeader from "@/components/base/card-header";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

// Dummy data - this should come from props or a state management solution
// reflecting the actual completion status of each verification section.
// Added 'description' for context, and confirmed 'link' matches sidebar 'id'
const allSections = [
  {
    id: "business",
    name: "Business Profile",
    status: "incomplete",
    link: "business",
    description: "Provide your business details.",
  },
  {
    id: "bankAccount",
    name: "Bank Account Details",
    status: "complete",
    link: "bankAccount",
    description: "Your business bank account for transactions.",
  },
  {
    id: "contactPerson",
    name: "Contact Person",
    status: "incomplete",
    link: "contactPerson",
    description: "Information about business's contact person.",
  },
  {
    id: "documents",
    name: "Documents",
    status: "complete",
    link: "documents",
    description: "Upload and verify required documents.",
  },
  {
    id: "contract",
    name: "Contract & Agreement",
    status: "pending",
    link: "contract",
    description: "Review and accept the terms and conditions.",
  }, // Assuming pending maps to incomplete for display
];

// Helper to determine badge class based on status
const getStatusBadgeClass = (status) => {
  switch (status) {
    case "complete":
      return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100";
    case "incomplete":
    case "pending": // Treat pending as incomplete for badge color
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-600 dark:text-yellow-100"; // Warm yellow
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100";
  }
};

function ComplianceSummary({ navigateToSection }) {
  const handleNavigate = (sectionLink) => {
    if (navigateToSection && sectionLink) {
      navigateToSection(sectionLink);
    } else {
      console.warn(
        "Navigation unavailable or sectionLink missing for:",
        sectionLink
      );
    }
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
        {allSections.map((section) => (
          <div
            key={section.id}
            className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800"
          >
            <div className="flex-grow">
              <span className="text-base font-medium text-gray-800 dark:text-gray-100">
                {section.name}
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {section.description}
              </p>
            </div>
            <div className="flex items-center ml-4">
              <span
                className={`px-3 py-1 mr-4 text-xs font-semibold rounded-full 
                            ${getStatusBadgeClass(section.status)}`}
              >
                {section.status === "complete" ? "Complete" : "Incomplete"}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleNavigate(section.link)}
                // Using blue for hover/focus states for the View button to align with primary color theme
                className="text-blue-600 border-blue-600 hover:bg-blue-50 focus:ring-blue-500 dark:text-blue-400 dark:border-blue-500 dark:hover:bg-gray-700 dark:focus:ring-blue-600"
              >
                View <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
        {allSections.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            No compliance sections to display.
          </p>
        )}
      </div>
    </div>
  );
}

export default ComplianceSummary;
