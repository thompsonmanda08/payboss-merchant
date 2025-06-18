"use client";
import { useState } from "react";
import { Checkbox, Tooltip, addToast } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { uploadBusinessFile } from "@/app/_actions/pocketbase-actions";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  deleteBusinessDocumentRefs,
  sendBusinessDocumentRefs,
  updateBusinessDocumentRefs,
} from "@/app/_actions/auth-actions";
import CardHeader from "@/components/base/card-header";
import StatusMessage from "@/components/base/status-message";
import EmptyLogs from "@/components/base/empty-logs";
import UploadField from "@/components/base/file-dropzone";
import Modal from "@/components/modals/custom-modal";
import DocumentDisplayButton from "@/components/base/document-display-button";
import PromptModal from "@/components/modals/prompt-modal";
import { QUERY_KEYS } from "@/lib/constants";
import { InfoIcon } from "lucide-react";

const ALL_DOCUMENT_CONFIGS = [
  {
    id: "CERTIFICATE_INC",
    label: "Business Incorporation Certificate",
    backendKey: "cert_of_incorporation_url",
    required: true,
    tooltip:
      "Upload a copy of the company's Business Incorporation Certificate.",
  },
  {
    id: "ARTICLES_ASSOCIATION",
    label: "Articles of Association (Stamped)",
    backendKey: "articles_of_association_url",
    required: true,
    tooltip: "Upload a stamped copy of the company's Articles of Association.",
  },
  {
    id: "SHAREHOLDER_AGREEMENT",
    label: "Shareholders Agreement",
    backendKey: "share_holder_url",
    required: true,
    tooltip: "Upload a copy of the company's Shareholders Agreement.",
  },

  {
    id: "DIRECTOR_NRC",
    label: "Directors' National IDS (Certified)",
    backendKey: "director_nrc_url",
    required: true,
    tooltip:
      "Upload a certified copies of all the company Directors' National IDs",
  },

  {
    id: "TAX_CLEARANCE",
    label: "Clearance Certificate",
    backendKey: "tax_clearance_certificate_url",
    required: true,
    tooltip:
      "Tax Clearance Certificate must be a ZRA issued document with the TPIN and the company's name.",
  },
  {
    id: "COMPANY_PROFILE",
    label: "Copy of Company Profile",
    backendKey: "company_profile_url",
    required: true,
    tooltip:
      "Company Profile could be a any document that shows the company's name, address, and contact information. It should also include the company's logo and other relevant information on the nature of business of the company.",
  },
  {
    id: "COMPANY_STRUCTURE",
    label: "Company Structure",
    backendKey: "organisation_structure_url",
    required: true,
    tooltip:
      "Company Structure could be a any document that shows the company's leadership structure and their responsibilities.",
  },
  {
    id: "PROOF_OF_ADDRESS",
    label: "Proof of Address",
    backendKey: "proof_of_address_url",
    required: true,
    tooltip:
      "Proof of Address must be a certified document, utility bill, lease agreement, or bank statement with the company's name and address. The document must be no more than 3 months old.",
  },
  {
    id: "BANK_STATEMENT",
    label: "Copy of Bank Statement",
    backendKey: "bank_statement_url",
    required: true,
    tooltip:
      "Bank Statement document must be no more than 3 months old with all bank details clearly visible.",
  },
  {
    id: "PROFESSIONAL_LICENSE",
    label: "Professional License",
    backendKey: "professional_license_url",
    required: false,
    tooltip:
      "(Optional) A professional license is required for certain businesses. Please provide a copy of the professional license if applicable.",
  },
];

