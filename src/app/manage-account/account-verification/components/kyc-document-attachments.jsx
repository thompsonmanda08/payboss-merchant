"use client";
import { useState } from "react";
import { Checkbox } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";

import useAuthStore from "@/context/auth-store";
import { uploadBusinessFile } from "@/app/_actions/pocketbase-actions";
import { notify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAccountProfile from "@/hooks/useProfileDetails";
import {
  sendBusinessDocumentRefs,
  updateBusinessDocumentRefs,
} from "@/app/_actions/auth-actions";
import CardHeader from "@/components/base/card-header";
import StatusMessage from "@/components/base/status-message";
import EmptyLogs from "@/components/base/empty-logs";
import UploadField from "@/components/base/file-dropzone";

// BUSINESS DOCUMENTS AND ATTACHMENTS
export default function DocumentAttachments() {
  const queryClient = useQueryClient();
  const { merchantID, refDocsExist, isOwner, isAccountAdmin, merchantKYC } =
    useAccountProfile();
  const { isKYCSent, setIsKYCSent } = useAuthStore((state) => state);
  const [docFiles, setDocFiles] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({ status: false, message: null });

  function updateDocs(fields) {
    setDocFiles({ ...docFiles, ...fields });
  }

  async function submitKYCDocuments() {
    setIsSubmitting(true);
    setError({ message: "", status: "" });

    const documentUrls = {
      company_profile_url: docFiles["COMPANY_PROFILE"]?.file_url,
      cert_of_incorporation_url: docFiles["CERTIFICATE_INC"]?.file_url,
      share_holder_url: docFiles["SHAREHOLDER_AGREEMENT"]?.file_url,
      tax_clearance_certificate_url: docFiles["TAX_CLEARANCE"]?.file_url,
      articles_of_association_url: docFiles["ARTICLES_ASSOCIATION"]?.file_url,
      organisation_structure_url: docFiles["COMPANY_STRUCTURE"]?.file_url,
      professional_license_url: docFiles["PROFESSIONAL_LICENSE"]?.file_url,
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

  return isOwner || isAccountAdmin ? (
    <>
      <CardHeader
        className={"py-0"}
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
          <UploadField
            required
            handleFile={async (file) =>
              updateDocs({
                CERTIFICATE_INC: await handleFileUpload(
                  file,
                  docFiles["CERTIFICATE_INC"]?.file_record_id,
                ),
              })
            }
            isLoading={isLoading}
            label={"Business Incorporation Certificate"}
          />
          <UploadField
            required
            handleFile={async (file) =>
              updateDocs({
                ARTICLES_ASSOCIATION: await handleFileUpload(
                  file,
                  docFiles["ARTICLES_ASSOCIATION"]?.file_record_id,
                ),
              })
            }
            isLoading={isLoading}
            label={"Articles of Association"}
          />
          <UploadField
            required
            handleFile={async (file) =>
              updateDocs({
                SHAREHOLDER_AGREEMENT: await handleFileUpload(
                  file,
                  docFiles["SHAREHOLDER_AGREEMENT"]?.file_record_id,
                ),
              })
            }
            isLoading={isLoading}
            label={"Shareholders Agreement"}
          />
          {merchantKYC?.merchant_type == "super" && (
            <UploadField
              required
              handleFile={async (file) =>
                updateDocs({
                  PROFESSIONAL_LICENSE: await handleFileUpload(
                    file,
                    docFiles["PROFESSIONAL_LICENSE"]?.file_record_id,
                  ),
                })
              }
              isLoading={isLoading}
              label={"Professional License"}
            />
          )}
        </div>

        <div className="flex w-full flex-1 flex-col gap-2">
          <UploadField
            required
            handleFile={async (file) =>
              updateDocs({
                TAX_CLEARANCE: await handleFileUpload(
                  file,
                  docFiles["TAX_CLEARANCE"]?.file_record_id,
                ),
              })
            }
            isLoading={isLoading}
            label={"Tax Clearance Certificate"}
          />

          <UploadField
            required
            handleFile={async (file) =>
              updateDocs({
                COMPANY_PROFILE: await handleFileUpload(
                  file,
                  docFiles["COMPANY_PROFILE"]?.file_record_id,
                ),
              })
            }
            isLoading={isLoading}
            label={"Company Profile"}
          />

          {merchantKYC?.merchant_type == "super" && (
            <UploadField
              required
              handleFile={async (file) =>
                updateDocs({
                  COMPANY_STRUCTURE: await handleFileUpload(
                    file,
                    docFiles["COMPANY_STRUCTURE"]?.file_record_id,
                  ),
                })
              }
              isLoading={isLoading}
              label={"Company Structure"}
            />
          )}
        </div>
      </div>
      {error.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}

      <div className="mt-4 flex w-full flex-col items-start gap-4">
        <Checkbox
          className="flex items-start"
          classNames={{
            label: "flex flex-col items-start -mt-1",
          }}
          isSelected={isKYCSent}
          onValueChange={setIsKYCSent}
        >
          <span className="max-w-xl text-xs font-medium italic text-foreground/70 md:text-sm">
            Yes, I confirm that the details provided accurately represent my
            business. I understand that any misrepresentation of my business may
            result in the rejection of my application.
          </span>
        </Checkbox>
        {
          <Button
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            loadingText={"Submitting..."}
            onPress={submitKYCDocuments}
          >
            Submit for Approval
          </Button>
        }
      </div>
    </>
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
