'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'
import useAuthStore from '@/context/authStore'
import { uploadBusinessFile } from '@/app/_actions/pocketbase-actions'
import { CardHeader, FileDropZone } from '@/components/base'
import { notify } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@nextui-org/react'
import useAccountProfile from '@/hooks/useProfileDetails'
import {
  sendBusinessDocumentRefs,
  updateBusinessDocumentRefs,
} from '@/app/_actions/auth-actions'
import DocumentsViewer from './DocumentsViewer'

// BUSINESS DOCUMENTS AND ATTACHMENTS
export default function DocumentAttachments({ navigateToPage }) {
  const {
    merchantID,
    businessDocs,
    KYCStageID,
    allowUserToSubmitKYC,
    KYCApprovalStatus,
  } = useAccountProfile()
  const { isKYCSent, setIsKYCSent } = useAuthStore((state) => state)
  const [docFiles, setDocFiles] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  function updateDocs(fields) {
    setDocFiles({ ...docFiles, ...fields })
  }

  async function submitKYCDocuments() {
    setIsLoading(true)

    const documentUrls = {
      company_profile_url: docFiles['COMPANY_PROFILE']?.file_url,
      cert_of_incorporation_url: docFiles['CERTIFICATE_INC']?.file_url,
      share_holder_url: docFiles['SHAREHOLDER_AGREEMENT']?.file_url,
      tax_clearance_certificate_url: docFiles['TAX_CLEARANCE']?.file_url,
      articles_of_association_url: docFiles['ARTICLES_ASSOCIATION']?.file_url,
    }

    console.log(documentUrls)

    if (!isKYCSent) {
      notify('error', 'Checkbox is unmarked')
      setIsLoading(false)
      return
    }

    if (Object.keys(documentUrls).length < 5 && isKYCSent) {
      notify('error', 'Provide all required files!')
      setIsLoading(false)
      return
    }

    // SAVE FILES TO PAYBOSS BACKEND
    let response
    if (Object.keys(businessDocs).length === 0 && isKYCSent) {
      response = await sendBusinessDocumentRefs(documentUrls)
    } else if (!Object.keys(businessDocs).length === 0 && isKYCSent) {
      response = await updateBusinessDocumentRefs(documentUrls)
    }

    if (response?.success) {
      notify('success', 'Documents Submitted For Approval')
      navigateToPage(2)
      setIsLoading(false)
      return
    } else {
      notify('error', 'Error Submitting Documents')
      setIsLoading(false)
      return
    }
  }

  async function handleFileUpload(file, recordID) {
    // AWAIT SAVE TO POCKET-BASE DB AND RETURN FILE_URL
    let response = await uploadBusinessFile(file, merchantID, recordID)
    if (response.success) {
      notify('success', response?.message)
      return response?.data
    }
    notify('error', 'Failed to upload file')
    notify('error', response.message)
  }

  return (
    <>
      <CardHeader
        className={'py-0'}
        classNames={{
          infoClasses: 'mb-0',
          innerWrapper: 'gap-0',
        }}
        title="Business Documents and Attachments"
        infoText={
          'Documents that prove your company registrations and compliance with regulatory bodies.'
        }
      />

      {allowUserToSubmitKYC ? (
        <div className="flex w-full flex-col gap-2 md:flex-row">
          <div className="flex w-full flex-1 flex-col gap-2">
            <UploadField
              label={'Business Incorporation Certificate'}
              handleFile={async (file) =>
                updateDocs({
                  CERTIFICATE_INC: await handleFileUpload(
                    file,
                    docFiles['CERTIFICATE_INC']?.file_record_id,
                  ),
                })
              }
            />
            <UploadField
              label={'Articles of Association'}
              handleFile={async (file) =>
                updateDocs({
                  ARTICLES_ASSOCIATION: await handleFileUpload(
                    file,
                    docFiles['ARTICLES_ASSOCIATION']?.file_record_id,
                  ),
                })
              }
            />
            <UploadField
              label={'Shareholders Agreement'}
              handleFile={async (file) =>
                updateDocs({
                  SHAREHOLDER_AGREEMENT: await handleFileUpload(
                    file,
                    docFiles['SHAREHOLDER_AGREEMENT']?.file_record_id,
                  ),
                })
              }
            />
          </div>

          <div className="flex w-full flex-1 flex-col gap-2">
            <UploadField
              label={'Tax Clearance Certificate'}
              handleFile={async (file) =>
                updateDocs({
                  TAX_CLEARANCE: await handleFileUpload(
                    file,
                    docFiles['TAX_CLEARANCE']?.file_record_id,
                  ),
                })
              }
            />

            <UploadField
              label={'Company Profile'}
              handleFile={async (file) =>
                updateDocs({
                  COMPANY_PROFILE: await handleFileUpload(
                    file,
                    docFiles['COMPANY_PROFILE']?.file_record_id,
                  ),
                })
              }
            />
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col gap-2 md:flex-row">
          <DocumentsViewer />
        </div>
      )}
      {allowUserToSubmitKYC && (
        <div className="mt-8 flex w-full flex-col items-start gap-4">
          <Checkbox
            className="flex items-start"
            classNames={{
              label: 'flex flex-col items-start -mt-1',
            }}
            isSelected={isKYCSent}
            onValueChange={setIsKYCSent}
          >
            <span className="max-w-xl text-xs font-medium italic text-slate-700 md:text-sm">
              Yes, I confirm that the details provided accurately represent my
              business. I understand that any misrepresentation of my business
              may result in the rejection of my application.
            </span>
          </Checkbox>
          {
            <Button
              isLoading={isLoading}
              loadingText={'Submitting...'}
              onPress={async () => await submitKYCDocuments()}
            >
              Submit for Approval
            </Button>
          }
        </div>
      )}
    </>
  )
}

function UploadField({ label, handleFile }) {
  return (
    <motion.div
      key={'step-2-1'}
      className="w-full"
      variants={staggerContainerItemVariants}
    >
      <label className="mb-2 text-xs font-medium capitalize text-gray-500 lg:text-[13px]">
        {label}
      </label>
      <FileDropZone
        isLandscape
        className={' min-h-8 px-2'}
        otherAcceptedFiles={{
          'application/pdf': [],
        }}
        onChange={(file) => handleFile(file)}
      />
    </motion.div>
  )
}
