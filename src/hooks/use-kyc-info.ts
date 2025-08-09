"use client";

import { useQuery } from "@tanstack/react-query";

import { getAllKYCData } from "@/app/_actions/merchant-actions";
import { getBusinessDocumentRefs } from "@/app/_actions/auth-actions";

const useKYCInfo = () => {
  const {
    data: response,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["KYC"],
    queryFn: async () => await getAllKYCData(),
    staleTime: Infinity,
  });

  const { data: docsResponse } = useQuery({
    queryKey: ["uploaded-docs"],
    queryFn: () => getBusinessDocumentRefs(),
    staleTime: Infinity,
  });

  const users = response?.data?.users || [];
  const businessDetails = response?.data?.details || {};
  const documents = docsResponse?.data || response?.data?.documents || {};
  const refDocsExist = Object.keys(documents).length > 0;

  let merchantKYC = response?.data?.merchant_kyc || {
    is_complete_kyc: false,
    stage: "",
    stage_id: 1,
    kyc_approval_status: "pending",
    can_edit: false,
  };

  const merchantID = businessDetails?.ID || "";
  const merchant = businessDetails?.name || "";

  const isCompleteKYC = merchantKYC?.is_complete_kyc;
  const KYCStage = merchantKYC?.stage?.toLowerCase();
  const KYCStageID = merchantKYC?.stage_id;
  const KYCApprovalStatus = merchantKYC?.kyc_approval_status?.toLowerCase();

  const isApprovedUser =
    KYCStageID == 3 && isCompleteKYC && KYCApprovalStatus == "approved";

  const contactPerson =
    users?.find((user: any) => user?.role?.toLowerCase() == "owner") || {};

  const signedContractDoc = documents?.signed_contract || "";

  const allowUserToSubmitKYC =
    merchantKYC?.can_edit && contactPerson?.role?.toLowerCase() == "owner";

  return {
    businessDetails,
    merchantID,
    merchant,
    isCompleteKYC,
    KYCStage,
    KYCStageID,
    documents,
    refDocsExist,
    KYCApprovalStatus,
    isApprovedUser,
    signedContractDoc,
    contactPerson,
    isLoading,
    isError,
    isSuccess,
    allowUserToSubmitKYC,
    merchantKYC,
  };
};

export default useKYCInfo;
