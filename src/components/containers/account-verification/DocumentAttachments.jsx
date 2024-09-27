'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'
import useAuthStore from '@/context/authStore'
import { uploadBusinessFile } from '@/app/_actions/pocketbase-actions'
import {
  CardHeader,
  EmptyLogs,
  EmptyState,
  FileDropZone,
  StatusMessage,
} from '@/components/base'
import { notify } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { Checkbox } from '@nextui-org/react'
import useAccountProfile from '@/hooks/useProfileDetails'
import {
  sendBusinessDocumentRefs,
  updateBusinessDocumentRefs,
} from '@/app/_actions/auth-actions'
import DocumentsViewer from './DocumentsViewer'
import { useQueryClient } from '@tanstack/react-query'

// BUSINESS DOCUMENTS AND ATTACHMENTS
export default function DocumentAttachments({ navigateToPage }) {
  const queryClient = useQueryClient()
  const {
    merchantID,
    allowUserToSubmitKYC,
    refDocsExist,
    isOwner,
    isAccountAdmin,
  } = useAccountProfile()
  const { isKYCSent, setIsKYCSent } = useAuthStore((state) => state)
  const [docFiles, setDocFiles] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({ status: false, message: null })

  function updateDocs(fields) {
    setDocFiles({ ...docFiles, ...fields })
  }

  async function submitKYCDocuments() {
    setIsSubmitting(true)
    setError({ message: '', status: '' })

    const documentUrls = {
      company_profile_url: docFiles['COMPANY_PROFILE']?.file_url,
      cert_of_incorporation_url: docFiles['CERTIFICATE_INC']?.file_url,
      share_holder_url: docFiles['SHAREHOLDER_AGREEMENT']?.file_url,
      tax_clearance_certificate_url: docFiles['TAX_CLEARANCE']?.file_url,
      articles_of_association_url: docFiles['ARTICLES_ASSOCIATION']?.file_url,
    }

    if (!isKYCSent) {
      notify('error', 'Checkbox is unmarked')
      setError({
        message: 'Checkbox is unmarked. Agree to the statement below.',
        status: true,
      })
      setIsSubmitting(false)
      return
    }

    if (Object.keys(documentUrls).length < 5 && isKYCSent) {
      notify('error', 'Provide all required files!')
      setError({
        message: 'Provide all required files!',
        status: true,
      })
      setIsSubmitting(false)
      return
    }

    // SAVE FILES TO PAYBOSS BACKEND
    let response
    if (refDocsExist) {
      response = await updateBusinessDocumentRefs(documentUrls)

      if (response?.success) {
        notify('success', 'Documents Updated Successfully!')
        queryClient.invalidateQueries()
        // window.location.reload()
        setIsSubmitting(false)
        return
      }
    } else {
      response = await sendBusinessDocumentRefs(documentUrls)

      if (response?.success) {
        notify('success', 'Documents Submitted For Approval!')
        queryClient.invalidateQueries()
        // navigateToPage(2)
        setIsSubmitting(false)
        return
      }
    }

    setError({ message: response?.message, status: true })
    notify('error', 'Error Submitting Documents')

    setIsSubmitting(false)
  }

  async function handleFileUpload(file, recordID) {
    setIsLoading(true)
    setError({ message: '', status: '' })
    let response = await uploadBusinessFile(file, merchantID, recordID)
    if (response?.success) {
      notify('success', response?.message)
      setIsLoading(false)
      return response?.data
    }
    notify('error', response?.message)
    setIsLoading(false)
  }

  return isOwner || isAccountAdmin ? (
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
            isLoading={isLoading}
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
            isLoading={isLoading}
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
            isLoading={isLoading}
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
            isLoading={isLoading}
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
            isLoading={isLoading}
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
      {error.status && (
        <div className="mx-auto flex w-full flex-col items-center justify-center gap-4">
          <StatusMessage error={error.status} message={error.message} />
        </div>
      )}

      <div className="mt-4 flex w-full flex-col items-start gap-4">
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
            business. I understand that any misrepresentation of my business may
            result in the rejection of my application.
          </span>
        </Checkbox>
        {
          <Button
            isLoading={isSubmitting}
            isDisabled={isSubmitting}
            loadingText={'Submitting...'}
            onPress={submitKYCDocuments}
          >
            Submit for Approval
          </Button>
        }
      </div>
    </>
  ) : (
    <div className="flex aspect-square max-h-[500px] w-full flex-1 items-center rounded-lg  text-sm font-semibold text-slate-600">
      <EmptyLogs
        className={'my-auto'}
        title={'Oops! Looks like your are not an Admin'}
        subTitle={
          'Only the admin or account owner can submit company documentation.'
        }
      />
    </div>
  )
}

export function UploadField({
  label,
  isLoading,
  handleFile,
  acceptedFiles,
  ...props
}) {
  return (
    <motion.div
      key={'step-2-1'}
      className="w-full"
      variants={staggerContainerItemVariants}
    >
      <label className="mb-2 text-xs font-medium capitalize text-gray-500 lg:text-[13px]">
        {label}{' '}
        {props?.required && <span className="font-bold text-red-500"> *</span>}
      </label>
      <FileDropZone
        isLandscape
        className={' min-h-8 px-2'}
        isLoading={isLoading}
        disabled={isLoading}
        otherAcceptedFiles={{
          'application/pdf': [],
          ...acceptedFiles,
        }}
        onChange={(file) => handleFile(file)}
      />
    </motion.div>
  )
}
