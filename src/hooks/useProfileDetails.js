"use client";

import { useSetupConfig } from "./useQueryHooks";

const useAccountProfile = () => {
  const { data: setup, isFetching, isLoading } = useSetupConfig();

  const user = setup?.data?.userDetails || [];
  const permissions = setup?.data?.userPermissions;

  const merchantKYC = setup?.data?.kyc;
  const isCompleteKYC = merchantKYC?.is_complete_kyc;

  const merchantID = setup?.data?.merchantID;

  const isOwner = permissions?.role?.toLowerCase() == "owner";
  const isAccountAdmin = permissions?.role?.toLowerCase() == "admin";

  return {
    user,
    merchantID,
    merchantKYC,
    isOwner,
    isAccountAdmin,
    isCompleteKYC,
    isFetching,
    isLoading,
  };
};

export default useAccountProfile;
