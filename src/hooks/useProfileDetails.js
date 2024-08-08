'use client'
import { useKYCData, useSetupConfig } from './useQueryHooks'

const useAccountProfile = () => {
  const { data: setup } = useSetupConfig()
  const { data: kycData } = useKYCData()
  const user = setup?.data?.userDetails || []
  const roles = setup?.data?.userDetails?.roles || []

  const businessDetails = kycData?.data?.details || {}
  const businessDocs = kycData?.data?.documents || {}
  const merchantID = businessDetails?.ID

  return { user, roles, businessDetails, businessDocs, merchantID }
}

export default useAccountProfile
