"use client";

import { uploadBusinessFile } from "@/app/_actions/pocketbase-actions";
import UploadField from "@/components/base/file-dropzone";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/utils";
import { Checkbox } from "@heroui/react";
import React, { useState } from "react";
import useAccountProfile from "@/hooks/useProfileDetails";
import CardHeader from "@/components/base/card-header";

function TermsAndAgreement() {
  const [agreed, setAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signedContract, setSignedContract] = useState(null);
  const { merchantID } = useAccountProfile();
  const [error, setError] = useState({ status: false, message: null });

  async function handleFileUpload(file, recordID) {
    setIsSubmitting(true);
    setError({ message: "", status: "" });
    let response = await uploadBusinessFile(file, merchantID, recordID);

    if (response?.success) {
      notify({
        title: "Success",
        color: "success",
        description: response?.message,
      });
      setIsSubmitting(false);

      return response?.data;
    }

    notify({
      title: "Error",
      color: "danger",
      description: response?.message,
    });
    setIsSubmitting(false);
  }

  return (
    <div className="w-full lg:px-8 mx-auto p-2">
      <CardHeader
        title="Contract & Agreement"
        infoText="Please read and agree to the terms and conditions."
        className={"py-0 mb-6"}
        classNames={{
          infoClasses: "mb-0",
          innerWrapper: "gap-0",
        }}
      />

      <p className="mt-4 text-sm text-gray-500">
        This section is currently a placeholder. The UI and functionality will
        be built out as per future requirements.
      </p>

      <div className="flex flex-col gap-4">
        <UploadField
          key={"contract-upload"}
          required={true}
          handleFile={async (file) =>
            setSignedContract({
              signed_contract: await handleFileUpload(
                file,
                signedContract?.file_record_id,
                "signed_contract"
              ),
            })
          }
          isLoading={isSubmitting}
          label={"Upload Contract"}
        />
      </div>

      <div className="mt-4 flex w-full flex-col items-start gap-4">
        <Checkbox
          className="flex items-start"
          classNames={{
            label: "flex flex-col items-start -mt-1",
          }}
          isSelected={agreed}
          onValueChange={setAgreed}
        >
          <span className="max-w-xl text-xs font-medium italic text-foreground/70 md:text-sm">
            I agree to the terms and conditions.
          </span>
        </Checkbox>
        <Button
          isDisabled={false}
          isLoading={false}
          loadingText={"Submitting..."}
          onPress={() => {}}
        >
          Submit Contract
        </Button>
      </div>
    </div>
  );
}

export default TermsAndAgreement;
