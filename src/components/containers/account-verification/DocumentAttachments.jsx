//BUSINESS REGISTRATION STATUS
'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'
import useAuthStore from '@/context/authStore'
import { uploadBusinessFile } from '@/app/_actions/pocketbase-actions'
import { CardHeader, FileDropZone } from '@/components/base'
import { notify } from '@/lib/utils'

// BUSINESS DOCUMENTS AND ATTACHMENTS
export default function DocumentAttachments({}) {
  const { setBusinessDocs, businessDocs } = useAuthStore((state) => state)

  function updateDetails(fields) {
    setBusinessDocs({ ...businessDocs, ...fields })
  }

  function submitKYCDocuments() {
    // SAVE FILES TO PAYBOSS BACKEND
    // if (currentTabIndex === 3 && STEPS[currentTabIndex] === STEPS[3]) {
    //   console.log(merchantID)
    //   // POST AND PATCH
    //   let payload
    //   if (!documentsInfoSent) {
    //     payload = await sendBusinessDocumentRefs(businessDocs, merchantID)
    //     setDocumentsInfoSent(true)
    //   } else if (documentsInfoSent && merchantID) {
    //     payload = await updateBusinessDocumentRefs(businessDocs, merchantID)
    //   }
    //   if (payload.success && merchantID) {
    //     notify('success', 'Documents Submitted For Approval')
    //     navigateForward()
    //     setIsLoading(false)
    //     return
    //   } else {
    //     notify('error', 'Error Submitting Documents')
    //     setIsLoading(false)
    //     updateErrorStatus({ status: true, message: payload.message })
    //     return
    //   }
    // }
  }

  const handleFileUpload = async (file) => {
    // AWAIT SAVE TO POCKET-BASE DB AND RETURN FILE_URL
    let response = await uploadBusinessFile(file, merchantID)
    if (response.success) {
      notify('success', response?.message)
      let { file_url } = response?.data
      return file_url
    }
    notify('error', 'Failed to upload file')
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

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="flex w-full flex-1 flex-col gap-2">
          <UploadField
            label={'Business Incorporation Certificate'}
            handleFile={async (file) =>
              updateDetails({
                cert_of_incorporation_url: await handleFileUpload(file),
              })
            }
          />
          <UploadField
            label={'Articles of Association'}
            handleFile={async (file) =>
              updateDetails({
                articles_of_association_url: await handleFileUpload(file),
              })
            }
          />
          <UploadField
            label={'Shareholders Agreement'}
            handleFile={async (file) =>
              updateDetails({
                share_holder_url: await handleFileUpload(file),
              })
            }
          />
        </div>

        <div className="flex w-full flex-1 flex-col gap-2">
          <UploadField
            label={'Tax Clearance Certificate'}
            handleFile={async (file) =>
              updateDetails({
                tax_clearance_certificate_url: await handleFileUpload(file),
              })
            }
          />

          <UploadField
            label={'Company Profile'}
            handleFile={async (file) =>
              updateDetails({
                company_profile_url: await handleFileUpload(file),
              })
            }
          />
        </div>
      </div>
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
          // 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          //   [],
          'application/pdf': [],
          // 'application/msword': [],
        }}
        onChange={(file) => handleFile(file)}
      />
    </motion.div>
  )
}
