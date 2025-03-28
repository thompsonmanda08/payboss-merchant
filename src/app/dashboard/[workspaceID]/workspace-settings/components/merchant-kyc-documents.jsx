"use client";
import React, { useState } from "react";
import useAuthStore from "@/context/auth-store";
import { uploadBusinessFile } from "@/app/_actions/pocketbase-actions";

import { notify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAccountProfile from "@/hooks/useProfileDetails";
import {
  sendBusinessDocumentRefs,
  updateBusinessDocumentRefs,
} from "@/app/_actions/auth-actions";
import { useQueryClient } from "@tanstack/react-query";
import CardHeader from "@/components/base/card-header";
import StatusMessage from "@/components/base/status-message";
import EmptyLogs from "@/components/base/empty-logs";
import UploadField from "@/components/base/file-dropzone";

// BUSINESS DOCUMENTS AND ATTACHMENTS
export default function MerchantDocumentAttachments() {
  const queryClient = useQueryClient();
  const { merchantID, refDocsExist, isOwner, isAccountAdmin } =
    useAccountProfile();
  const { isKYCSent, setIsKYCSent } = useAuthStore((state) => state);
  const [docFiles, setDocFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ status: false, message: null });

  function updateDocs(fields) {
    setDocFiles({ ...docFiles, ...fields });
  }

  async function submitMerchantKYCDocuments() {
    setIsSubmitting(true);
    setError({ message: "", status: "" });

    const documentUrls = {
      company_profile_url: docFiles["COMPANY_PROFILE"]?.file_url,
      cert_of_incorporation_url: docFiles["CERTIFICATE_INC"]?.file_url,
      share_holder_url: docFiles["SHAREHOLDER_AGREEMENT"]?.file_url,
      tax_clearance_certificate_url: docFiles["TAX_CLEARANCE"]?.file_url,
      articles_of_association_url: docFiles["ARTICLES_ASSOCIATION"]?.file_url,
    };

    if (!isKYCSent) {
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

    if (Object.keys(documentUrls).length < 5 && isKYCSent) {
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
        queryClient.invalidateQueries();
        setIsSubmitting(false);
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
        queryClient.invalidateQueries();
        setIsSubmitting(false);
        return;
      }
    }

    setError({ message: response?.message, status: true });

    notify({
      title: "Error",
      color: "danger",
      description: "Failed to submit documents",
    });

    setIsSubmitting(false);
  }

  async function handleFileUpload(file, recordID) {
    setIsLoading(true);
    setError({ message: "", status: "" });
    let response = await uploadBusinessFile(file, merchantID, recordID);
    if (response?.success) {
      notify({
        title: "Success",
        color: "success",
        description: response?.message,
      });
      setIsLoading(false);
      return response?.data;
    }

    notify({
      title: "Error",
      color: "danger",
      description: response?.message,
    });
    setIsLoading(false);
  }

  // ONLY ADMIN CAN SUBMIT KYC DOCUMENTATION
  return isWorkspaceAdmin ? (
    <>
      <CardHeader
        className={"py-0"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
        title="Business Documents and Attachments"
        infoText={
          "Documents that prove your company registrations and compliance with regulatory bodies."
        }
      />

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="flex w-full flex-1 flex-col gap-2">
          <UploadField
            label={"Business Incorporation Certificate"}
            isLoading={isLoading}
            handleFile={async (file) =>
              updateDocs({
                CERTIFICATE_INC: await handleFileUpload(
                  file,
                  docFiles["CERTIFICATE_INC"]?.file_record_id
                ),
              })
            }
          />
          <UploadField
            label={"Articles of Association"}
            isLoading={isLoading}
            handleFile={async (file) =>
              updateDocs({
                ARTICLES_ASSOCIATION: await handleFileUpload(
                  file,
                  docFiles["ARTICLES_ASSOCIATION"]?.file_record_id
                ),
              })
            }
          />
          <UploadField
            label={"Shareholders Agreement"}
            isLoading={isLoading}
            handleFile={async (file) =>
              updateDocs({
                SHAREHOLDER_AGREEMENT: await handleFileUpload(
                  file,
                  docFiles["SHAREHOLDER_AGREEMENT"]?.file_record_id
                ),
              })
            }
          />
        </div>

        <div className="flex w-full flex-1 flex-col gap-2">
          <UploadField
            label={"Tax Clearance Certificate"}
            isLoading={isLoading}
            handleFile={async (file) =>
              updateDocs({
                TAX_CLEARANCE: await handleFileUpload(
                  file,
                  docFiles["TAX_CLEARANCE"]?.file_record_id
                ),
              })
            }
          />

          <UploadField
            label={"Company Profile"}
            isLoading={isLoading}
            handleFile={async (file) =>
              updateDocs({
                COMPANY_PROFILE: await handleFileUpload(
                  file,
                  docFiles["COMPANY_PROFILE"]?.file_record_id
                ),
              })
            }
          />
        </div>
      </div>
      {error.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}

      <Button
        isLoading={isSubmitting}
        isDisabled={isSubmitting}
        loadingText={"Submitting..."}
        className="my-4"
        onPress={submitMerchantKYCDocuments}
      >
        Submit for Approval
      </Button>
    </>
  ) : (
      /* IF NOT AN ADMIN || THE USER IS A VIEW */
    <div>
      <div className="flex aspect-square max-h-[500px] w-full flex-1 items-center rounded-lg  text-sm font-semibold text-slate-600">
        <EmptyLogs
          className={"my-auto"}
          title={"Oops! Looks like your are not an Admin"}
          subTitle={
            "Only the admin of the workspace can submit company documentation."
          }
        />
      </div>
    </div>
  );
}
