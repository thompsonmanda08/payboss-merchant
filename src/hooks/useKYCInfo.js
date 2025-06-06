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

  const { data: uploadedDocsResponse } = useQuery({
    queryKey: ["uploaded-docs"],
    queryFn: () => getBusinessDocumentRefs(),
    staleTime: Infinity,
  });

  const businessDetails = response?.data?.details || {};

  const documents =
    uploadedDocsResponse?.data || response?.data.documents || {};

  const users = response?.data?.users || [];

  const refDocsExist = Object.keys(documents).length > 0;

  /* ****** SET STATE VARIABLES**************** */
  const isApprovedUser =
    businessDetails?.stageID == 3 &&
    businessDetails?.isCompleteKYC &&
    businessDetails?.kyc_approval_status?.toLowerCase() == "approved";

  const merchantID = businessDetails?.ID || "";
  const merchant = businessDetails?.name || "";

  const isCompleteKYC = businessDetails?.isCompleteKYC;
  const KYCStage = businessDetails?.stage;
  const KYCStageID = businessDetails?.stageID;
  const KYCApprovalStatus = businessDetails?.kyc_approval_status?.toLowerCase();

  const contactPerson =
    users?.filter((user) => user?.role?.toLowerCase() == "owner")[0] || {};

  const signedContractDoc = documents?.signed_contract || null;

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
  };
};

export default useKYCInfo;
