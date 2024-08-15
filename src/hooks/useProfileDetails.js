'use client'
import { useEffect, useState } from 'react'
import { useAccountRoles, useKYCData, useSetupConfig } from './useQueryHooks'

const useAccountProfile = () => {
  const { data: setup } = useSetupConfig()
  const { data: kycData } = useKYCData()

  const user = setup?.data?.userDetails || []

  const isOwner = user?.role?.toLowerCase() == 'owner'
  const isAccountAdmin = user?.role?.toLowerCase() == 'admin'

  const businessDetails = kycData?.data?.details || {}
  const documents = kycData?.data?.documents || {}
  const [merchantID, setMerchantID] = useState('')
  const [isCompleteKYC, setIsCompleteKYC] = useState('')
  const [KYCStage, setKYCStage] = useState('')
  const [KYCStageID, setKYCStageID] = useState('')
  const [KYCApprovalStatus, setKYCApprovalStatus] = useState('')
  const [allowUserToSubmitKYC, setAllowUserToSubmitKYC] = useState('')
  const [businessDocs, setBusinessDocs] = useState([])


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

    if (documents) {
      let attachments = [
        {
          name: 'Company Profile',
          url: businessDocs?.company_profile_url || '#',
          type: 'COMPANY_PROFILE',
        },
        {
          name: 'Certificate of Incorporation',
          url: businessDocs?.cert_of_incorporation_url || '#',
          type: 'CERTIFICATE_INC',
        },
        {
          name: 'Shareholder Agreement',
          url: businessDocs?.share_holder_url || '#',
          type: 'SHAREHOLDER_AGREEMENT',
        },
        {
          name: 'Tax Clearance Certificate',
          url: businessDocs?.tax_clearance_certificate_url || '#',
          type: 'TAX_CLEARANCE',
        },
        {
          name: 'Articles of Association',
          url: businessDocs?.articles_of_association_url || '#',
          type: 'ARTICLES_ASSOCIATION',
        },
      ]

      setBusinessDocs(attachments)
    }
  }, [kycData])

  return {
    user,
    businessDetails,
    businessDocs,
    merchantID,
    isCompleteKYC,
    KYCStage,
    KYCStageID,
    KYCApprovalStatus,
    allowUserToSubmitKYC,
    isOwner,
    isAccountAdmin,
  }
}

export default useAccountProfile
