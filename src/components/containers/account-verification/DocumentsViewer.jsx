import React, { useState } from 'react'
import fileImage from '@/images/attachment.png'
import Image from 'next/image'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'
// import {
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
//   useDisclosure,
// } from '@nextui-org/modal'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { Modal } from '@/components/base'
import useAccountProfile from '@/hooks/useProfileDetails'

const DocumentsViewer = () => {
  const { businessDocs } = useAccountProfile()

  const [selectedDoc, setSelectedDoc] = useState(businessDocs[0])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="grid w-full grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-5">
        {businessDocs?.map((doc, index) => (
          <Button
            key={doc?.type}
            variant="light"
            className="relative flex h-40 w-full cursor-pointer flex-col gap-y-2 rounded-[10px] border border-primary-100 bg-slate-100 p-4 transition-all duration-300 ease-in-out"
            onClick={() => {
              setSelectedDoc(doc)
              setIsOpen(true)
            }}
          >
            <Link href={doc?.url} target="_blank">
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
            <span className="text-[13px] text-black/90">{doc?.name}</span>
          </Button>
        ))}
      </div>

      <Modal
        show={isOpen}
        onClose={() => setIsOpen(false)}
        cancelText="Close"
        isDismissible={true}
        title={selectedDoc?.name}
        infoText="Ensure the document aligns with the submitted details"
        width={1200}
        removeCallToAction
      >
        <iframe
          src={selectedDoc?.url}
          title={selectedDoc?.name}
          className="min-h-[60vh]  w-full py-4"
          style={{ border: 'none' }}
        />
      </Modal>
    </>
  )
}

export default DocumentsViewer