// BUSINESS DOCUMENTS AND ATTACHMENTS
export default function DocumentAttachments({
  merchantID,
  documents,
  refDocsExist,
  onCompletionNavigateTo,
  allowUserToSubmitKYC,
}) {
  const queryClient = useQueryClient();

  const [docFiles, setDocFiles] = useState({});
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldLoadingStates, setFieldLoadingStates] = useState({});
  const [error, setError] = useState({ status: false, message: null });
  const [isViewerModalOpen, setViewerModalOpen] = useState(false);
  const [currentDocInModal, setCurrentDocInModal] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeletePromptOpen, setDeletePromptOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);

  function updateDocs(fields) {
    setDocFiles({ ...docFiles, ...fields });
  }

  async function submitKYCDocuments() {
    setIsSubmitting(true);
    setError({ message: "", status: "" });

    const documentUrls = {};

    ALL_DOCUMENT_CONFIGS.forEach((docConfig) => {
      documentUrls[docConfig.backendKey] =
        docFiles[docConfig.id]?.file_url || documents?.[docConfig.backendKey];
    });

    if (!agreed) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Checkbox is unmarked",
      });
      setError({
        message: "Checkbox is unmarked. Agree to the statement below.",
        status: true,
      });
      setIsSubmitting(false);

      return;
    }

    let requiredDocsProvided = true;

    for (const docConfig of ALL_DOCUMENT_CONFIGS) {
      if (
        docConfig.required &&
        !docFiles[docConfig.id]?.file_url &&
        !documents?.[docConfig.backendKey]
      ) {
        requiredDocsProvided = false;
        break;
      }
    }

    if (!requiredDocsProvided && agreed) {
      addToast({
        title: "Error",
        color: "danger",
        description: "Provide all required files!",
      });
      setError({
        message: "Provide all required files!",
        status: true,
      });
      setIsSubmitting(false);

      return;
    }

    // SAVE FILES TO PAYBOSS BACKEND
    let response;

    if (refDocsExist) {
      response = await updateBusinessDocumentRefs(documentUrls);

      if (response?.success) {
        addToast({
          title: "Success",
          color: "success",
          description: "Documents updated successfully!",
        });
        queryClient.invalidateQueries({ queryKey: ["KYC"] });
        queryClient.invalidateQueries({ queryKey: ["uploaded-docs"] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETUP] });
        setIsSubmitting(false);

        if (isCompleteDocumentUploads(documents)) {
          onCompletionNavigateTo();
        }

        return;
      }
    } else {
      response = await sendBusinessDocumentRefs(documentUrls);

      if (response?.success) {
        addToast({
          title: "Success",
          color: "success",
          description: "Documents submitted successfully!",
        });
        queryClient.invalidateQueries({ queryKey: ["KYC"] });
        queryClient.invalidateQueries({ queryKey: ["uploaded-docs"] });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETUP] });
        setIsSubmitting(false);

        if (isCompleteDocumentUploads(documents)) {
          onCompletionNavigateTo();
        }

        return;
      }
    }

    setError({ message: response?.message, status: true });

    const action = refDocsExist ? "update" : "submit";

    addToast({
      title: "Error",
      color: "danger",
      description: `Failed to ${action} documents`,
    });

    setIsSubmitting(false);
  }

  async function handleFileUpload(file, recordID, fieldId) {
    setFieldLoadingStates((prev) => ({ ...prev, [fieldId]: true }));
    setError({ message: "", status: "" });
    let response = await uploadBusinessFile(file, merchantID, recordID);

    if (response?.success) {
      addToast({
        title: "Success",
        color: "success",
        description: response?.message,
      });
      setFieldLoadingStates((prev) => ({ ...prev, [fieldId]: false }));

      return response?.data;
    }

    addToast({
      title: "Error",
      color: "danger",
      description: response?.message,
    });
    setFieldLoadingStates((prev) => ({ ...prev, [fieldId]: false }));
  }

  function handleDeleteRequest(backendKey, name) {
    setDocToDelete({ backendKey, name });
    setDeletePromptOpen(true);
  }

  async function confirmDelete() {
    if (!docToDelete) return;

    setIsDeleting(true);
    setError({ message: "", status: "" });

    // Send and array of keys to Backend to delete the file
    const response = await deleteBusinessDocumentRefs([docToDelete.backendKey]);

    if (response?.success) {
      addToast({
        title: "Success",
        color: "success",
        description: "Document removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["KYC"] });
      queryClient.invalidateQueries({ queryKey: ["uploaded-docs"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETUP] });
    } else {
      addToast({
        title: "Error",
        color: "danger",
        description: response?.message || "Failed to remove document.",
      });
      setError({ message: response?.message, status: true });
    }
    setIsDeleting(false);
    setDeletePromptOpen(false);
    setDocToDelete(null);
  }

  const isCompleteDocumentUploads = (documents) =>
    documents.company_profile_url &&
    documents.cert_of_incorporation_url &&
    documents.share_holder_url &&
    documents.tax_clearance_certificate_url &&
    documents.articles_of_association_url &&
    documents.organisation_structure_url &&
    documents.professional_license_url &&
    documents.director_nrc_url &&
    documents.proof_of_address_url &&
    documents.bank_statement_url;

  return allowUserToSubmitKYC ? (
    <div className="w-full flex flex-1 flex-col gap-4">
      <CardHeader
        className={"py-0 mb-6"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
        infoText={
          "Documents that prove your company registrations and compliance with regulatory bodies."
        }
        title="Business Documents and Attachments"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-x-4 gap-y-1 w-full ">
        {ALL_DOCUMENT_CONFIGS.map((docConfig) => {
          const displayUrl = documents?.[docConfig.backendKey];

          const displayName = docConfig.label;

          if (displayUrl) {
            return (
              <DocumentDisplayButton
                key={docConfig.id + "-display"}
                buttonKey={docConfig.id + "-btn"}
                documentName={displayName}
                documentUrl={displayUrl}
                onOpenModal={() => {
                  setCurrentDocInModal({
                    name: displayName,
                    url: displayUrl,
                  });
                  setViewerModalOpen(true);
                }}
                allowDelete={allowUserToSubmitKYC}
                onDelete={() =>
                  handleDeleteRequest(docConfig.backendKey, docConfig.label)
                }
              />
            );
          }
          return (
            <div key={docConfig.id + "-upload-field"} className="relative">
              <UploadField
                key={docConfig.id + "-upload"}
                required={docConfig.required}
                handleFile={async (file) =>
                  updateDocs({
                    [docConfig.id]: await handleFileUpload(
                      file,
                      docFiles[docConfig.id]?.file_record_id,
                      docConfig.id,
                    ),
                  })
                }
                isLoading={fieldLoadingStates[docConfig.id] || false}
                label={docConfig.label}
              />
              <Tooltip content={docConfig.tooltip} placement="top" className="">
                <InfoIcon
                  className={cn(
                    "w-5 h-5 text-gray-300 dark:text-gray-600 hover:text-secondary absolute top-8 right-2 focus:outline-none transition-all duration-300 ease-in-out",
                    {
                      "right-8": docFiles[docConfig.id]?.file_url,
                    },
                  )}
                />
              </Tooltip>
            </div>
          );
        })}
      </div>
      {error.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}

      {/* IF THE DOCUMENTS OBJECT HAS LESS THAN 10 ENTRIES, SHOW THE SUBMIT DOCUMENTS BUTTON */}
      {!isCompleteDocumentUploads(documents) && (
        <div className="mt-4 flex w-full flex-col  lg:flex-row justify-between items-start gap-4">
          <Checkbox
            size="lg"
            color="primary"
            className="flex items-start "
            classNames={{
              label: "flex flex-col items-start -mt-1",
            }}
            isSelected={agreed}
            onValueChange={setAgreed}
          >
            <span className="max-w-xl lg:max-w-3xl text-xs font-medium text-slate-500 md:text-sm">
              Yes, I confirm that the details provided accurately represent my
              business. I understand that any misrepresentation of my business
              may result in the rejection of my application.
            </span>
          </Checkbox>

          <Button
            isDisabled={!agreed || isSubmitting}
            isLoading={isSubmitting}
            loadingText={"Submitting..."}
            onPress={submitKYCDocuments}
            className="w-full lg:w-auto"
          >
            Submit Documents
          </Button>
        </div>
      )}

      {isCompleteDocumentUploads(documents) && (
        <div className="mt-4 flex w-full justify-end items-start gap-4">
          <Button
            className={"justify-end ml-auto"}
            onPress={() =>
              onCompletionNavigateTo(
                allowUserToSubmitKYC ? "summary" : "contract",
              )
            }
          >
            Next Section
          </Button>
        </div>
      )}

      <Modal
        removeCallToAction
        cancelText="Close"
        infoText="Ensure the document aligns with the submitted details"
        isDismissible={true}
        show={isViewerModalOpen}
        title={currentDocInModal?.name}
        width={1200}
        onClose={() => {
          setViewerModalOpen(false);
          setCurrentDocInModal(null);
        }}
      >
        {currentDocInModal?.url && (
          <iframe
            className="min-h-[60vh] w-full py-4"
            src={currentDocInModal?.url}
            style={{ border: "none" }}
            title={currentDocInModal?.name}
          />
        )}
      </Modal>

      <PromptModal
        isOpen={isDeletePromptOpen}
        onClose={() => setDeletePromptOpen(false)}
        onConfirm={confirmDelete}
        title={`Delete ${docToDelete?.name}?`}
        confirmText="Delete"
        isLoading={isDeleting}
        className={"max-w-md"}
      >
        <p className="-mt-2 text-xs text-foreground/85 lg:text-sm">
          Are you sure you want to delete this document.
          <span className="font-semibold text-red-700">
            This action cannot be undone ?
          </span>
        </p>
      </PromptModal>
    </div>
  ) : (
    <div className="flex aspect-square max-h-[500px] w-full flex-1 items-center rounded-lg  text-sm font-semibold text-slate-600">
      <EmptyLogs
        className={"my-auto"}
        subTitle={
          "Only the admin or account owner can submit company documentation."
        }
        title={"Oops! Looks like your are not an Admin"}
      />
    </div>
  );
}
