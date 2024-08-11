'use client'
import { useEffect, useState } from 'react'
import { useKYCData, useSetupConfig } from './useQueryHooks'

const useAccountProfile = () => {
  const { data: setup } = useSetupConfig()
  const { data: kycData } = useKYCData()
  const user = setup?.data?.userDetails || []
  const roles = setup?.data?.userDetails?.roles || []

  const businessDetails = kycData?.data?.details || {}
  const businessDocs = kycData?.data?.documents || {}
  const [merchantID, setMerchantID] = useState('')
  const [isCompleteKYC, setIsCompleteKYC] = useState('')
  const [KYCStage, setKYCStage] = useState('')
  const [KYCStageID, setKYCStageID] = useState('')
  const [KYCApprovalStatus, setKYCApprovalStatus] = useState('')
  const [allowUserToSubmitKYC, setAllowUserToSubmitKYC] = useState('')

  useEffect(() => {
    if (kycData) {
      setMerchantID(businessDetails?.ID)
      setIsCompleteKYC(businessDetails?.isCompleteKYC)
      setKYCStage(businessDetails?.stage)
      setKYCStageID(businessDetails?.stageID)
      setKYCApprovalStatus(businessDetails?.kyc_approval_status?.toLowerCase())
      setAllowUserToSubmitKYC(
        businessDetails?.stageID == 1 ||
          businessDetails?.stage?.toLowerCase() == 'new' ||
          businessDetails?.kyc_approval_status?.toLowerCase() == 'rejected',
      )
    }
  }, [kycData])

  return {
    user,
    roles,
    businessDetails,
    businessDocs,
    merchantID,
    isCompleteKYC,
    KYCStage,
    KYCStageID,
    KYCApprovalStatus,
    allowUserToSubmitKYC,
  }
}

export default useAccountProfile
