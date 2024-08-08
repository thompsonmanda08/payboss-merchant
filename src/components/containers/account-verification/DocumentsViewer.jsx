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

const DocumentsViewer = () => {
  const docs = [
    {
      uri: 'https://mypphysed.wordpress.com/wp-content/uploads/2015/10/traditionalgamesteachingresource.pdf',
      fileName: 'NRC',
    },
    {
      uri: 'https://www.cartercenter.org/resources/pdfs/health/ephti/library/modules/FinalModuleCommonMentalIllnesses.pdf',
      fileName: 'BRN Certificate',
    },
    {
      uri: 'https://irp-cdn.multiscreensite.com/cb9165b2/files/uploaded/The+48+Laws+Of+Power.pdf',
      fileName: 'TPIN Certificate',
    },
  ]

  const [selectedDoc, setSelectedDoc] = useState(docs[0])
  const [isOpen, setIsOpen] = useState(false)


  return (
    <>
      <div className="flex flex-wrap gap-4 self-start py-5">
        {docs.map((doc, index) => (
          <Button
            key={index}
            variant="light"
            className="relative flex h-40 w-[150px] cursor-pointer flex-col gap-y-2 rounded-[10px] border border-primary-100 bg-slate-100 p-4 transition-all duration-300 ease-in-out"
            onClick={() => {
              setSelectedDoc(doc)
              setIsOpen(true)
            }}
          >
            <Link href={doc.uri} target="_blank">
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
            <span className="text-[13px] text-black/90">{doc.fileName}</span>
          </Button>
        ))}
      </div>

      <Modal
        show={isOpen}
        onClose={() => setIsOpen(false)}
        cancelText="Close"
        isDismissible={true}
        title={selectedDoc.fileName}
        infoText="Ensure the document aligns with the submitted details"
        width={1200}
        removeCallToAction
      >
        <iframe
          src={selectedDoc.uri}
          title={selectedDoc.fileName}
          className="min-h-[60vh]  w-full py-4"
          style={{ border: 'none' }}
        />
      </Modal>
    </>
  )
}

export default DocumentsViewer
