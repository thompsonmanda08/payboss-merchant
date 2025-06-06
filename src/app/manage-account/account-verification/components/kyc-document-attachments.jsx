"use client";
import { useState, useMemo } from "react";
import { Checkbox } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import { uploadBusinessFile } from "@/app/_actions/pocketbase-actions";
import { notify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAccountProfile from "@/hooks/useProfileDetails";
import {
  deleteBusinessDocumentRefs,
  sendBusinessDocumentRefs,
  updateBusinessDocumentRefs,
} from "@/app/_actions/auth-actions";
import CardHeader from "@/components/base/card-header";
import StatusMessage from "@/components/base/status-message";
import EmptyLogs from "@/components/base/empty-logs";
import UploadField from "@/components/base/file-dropzone";
import Modal from "@/components/base/custom-modal";
import DocumentDisplayButton from "@/components/base/document-display-button";
import PromptModal from "@/components/base/prompt-modal";
import useKYCInfo from "@/hooks/useKYCInfo";
import { QUERY_KEYS } from "@/lib/constants";

// Define document configurations
const KYC_COL1_BASE_DOCS = [
  {
    id: "CERTIFICATE_INC",
    label: "Business Incorporation Certificate",
    backendKey: "cert_of_incorporation_url",
    required: true,
  },
  {
    id: "ARTICLES_ASSOCIATION",
    label: "Articles of Association",
    backendKey: "articles_of_association_url",
    required: true,
  },
  {
    id: "SHAREHOLDER_AGREEMENT",
    label: "Shareholders Agreement",
    backendKey: "share_holder_url",
    required: true,
  },

  {
    id: "DIRECTOR_NRC",
    label: "Directors' ID",
    backendKey: "director_nrc_url",
    required: true,
  },
  {
    id: "PROFESSIONAL_LICENSE",
    label: "Professional License",
    backendKey: "professional_license_url",
    required: false,
  },
];

const KYC_COL2_BASE_DOCS = [
  {
    id: "TAX_CLEARANCE",
    label: "Tax Clearance Certificate",
    backendKey: "tax_clearance_certificate_url",
    required: true,
  },
  {
    id: "COMPANY_PROFILE",
    label: "Company Profile",
    backendKey: "company_profile_url",
    required: true,
  },
  {
    id: "COMPANY_STRUCTURE",
    label: "Company Structure",
    backendKey: "organisation_structure_url",
    required: true,
  },
  {
    id: "PROOF_OF_ADDRESS",
    label: "Proof of Address",
    backendKey: "proof_of_address_url",
    required: true,
  },
  {
    id: "BANK_STATEMENT",
    label: "Bank Statement",
    backendKey: "bank_statement_url",
    required: true,
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

  // NEW: Memoized document configurations based on merchantKYC
  const {
    KYC_DOCUMENTS_COL1_CONFIG,
    KYC_DOCUMENTS_COL2_CONFIG,
    ALL_DOCUMENT_CONFIGS,
  } = useMemo(() => {
    const col1 = [...KYC_COL1_BASE_DOCS];
    const col2 = [...KYC_COL2_BASE_DOCS];
    const allActive = [...KYC_COL1_BASE_DOCS, ...KYC_COL2_BASE_DOCS];

    return {
      KYC_DOCUMENTS_COL1_CONFIG: col1,
      KYC_DOCUMENTS_COL2_CONFIG: col2,
      ALL_DOCUMENT_CONFIGS: allActive,
    };
  }, []);

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
      notify({
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
      notify({
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
        notify({
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
        notify({
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

    notify({
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
      notify({
        title: "Success",
        color: "success",
        description: response?.message,
      });
      setFieldLoadingStates((prev) => ({ ...prev, [fieldId]: false }));

      return response?.data;
    }

    notify({
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
      notify({
        title: "Success",
        color: "success",
        description: "Document removed successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["KYC"] });
      queryClient.invalidateQueries({ queryKey: ["uploaded-docs"] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SETUP] });
    } else {
      notify({
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
    <div className="w-full lg:px-8 mx-auto p-2">
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

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="flex w-full flex-1 flex-col gap-2">
          {KYC_DOCUMENTS_COL1_CONFIG.map((docConfig) => {
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
                  onDelete={() =>
                    handleDeleteRequest(docConfig.backendKey, docConfig.label)
                  }
                />
              );
            }
            return (
              <UploadField
                key={docConfig.id + "-upload"}
                required={docConfig.required}
                handleFile={async (file) =>
                  updateDocs({
                    [docConfig.id]: await handleFileUpload(
                      file,
                      docFiles[docConfig.id]?.file_record_id,
                      docConfig.id
                    ),
                  })
                }
                isLoading={fieldLoadingStates[docConfig.id] || false}
                label={docConfig.label}
              />
            );
          })}
        </div>

        <div className="flex w-full flex-1 flex-col gap-2">
          {KYC_DOCUMENTS_COL2_CONFIG.map((docConfig) => {
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
                  onDelete={() =>
                    handleDeleteRequest(docConfig.backendKey, docConfig.label)
                  }
                />
              );
            }
            return (
              <UploadField
                key={docConfig.id + "-upload"}
                required={docConfig.required}
                handleFile={async (file) =>
                  updateDocs({
                    [docConfig.id]: await handleFileUpload(
                      file,
                      docFiles[docConfig.id]?.file_record_id,
                      docConfig.id
                    ),
                  })
                }
                isLoading={fieldLoadingStates[docConfig.id] || false}
                label={docConfig.label}
              />
            );
          })}
        </div>
      </div>
      {error.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}

      {/* IF THE DOCUMENTS OBJECT HAS LESS THAN 10 ENTRIES, SHOW THE SUBMIT DOCUMENTS BUTTON */}
      {!isCompleteDocumentUploads(documents) && (
        <div className="mt-4 flex w-full justify-between items-start gap-4">
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
          >
            Submit Documents
          </Button>
        </div>
      )}

      {isCompleteDocumentUploads(documents) && (
        <div className="mt-4 flex w-full justify-end items-start gap-4">
          <Button
            className={"justify-end ml-auto"}
            onPress={() => onCompletionNavigateTo()}
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
