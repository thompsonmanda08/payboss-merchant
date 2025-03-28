"use client";
import { useEffect, useState } from "react";
import { useKYCData, useSetupConfig } from "./useQueryHooks";

const useAccountProfile = () => {
  const { data: setup } = useSetupConfig();
  const { data: kycData } = useKYCData();

  console.log("kycData", kycData);
  console.log("setup", setup);

  const user = setup?.data?.userDetails || [];
  const permissions = setup?.data?.userPermissions;
  const merchantKYC = setup?.data?.kyc;

  const isOwner = permissions?.role?.toLowerCase() == "owner";
  const isAccountAdmin = permissions?.role?.toLowerCase() == "admin";

  const businessDetails = kycData?.data?.details || {};
  const documents = kycData?.data?.documents || {};
  const [merchantID, setMerchantID] = useState("");
  const [merchant, setMerchant] = useState("");
  const [isCompleteKYC, setIsCompleteKYC] = useState("");
  const [KYCStage, setKYCStage] = useState("");
  const [KYCStageID, setKYCStageID] = useState("");
  const [KYCApprovalStatus, setKYCApprovalStatus] = useState("");
  const [allowUserToSubmitKYC, setAllowUserToSubmitKYC] = useState("");
  const [businessDocs, setBusinessDocs] = useState([]);
  const [signedContractDoc, setSignedContractDoc] = useState(null);

  // IF THE DOCUMENT OBJECT IS NOT EMPTY DOCS EXIST
  const refDocsExist =
    Object.keys(documents).length > 0 ||
    documents?.company_profile_url ||
    documents?.cert_of_incorporation_url ||
    documents?.share_holder_url ||
    documents?.tax_clearance_certificate_url ||
    documents?.organisation_structure_url ||
    documents?.professional_license_url ||
    documents?.articles_of_association_url;

  /* ****** SET STATE VARIABLES**************** */
  const isApprovedUser =
    merchantKYC?.stageID == 3 &&
    businessDetails?.isCompleteKYC &&
    businessDetails?.kyc_approval_status?.toLowerCase() == "approved";

  useEffect(() => {
    // Set KYC Data if it exists
    if (kycData) {
      setMerchantID(businessDetails?.ID);
      setIsCompleteKYC(businessDetails?.isCompleteKYC);
      setKYCStage(businessDetails?.stage);
      setKYCStageID(businessDetails?.stageID);
      setKYCApprovalStatus(businessDetails?.kyc_approval_status?.toLowerCase());
      setAllowUserToSubmitKYC(
        merchantKYC?.stageID < 3 &&
          merchantKYC?.can_edit &&
          (isOwner || isAccountAdmin)
      );
    }

    //  Check Business Documents if they exist
    if (Object.keys(documents).length > 0) {
      const EXTRA_DOCS =
        merchantKYC?.merchant_type == "super"
          ? [
              {
                name: "Organizational Structure",
                url: documents?.organisation_structure_url || "#",
                type: "COMPANY STRUCTURE",
              },
              {
                name: "Professional License",
                url: documents?.professional_license_url || "#",
                type: "PROFESSIONAL_LICENSE",
              },
            ]
          : [];

      let attachments = [
        {
          name: "Company Profile",
          url: documents?.company_profile_url || "#",
          type: "COMPANY_PROFILE",
        },
        {
          name: "Certificate of Incorporation",
          url: documents?.cert_of_incorporation_url || "#",
          type: "CERTIFICATE_INC",
        },
        {
          name: "Shareholder Agreement",
          url: documents?.share_holder_url || "#",
          type: "SHAREHOLDER_AGREEMENT",
        },
        {
          name: "Tax Clearance Certificate",
          url: documents?.tax_clearance_certificate_url || "#",
          type: "TAX_CLEARANCE",
        },
        {
          name: "Articles of Association",
          url: documents?.articles_of_association_url || "#",
          type: "ARTICLES_ASSOCIATION",
        },
        ...EXTRA_DOCS,
      ];

      // Set Business Documents in state variable
      setBusinessDocs(attachments);
    }

    if (documents?.signed_contract) {
      setSignedContractDoc({
        name: "Signed Contract Document",
        url: documents?.signed_contract || "#",
        type: "SIGNED_CONTRACT",
      });
    }
  }, [kycData]);

  useEffect(() => {
    if (businessDetails?.name && merchant == "") {
      setMerchant(businessDetails?.name);
    }
  }, [businessDetails]);

  return {
    user,
    businessDetails,
    businessDocs,
    merchantID,
    merchant,
    merchantKYC,
    isCompleteKYC,
    KYCStage,
    KYCStageID,
    KYCApprovalStatus,
    allowUserToSubmitKYC,
    isApprovedUser,
    isOwner,
    isAccountAdmin,
    signedContractDoc,
    refDocsExist,
  };
};

export default useAccountProfile;
