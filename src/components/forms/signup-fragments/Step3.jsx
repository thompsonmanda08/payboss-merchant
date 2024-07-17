//BUSINESS REGISTRATION STATUS
'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { staggerContainerItemVariants } from '@/lib/constants'
import useAuthStore from '@/context/authStore'
import { uploadBusinessFile } from '@/app/_actions/pocketbase-actions'
import { FileDropZone } from '@/components/base'
import { STEPS } from '../SignupForm'
import { notify } from '@/lib/utils'

// BUSINESS DOCUMENTS AND ATTACHMENTS
export default function Step3({ updateDetails }) {
  const { merchantID } = useAuthStore((state) => state.merchantID)

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
    <div className="flex w-full flex-col gap-2">
      <UploadField
        label={'Business Incorporation Certificate'}
        handleFile={async (file) =>
          updateDetails(STEPS[3], {
            cert_of_incorporation_url: await handleFileUpload(file),
          })
        }
      />
      <UploadField
        label={'Articles of Association'}
        handleFile={async (file) =>
          updateDetails(STEPS[3], {
            articles_of_association_url: await handleFileUpload(file),
          })
        }
      />
      <UploadField
        label={'Shareholders Agreement'}
        handleFile={async (file) =>
          updateDetails(STEPS[3], {
            share_holder_url: await handleFileUpload(file),
          })
        }
      />
      <UploadField
        label={'Tax Clearance Certificate'}
        handleFile={async (file) =>
          updateDetails(STEPS[3], {
            tax_clearance_certificate_url: await handleFileUpload(file),
          })
        }
      />

      <UploadField
        label={'Company Profile'}
        handleFile={async (file) =>
          updateDetails(STEPS[3], {
            company_profile_url: await handleFileUpload(file),
          })
        }
      />
    </div>
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
