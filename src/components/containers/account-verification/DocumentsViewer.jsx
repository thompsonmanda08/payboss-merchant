import React, { useEffect, useState } from 'react'
import fileImage from '@/images/attachment.png'
import Image from 'next/image'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { CardHeader, Modal } from '@/components/base'
import useAccountProfile from '@/hooks/useProfileDetails'

const DocumentsViewer = () => {
  const { businessDocs, signedContractDoc } = useAccountProfile()

  const [selectedDoc, setSelectedDoc] = useState(businessDocs[0])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (businessDocs.length) {
      setSelectedDoc(businessDocs[0])
    }
  })

  return (
    <>
      <CardHeader
        className={'py-0'}
        classNames={{
          infoClasses: 'mb-0',
          innerWrapper: 'gap-0',
        }}
        title="Business Documentation"
        infoText={
          'Documents that prove your company registrations and compliance with regulatory bodies.'
        }
      />

      <div className="flex w-full flex-col gap-2 md:flex-row">
        <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5">
          {businessDocs?.map((document, index) => (
            <Button
              key={document?.type}
              variant="light"
              className="relative flex h-40 w-full cursor-pointer flex-col gap-y-2 rounded-[10px] border border-primary-100 bg-slate-100 p-4 transition-all duration-300 ease-in-out"
              onClick={() => {
                setSelectedDoc(document)
                setIsOpen(true)
              }}
            >
              <Link href={document?.url} target="_blank">
                <ArrowTopRightOnSquareIcon className="absolute right-2 top-2 z-50 h-5 w-5 text-primary/20 hover:text-primary" />
              </Link>
              <div className="h-[65%]">
                <Image
                  className="h-full w-full object-cover"
                  src={fileImage}
                  alt="file"
                  unoptimized
                />
              </div>
              <span className="text-[13px] text-black/90">
                {document?.name}
              </span>
            </Button>
          ))}

          {signedContractDoc && (
            <Button
              variant="light"
              className="relative flex h-40 w-full cursor-pointer flex-col gap-y-2 rounded-[10px] border border-primary-100 bg-slate-100 p-4 transition-all duration-300 ease-in-out"
              onClick={() => {
                setSelectedDoc(signedContractDoc)
                setIsOpen(true)
              }}
            >
              <Link href={signedContractDoc?.url} target="_blank">
                <ArrowTopRightOnSquareIcon className="absolute right-2 top-2 z-50 h-5 w-5 text-primary/20 hover:text-primary" />
              </Link>
              <div className="h-[65%]">
                <Image
                  className="h-full w-full object-cover"
                  src={fileImage}
                  alt="file"
                  unoptimized
                />
              </div>
              <span className="text-[13px] text-black/90">
                {signedContractDoc?.name}
              </span>
            </Button>
          )}
        </div>
      </div>

      {/* **************************************************** */}

      <Modal
        show={isOpen}
        onClose={() => {
          setIsOpen(false)
          setSelectedDoc(null)
        }}
        cancelText="Close"
        isDismissible={true}
        title={selectedDoc?.name}
        infoText="Ensure the document aligns with the submitted details"
        width={1200}
        removeCallToAction
      >
        {selectedDoc?.url && (
          <iframe
            src={selectedDoc?.url}
            title={selectedDoc?.name}
            className="min-h-[60vh]  w-full py-4"
            style={{ border: 'none' }}
          />
        )}
      </Modal>
    </>
  )
}

export default DocumentsViewer
